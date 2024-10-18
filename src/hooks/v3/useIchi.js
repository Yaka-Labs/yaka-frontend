import { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { v4 as uuidv4 } from 'uuid'
import { ichiVaultAbi } from 'config/abi/v3'
import { multicall } from 'utils/multicall'
import { TRANSACTION_STATUS } from 'config/constants'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { getERC20Contract, getGaugeSimpleContract, getIchiVaultContract, getWBNBContract } from 'utils/contractHelpers'
import { getAllowance, sendContract } from 'utils/api'
import { MAX_UINT256, formatNumber, fromWei, toWei } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import { useVaultDepositGaurd } from 'hooks/useContract'
import { useV3VaultDepositGaurd } from 'hooks/useContractV3'
import { VAULT_DEPLOYER_ADDRESS, VAULT_DEPOSIT_GUARD_ADDRESS } from 'config/constants/v3/addresses'
import { useAssets } from 'state/assets/hooks'
import { useNetwork } from 'state/settings/hooks'
import { usePools } from 'state/pools/hooks'
import { VaultsContext } from 'context/VaultsContext'
import useWeb3 from '../useWeb3'

export const useIchiVaultsInfo = () => {
  const [info, setInfo] = useState([])
  const assets = useAssets()
  const pools = usePools()
  const vaults = useContext(VaultsContext)
  const { networkId } = useNetwork()

  const fetchInfo = useCallback(async () => {
    const ichi = pools.filter((pool) => pool.title === 'Ichi')
    const calls = [...vaults, ...ichi].map((vault) => {
      return {
        address: vault.address,
        name: 'allowToken0',
        params: [],
      }
    })
    const res = await multicall(ichiVaultAbi, calls, networkId)
    const final = [...vaults, ...ichi].map((ele, index) => {
      const found = assets.find((asset) => asset.address === (res[index][0] ? ele.token0.address : ele.token1.address))
      return {
        ...ele,
        allowed: found,
        token0: {
          ...ele.token0,
          allowed: res[index][0],
        },
        token1: {
          ...ele.token1,
          allowed: !res[index][0],
        },
      }
    })
    setInfo(final)
  }, [networkId, vaults, pools, assets])

  useEffect(() => {
    if (assets.length > 0) {
      fetchInfo(vaults, assets)
    }
  }, [fetchInfo])

  return info
}

export const useVaultAdd = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const v3depositGuardContract = useV3VaultDepositGaurd()
  const depositGuardContract = useVaultDepositGaurd()
  const { networkId } = useNetwork()

  const handleVaultAdd = useCallback(
    async (vault, amount, slippage) => {
      const vaultContract = getIchiVaultContract(web3, vault.address)
      const { token0, token1 } = vault
      if (token0.allowed) {
        const maxRes = await vaultContract.methods.deposit0Max().call()
        const deposit0Max = fromWei(maxRes, token0.decimals)
        if (deposit0Max.lt(amount)) {
          customNotify(`Maximum deposit amount of ${token0.symbol} is ${deposit0Max.toFormat(0)}.`, 'warn')
          return
        }
      } else {
        const maxRes = await vaultContract.methods.deposit1Max().call()
        const deposit1Max = fromWei(maxRes, token1.decimals)
        if (deposit1Max.lt(amount)) {
          customNotify(`Maximum deposit amount of ${token1.symbol} is ${deposit1Max.toFormat(0)}.`, 'warn')
          return
        }
      }
      const key = uuidv4()
      const approveuuid = uuidv4()
      const supplyuuid = uuidv4()
      const depositToken = token0.allowed ? token0 : token1
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Deposit ${depositToken.symbol} in the vault`,
          transactions: {
            [approveuuid]: {
              desc: `Approve ${depositToken.symbol}`,
              status: TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [supplyuuid]: {
              desc: `Deposit ${depositToken.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      let isApproved = true
      const tokenContract = getERC20Contract(web3, depositToken.address)
      const depositGuardAddress = VAULT_DEPOSIT_GUARD_ADDRESS[networkId]
      const vaultDeployerAddress = VAULT_DEPLOYER_ADDRESS[networkId]
      const allowance = await getAllowance(tokenContract, depositGuardAddress, account)
      if (fromWei(allowance, depositToken.decimals).lt(amount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [depositGuardAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approveuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const depositAmount = toWei(amount, depositToken.decimals).dp(0).toString(10)
      let lpAmount = await v3depositGuardContract.callStatic.forwardDepositToICHIVault(
        vault.address,
        vaultDeployerAddress,
        depositToken.address,
        depositAmount,
        '0',
        account,
        { from: account },
      )
      lpAmount = new BigNumber(lpAmount._hex)
        .times(Math.floor((100 - slippage) * 1000))
        .div(100000)
        .dp(0)
        .toString(10)

      try {
        await sendContract(
          dispatch,
          key,
          supplyuuid,
          depositGuardContract,
          'forwardDepositToICHIVault',
          [vault.address, vaultDeployerAddress, depositToken.address, depositAmount, lpAmount, account],
          account,
        )
      } catch (err) {
        console.log('supply error :>> ', err)
        setPending(false)
        return
      }
      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Added',
        }),
      )
      setPending(false)
    },
    [account, web3, v3depositGuardContract, depositGuardContract],
  )

  const handleVaultAddAndStake = useCallback(
    async (vault, amount, amountToWrap, slippage) => {
      const vaultContract = getIchiVaultContract(web3, vault.address)
      const { token0, token1 } = vault
      if (token0.allowed) {
        const maxRes = await vaultContract.methods.deposit0Max().call()
        const deposit0Max = fromWei(maxRes, token0.decimals)
        if (deposit0Max.lt(amount)) {
          customNotify(`Maximum deposit amount of ${token0.symbol} is ${deposit0Max.toFormat(0)}.`, 'warn')
          return
        }
      } else {
        const maxRes = await vaultContract.methods.deposit1Max().call()
        const deposit1Max = fromWei(maxRes, token1.decimals)
        if (deposit1Max.lt(amount)) {
          customNotify(`Maximum deposit amount of ${token1.symbol} is ${deposit1Max.toFormat(0)}.`, 'warn')
          return
        }
      }
      const key = uuidv4()
      const approveuuid = uuidv4()
      const wrapuuid = uuidv4()
      const supplyuuid = uuidv4()
      const approve1uuid = uuidv4()
      const stakeuuid = uuidv4()
      const depositToken = token0.allowed ? token0 : token1
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: 'Add and stake liquidity',
          transactions: {
            ...(amountToWrap
              ? {
                  [wrapuuid]: {
                    desc: `Wrap ${formatNumber(amountToWrap)} BNB for WBNB`,
                    status: TRANSACTION_STATUS.WAITING,
                    hash: null,
                  },
                }
              : {}),
            [approveuuid]: {
              desc: `Approve ${depositToken.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [supplyuuid]: {
              desc: 'Add liquidity',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [approve1uuid]: {
              desc: 'Approve LP',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [stakeuuid]: {
              desc: 'Stake LP',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      if (amountToWrap) {
        const wbnbContract = getWBNBContract(web3, networkId)
        try {
          await sendContract(dispatch, key, wrapuuid, wbnbContract, 'deposit', [], account, toWei(amountToWrap).dp(0).toString(10))
        } catch (err) {
          console.log('wrap error :>> ', err)
          setPending(false)
          return
        }
      }

      let isApproved = true
      const tokenContract = getERC20Contract(web3, depositToken.address)
      const depositGuardAddress = VAULT_DEPOSIT_GUARD_ADDRESS[networkId]
      const vaultDeployerAddress = VAULT_DEPLOYER_ADDRESS[networkId]
      const allowance = await getAllowance(tokenContract, depositGuardAddress, account)
      if (fromWei(allowance, depositToken.decimals).lt(amount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [depositGuardAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approveuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      const depositAmount = toWei(amount, depositToken.decimals).dp(0).toString(10)
      let lpAmount = await v3depositGuardContract.callStatic.forwardDepositToICHIVault(
        vault.address,
        vaultDeployerAddress,
        depositToken.address,
        depositAmount,
        '0',
        account,
        { from: account },
      )
      lpAmount = new BigNumber(lpAmount._hex)
        .times(Math.floor((100 - slippage) * 1000))
        .div(100000)
        .dp(0)
        .toString(10)

      console.log('lpAmount :>> ', lpAmount)
      try {
        await sendContract(
          dispatch,
          key,
          supplyuuid,
          depositGuardContract,
          'forwardDepositToICHIVault',
          [vault.address, vaultDeployerAddress, depositToken.address, depositAmount, lpAmount, account],
          account,
        )
      } catch (err) {
        console.log('supply error :>> ', err)
        setPending(false)
        return
      }
      isApproved = true
      const pairBalance = await vaultContract.methods.balanceOf(account).call()
      const pairAllowance = await getAllowance(vaultContract, vault.gauge.address, account)
      if (fromWei(pairAllowance).lt(fromWei(pairBalance))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve1uuid, vaultContract, 'approve', [vault.gauge.address, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 1 error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve1uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const bal = new BigNumber(pairBalance).dp(0).toString(10)
      console.log('bal :>> ', bal)
      const params = [bal]
      const gaugeContract = getGaugeSimpleContract(web3, vault.gauge.address)
      try {
        await sendContract(dispatch, key, stakeuuid, gaugeContract, 'deposit', params, account)
      } catch (err) {
        console.log('stake error :>> ', err)
        setPending(false)
        return
      }
      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Added And Staked',
        }),
      )
      setPending(false)
    },
    [account, web3, v3depositGuardContract, depositGuardContract],
  )

  return { onVaultAdd: handleVaultAdd, onVaultAddAndStake: handleVaultAddAndStake, pending }
}

export const useVaultRemove = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleVaultRemove = useCallback(
    async (vault, amount) => {
      const {
        address: pairAddress,
        token0: { symbol: baseSymbol },
        token1: { symbol: quoteSymbol },
      } = vault
      const key = uuidv4()
      const removeuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Remove ${baseSymbol}/${quoteSymbol} liquidity`,
          transactions: {
            [removeuuid]: {
              desc: 'Remove liquidity',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
      const vaultContract = getIchiVaultContract(web3, pairAddress)

      try {
        await sendContract(dispatch, key, removeuuid, vaultContract, 'withdraw', [toWei(amount).toFixed(0), account], account)
      } catch (err) {
        console.log('remove error :>> ', err)
        setPending(false)
        return
      }
      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Removed',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onVaultRemove: handleVaultRemove, pending }
}

export const useVaultStake = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleStake = useCallback(
    async (pair, amount) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const stakeuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Stake ${pair.symbol} in the gauge`,
          transactions: {
            [approveuuid]: {
              desc: 'Approve LP',
              status: TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [stakeuuid]: {
              desc: 'Stake LP',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isApproved = true
      const tokenContract = getERC20Contract(web3, pair.address)
      const allowance = await getAllowance(tokenContract, pair.gauge.address, account)
      if (fromWei(allowance, pair.decimals).lt(amount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [pair.gauge.address, MAX_UINT256], account)
        } catch (err) {
          console.log('approve error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approveuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const params = [toWei(amount, pair.decimals).toFixed(0)]
      const gaugeContract = getGaugeSimpleContract(web3, pair.gauge.address)
      try {
        await sendContract(dispatch, key, stakeuuid, gaugeContract, 'deposit', params, account)
      } catch (err) {
        console.log('stake error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'LP Staked',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onStake: handleStake, pending }
}

export const useVaultUnstake = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleUntake = useCallback(
    async (pair, amount) => {
      const key = uuidv4()
      const unstakeuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Unstake ${pair.symbol} from the gauge`,
          transactions: {
            [unstakeuuid]: {
              desc: 'Unstake LP tokens from the gauge',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
      const params = [toWei(amount, pair.decimals).toFixed(0)]
      const gaugeContract = getGaugeSimpleContract(web3, pair.gauge.address)
      setPending(true)
      try {
        await sendContract(dispatch, key, unstakeuuid, gaugeContract, 'withdraw', params, account)
      } catch (err) {
        console.log('unstake error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'LP Unstaked',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onUnstake: handleUntake, pending }
}

export const useVaultHarvest = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleHarvest = useCallback(
    async (pair) => {
      const key = uuidv4()
      const harvestuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim earnings for ${pair.symbol}`,
          transactions: {
            [harvestuuid]: {
              desc: 'Claim your earnings',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
      const gaugeContract = getGaugeSimpleContract(web3, pair.gauge.address)
      setPending(true)
      try {
        await sendContract(dispatch, key, harvestuuid, gaugeContract, 'getReward', [], account)
      } catch (err) {
        console.log('harvest error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Rewards Claimed',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onHarvest: handleHarvest, pending }
}

import { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { v4 as uuidv4 } from 'uuid'
import { TRANSACTION_STATUS } from 'config/constants'
import { useActivePreset, useV3MintActionHandlers } from 'state/mintV3/hooks'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { getERC20Contract, getGammaClearingContract, getGammaHyperVisorContract, getGaugeContract, getWBNBContract } from 'utils/contractHelpers'
import { getAllowance, sendContract } from 'utils/api'
import { MAX_UINT256, formatNumber, fromWei, toWei } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import { multicall } from 'utils/multicall'
import { gammaHypervisorAbi } from 'config/abi/v3'
import { useNetwork } from 'state/settings/hooks'
import { useGammas } from 'state/pools/hooks'
import useWeb3 from '../useWeb3'
import { useGammaUNIProxy } from '../useContract'

export const useGammasInfo = () => {
  const [info, setInfo] = useState([])
  const gammas = useGammas()
  const { networkId } = useNetwork()

  const fetchInfo = useCallback(async () => {
    const lowerCalls = gammas.map((pair) => {
      return {
        address: pair.address,
        name: 'baseLower',
      }
    })
    const upperCalls = gammas.map((pair) => {
      return {
        address: pair.address,
        name: 'baseUpper',
      }
    })
    const currentCalls = gammas.map((pair) => {
      return {
        address: pair.address,
        name: 'currentTick',
      }
    })
    const [lowerRes, upperRes, currentRes] = await Promise.all([
      multicall(gammaHypervisorAbi, lowerCalls, networkId),
      multicall(gammaHypervisorAbi, upperCalls, networkId),
      multicall(gammaHypervisorAbi, currentCalls, networkId),
    ])
    const final = gammas.map((pair, index) => {
      return {
        ...pair,
        lower: lowerRes[index][0],
        upper: upperRes[index][0],
        current: currentRes[index][0],
      }
    })
    setInfo(final)
  }, [gammas])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])

  return info
}

const useGammaAdd = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const gammaUNIProxyContract = useGammaUNIProxy()
  const web3 = useWeb3()
  const preset = useActivePreset()
  const { networkId } = useNetwork()

  const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers()

  const handleGammaAdd = useCallback(
    async (amountA, amountB, amountToWrap, gammaPair) => {
      const baseCurrency = amountA.currency
      const quoteCurrency = amountB.currency
      const baseCurrencyAddress = baseCurrency.wrapped ? baseCurrency.wrapped.address.toLowerCase() : ''
      const quoteCurrencyAddress = quoteCurrency.wrapped ? quoteCurrency.wrapped.address.toLowerCase() : ''
      const gammaPairAddress = gammaPair ? gammaPair.address : undefined
      if (!amountA || !amountB || !gammaPairAddress) return
      const clearingAddress = await gammaUNIProxyContract.methods.clearance().call()
      const clearingContract = getGammaClearingContract(clearingAddress, web3)
      const { deposit0Max: deposit0MaxRes, deposit1Max: deposit1MaxRes } = await clearingContract.methods.positions(gammaPairAddress).call()
      const deposit0Max = fromWei(deposit0MaxRes, gammaPair.token0.decimals)
      const deposit1Max = fromWei(deposit1MaxRes, gammaPair.token1.decimals)
      if (deposit0Max.lt((baseCurrencyAddress === gammaPair.token0.address.toLowerCase() ? amountA : amountB).toExact())) {
        customNotify(`Maximum deposit amount of ${gammaPair.token0.symbol} is ${deposit0Max.toFormat(0)}.`, 'warn')
        return
      }
      if (deposit1Max.lt((baseCurrencyAddress === gammaPair.token0.address.toLowerCase() ? amountB : amountA).toExact())) {
        customNotify(`Maximum deposit amount of ${gammaPair.token1.symbol} is ${deposit1Max.toFormat(0)}.`, 'warn')
        return
      }
      const key = uuidv4()
      const wrapuuid = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const supplyuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity`,
          transactions: {
            ...(amountToWrap
              ? {
                  [wrapuuid]: {
                    desc: `Wrap ${formatNumber(fromWei(amountToWrap.toString(10)))} BNB for WBNB`,
                    status: TRANSACTION_STATUS.WAITING,
                    hash: null,
                  },
                }
              : {}),
            [approve0uuid]: {
              desc: `Approve ${baseCurrency.symbol}`,
              status: amountToWrap ? TRANSACTION_STATUS.START : TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [approve1uuid]: {
              desc: `Approve ${quoteCurrency.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [supplyuuid]: {
              desc: 'Add liquidity',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      if (amountToWrap) {
        const wbnbContract = getWBNBContract(web3, networkId)
        try {
          await sendContract(dispatch, key, wrapuuid, wbnbContract, 'deposit', [], account, amountToWrap.toString(10))
        } catch (err) {
          console.log('wrap error :>> ', err)
          setPending(false)
          return
        }
      }

      let isApproved = true
      const baseTokenContract = getERC20Contract(web3, baseCurrencyAddress)
      const baseAllowance = await getAllowance(baseTokenContract, gammaPairAddress, account)
      if (fromWei(baseAllowance, baseCurrency.decimals).lt(amountA.toExact())) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve0uuid, baseTokenContract, 'approve', [gammaPairAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 0 error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve0uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      isApproved = true
      const quoteTokenContract = getERC20Contract(web3, quoteCurrencyAddress)
      const quoteAllowance = await getAllowance(quoteTokenContract, gammaPairAddress, account)
      if (fromWei(quoteAllowance, quoteCurrency.decimals).lt(amountB.toExact())) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve1uuid, quoteTokenContract, 'approve', [gammaPairAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 0 error :>> ', err)
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

      const firstParam = (baseCurrencyAddress === gammaPair.token0.address.toLowerCase() ? amountA : amountB).numerator.toString()
      const secondParam = (baseCurrencyAddress === gammaPair.token0.address.toLowerCase() ? amountB : amountA).numerator.toString()

      try {
        await sendContract(
          dispatch,
          key,
          supplyuuid,
          gammaUNIProxyContract,
          'deposit',
          [firstParam, secondParam, account, gammaPairAddress, [0, 0, 0, 0]],
          account,
        )
      } catch (err) {
        console.log('supply error :>> ', err)
        setPending(false)
        return
      }
      onFieldAInput('')
      onFieldBInput('')
      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Added',
        }),
      )
      setPending(false)
    },
    [account, web3, gammaUNIProxyContract, preset],
  )

  const handleGammaAddAndStake = useCallback(
    async (amountA, amountB, amountToWrap, gammaPair) => {
      const baseCurrency = amountA.currency
      const quoteCurrency = amountB.currency
      const baseCurrencyAddress = baseCurrency.wrapped ? baseCurrency.wrapped.address.toLowerCase() : ''
      const quoteCurrencyAddress = quoteCurrency.wrapped ? quoteCurrency.wrapped.address.toLowerCase() : ''
      const gammaPairAddress = gammaPair ? gammaPair.address : undefined
      if (!amountA || !amountB || !gammaPairAddress) return
      const clearingAddress = await gammaUNIProxyContract.methods.clearance().call()
      const clearingContract = getGammaClearingContract(clearingAddress, web3)
      const { deposit0Max: deposit0MaxRes, deposit1Max: deposit1MaxRes } = await clearingContract.methods.positions(gammaPairAddress).call()
      const deposit0Max = fromWei(deposit0MaxRes, gammaPair.token0.decimals)
      const deposit1Max = fromWei(deposit1MaxRes, gammaPair.token1.decimals)
      if (deposit0Max.lt((baseCurrencyAddress === gammaPair.token0.address.toLowerCase() ? amountA : amountB).toExact())) {
        customNotify(`Maximum deposit amount of ${gammaPair.token0.symbol} is ${deposit0Max.toFormat(0)}.`, 'warn')
        return
      }
      if (deposit1Max.lt((baseCurrencyAddress === gammaPair.token0.address.toLowerCase() ? amountB : amountA).toExact())) {
        customNotify(`Maximum deposit amount of ${gammaPair.token1.symbol} is ${deposit1Max.toFormat(0)}.`, 'warn')
        return
      }
      const key = uuidv4()
      const wrapuuid = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const supplyuuid = uuidv4()
      const approve2uuid = uuidv4()
      const stakeuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Add ${gammaPair.symbol} liquidity`,
          transactions: {
            ...(amountToWrap
              ? {
                  [wrapuuid]: {
                    desc: `Wrap ${formatNumber(fromWei(amountToWrap.toString(10)))} BNB for WBNB`,
                    status: TRANSACTION_STATUS.WAITING,
                    hash: null,
                  },
                }
              : {}),
            [approve0uuid]: {
              desc: `Approve ${baseCurrency.symbol}`,
              status: amountToWrap ? TRANSACTION_STATUS.START : TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [approve1uuid]: {
              desc: `Approve ${quoteCurrency.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [supplyuuid]: {
              desc: 'Add liquidity',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [approve2uuid]: {
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
          await sendContract(dispatch, key, wrapuuid, wbnbContract, 'deposit', [], account, amountToWrap.toString(10))
        } catch (err) {
          console.log('wrap error :>> ', err)
          setPending(false)
          return
        }
      }

      let isApproved = true
      const baseTokenContract = getERC20Contract(web3, baseCurrencyAddress)
      const baseAllowance = await getAllowance(baseTokenContract, gammaPairAddress, account)
      if (fromWei(baseAllowance, baseCurrency.decimals).lt(amountA.toExact())) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve0uuid, baseTokenContract, 'approve', [gammaPairAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 0 error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve0uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      isApproved = true
      const quoteTokenContract = getERC20Contract(web3, quoteCurrencyAddress)
      const quoteAllowance = await getAllowance(quoteTokenContract, gammaPairAddress, account)
      if (fromWei(quoteAllowance, quoteCurrency.decimals).lt(amountB.toExact())) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve1uuid, quoteTokenContract, 'approve', [gammaPairAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 0 error :>> ', err)
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

      const firstParam = (baseCurrencyAddress === gammaPair.token0.address.toLowerCase() ? amountA : amountB).numerator.toString()
      const secondParam = (baseCurrencyAddress === gammaPair.token0.address.toLowerCase() ? amountB : amountA).numerator.toString()

      try {
        await sendContract(
          dispatch,
          key,
          supplyuuid,
          gammaUNIProxyContract,
          'deposit',
          [firstParam, secondParam, account, gammaPairAddress, [0, 0, 0, 0]],
          account,
        )
      } catch (err) {
        console.log('supply error :>> ', err)
        setPending(false)
        return
      }
      isApproved = true
      const gammaPairContract = getERC20Contract(web3, gammaPairAddress)
      const pairBalance = await gammaPairContract.methods.balanceOf(account).call()
      const pairAllowance = await getAllowance(gammaPairContract, gammaPair.gauge.address, account)
      if (fromWei(pairAllowance).lt(fromWei(pairBalance))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve2uuid, gammaPairContract, 'approve', [gammaPair.gauge.address, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 2 error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve2uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const params = [pairBalance]
      const gaugeContract = getGaugeContract(web3, gammaPair.gauge.address)
      try {
        await sendContract(dispatch, key, stakeuuid, gaugeContract, 'deposit', params, account)
      } catch (err) {
        console.log('stake error :>> ', err)
        setPending(false)
        return
      }
      onFieldAInput('')
      onFieldBInput('')
      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Added And Staked',
        }),
      )
      setPending(false)
    },
    [account, web3, gammaUNIProxyContract, preset],
  )

  return { onGammaAdd: handleGammaAdd, onGammaAddAndStake: handleGammaAddAndStake, pending }
}

const useGammaRemove = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const preset = useActivePreset()

  const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers()

  const handleGammaRemove = useCallback(
    async (pool, amount) => {
      const {
        address: pairAddress,
        token0: { symbol: baseSymbol },
        token1: { symbol: quoteSymbol },
      } = pool
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
      const contract = getGammaHyperVisorContract(web3, pairAddress)

      try {
        await sendContract(dispatch, key, removeuuid, contract, 'withdraw', [toWei(amount).toFixed(0), account, account, [0, 0, 0, 0]], account)
      } catch (err) {
        console.log('remove error :>> ', err)
        setPending(false)
        return
      }
      onFieldAInput('')
      onFieldBInput('')
      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Removed',
        }),
      )
      setPending(false)
    },
    [account, web3, preset],
  )

  return { onGammaRemove: handleGammaRemove, pending }
}

export { useGammaAdd, useGammaRemove }

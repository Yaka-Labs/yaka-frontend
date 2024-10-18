import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import JSBI from 'jsbi'
import { useWeb3React } from '@web3-react/core'
import { Percent } from 'thena-sdk-core'
import { TRANSACTION_STATUS } from 'config/constants'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { getERC20Contract } from 'utils/contractHelpers'
import { getAllowance, sendContract, sendV3Contract } from 'utils/api'
import { MAX_UINT256, fromWei } from 'utils/formatNumber'
import { getAlgebraAddress } from 'utils/addressHelpers'
import { NonfungiblePositionManager } from 'v3lib/entities/nonfungiblePositionManager'
import { useNetwork } from 'state/settings/hooks'
import useWeb3 from '../useWeb3'
import { useAlgebra } from '../useContract'

const useAlgebraAdd = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const algebraContract = useAlgebra()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  const handleAlgebraAdd = useCallback(
    async (amountA, amountB, baseCurrency, quoteCurrency, mintInfo, slippage, deadline) => {
      const algebraAddress = getAlgebraAddress(networkId)
      const allowedSlippage = new Percent(JSBI.BigInt(slippage * 100), JSBI.BigInt(10000))
      const { position, depositADisabled, depositBDisabled, noLiquidity } = mintInfo
      const baseCurrencyAddress = baseCurrency.wrapped ? baseCurrency.wrapped.address.toLowerCase() : ''
      const quoteCurrencyAddress = quoteCurrency.wrapped ? quoteCurrency.wrapped.address.toLowerCase() : ''
      const key = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const supplyuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity`,
          transactions: {
            [approve0uuid]: {
              desc: `Approve ${baseCurrency.symbol}`,
              status: TRANSACTION_STATUS.WAITING,
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

      let isApproved = true
      if (!baseCurrency.isNative && !depositADisabled) {
        const baseTokenContract = getERC20Contract(web3, baseCurrencyAddress)
        const baseAllowance = await getAllowance(baseTokenContract, algebraAddress, account)
        if (fromWei(baseAllowance, baseCurrency.decimals).lt(amountA.toExact())) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve0uuid, baseTokenContract, 'approve', [algebraAddress, MAX_UINT256], account, '0', networkId)
          } catch (err) {
            console.log('approve 0 error :>> ', err)
            setPending(false)
            return
          }
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
      if (!quoteCurrency.isNative && !depositBDisabled) {
        const quoteTokenContract = getERC20Contract(web3, quoteCurrencyAddress)
        const quoteAllowance = await getAllowance(quoteTokenContract, algebraAddress, account)
        if (fromWei(quoteAllowance, quoteCurrency.decimals).lt(amountB.toExact())) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve1uuid, quoteTokenContract, 'approve', [algebraAddress, MAX_UINT256], account, '0', networkId)
          } catch (err) {
            console.log('approve 0 error :>> ', err)
            setPending(false)
            return
          }
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
      const timestamp = Math.floor(new Date().getTime() / 1000) + deadline * 60
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
      const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, {
        slippageTolerance: allowedSlippage,
        recipient: account,
        deadline: timestamp.toString(),
        useNative,
        createPool: noLiquidity,
      })

      try {
        await sendV3Contract(dispatch, key, supplyuuid, web3, account, algebraAddress, calldata, value, networkId)
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
    [account, web3, algebraContract, networkId],
  )

  return { onAlgebraAdd: handleAlgebraAdd, pending }
}

const useAlgebraIncrease = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const algebraContract = useAlgebra()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  const handleAlgebraIncrease = useCallback(
    async (amountA, amountB, position, slippage, deadline, tokenId) => {
      const algebraAddress = getAlgebraAddress(networkId)
      const allowedSlippage = new Percent(JSBI.BigInt(slippage * 100), JSBI.BigInt(10000))
      const baseCurrency = amountA.currency
      const quoteCurrency = amountB.currency
      const baseCurrencyAddress = baseCurrency.wrapped ? baseCurrency.wrapped.address.toLowerCase() : ''
      const quoteCurrencyAddress = quoteCurrency.wrapped ? quoteCurrency.wrapped.address.toLowerCase() : ''
      const key = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const increaseuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Increase ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity`,
          transactions: {
            [approve0uuid]: {
              desc: `Approve ${baseCurrency.symbol}`,
              status: TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [approve1uuid]: {
              desc: `Approve ${quoteCurrency.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [increaseuuid]: {
              desc: 'Add liquidity',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      let isApproved = true
      if (!baseCurrency.isNative) {
        const baseTokenContract = getERC20Contract(web3, baseCurrencyAddress)
        const baseAllowance = await getAllowance(baseTokenContract, algebraAddress, account)
        if (fromWei(baseAllowance, baseCurrency.decimals).lt(amountA.toExact())) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve0uuid, baseTokenContract, 'approve', [algebraAddress, MAX_UINT256], account, '0', networkId)
          } catch (err) {
            console.log('approve 0 error :>> ', err)
            setPending(false)
            return
          }
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
      if (!quoteCurrency.isNative) {
        const quoteTokenContract = getERC20Contract(web3, quoteCurrencyAddress)
        const quoteAllowance = await getAllowance(quoteTokenContract, algebraAddress, account)
        if (fromWei(quoteAllowance, quoteCurrency.decimals).lt(amountB.toExact())) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve1uuid, quoteTokenContract, 'approve', [algebraAddress, MAX_UINT256], account, '0', networkId)
          } catch (err) {
            console.log('approve 0 error :>> ', err)
            setPending(false)
            return
          }
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
      const timestamp = Math.floor(new Date().getTime() / 1000) + deadline * 60
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
      const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, {
        tokenId,
        slippageTolerance: allowedSlippage,
        deadline: timestamp.toString(),
        useNative,
      })

      try {
        await sendV3Contract(dispatch, key, increaseuuid, web3, account, algebraAddress, calldata, value, networkId)
      } catch (err) {
        console.log('increase error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Increased',
        }),
      )
      setPending(false)
    },
    [account, web3, algebraContract, networkId],
  )

  return { onAlgebraIncrease: handleAlgebraIncrease, pending }
}

const useAlgebraRemove = () => {
  const [pending, setPending] = useState(false)
  const [burnPending, setBurnPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const algebraContract = useAlgebra()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  const handleAlgebraRemove = useCallback(
    async (tokenId, derivedInfo, slippage, deadline) => {
      const algebraAddress = getAlgebraAddress(networkId)
      const { positionSDK, liquidityPercentage, liquidityValue0, liquidityValue1, feeValue0, feeValue1 } = derivedInfo
      const allowedSlippage = new Percent(JSBI.BigInt(slippage * 100), JSBI.BigInt(10000))
      const key = uuidv4()
      const removeuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Remove ${liquidityValue0.currency.symbol}/${liquidityValue1.currency.symbol} liquidity`,
          transactions: {
            [removeuuid]: {
              desc: 'Remove tokens from the pool',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
      const timestamp = Math.floor(new Date().getTime() / 1000) + deadline * 60

      const { calldata, value } = NonfungiblePositionManager.removeCallParameters(positionSDK, {
        tokenId: tokenId.toString(),
        liquidityPercentage,
        slippageTolerance: allowedSlippage,
        deadline: timestamp.toString(),
        collectOptions: {
          expectedCurrencyOwed0: feeValue0,
          expectedCurrencyOwed1: feeValue1,
          recipient: account,
        },
      })

      try {
        await sendV3Contract(dispatch, key, removeuuid, web3, account, algebraAddress, calldata, value, networkId)
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
    [account, web3, algebraContract, networkId],
  )

  const handleAlgebraRemoveAndBurn = useCallback(
    async (tokenId, derivedInfo, slippage, deadline) => {
      const algebraAddress = getAlgebraAddress(networkId)
      const { positionSDK, liquidityPercentage, liquidityValue0, liquidityValue1, feeValue0, feeValue1 } = derivedInfo
      const allowedSlippage = new Percent(JSBI.BigInt(slippage * 100), JSBI.BigInt(10000))
      const key = uuidv4()
      const removeuuid = uuidv4()
      setBurnPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Withdraw and burn ${liquidityValue0.currency.symbol}/${liquidityValue1.currency.symbol} liquidity`,
          transactions: {
            [removeuuid]: {
              desc: 'Withdraw and burn',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
      const timestamp = Math.floor(new Date().getTime() / 1000) + deadline * 60

      const { calldata, value } = NonfungiblePositionManager.removeCallParameters(positionSDK, {
        tokenId: tokenId.toString(),
        liquidityPercentage,
        slippageTolerance: allowedSlippage,
        deadline: timestamp.toString(),
        collectOptions: {
          expectedCurrencyOwed0: feeValue0,
          expectedCurrencyOwed1: feeValue1,
          recipient: account,
        },
        burnToken: true,
      })

      try {
        await sendV3Contract(dispatch, key, removeuuid, web3, account, algebraAddress, calldata, value, networkId)
      } catch (err) {
        console.log('withdraw and burn error :>> ', err)
        setBurnPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Withdrawn and Burnt',
        }),
      )
      setBurnPending(false)
    },
    [account, web3, algebraContract, networkId],
  )

  return { onAlgebraRemove: handleAlgebraRemove, pending, onAlgebraRemoveAndBurn: handleAlgebraRemoveAndBurn, burnPending }
}

const useAlgebraClaim = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const algebraContract = useAlgebra()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  const handleAlgebraClaim = useCallback(
    async (tokenId, feeValue0, feeValue1) => {
      const algebraAddress = getAlgebraAddress(networkId)
      const key = uuidv4()
      const collectuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Claim ${feeValue0.currency.symbol}/${feeValue1.currency.symbol} Fees`,
          transactions: {
            [collectuuid]: {
              desc: 'Claim Fees',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
        tokenId: tokenId.toString(),
        expectedCurrencyOwed0: feeValue0,
        expectedCurrencyOwed1: feeValue1,
        recipient: account,
      })

      try {
        await sendV3Contract(dispatch, key, collectuuid, web3, account, algebraAddress, calldata, value, networkId)
      } catch (err) {
        console.log('claim error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Fees Claimed',
        }),
      )
      setPending(false)
    },
    [account, web3, algebraContract, networkId],
  )

  return { onAlgebraClaim: handleAlgebraClaim, pending }
}

const useAlgebraBurn = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const algebraContract = useAlgebra()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  const handleAlgebraBurn = useCallback(
    async (tokenId) => {
      const algebraAddress = getAlgebraAddress(networkId)
      const key = uuidv4()
      const burnuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Burn NFT #${tokenId}`,
          transactions: {
            [burnuuid]: {
              desc: `Burn NFT #${tokenId}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      const { calldata, value } = NonfungiblePositionManager.burnCallParameters(tokenId.toString())

      try {
        await sendV3Contract(dispatch, key, burnuuid, web3, account, algebraAddress, calldata, value, networkId)
      } catch (err) {
        console.log('burn error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: `NFT #${tokenId} Burnt`,
        }),
      )
      setPending(false)
    },
    [account, web3, algebraContract, networkId],
  )

  return { onAlgebraBurn: handleAlgebraBurn, pending }
}

export { useAlgebraAdd, useAlgebraIncrease, useAlgebraRemove, useAlgebraClaim, useAlgebraBurn }

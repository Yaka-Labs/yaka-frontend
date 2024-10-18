import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { routerAbi } from 'config/abi'
import { CURRENCY_LIST, POOL_TYPES, TAX_ASSETS, TRANSACTION_STATUS, WSEI_ADDRESS } from 'config/constants'
import { getActivityAddress, getRouterAddress } from 'utils/addressHelpers'
import { formatNumber, fromWei, getWrappedAddress, isInvalidAmount, MAX_UINT256, toWei } from 'utils/formatNumber'
import { multicall } from 'utils/multicall'
import { getAllowance, isWhiteListPair, sendContract, sendV3Contract } from 'utils/api'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { getERC20Contract, getWBNBContract } from 'utils/contractHelpers'
import { usePools } from 'state/pools/hooks'
import { useNetwork } from 'state/settings/hooks'
import { useQuery } from '@tanstack/react-query'
import { useActivity, useRouter } from './useContract'
import useWeb3 from './useWeb3'

// const DisabledDexIds = '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,44,45,46'
const EnabledDexIds = '43,47'
const Connectors =
  '0xf4c8e32eadec4bfe97e0f595add0f4450a863a11,0x52f24a5e03aee338da5fd9df68d2b6fae1178827,0x90c97f71e18723b0cf0dfa30ee176ab653e89f40,0x1bdd3cf7f79cfb8edbb955f20ad99211551ba275'

const useQuoteSwap = (fromAsset, toAsset, fromAmount) => {
  const [bestTrade, setBestTrade] = useState()
  const [priceImpact, setPriceImpact] = useState(new BigNumber(0))
  const [quotePending, setQuotePending] = useState(false)
  const fusions = usePools()
  const { networkId } = useNetwork()

  useEffect(() => {
    const fetchInfo = async () => {
      const fromAddress = getWrappedAddress(fromAsset)
      const toAddress = getWrappedAddress(toAsset)
      // const bases = V1_ROUTE_ASSETS[fromAsset.chainId].filter((item) => ![fromAddress, toAddress].includes(item.address.toLowerCase()))
      const result = []
      // direct pairs
      result.push({
        routes: [
          {
            from: fromAddress,
            to: toAddress,
            stable: true,
            address: '',
          },
        ],
      })
      result.push({
        routes: [
          {
            from: fromAddress,
            to: toAddress,
            stable: false,
            address: '',
          },
        ],
      })
      // // 1 hop
      // bases.forEach((base) => {
      //   result.push({
      //     routes: [
      //       {
      //         from: fromAddress,
      //         to: base.address,
      //         stable: true,
      //       },
      //       {
      //         from: base.address,
      //         to: toAddress,
      //         stable: true,
      //       },
      //     ],
      //     base: [base],
      //   })
      //   result.push({
      //     routes: [
      //       {
      //         from: fromAddress,
      //         to: base.address,
      //         stable: true,
      //       },
      //       {
      //         from: base.address,
      //         to: toAddress,
      //         stable: false,
      //       },
      //     ],
      //     base: [base],
      //   })
      //   result.push({
      //     routes: [
      //       {
      //         from: fromAddress,
      //         to: base.address,
      //         stable: false,
      //       },
      //       {
      //         from: base.address,
      //         to: toAddress,
      //         stable: true,
      //       },
      //     ],
      //     base: [base],
      //   })
      //   result.push({
      //     routes: [
      //       {
      //         from: fromAddress,
      //         to: base.address,
      //         stable: false,
      //       },
      //       {
      //         from: base.address,
      //         to: toAddress,
      //         stable: false,
      //       },
      //     ],
      //     base: [base],
      //   })
      // })
      // // 2 hop
      // bases.forEach((base) => {
      //   const otherbases = bases.filter((ele) => ele.address !== base.address)
      //   otherbases.forEach((otherbase) => {
      //     // true true true
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAddress,
      //           to: base.address,
      //           stable: true,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           stable: true,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAddress,
      //           stable: true,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // true true false
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAddress,
      //           to: base.address,
      //           stable: true,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           stable: true,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAddress,
      //           stable: false,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // true false true
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAddress,
      //           to: base.address,
      //           stable: true,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           stable: false,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAddress,
      //           stable: true,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // true false false
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAddress,
      //           to: base.address,
      //           stable: true,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           stable: false,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAddress,
      //           stable: false,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // false true true
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAddress,
      //           to: base.address,
      //           stable: false,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           stable: true,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAddress,
      //           stable: true,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // false true false
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAddress,
      //           to: base.address,
      //           stable: false,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           stable: true,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAddress,
      //           stable: false,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // false false true
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAddress,
      //           to: base.address,
      //           stable: false,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           stable: false,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAddress,
      //           stable: true,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // false false false
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAddress,
      //           to: base.address,
      //           stable: false,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           stable: false,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAddress,
      //           stable: false,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //   })
      // })
      const final = result.filter((item) => {
        let isExist = true
        for (let i = 0; i < item.routes.length; i++) {
          const route = item.routes[i]
          const found = fusions
            .filter((pool) => pool.isValid && pool.type === POOL_TYPES.V1)
            .find((pool) => {
              return (
                pool.stable === route.stable &&
                [pool.token0.address.toLowerCase(), pool.token1.address.toLowerCase()].includes(route.from.toLowerCase()) &&
                [pool.token0.address.toLowerCase(), pool.token1.address.toLowerCase()].includes(route.to.toLowerCase())
              )
            })
          if (!found || found.tvl.lt(1e-5)) {
            isExist = false
            break
          }
        }
        return isExist
      })
      if (final.length === 0) {
        setBestTrade(null)
        return
      }
      setQuotePending(true)
      const sendFromAmount = toWei(fromAmount, fromAsset.decimals).toFixed(0)
      const calls = final.map((item) => {
        return {
          address: getRouterAddress(networkId),
          name: 'getAmountsOut',
          params: [sendFromAmount, item.routes],
        }
      })
      try {
        const receiveAmounts = await multicall(routerAbi, calls, fromAsset.chainId)
        for (let i = 0; i < receiveAmounts.length; i++) {
          final[i].receiveAmounts = receiveAmounts[i].amounts
          final[i].finalValue = fromWei(Number(receiveAmounts[i].amounts[receiveAmounts[i].amounts.length - 1]), toAsset.decimals)
        }
        const bestAmountOut = final.reduce((best, current) => {
          if (!best) {
            return current
          }
          return best.finalValue.gt(current.finalValue) ? best : current
        }, 0)
        console.log(bestAmountOut)

        if (bestAmountOut.finalValue.isZero()) {
          setQuotePending(false)
          setBestTrade(null)
          return
        }

        let totalRatio = new BigNumber(1)

        for (let i = 0; i < bestAmountOut.routes.length; i++) {
          const route = bestAmountOut.routes[i]
          const found = fusions.find(
            (pool) =>
              pool.stable === route.stable &&
              pool.type === POOL_TYPES.V1 &&
              [pool.token0.address.toLowerCase(), pool.token1.address.toLowerCase()].includes(route.from.toLowerCase()) &&
              [pool.token0.address.toLowerCase(), pool.token1.address.toLowerCase()].includes(route.to.toLowerCase()),
          )
          if (!route.stable) {
            let reserveIn
            let reserveOut
            if (found.token0.address.toLowerCase() === route.from.toLowerCase()) {
              reserveIn = toWei(found.token0.reserve, found.token0.decimals)
              reserveOut = toWei(found.token1.reserve, found.token1.decimals)
            } else {
              reserveIn = toWei(found.token1.reserve, found.token1.decimals)
              reserveOut = toWei(found.token0.reserve, found.token0.decimals)
            }
            let amountIn = 0
            let amountOut = 0
            if (i === 0) {
              amountIn = sendFromAmount
              amountOut = Number(bestAmountOut.receiveAmounts[1])
            } else {
              amountIn = Number(bestAmountOut.receiveAmounts[i])
              amountOut = Number(bestAmountOut.receiveAmounts[i + 1])
            }

            const amIn = new BigNumber(amountIn).div(reserveIn)
            const amOut = new BigNumber(amountOut).div(reserveOut)
            const ratio = new BigNumber(amOut).div(amIn)

            totalRatio = totalRatio.times(ratio)
          }
          bestAmountOut.routes[i].address = found.address
        }
        setBestTrade(bestAmountOut)
        setPriceImpact(new BigNumber(1).minus(totalRatio).times(100))
        setQuotePending(false)
      } catch (error) {
        console.log('error :>> ', error)
        setBestTrade(null)
        setQuotePending(false)
      }
    }
    if (fromAsset && toAsset && !isInvalidAmount(fromAmount) && getWrappedAddress(fromAsset) !== getWrappedAddress(toAsset)) {
      fetchInfo()
    } else {
      setBestTrade(null)
    }
  }, [fromAsset, toAsset, fromAmount, fusions, networkId])

  return { bestTrade, priceImpact, quotePending }
}

const useProceedSwap = () => {
  const [swapPending, setSwapPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const routerContract = useRouter()
  const activityContract = useActivity()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  const handleSwap = useCallback(
    async (fromAsset, toAsset, fromAmount, bestTrade, slippage, deadline, inviter) => {
      const routerAddress = getRouterAddress(networkId)
      const activityAddress = getActivityAddress(networkId)
      const key = uuidv4()
      const approveuuid = uuidv4()
      const swapuuid = uuidv4()
      console.log(bestTrade)

      setSwapPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Swap ${fromAsset.symbol} for ${toAsset.symbol}`,
          transactions: {
            [approveuuid]: {
              desc: `Approve ${fromAsset.symbol}`,
              status: TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [swapuuid]: {
              desc: `Swap ${formatNumber(fromAmount)} ${fromAsset.symbol} for ${toAsset.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
      let isApproved = true
      let realContract = routerContract
      let realRouterAddress = routerAddress
      let flag = false
      // const isWhite = await isWhiteListPair(activityContract, bestTrade.routes[0].address)
      // const white = await getWhiteList(activityContract, 0)
      // console.log(bestTrade.routes[0].address)
      // console.log(isWhite, bestTrade.routes[0].address)
      // if (isWhite) {
      //   realContract = activityContract
      //   realRouterAddress = activityAddress
      //   flag = false //
      // }
      delete bestTrade.routes[0].address
      if (fromAsset.address !== 'SEI') {
        const tokenContract = getERC20Contract(web3, fromAsset.address)
        console.log(tokenContract, web3, fromAsset.address)
        const allowance = await getAllowance(tokenContract, realRouterAddress, account)
        console.log(allowance)
        if (fromWei(allowance, fromAsset.decimals).lt(fromAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [realRouterAddress, MAX_UINT256], account, '0', networkId)
          } catch (err) {
            console.log('approve 0 error :>> ', err)
            setSwapPending(false)
            return
          }
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
      const sendSlippage = new BigNumber(100).minus(slippage).div(100)
      const sendFromAmount = toWei(fromAmount, fromAsset.decimals).toFixed(0)
      const sendMinAmountOut = toWei(bestTrade.finalValue.times(sendSlippage), toAsset.decimals).toFixed(0)
      const deadlineVal =
        '' +
        moment()
          .add(Number(deadline) * 60, 'seconds')
          .unix()
      let func =
        TAX_ASSETS[fromAsset.chainId].includes(fromAsset.address.toLowerCase()) || TAX_ASSETS[fromAsset.chainId].includes(toAsset.address.toLowerCase())
          ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
          : 'swapExactTokensForTokens'
      let params = [sendFromAmount, sendMinAmountOut, bestTrade.routes, account, deadlineVal]
      if (flag) {
        params = [sendFromAmount, sendMinAmountOut, bestTrade.routes, deadlineVal, inviter]
      }
      let sendValue = '0'

      if (fromAsset.address === 'SEI') {
        if (TAX_ASSETS[fromAsset.chainId].includes(toAsset.address.toLowerCase())) {
          func = 'swapExactETHForTokensSupportingFeeOnTransferTokens'
        } else {
          func = 'swapExactETHForTokens'
        }
        params = [sendMinAmountOut, bestTrade.routes, account, deadlineVal]
        if (flag) {
          params = [sendMinAmountOut, bestTrade.routes, deadlineVal, inviter]
        }
        sendValue = sendFromAmount
      }
      if (toAsset.address === 'SEI') {
        if (TAX_ASSETS[fromAsset.chainId].includes(fromAsset.address.toLowerCase())) {
          func = 'swapExactTokensForETHSupportingFeeOnTransferTokens'
        } else {
          func = 'swapExactTokensForETH'
        }
        if (flag) {
          params = [sendFromAmount, sendMinAmountOut, bestTrade.routes, deadlineVal, inviter]
        } else {
          params = [sendFromAmount, sendMinAmountOut, bestTrade.routes, account, deadlineVal]
        }
      }
      try {
        console.log(func, params)
        await sendContract(dispatch, key, swapuuid, realContract, func, params, account, sendValue, networkId)
      } catch (err) {
        console.log('swap error :>> ', err)
        setSwapPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Swap Successful',
        }),
      )
      setSwapPending(false)
    },
    [account, web3, routerContract, networkId],
  )

  const handleWrap = useCallback(
    async (amount) => {
      const key = uuidv4()
      const wrapuuid = uuidv4()
      setSwapPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Wrap ${CURRENCY_LIST[networkId]} for W${CURRENCY_LIST[networkId]}`,
          transactions: {
            [wrapuuid]: {
              desc: `Wrap ${formatNumber(amount)} ${CURRENCY_LIST[networkId]} for W${CURRENCY_LIST[networkId]}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      const wbnbContract = getWBNBContract(web3, networkId)
      try {
        await sendContract(dispatch, key, wrapuuid, wbnbContract, 'deposit', [], account, toWei(amount).toFixed(0), networkId)
      } catch (err) {
        console.log('wrap error :>> ', err)
        setSwapPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Wrap Successful',
        }),
      )
      setSwapPending(false)
    },
    [account, web3, routerContract],
  )

  const handleUnwrap = useCallback(
    async (amount) => {
      const key = uuidv4()
      const wrapuuid = uuidv4()
      setSwapPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Unwrap W${CURRENCY_LIST[networkId]} for ${CURRENCY_LIST[networkId]}`,
          transactions: {
            [wrapuuid]: {
              desc: `Unwrap ${formatNumber(amount)} W${CURRENCY_LIST[networkId]} for ${CURRENCY_LIST[networkId]}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      const wbnbContract = getWBNBContract(web3, networkId)
      try {
        await sendContract(dispatch, key, wrapuuid, wbnbContract, 'withdraw', [toWei(amount).toFixed(0)], account, '0', networkId)
      } catch (err) {
        console.log('unwrap error :>> ', err)
        setSwapPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Unwrap Successful',
        }),
      )
      setSwapPending(false)
    },
    [account, web3, routerContract],
  )

  return { onSwap: handleSwap, onWrap: handleWrap, onUnwrap: handleUnwrap, swapPending }
}

const useBestQuoteSwap = (fromAsset, toAsset, fromAmount, slippage) => {
  return useQuery({
    queryKey: ['useBestQuoteSwap', fromAsset?.address, toAsset?.address, fromAmount, slippage],
    queryFn: async ({ signal }) => {
      const inTokenAddress =
        fromAsset.address.toLowerCase() === CURRENCY_LIST[fromAsset.chainId].toLowerCase() ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : fromAsset.address
      const outTokenAddress =
        toAsset.address.toLowerCase() === CURRENCY_LIST[toAsset.chainId].toLowerCase() ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : toAsset.address
      const response = await fetch(
        `https://open-api.openocean.finance/v3/bsc/quote?chain=bsc&inTokenAddress=${inTokenAddress}&outTokenAddress=${outTokenAddress}&amount=${Number(
          fromAmount,
        )}&gasPrice=5&slippage=${slippage}&enabledDexIds=${EnabledDexIds}&referrer=0x7aefe9316fe9eff671da6edf4eeafaa93380f197&connectors=${Connectors}`,
        {
          method: 'GET',
          signal,
        },
      )
      const res = await response.json()

      return res.data
    },
    refetchInterval: 20_000,
    gcTime: 0,
    enabled: !!fromAsset && !!toAsset && !isInvalidAmount(fromAmount) && fromAsset.address.toLowerCase() !== toAsset.address.toLowerCase(),
  })
}

const useBestSwap = () => {
  const [swapPending, setSwapPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  const handleBestSwap = useCallback(
    async (fromAsset, toAsset, fromAmount, toAmount, slippage) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const swapuuid = uuidv4()
      // const routerAddress = getOpenOceanRouterAddress()
      const routerAddress = '0xdB684227dc12C001dfF60E9D155236340629ff4d'
      setSwapPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Swap ${fromAsset.symbol} for ${toAsset.symbol}`,
          transactions: {
            [approveuuid]: {
              desc: `Approve ${fromAsset.symbol}`,
              status: TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [swapuuid]: {
              desc: `Swap ${formatNumber(fromAmount)} ${fromAsset.symbol} for ${formatNumber(toAmount)} ${toAsset.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      let isApproved = true
      if (fromAsset.address.toLowerCase() !== CURRENCY_LIST[fromAsset.chainId].toLowerCase()) {
        const tokenContract = getERC20Contract(web3, fromAsset.address)
        const allowance = await getAllowance(tokenContract, routerAddress, account)
        if (fromWei(allowance, fromAsset.decimals).lt(fromAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [routerAddress, MAX_UINT256], account)
          } catch (err) {
            console.log('approve 0 error :>> ', err)
            setSwapPending(false)
            return
          }
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
      const inTokenAddress =
        fromAsset.address.toLowerCase() === CURRENCY_LIST[fromAsset.chainId].toLowerCase() ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : fromAsset.address
      const outTokenAddress =
        toAsset.address.toLowerCase() === CURRENCY_LIST[toAsset.chainId].toLowerCase() ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : toAsset.address
      const response = await fetch(
        `https://open-api.openocean.finance/v3/bsc/swap_quote?inTokenAddress=${inTokenAddress}&outTokenAddress=${outTokenAddress}&amount=${new BigNumber(
          fromAmount,
        )
          .dp(fromAsset.decimals)
          .toString(10)}&gasPrice=5&slippage=${slippage}&account=${account}&enabledDexIds=${EnabledDexIds}
          &referrer=0x7aefe9316fe9eff671da6edf4eeafaa93380f197&connectors=${Connectors}`,
        {
          method: 'GET',
        },
      )
      const res = await response.json()
      const { data, value } = res.data
      try {
        await sendV3Contract(dispatch, key, swapuuid, web3, account, routerAddress, data, value, networkId)
      } catch (err) {
        console.log('best swap error :>> ', err)
        setSwapPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Swap Successful',
        }),
      )
      setSwapPending(false)
    },
    [account, web3, networkId],
  )

  return { onBestSwap: handleBestSwap, swapPending }
}

export { useQuoteSwap, useProceedSwap, useBestQuoteSwap, useBestSwap }

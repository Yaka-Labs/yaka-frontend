import { useState, useCallback, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { TAX_ASSETS, TRANSACTION_STATUS, WSEI_ADDRESS } from 'config/constants'
import { getAllowance, isWhiteListPair, sendContract } from 'utils/api'
import { getActivityAddress, getRouterAddress, getWBNBAddress } from 'utils/addressHelpers'
import { getERC20Contract, getGaugeContract } from 'utils/contractHelpers'
import { extractJsonObject, fromWei, MAX_UINT256, toWei } from 'utils/formatNumber'
import { useNetwork } from 'state/settings/hooks'
// import { getWeb3NoAccount } from 'utils/web3'
import useWeb3 from './useWeb3'
import { useActivity, useRouter } from './useContract'
import useRefresh from './useRefresh'
import { customNotify } from '../utils/notify'

const useAddLiquidity = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const routerContract = useRouter()
  const activityContract = useActivity()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  const handleAdd = useCallback(
    async (firstAsset, secondAsset, firstAmount, secondAmount, isStable, slippage, deadline, inviter, pool) => {
      const routerAddress = getRouterAddress(networkId)
      const activityAddress = getActivityAddress(networkId)
      const key = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const supplyuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Add ${firstAsset.symbol} and ${secondAsset.symbol} (${isStable ? 'Stable' : 'Volatile'})`,
          transactions: {
            [approve0uuid]: {
              desc: `Approve ${firstAsset.symbol}`,
              status: TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [approve1uuid]: {
              desc: `Approve ${secondAsset.symbol}`,
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

      let realContract = routerContract
      let realRouterAddress = routerAddress
      let flag = false
      // let poolAddress = pool ? pool.address : ''
      // let isWhite = false
      // if (poolAddress) {
      //   isWhite = await isWhiteListPair(activityContract, pool.address)
      // }
      // if (isWhite) {
      //   realContract = activityContract
      //   realRouterAddress = activityAddress
      //   flag = false //关闭不走活动合约
      // }

      let isApproved = true
      if (firstAsset.address !== 'SEI') {
        const tokenContract = getERC20Contract(web3, firstAsset.address)
        const allowance = await getAllowance(tokenContract, realRouterAddress, account)
        if (fromWei(allowance, firstAsset.decimals).lt(firstAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve0uuid, tokenContract, 'approve', [realRouterAddress, MAX_UINT256], account, '0', networkId)
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
      if (secondAsset.address !== 'SEI') {
        const tokenContract = getERC20Contract(web3, secondAsset.address)
        const allowance = await getAllowance(tokenContract, realRouterAddress, account)
        if (fromWei(allowance, secondAsset.decimals).lt(firstAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve1uuid, tokenContract, 'approve', [realRouterAddress, MAX_UINT256], account, '0', networkId)
          } catch (err) {
            console.log('approve 1 error :>> ', err)
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

      const sendSlippage = new BigNumber(100).minus(slippage).div(100)

      console.log('sendSlippage', sendSlippage.toString())
      const sendAmount0 = toWei(firstAmount, firstAsset.decimals).toFixed(0)
      const sendAmount1 = toWei(secondAmount, secondAsset.decimals).toFixed(0)
      const deadlineVal =
        '' +
        moment()
          .add(Number(deadline) * 60, 'seconds')
          .unix()
      const sendAmount0Min = toWei(sendSlippage.times(firstAmount), firstAsset.decimals).toFixed(0)
      const sendAmount1Min = toWei(sendSlippage.times(secondAmount), secondAsset.decimals).toFixed(0)
      let func = 'addLiquidity'
      let params = [firstAsset.address, secondAsset.address, isStable, sendAmount0, sendAmount1, sendAmount0Min, sendAmount1Min, account, deadlineVal]
      let sendValue = '0'
      if (flag) {
        params = [firstAsset.address, secondAsset.address, isStable, sendAmount0, sendAmount1, sendAmount0Min, sendAmount1Min, deadlineVal, inviter]
      }
      if (firstAsset.address === 'SEI') {
        func = 'addLiquidityETH'
        params = [secondAsset.address, isStable, sendAmount1, sendAmount1Min, sendAmount0Min, account, deadlineVal]
        if (flag) {
          params = [secondAsset.address, isStable, sendAmount1, sendAmount1Min, sendAmount0Min, deadlineVal, inviter]
        }
        sendValue = sendAmount0
        //  * sendSlippage
      }
      if (secondAsset.address === 'SEI') {
        func = 'addLiquidityETH'
        params = [firstAsset.address, isStable, sendAmount0, sendAmount0Min, sendAmount1Min, account, deadlineVal]
        if (flag) {
          params = [firstAsset.address, isStable, sendAmount0, sendAmount0Min, sendAmount1Min, deadlineVal, inviter]
        }
        sendValue = sendAmount1
        //  * sendSlippage
      }

      // if (firstAsset.address === 'SEI' || secondAsset.address === 'SEI') {
      //   const amountOut = await routerContract.methods.getAmountOut(sendAmount1, getWBNBAddress(firstAsset.chainId).toLowerCase(), secondAsset.address).call()
      //   console.log('amountOut', amountOut)
      // }

      try {
        await sendContract(dispatch, key, supplyuuid, realContract, func, params, account, sendValue, networkId)
      } catch (err) {
        console.log('supply error1 :>> ', err)
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
    [account, web3, routerContract, networkId],
  )

  const handleAddAndStake = useCallback(
    // async (firstAsset, secondAsset, firstAmount, secondAmount, isStable, slippage, deadline, inviter, pool) => {

    async (pair, firstAsset, secondAsset, firstAmount, secondAmount, isStable, slippage, deadline, inviter) => {
      const pool = pair
      const routerAddress = getRouterAddress(networkId)
      const activityAddress = getActivityAddress(networkId)
      const key = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const approve2uuid = uuidv4()
      const supplyuuid = uuidv4()
      const stakeuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Add ${firstAsset.symbol} and ${secondAsset.symbol} (${isStable ? 'Stable' : 'Volatile'})`,
          transactions: {
            [approve0uuid]: {
              desc: `Approve ${firstAsset.symbol}`,
              status: TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [approve1uuid]: {
              desc: `Approve ${secondAsset.symbol}`,
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

      let isApproved = true
      // if (firstAsset.address !== 'SEI') {
      //   const tokenContract = getERC20Contract(web3, firstAsset.address)
      //   const allowance = await getAllowance(tokenContract, routerAddress, account)
      //   if (fromWei(allowance, firstAsset.decimals).lt(firstAmount)) {
      //     isApproved = false
      //     try {
      //       await sendContract(dispatch, key, approve0uuid, tokenContract, 'approve', [routerAddress, MAX_UINT256], account, '0', networkId)
      //     } catch (err) {
      //       console.log('approve 0 error :>> ', err)
      //       setPending(false)
      //       return
      //     }
      //   }
      // }
      // if (isApproved) {
      //   dispatch(
      //     updateTransaction({
      //       key,
      //       uuid: approve0uuid,
      //       status: TRANSACTION_STATUS.SUCCESS,
      //     }),
      //   )
      // }
      // isApproved = true
      // if (secondAsset.address !== 'SEI') {
      //   const tokenContract = getERC20Contract(web3, secondAsset.address)
      //   const allowance = await getAllowance(tokenContract, routerAddress, account)
      //   if (fromWei(allowance, secondAsset.decimals).lt(firstAmount)) {
      //     isApproved = false
      //     try {
      //       await sendContract(dispatch, key, approve1uuid, tokenContract, 'approve', [routerAddress, MAX_UINT256], account, '0', networkId)
      //     } catch (err) {
      //       console.log('approve 1 error :>> ', err)
      //       setPending(false)
      //       return
      //     }
      //   }
      // }
      // if (isApproved) {
      //   dispatch(
      //     updateTransaction({
      //       key,
      //       uuid: approve1uuid,
      //       status: TRANSACTION_STATUS.SUCCESS,
      //     }),
      //   )
      // }

      // const sendSlippage = new BigNumber(100).minus(slippage).div(100)
      // const sendAmount0 = toWei(firstAmount, firstAsset.decimals).toFixed(0)
      // const sendAmount1 = toWei(secondAmount, secondAsset.decimals).toFixed(0)
      // const deadlineVal =
      //   '' +
      //   moment()
      //     .add(Number(deadline) * 60, 'seconds')
      //     .unix()
      // const sendAmount0Min = toWei(sendSlippage.times(firstAmount), firstAsset.decimals).toFixed(0)
      // const sendAmount1Min = toWei(sendSlippage.times(secondAmount), secondAsset.decimals).toFixed(0)

      // let func = 'addLiquidity'
      // let params = [firstAsset.address, secondAsset.address, isStable, sendAmount0, sendAmount1, sendAmount0Min, sendAmount1Min, account, deadlineVal]
      // let sendValue = '0'

      // if (firstAsset.address === 'BNB') {
      //   func = 'addLiquidityETH'
      //   params = [secondAsset.address, isStable, sendAmount1, sendAmount1Min, sendAmount0Min, account, deadlineVal]
      //   sendValue = sendAmount0
      // }
      // if (secondAsset.address === 'BNB') {
      //   func = 'addLiquidityETH'
      //   params = [firstAsset.address, isStable, sendAmount0, sendAmount0Min, sendAmount1Min, account, deadlineVal]
      //   sendValue = sendAmount1
      // }

      // try {
      //   await sendContract(dispatch, key, supplyuuid, routerContract, func, params, account, sendValue, networkId)
      // } catch (err) {
      //   console.log('supply error :>> ', err)
      //   setPending(false)
      //   return
      // }

      let realContract = routerContract
      let realRouterAddress = routerAddress
      let flag = false
      let poolAddress = pool ? pool.address : ''
      let isWhite = false
      if (poolAddress) {
        isWhite = await isWhiteListPair(activityContract, pool.address)
      }
      console.log(isWhite)
      if (isWhite) {
        realContract = activityContract
        realRouterAddress = activityAddress
        flag = true
      }

      if (firstAsset.address !== 'SEI') {
        const tokenContract = getERC20Contract(web3, firstAsset.address)
        const allowance = await getAllowance(tokenContract, realRouterAddress, account)
        if (fromWei(allowance, firstAsset.decimals).lt(firstAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve0uuid, tokenContract, 'approve', [realRouterAddress, MAX_UINT256], account, '0', networkId)
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
      if (secondAsset.address !== 'SEI') {
        const tokenContract = getERC20Contract(web3, secondAsset.address)
        const allowance = await getAllowance(tokenContract, realRouterAddress, account)
        if (fromWei(allowance, secondAsset.decimals).lt(firstAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve1uuid, tokenContract, 'approve', [realRouterAddress, MAX_UINT256], account, '0', networkId)
          } catch (err) {
            console.log('approve 1 error :>> ', err)
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

      const sendSlippage = new BigNumber(100).minus(slippage).div(100)

      console.log('sendSlippage', sendSlippage.toString())
      const sendAmount0 = toWei(firstAmount, firstAsset.decimals).toFixed(0)
      const sendAmount1 = toWei(secondAmount, secondAsset.decimals).toFixed(0)
      const deadlineVal =
        '' +
        moment()
          .add(Number(deadline) * 60, 'seconds')
          .unix()
      const sendAmount0Min = toWei(sendSlippage.times(firstAmount), firstAsset.decimals).toFixed(0)
      const sendAmount1Min = toWei(sendSlippage.times(secondAmount), secondAsset.decimals).toFixed(0)
      // console.log(inviter)
      let func = 'addLiquidity'
      let params = [firstAsset.address, secondAsset.address, isStable, sendAmount0, sendAmount1, sendAmount0Min, sendAmount1Min, account, deadlineVal]
      let sendValue = '0'
      if (flag) {
        params = [firstAsset.address, secondAsset.address, isStable, sendAmount0, sendAmount1, sendAmount0Min, sendAmount1Min, deadlineVal, inviter]
      }
      if (firstAsset.address === 'SEI') {
        func = 'addLiquidityETH'
        params = [secondAsset.address, isStable, sendAmount1, sendAmount1Min, sendAmount0Min, account, deadlineVal]
        if (flag) {
          params = [secondAsset.address, isStable, sendAmount1, sendAmount1Min, sendAmount0Min, deadlineVal, inviter]
        }
        sendValue = sendAmount0
        //  * sendSlippage
      }
      if (secondAsset.address === 'SEI') {
        func = 'addLiquidityETH'
        params = [firstAsset.address, isStable, sendAmount0, sendAmount0Min, sendAmount1Min, account, deadlineVal]
        if (flag) {
          params = [firstAsset.address, isStable, sendAmount0, sendAmount0Min, sendAmount1Min, deadlineVal, inviter]
        }
        sendValue = sendAmount1
        //  * sendSlippage
      }

      // if (firstAsset.address === 'SEI' || secondAsset.address === 'SEI') {
      //   const amountOut = await routerContract.methods.getAmountOut(sendAmount1, getWBNBAddress(firstAsset.chainId).toLowerCase(), secondAsset.address).call()
      //   console.log('amountOut', amountOut)
      // }

      try {
        await sendContract(dispatch, key, supplyuuid, realContract, func, params, account, sendValue, networkId)
      } catch (err) {
        console.log('supply error2 :>> ', err)
        setPending(false)
        return
      }

      isApproved = true
      const pairContract = getERC20Contract(web3, pair.address)
      const allowance = await getAllowance(pairContract, pair.gauge.address, account)
      const balanceOf = await pairContract.methods.balanceOf(account).call()
      if (fromWei(allowance).lt(fromWei(balanceOf))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve2uuid, pairContract, 'approve', [pair.gauge.address, MAX_UINT256], account, '0', networkId)
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
            uuid: approve2uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      try {
        await sendContract(dispatch, key, stakeuuid, gaugeContract, 'deposit', [balanceOf], account, '0', networkId)
      } catch (err) {
        console.log('stake error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Added and Staked',
        }),
      )
      setPending(false)
    },
    [account, web3, routerContract, networkId],
  )

  return { onAdd: handleAdd, onAddAndStake: handleAddAndStake, pending }
}

const useQuoteRemove = (pair, withdrawAmount) => {
  const [outputs, setOutputs] = useState({
    firstAmount: '',
    secondAmount: '',
  })
  const contract = useRouter()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchInfo = async () => {
      const res = await contract.methods
        .quoteRemoveLiquidity(pair.token0.address, pair.token1.address, pair.stable, toWei(withdrawAmount).dp(0).toString(10))
        .call()
      setOutputs({
        firstAmount: fromWei(res.amountA, pair.token0.decimals).toString(10),
        secondAmount: fromWei(res.amountB, pair.token1.decimals).toString(10),
      })
    }
    if (pair && withdrawAmount && withdrawAmount !== '') {
      fetchInfo()
    } else {
      setOutputs({
        firstAmount: '',
        secondAmount: '',
      })
    }
  }, [contract, fastRefresh, pair, withdrawAmount])

  return outputs
}

const useRemoveLiquidity = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const routerContract = useRouter()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  const handleRemove = useCallback(
    async (pair, withdrawAmount, slippage, deadline, firstAmount, secondAmount) => {
      const routerAddress = getRouterAddress(networkId)
      const key = uuidv4()
      const approveuuid = uuidv4()
      const removeuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Remove ${pair.symbol} liquidity`,
          transactions: {
            [approveuuid]: {
              desc: 'Approve LP',
              status: TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [removeuuid]: {
              desc: 'Remove liquidity',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      let isApproved = true
      const tokenContract = getERC20Contract(web3, pair.address)
      const allowance = await getAllowance(tokenContract, routerAddress, account)
      if (fromWei(allowance, pair.decimals).lt(withdrawAmount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [routerAddress, MAX_UINT256], account, '0', networkId)
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
            uuid: approveuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const sendSlippage = new BigNumber(100).minus(slippage).div(100)
      const sendAmount = toWei(withdrawAmount, pair.decimals).toFixed(0)
      const sendAmount0Min = toWei(firstAmount, pair.token0.decimals).times(sendSlippage).toFixed(0)
      const sendAmount1Min = toWei(secondAmount, pair.token1.decimals).times(sendSlippage).toFixed(0)
      const deadlineVal =
        '' +
        moment()
          .add(Number(deadline) * 60, 'seconds')
          .unix()

      let func = 'removeLiquidity'
      let params = [pair.token0.address, pair.token1.address, pair.stable, sendAmount, sendAmount0Min, sendAmount1Min, account, deadlineVal]

      if (pair.token0.address.toLowerCase() === getWBNBAddress(networkId).toLowerCase()) {
        func = TAX_ASSETS[networkId].includes(pair.token1.address.toLowerCase()) ? 'removeLiquidityETHSupportingFeeOnTransferTokens' : 'removeLiquidityETH'
        params = [pair.token1.address, pair.stable, sendAmount, sendAmount1Min, sendAmount0Min, account, deadlineVal]
      }
      if (pair.token1.address.toLowerCase() === getWBNBAddress(networkId).toLowerCase()) {
        func = TAX_ASSETS[networkId].includes(pair.token0.address.toLowerCase()) ? 'removeLiquidityETHSupportingFeeOnTransferTokens' : 'removeLiquidityETH'
        params = [pair.token0.address, pair.stable, sendAmount, sendAmount0Min, sendAmount1Min, account, deadlineVal]
      }

      routerContract.methods[func](...params)
        .estimateGas({
          from: account,
          value: '0',
        })
        .then(async (res) => {
          try {
            await sendContract(dispatch, key, removeuuid, routerContract, func, params, account, '0', networkId)
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
        })
        .catch((err) => {
          const data = extractJsonObject(err.message)
          if (data) {
            customNotify(data.message, 'error')
          } else {
            customNotify(err.message, 'error')
          }
          setPending(false)
        })
    },
    [account, web3, routerContract, networkId],
  )

  return { onRemove: handleRemove, pending }
}

export { useAddLiquidity, useRemoveLiquidity, useQuoteRemove }

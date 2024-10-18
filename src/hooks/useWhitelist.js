import { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { POOL_TYPES, TRANSACTION_STATUS } from 'config/constants'
import { getAllowance, sendContract, sendBribeContract } from 'utils/api'
import { fromWei, MAX_UINT256, toWei } from 'utils/formatNumber'
import { getERC20Contract, getBribeContract } from 'utils/contractHelpers'
import useWeb3 from './useWeb3'
import { useV3Voter } from './useContract'

const useAddGauge = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const voterContract = useV3Voter()

  const handleAddGauge = useCallback(
    async (pool) => {
      const key = uuidv4()
      const adduuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Create gauge for ${pool.symbol}`,
          transactions: {
            [adduuid]: {
              desc: 'Create gauge',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      try {
        await sendContract(dispatch, key, adduuid, voterContract, 'createGauge', [pool.address, pool.type === POOL_TYPES.V1 ? 0 : 1], account)
      } catch (err) {
        console.log('create gauge error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Gauge Created',
        }),
      )
      setPending(false)
    },
    [account, web3, voterContract],
  )

  return { onAddGauge: handleAddGauge, pending }
}

const useAddBribe = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleAddBribe = useCallback(
    async (pool, asset, amount) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const bribeuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Create bribe on ${pool.symbol}`,
          transactions: {
            [approveuuid]: {
              desc: `Approve ${asset.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [bribeuuid]: {
              desc: 'Create bribe',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let bribeAddress = pool.gauge.bribe
      let isApproved = true
      const tokenContract = getERC20Contract(web3, asset.address)
      const allowance = await getAllowance(tokenContract, bribeAddress, account)
      if (fromWei(allowance).lt(amount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [bribeAddress, MAX_UINT256], account)
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
      const bribeContract = getBribeContract(web3, bribeAddress)
      const sendAmount = toWei(amount, asset.decimals).toFixed(0)
      const params = [asset.address, sendAmount]
      try {
        await sendBribeContract(dispatch, key, bribeuuid, bribeContract, 'notifyRewardAmount', params, account)
      } catch (err) {
        console.log('create bribe error :>> ', err)
        setPending(false)
        return
      }
      dispatch(
        completeTransaction({
          key,
          final: 'Bribe Created',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onAddBribe: handleAddBribe, pending }
}

export { useAddGauge, useAddBribe }

import { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { TRANSACTION_STATUS } from 'config/constants'
import { getAllowance, sendContract } from 'utils/api'
import { getERC20Contract, getGaugeContract } from 'utils/contractHelpers'
import { fromWei, MAX_UINT256, toWei } from 'utils/formatNumber'
import { useNetwork } from 'state/settings/hooks'
import useWeb3 from './useWeb3'
import { useV3Voter } from './useContract'

const useStake = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

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
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [pair.gauge.address, MAX_UINT256], account, '0', networkId)
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
      const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      try {
        await sendContract(dispatch, key, stakeuuid, gaugeContract, 'deposit', params, account, '0', networkId)
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
    [account, web3, networkId],
  )

  return { onStake: handleStake, pending }
}

const useUnstake = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

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
      const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      setPending(true)
      try {
        await sendContract(dispatch, key, unstakeuuid, gaugeContract, 'withdraw', params, account, '0', networkId)
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
    [account, web3, networkId],
  )

  return { onUnstake: handleUntake, pending }
}

const useHarvest = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

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
      const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      setPending(true)
      try {
        await sendContract(dispatch, key, harvestuuid, gaugeContract, 'getReward', [], account, '0', networkId)
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
    [account, networkId, web3],
  )

  return { onHarvest: handleHarvest, pending }
}

const useAllHarvest = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const voterContract = useV3Voter()
  const { networkId } = useNetwork()

  const handleAllHarvest = useCallback(
    async (pairs) => {
      const key = uuidv4()
      const harvestuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim all earnings (${pairs.length})`,
          transactions: {
            [harvestuuid]: {
              desc: 'Claim your earnings',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      const gaugeAddresses = pairs.map((pair) => pair.gauge.address)
      try {
        await sendContract(dispatch, key, harvestuuid, voterContract, 'claimRewards', [gaugeAddresses], account, '0', networkId)
      } catch (err) {
        console.log('all harvest error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed all earnings',
        }),
      )
      setPending(false)
    },
    [account, voterContract, networkId],
  )

  return { onAllHarvest: handleAllHarvest, pending }
}

export { useStake, useUnstake, useHarvest, useAllHarvest }

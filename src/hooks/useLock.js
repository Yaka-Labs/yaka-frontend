import { useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { TRANSACTION_STATUS } from 'config/constants'
import { getAllowance, sendContract } from 'utils/api'
import { getERC20Contract } from 'utils/contractHelpers'
import { ZERO_ADDRESS, fromWei, toWei } from 'utils/formatNumber'
import { getSeiCampaignStage2Address, getTHEAddress, getVeTHEAddress } from 'utils/addressHelpers'
import { useNetwork } from 'state/settings/hooks'
import useWeb3 from './useWeb3'
import { useV3Voter, useVeDist, useVeTHE } from './useContract'
import { getSeiCampaignStage2Contract } from 'utils/contractHelpers'
import { ADDRESS_ZERO } from 'thena-fusion-sdk'
import useCheckInviter from './useCheckInviter'
import { toast } from 'react-toastify'

const useCreateLock = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veTHEContract = useVeTHE()
  const { networkId } = useNetwork()
  const seiCampaignStage2Contract = getSeiCampaignStage2Contract(web3)
  console.log('seiCampaignStage2Contract', seiCampaignStage2Contract._address)
  const inviter = localStorage.getItem('inviter')
  const isInviter = useCheckInviter(inviter)

  const handleCreate = async (amount, unlockTime) => {
    // const inviterData = localStorage.getItem('inviter')
    // console.log('inviterData', inviterData)

    // if (!isInviter) {
    //   localStorage.setItem('inviter', ZERO_ADDRESS)
    // }

    // if (inviterData && !isInviter && inviterData !== ZERO_ADDRESS) {
    //   toast.error(`Invalid inviter`, {
    //     icon: false,
    //     style: { width: '300px' },
    //   })
    //   return
    // }

    const key = uuidv4()
    const approveuuid = uuidv4()
    const createuuid = uuidv4()
    const unlockString = moment().add(unlockTime, 'seconds').format('YYYY/MM/DD')
    dispatch(
      openTransaction({
        key,
        title: `Vest YAKA until ${unlockString}`,
        transactions: {
          [approveuuid]: {
            desc: 'Approve YAKA',
            status: TRANSACTION_STATUS.WAITING,
            hash: null,
          },
          [createuuid]: {
            desc: 'Vest your tokens',
            status: TRANSACTION_STATUS.START,
            hash: null,
          },
        },
      }),
    )

    setPending(true)
    let isApproved = true
    const tokenContract = getERC20Contract(web3, getTHEAddress(networkId))
    const allowance = await getAllowance(tokenContract, getVeTHEAddress(), account)
    // const allowance = await getAllowance(tokenContract, getSeiCampaignStage2Address(networkId), account)

    if (fromWei(allowance).lt(amount)) {
      isApproved = false
      try {
        await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [getVeTHEAddress(), toWei(amount).toFixed(0)], account)
        // await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [getSeiCampaignStage2Address(networkId), toWei(amount).toFixed(0)], account)
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
    const params = [toWei(amount).toFixed(0), unlockTime]
    // console.log("inviter");
    // const inviter = localStorage.getItem('inviter')
    // const params = [toWei(amount).toFixed(0), unlockTime, account, inviterData]

    try {
      await sendContract(dispatch, key, createuuid, veTHEContract, 'create_lock', params, account)
      // await sendContract(dispatch, key, createuuid, seiCampaignStage2Contract, 'create_lock_for', params, account)
    } catch (err) {
      console.log('create lock error :>> ', err)
      setPending(false)
      return
    }

    dispatch(
      completeTransaction({
        key,
        final: 'Vesting Successful',
      }),
    )
    setPending(false)
  }

  return { onCreateLock: handleCreate, pending }
}

const useIncreaseAmount = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veTHEContract = useVeTHE()
  const { networkId } = useNetwork()

  const handleIncreaseAmount = useCallback(
    async (id, amount) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const increaseuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Increase vest amount on veYAKA #${id}`,
          transactions: {
            [approveuuid]: {
              desc: 'Approve YAKA',
              status: TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [increaseuuid]: {
              desc: 'Increase your vest amount',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isApproved = true
      const tokenContract = getERC20Contract(web3, getTHEAddress(networkId))
      const allowance = await getAllowance(tokenContract, getVeTHEAddress(), account)
      if (fromWei(allowance).lt(amount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [getVeTHEAddress(), toWei(amount).toFixed(0)], account)
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
      const params = [id, toWei(amount).toFixed(0)]
      try {
        await sendContract(dispatch, key, increaseuuid, veTHEContract, 'increase_amount', params, account)
      } catch (err) {
        console.log('increase amount error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Vest Amount Increased',
        }),
      )
      setPending(false)
    },
    [account, web3, veTHEContract, networkId],
  )

  return { onIncreaseAmount: handleIncreaseAmount, pending }
}

const useIncreaseDuration = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veTHEContract = useVeTHE()

  const handleIncreaseDuration = useCallback(
    async (id, unlockTime) => {
      const key = uuidv4()
      const increaseuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Increase unlock time on veYAKA #${id}`,
          transactions: {
            [increaseuuid]: {
              desc: 'Increase your vest duration',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      const end = Math.floor((new Date().getTime() / 1000 + unlockTime) / 604800) * 604800
      console.log('unlockTime :>> ', unlockTime)
      console.log('end :>> ', end)
      const params = [id, unlockTime]
      try {
        await sendContract(dispatch, key, increaseuuid, veTHEContract, 'increase_unlock_time', params, account)
      } catch (err) {
        console.log('increase duration error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Vest Duration Increased',
        }),
      )
      setPending(false)
    },
    [account, web3, veTHEContract],
  )

  return { onIncreaseDuration: handleIncreaseDuration, pending }
}

const useWithdraw = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veTHEContract = useVeTHE()
  const voterContract = useV3Voter()

  const handleWithdraw = useCallback(
    async (veTHE) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      const withdrawuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Withdraw vest amount on veYAKA #${veTHE.id}`,
          transactions: {
            [resetuuid]: {
              desc: 'Reset votes',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [withdrawuuid]: {
              desc: 'Withdraw vest amount',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isReset = true
      if (veTHE.voted) {
        isReset = false
        try {
          await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [veTHE.id], account)
        } catch (err) {
          console.log('reset error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isReset) {
        dispatch(
          updateTransaction({
            key,
            uuid: resetuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      try {
        await sendContract(dispatch, key, withdrawuuid, veTHEContract, 'withdraw', [veTHE.id], account)
      } catch (err) {
        console.log('withdraw error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Vest Withdrawn',
        }),
      )
      setPending(false)
    },
    [account, web3, veTHEContract],
  )

  return { onWithdraw: handleWithdraw, pending }
}

const useMerge = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veTHEContract = useVeTHE()
  const voterContract = useV3Voter()
  const veDistContract = useVeDist()

  const handleMerge = useCallback(
    async (from, to) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      const claimuuid = uuidv4()
      const withdrawuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Merge veYAKA #${from.id} to veYAKA #${to.id}`,
          transactions: {
            [resetuuid]: {
              desc: `Reset votes for veYAKA #${from.id}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [claimuuid]: {
              desc: `Claim rebase for veYAKA #${from.id}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [withdrawuuid]: {
              desc: `Merge veYAKA #${from.id}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isReset = true
      if (from.voted) {
        isReset = false
        try {
          await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [from.id], account)
        } catch (err) {
          console.log('reset error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isReset) {
        dispatch(
          updateTransaction({
            key,
            uuid: resetuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      let isClaimed = true
      if (from.rebase_amount.gt(0)) {
        isClaimed = false
        try {
          await sendContract(dispatch, key, claimuuid, veDistContract, 'claim', [from.id], account)
        } catch (err) {
          console.log('claim error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isClaimed) {
        dispatch(
          updateTransaction({
            key,
            uuid: claimuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      try {
        await sendContract(dispatch, key, withdrawuuid, veTHEContract, 'merge', [from.id, to.id], account)
      } catch (err) {
        console.log('withdraw error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Merge Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, veTHEContract, veDistContract],
  )

  return { onMerge: handleMerge, pending }
}

const useSplit = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veTHEContract = useVeTHE()
  const voterContract = useV3Voter()
  const veDistContract = useVeDist()

  const handleSplit = useCallback(
    async (from, weights) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      const claimuuid = uuidv4()
      const splituuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Split veYAKA #${from.id}`,
          transactions: {
            [resetuuid]: {
              desc: `Reset votes for veYAKA #${from.id}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [claimuuid]: {
              desc: `Claim rebase for veYAKA #${from.id}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [splituuid]: {
              desc: `Split veYAKA #${from.id}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isReset = true
      if (from.voted) {
        isReset = false
        try {
          await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [from.id], account)
        } catch (err) {
          console.log('reset error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isReset) {
        dispatch(
          updateTransaction({
            key,
            uuid: resetuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      let isClaimed = true
      if (from.rebase_amount.gt(0)) {
        isClaimed = false
        try {
          await sendContract(dispatch, key, claimuuid, veDistContract, 'claim', [from.id], account)
        } catch (err) {
          console.log('claim error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isClaimed) {
        dispatch(
          updateTransaction({
            key,
            uuid: claimuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      try {
        await sendContract(dispatch, key, splituuid, veTHEContract, 'split', [weights, from.id], account)
      } catch (err) {
        console.log('split error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Split Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, veTHEContract, veDistContract],
  )

  return { onSplit: handleSplit, pending }
}

const useTransfer = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veTHEContract = useVeTHE()
  const voterContract = useV3Voter()

  const handleTransfer = useCallback(
    async (from, to) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      const transferuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Transfer veYAKA #${from.id}`,
          transactions: {
            [resetuuid]: {
              desc: `Reset votes for veYAKA #${from.id}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [transferuuid]: {
              desc: `Transfer veYAKA #${from.id}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isReset = true
      if (from.voted) {
        isReset = false
        try {
          await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [from.id], account)
        } catch (err) {
          console.log('reset error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isReset) {
        dispatch(
          updateTransaction({
            key,
            uuid: resetuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      try {
        await sendContract(dispatch, key, transferuuid, veTHEContract, 'transferFrom', [account, to, from.id], account)
      } catch (err) {
        console.log('transfer error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Transfer Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, veTHEContract, voterContract],
  )

  return { onTransfer: handleTransfer, pending }
}

const useReset = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const voterContract = useV3Voter()

  const handleReset = useCallback(
    async (veTheId) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: 'Reset Votes',
          transactions: {
            [resetuuid]: {
              desc: `Reset votes for veYAKA #${veTheId}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      try {
        await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [veTheId], account)
      } catch (err) {
        console.log('reset error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Reset Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, voterContract],
  )

  return { onReset: handleReset, pending }
}

const usePoke = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const voterContract = useV3Voter()

  const handlePoke = useCallback(
    async (veTheId) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: 'Poke Votes',
          transactions: {
            [resetuuid]: {
              desc: `Poke votes for veYAKA #${veTheId}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      try {
        await sendContract(dispatch, key, resetuuid, voterContract, 'poke', [veTheId], account)
      } catch (err) {
        console.log('poke error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Poke Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, voterContract],
  )

  return { onPoke: handlePoke, pending }
}

export { useCreateLock, useIncreaseAmount, useIncreaseDuration, useWithdraw, useMerge, useSplit, useTransfer, useReset, usePoke }

import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { TRANSACTION_STATUS } from 'config/constants'
import { getERC20Contract, getTCSpotContract } from 'utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3'
import { getAllowance, sendContract } from 'utils/api'
import { getTCManagerAddress } from 'utils/addressHelpers'
import { MAX_UINT256, fromWei } from 'utils/formatNumber'
import { useAssets } from 'state/assets/hooks'
import { useTCManager } from '../useContract'

export const useTCManagerInfo = () => {
  const [protocolFee, setProtocolFee] = useState()
  const [protocolFeeToken, setProtocolFeeToken] = useState(false)
  const [tradingTokens, setTradingTokens] = useState([])
  const [isAllowed, setIsAllowed] = useState(false)
  const tcManagerContract = useTCManager()
  const { account } = useWeb3React()
  const assets = useAssets()

  useEffect(() => {
    const fetchTotalInfo = async () => {
      const [res0, res1, res2, res3, res4] = await Promise.all([
        tcManagerContract.methods.isPermissionless().call(),
        tcManagerContract.methods.protocol_fee().call(),
        tcManagerContract.methods.protocol_fee_token().call(),
        tcManagerContract.methods.tradingTokens().call(),
        tcManagerContract.methods.isAllowedCreator(account).call(),
      ])
      const tradeAssets = assets.filter((ele) => res3.map((sub) => sub.toLowerCase()).includes(ele.address))
      const feeToken = assets.find((ele) => ele.address.toLowerCase() === res2.toLowerCase())
      setProtocolFee(res1)
      setProtocolFeeToken(feeToken)
      setTradingTokens(tradeAssets)
      setIsAllowed(res0 || res4)
    }

    if (account && assets.length > 0 && tradingTokens.length === 0) {
      fetchTotalInfo()
    }
  }, [tcManagerContract, account, assets])

  return { isAllowed, protocolFee, protocolFeeToken, tradingTokens }
}

export const useCreateTC = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const tcManagerContract = useTCManager()
  const { protocolFeeToken, protocolFee } = useTCManagerInfo()
  const web3 = useWeb3()

  const handleCreate = useCallback(
    async (data) => {
      const key = uuidv4()
      const approveFeeuuid = uuidv4()
      const approveHostuuid = uuidv4()
      const createuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: 'Create Trading Competition',
          transactions: {
            [approveFeeuuid]: {
              desc: 'Approve Fee',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [approveHostuuid]: {
              desc: 'Approve Host',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [createuuid]: {
              desc: 'Create TC',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      let isApproved = true
      const tokenContract = getERC20Contract(web3, protocolFeeToken.address)
      const allowance = await getAllowance(tokenContract, getTCManagerAddress(), account)
      if (fromWei(allowance).lt(fromWei(protocolFee))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveFeeuuid, tokenContract, 'approve', [getTCManagerAddress(), MAX_UINT256], account)
        } catch (err) {
          console.log('approve fee error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approveFeeuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      isApproved = true
      const prizeTokenContract = getERC20Contract(web3, data.prize.token.address)
      const allowanceHost = await getAllowance(prizeTokenContract, getTCManagerAddress(), account)
      if (fromWei(allowanceHost).lt(fromWei(data.prize.hostContribution))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveHostuuid, prizeTokenContract, 'approve', [getTCManagerAddress(), MAX_UINT256], account)
        } catch (err) {
          console.log('approve host error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approveHostuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const final = {
        entryFee: data.entryFee,
        MAX_PARTICIPANTS: data.maxParticipants,
        owner: data.owner.id,
        tradingCompetition: data.tradingCompetitionSpot,
        name: data.name,
        description: data.description,
        market: 0,
        timestamp: {
          ...data.timestamp,
        },
        competitionRules: {
          starting_balance: data.competitionRules.startingBalance,
          winning_token: data.competitionRules.winningToken.address,
          tradingTokens: data.competitionRules.tradingTokens.map((ele) => ele.address),
        },
        prize: {
          win_type: false,
          weights: data.prize.weights,
          totalPrize: data.prize.totalPrize,
          owner_fee: data.prize.ownerFee,
          token: data.prize.token.address,
          host_contribution: data.prize.hostContribution,
        },
      }

      try {
        await sendContract(dispatch, key, createuuid, tcManagerContract, 'create', [final], account)
      } catch (err) {
        console.log('deposit error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'TC Create Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, tcManagerContract],
  )

  return { onCreate: handleCreate, pending }
}

export const useRegister = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const tcManagerContract = useTCManager()
  const web3 = useWeb3()

  const handleJoin = useCallback(
    async (data) => {
      const key = uuidv4()
      const approveFeeuuid = uuidv4()
      const approveStartuuid = uuidv4()
      const joinuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: 'Create Trading Competition',
          transactions: {
            [approveFeeuuid]: {
              desc: 'Approve Fee Token',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [approveStartuuid]: {
              desc: 'Approve Winning Token',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [joinuuid]: {
              desc: 'Join TC',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      const spotAddress = data.tradingCompetitionSpot
      let isApproved = true
      const feeTokenContract = getERC20Contract(web3, data.prize.token.address)
      const allowance = await getAllowance(feeTokenContract, spotAddress, account)
      if (fromWei(allowance, data.prize.token.decimals).lt(fromWei(data.entryFee, data.prize.token.decimals))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveFeeuuid, feeTokenContract, 'approve', [spotAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve fee error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approveFeeuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      isApproved = true
      const winningTokenContract = getERC20Contract(web3, data.competitionRules.winningToken.address)
      const allowanceHost = await getAllowance(winningTokenContract, spotAddress, account)
      if (
        fromWei(allowanceHost, data.competitionRules.winningToken.decimals).lt(
          fromWei(data.competitionRules.startingBalance, data.competitionRules.winningToken.decimals),
        )
      ) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveStartuuid, winningTokenContract, 'approve', [spotAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve host error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approveStartuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      const tcSpotContract = getTCSpotContract(web3, spotAddress)
      try {
        await sendContract(dispatch, key, joinuuid, tcSpotContract, 'registerAndDeposit', [data.competitionRules.startingBalance], account)
      } catch (err) {
        console.log('register error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'TC Join Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, tcManagerContract],
  )

  return { onJoin: handleJoin, pending }
}

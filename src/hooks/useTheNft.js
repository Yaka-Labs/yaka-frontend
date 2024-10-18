import { useEffect, useState, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { v4 as uuidv4 } from 'uuid'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { TRANSACTION_STATUS } from 'config/constants'
import { fromWei } from 'utils/formatNumber'
import { getFloorPrice, sendContract } from 'utils/api'
import { getThenianContract } from 'utils/contractHelpers'
import { getNewStakingAddress, getStakingAddress } from 'utils/addressHelpers'
import useWeb3 from './useWeb3'
import { useNewStaking, useRoyalty, useStaking, useThenian } from './useContract'
import useRefresh from './useRefresh'

const useTheNftInfo = () => {
  const [walletIds, setWalletIds] = useState([])
  const [oldStakedIds, setOldStakedIds] = useState([])
  const [oldPendingReward, setOldPendingReward] = useState(new BigNumber(0))
  const [stakedIds, setStakedIds] = useState([])
  const [pendingReward, setPendingReward] = useState(new BigNumber(0))
  const [rewardPerSecond, setRewardPerSecond] = useState(new BigNumber(0))
  const [oldRewardPerSecond, setOldRewardPerSecond] = useState(new BigNumber(0))
  const [claimable, setClaimable] = useState(new BigNumber(0))
  const [isOriginal, setIsOriginal] = useState(false)
  const [totalStaked, setTotalStaked] = useState(0)
  const [oldTotalStaked, setOldTotalStaked] = useState(0)
  const [floorPrice, setFloorPrice] = useState(0)
  const theNftContract = useThenian()
  const stakingContract = useStaking()
  const newStakingContract = useNewStaking()
  const royaltyContract = useRoyalty()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const [res0, res1, res2, res3, res4, res5, res6] = await Promise.all([
        theNftContract.methods.tokensOfOwner(account).call(),
        stakingContract.methods.stakedTokenIds(account).call(),
        stakingContract.methods.pendingReward(account).call(),
        royaltyContract.methods.claimable(account).call(),
        theNftContract.methods.originalMinters(account).call(),
        newStakingContract.methods.stakedTokenIds(account).call(),
        newStakingContract.methods.pendingReward(account).call(),
      ])
      setWalletIds(res0)
      setOldStakedIds(res1)
      setOldPendingReward(fromWei(res2))
      setClaimable(fromWei(res3))
      setIsOriginal(Number(res4) > 0)
      setStakedIds(res5)
      setPendingReward(fromWei(res6))
    }
    const fetchTotalInfo = async () => {
      const [res0, res1, res2, res3, res4] = await Promise.all([
        theNftContract.methods.balanceOf(getNewStakingAddress()).call(),
        newStakingContract.methods.rewardPerSecond().call(),
        getFloorPrice(),
        theNftContract.methods.balanceOf(getStakingAddress()).call(),
        stakingContract.methods.rewardPerSecond().call(),
      ])
      setTotalStaked(res0)
      setRewardPerSecond(fromWei(res1))
      setFloorPrice(res2?.usdFloorPrice)
      setOldTotalStaked(res3)
      setOldRewardPerSecond(fromWei(res4))
    }

    fetchTotalInfo()
    if (account) {
      fetchAccountInfo()
    } else {
      setWalletIds([])
      setStakedIds([])
      setPendingReward(new BigNumber(0))
      setOldStakedIds([])
      setOldPendingReward(new BigNumber(0))
    }
  }, [theNftContract, stakingContract, newStakingContract, royaltyContract, account, fastRefresh])

  return {
    walletIds,
    stakedIds,
    oldStakedIds,
    pendingReward,
    oldPendingReward,
    rewardPerSecond,
    oldRewardPerSecond,
    totalStaked,
    oldTotalStaked,
    floorPrice,
    claimable,
    isOriginal,
  }
}

const useStakeNft = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const stakingContract = useNewStaking()

  const handleStake = useCallback(
    async (ids) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const voteuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Stake ${ids.length} theNFT`,
          transactions: {
            [approveuuid]: {
              desc: 'Approve theNFT',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [voteuuid]: {
              desc: 'Stake your theNFTs',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      const theNFTContract = getThenianContract(web3)
      const isApproved = await theNFTContract.methods.isApprovedForAll(account, getNewStakingAddress()).call()
      if (!isApproved) {
        try {
          await sendContract(dispatch, key, approveuuid, theNFTContract, 'setApprovalForAll', [getNewStakingAddress(), true], account)
        } catch (err) {
          console.log('approve error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: approveuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const params = [ids]
      try {
        await sendContract(dispatch, key, voteuuid, stakingContract, 'deposit', params, account)
      } catch (err) {
        console.log('deposit error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Stake Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, stakingContract],
  )

  return { onStake: handleStake, pending }
}

const useUnstakeNft = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const stakingContract = useNewStaking()

  const handleUnstake = useCallback(
    async (ids) => {
      const key = uuidv4()
      const unstakeuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Unstake ${ids.length} theNFT`,
          transactions: {
            [unstakeuuid]: {
              desc: 'Unstake your theNFTs',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      const params = [ids]
      try {
        await sendContract(dispatch, key, unstakeuuid, stakingContract, 'withdraw', params, account)
      } catch (err) {
        console.log('unstake error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Unstake Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, stakingContract],
  )

  return { onUnstake: handleUnstake, pending }
}

const useHarvest = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const stakingContract = useNewStaking()

  const handleHarvest = useCallback(async () => {
    const key = uuidv4()
    const harvestuuid = uuidv4()
    dispatch(
      openTransaction({
        key,
        title: 'Claim Fees',
        transactions: {
          [harvestuuid]: {
            desc: 'Claim Fees',
            status: TRANSACTION_STATUS.START,
            hash: null,
          },
        },
      }),
    )

    setPending(true)
    try {
      await sendContract(dispatch, key, harvestuuid, stakingContract, 'harvest', [], account)
    } catch (err) {
      console.log('harvest error :>> ', err)
      setPending(false)
      return
    }

    dispatch(
      completeTransaction({
        key,
        final: 'Claim Successful',
      }),
    )
    setPending(false)
  }, [account, web3, stakingContract])

  return { onHarvest: handleHarvest, pending }
}

export const useOldHarvest = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const stakingContract = useStaking()

  const handleHarvest = useCallback(async () => {
    const key = uuidv4()
    const harvestuuid = uuidv4()
    dispatch(
      openTransaction({
        key,
        title: 'Claim Fees',
        transactions: {
          [harvestuuid]: {
            desc: 'Claim Fees',
            status: TRANSACTION_STATUS.START,
            hash: null,
          },
        },
      }),
    )

    setPending(true)
    try {
      await sendContract(dispatch, key, harvestuuid, stakingContract, 'harvest', [], account)
    } catch (err) {
      console.log('harvest error :>> ', err)
      setPending(false)
      return
    }

    dispatch(
      completeTransaction({
        key,
        final: 'Claim Successful',
      }),
    )
    setPending(false)
  }, [account, web3, stakingContract])

  return { onHarvest: handleHarvest, pending }
}

const useRoyaltyClaim = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const royaltyContract = useRoyalty()

  const handleClaim = useCallback(async () => {
    const key = uuidv4()
    const claimuuid = uuidv4()
    dispatch(
      openTransaction({
        key,
        title: 'Claim Royalty Fees',
        transactions: {
          [claimuuid]: {
            desc: 'Claim Royalty Fees',
            status: TRANSACTION_STATUS.START,
            hash: null,
          },
        },
      }),
    )

    setPending(true)
    try {
      await sendContract(dispatch, key, claimuuid, royaltyContract, 'claim', [account], account)
    } catch (err) {
      console.log('claim error :>> ', err)
      setPending(false)
      return
    }

    dispatch(
      completeTransaction({
        key,
        final: 'Claim Successful',
      }),
    )
    setPending(false)
  }, [account, web3, royaltyContract])

  return { onClaim: handleClaim, pending }
}

const useRestake = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const newStakingContract = useNewStaking()
  const stakingContract = useStaking()

  const handleRestake = useCallback(
    async (ids, pendingReward) => {
      const key = uuidv4()
      const unstakeuuid = uuidv4()
      const approveuuid = uuidv4()
      const stakeuuid = uuidv4()
      const harvestuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Restake ${ids.length} theNFT`,
          transactions: {
            [unstakeuuid]: {
              desc: 'Unstake your theNFTs',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [harvestuuid]: {
              desc: 'Claim Fees',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [approveuuid]: {
              desc: 'Approve theNFT',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [stakeuuid]: {
              desc: 'Stake your theNFTs',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      const params = [ids]
      try {
        await sendContract(dispatch, key, unstakeuuid, stakingContract, 'withdraw', params, account)
      } catch (err) {
        console.log('unstake error :>> ', err)
        setPending(false)
        return
      }
      if (pendingReward.gt(0)) {
        try {
          await sendContract(dispatch, key, harvestuuid, stakingContract, 'harvest', [], account)
        } catch (err) {
          console.log('harvest error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: harvestuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const theNFTContract = getThenianContract(web3)
      const isApproved = await theNFTContract.methods.isApprovedForAll(account, getNewStakingAddress()).call()
      if (!isApproved) {
        try {
          await sendContract(dispatch, key, approveuuid, theNFTContract, 'setApprovalForAll', [getNewStakingAddress(), true], account)
        } catch (err) {
          console.log('approve error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: approveuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      try {
        await sendContract(dispatch, key, stakeuuid, newStakingContract, 'deposit', params, account)
      } catch (err) {
        console.log('deposit error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Restake Successful',
        }),
      )
      setPending(false)
    },
    [account, web3, stakingContract, newStakingContract],
  )

  return { onRestake: handleRestake, pending }
}

export { useTheNftInfo, useStakeNft, useUnstakeNft, useHarvest, useRoyaltyClaim, useRestake }

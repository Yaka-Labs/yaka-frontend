import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { rewardsV3APIAbi, veTheV3ApiAbi } from 'config/abi'
import { multicall, simulateMulticall } from 'utils/multicall'
import { fromWei, ZERO_ADDRESS } from 'utils/formatNumber'
import { getRewardsV3APIAddress, getVeTHEV3APIAddress } from 'utils/addressHelpers'
import { getBribeContract, getPairContract, getVeTHEV3APIContract } from 'utils/contractHelpers'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { TRANSACTION_STATUS } from 'config/constants'
import { sendContract } from 'utils/api'
import { useAssets } from 'state/assets/hooks'
import { usePools } from 'state/pools/hooks'
import { useNetwork } from 'state/settings/hooks'
import useWeb3 from './useWeb3'
import { useVeDist, useV3Voter } from './useContract'
import useRefresh from './useRefresh'

const useGetVeRewards = (veTHE) => {
  const [rewards, setRewards] = useState([])
  const pools = usePools()
  const assets = useAssets()
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  const fetchRewards = useCallback(async () => {
    try {
      const gauges = pools.filter((pool) => pool.gauge.address !== ZERO_ADDRESS)
      let callsRewards
      if (!veTHE.id) {
        callsRewards = gauges.map((pool) => {
          return {
            address: getVeTHEV3APIAddress(),
            name: 'singlePairRewardAddress',
            params: [account, pool.address],
          }
        })
      } else {
        callsRewards = gauges.map((pool) => {
          return {
            address: getVeTHEV3APIAddress(),
            name: 'singlePairRewardId',
            params: [veTHE.id, pool.address],
          }
        })
      }
      const resRewards = await simulateMulticall(veTheV3ApiAbi, callsRewards, networkId)
      const final = gauges
        .map((pool, index) => {
          const result = {}
          let isFeeExist = false
          let isBribeExist = false
          if (resRewards[index].length > 0) {
            resRewards[index][0].forEach((reward, idx) => {
              const { amount, decimals, token } = reward
              if (idx < 2) {
                isFeeExist = isFeeExist || Number(amount) > 0
              } else {
                isBribeExist = isBribeExist || Number(amount) > 0
              }
              if (Number(amount) > 0) {
                result[token] = {
                  address: token,
                  amount: !result[token] ? fromWei(Number(amount), decimals) : result[token].amount.plus(fromWei(Number(amount), decimals)),
                }
              }
            })
          }

          return {
            ...pool,
            rewards: Object.values(result),
            isFeeExist,
            isBribeExist,
          }
        })
        .filter((pool) => pool.rewards.length > 0)
        .map((pool) => {
          let totalUsd = new BigNumber(0)
          const finalRewards = pool.rewards.map((reward) => {
            const found = assets.find((ele) => ele.address.toLowerCase() === reward.address.toLowerCase())
            if (found) {
              totalUsd = totalUsd.plus(reward.amount.times(found.price))
              return {
                ...reward,
                symbol: found.symbol,
              }
            }
            return reward
          })
          return {
            ...pool,
            rewards: finalRewards,
            totalUsd,
          }
        })
      setRewards(final)
    } catch (error) {
      console.log('current rewards error :>> ', error)
    }
  }, [account, networkId, veTHE, assets])

  useEffect(() => {
    if (account) {
      fetchRewards()
    } else {
      setRewards([])
    }
  }, [fetchRewards])

  return rewards
}

const useExpectedRewards = (veTHE) => {
  const [rewards, setRewards] = useState([])
  const pools = usePools()
  const assets = useAssets()
  const { account } = useWeb3React()
  const { networkId } = useNetwork()
  const fetchRewards = useCallback(async () => {
    try {
      const gaugePools = pools.filter((pool) => pool.gauge.address !== ZERO_ADDRESS)
      let callsRewards
      if (!veTHE.id) {
        callsRewards = gaugePools.map((pool) => {
          const arr = []
          arr.push(pool.address)
          return {
            address: getRewardsV3APIAddress(),
            name: 'getExpectedClaimForNextEpochAddress',
            params: [account, arr],
          }
        })
      } else {
        callsRewards = gaugePools.map((pool) => {
          const arr = []
          arr.push(pool.address)
          return {
            address: getRewardsV3APIAddress(),
            name: 'getExpectedClaimForNextEpochId',
            params: [veTHE.id, arr],
          }
        })
      }
      const resRewards = await simulateMulticall(rewardsV3APIAbi, callsRewards, networkId)
      const final = gaugePools
        .map((pool, index) => {
          let result = {}

          if (resRewards[index].length > 0) {
            // bribes
            const { 0: tokens, 1: decimals, 2: amounts } = resRewards[index][0][0][0][0]
            tokens.forEach((token, index) => {
              if (Number(amounts[index]) > 0) {
                result[token] = {
                  address: token,
                  amount: !result[token]
                    ? fromWei(Number(amounts[index]), Number(decimals[index]))
                    : result[token].amount.plus(fromWei(Number(amounts[index]), Number(decimals[index]))),
                }
              }
            })

            // fees
            const { 0: feeTokens, 1: feeDecimals, 2: feeAmounts } = resRewards[index][0][0][0][1]
            feeTokens.forEach((token, index) => {
              if (Number(feeAmounts[index]) > 0) {
                result[token] = {
                  address: token,
                  amount: !result[token]
                    ? fromWei(Number(feeAmounts[index]), Number(feeDecimals[index]))
                    : result[token].amount.plus(fromWei(Number(feeAmounts[index]), Number(feeDecimals[index]))),
                }
              }
            })
          }

          return {
            ...pool,
            rewards: Object.values(result),
          }
        })
        .filter((pool) => pool.rewards.length > 0)
        .map((pool) => {
          let totalUsd = new BigNumber(0)
          const finalRewards = pool.rewards.map((reward) => {
            const found = assets.find((ele) => ele.address.toLowerCase() === reward.address.toLowerCase())
            if (found) {
              totalUsd = totalUsd.plus(reward.amount.times(found.price))
              return {
                ...reward,
                symbol: found.symbol,
              }
            }
            return reward
          })
          return {
            ...pool,
            rewards: finalRewards,
            totalUsd,
          }
        })
      setRewards(final)
    } catch (error) {
      console.log('expected rewards error :>> ', error)
    }
  }, [account, networkId, veTHE])

  useEffect(() => {
    if (account) {
      fetchRewards()
    } else {
      setRewards([])
    }
  }, [fetchRewards])

  return rewards
}

const useGetFees = () => {
  const [fees, setFees] = useState([])
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()
  const pools = usePools()
  const assets = useAssets()

  useEffect(() => {
    const fetchRewards = () => {
      try {
        const result = pools
          .filter((pool) => !pool.account.token0claimable.isZero() || !pool.account.token1claimable.isZero())
          .map((pool) => {
            const found0 = assets.find((ele) => ele.address.toLowerCase() === pool.token0.address.toLowerCase())
            const found1 = assets.find((ele) => ele.address.toLowerCase() === pool.token1.address.toLowerCase())
            const totalUsd = pool.account.token0claimable.times(found0?.price).plus(pool.account.token1claimable.times(found1?.price))
            return {
              ...pool,
              totalUsd,
            }
          })
        setFees(result)
      } catch (error) {
        console.log('fees error :>> ', error)
        setFees([])
      }
    }

    if (pools.length > 0 && account) {
      fetchRewards()
    } else {
      setFees([])
    }
  }, [fastRefresh, account, pools, assets])

  return fees
}

const useClaimBribes = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const voterContract = useV3Voter()
  const { networkId } = useNetwork()

  const addressBribeAbi = [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_rewardToken',
          type: 'address',
        },
      ],
      name: 'earned',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ]

  const idBribeAbi = [
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '_rewardToken',
          type: 'address',
        },
      ],
      name: 'earned',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ]

  const handleClaimBribes = useCallback(
    async (pool, veTHE) => {
      const key = uuidv4()
      // fees claim
      const callsFees = pool.rewards.map((reward) => {
        return !veTHE.id
          ? {
              address: pool.gauge.fee,
              name: 'earned',
              params: [account, reward.address],
            }
          : {
              address: pool.gauge.fee,
              name: 'earned',
              params: [veTHE.id, reward.address],
            }
      })
      // bribes claim
      const callsBribes = pool.rewards.map((reward) => {
        return !veTHE.id
          ? {
              address: pool.gauge.bribe,
              name: 'earned',
              params: [account, reward.address],
            }
          : {
              address: pool.gauge.bribe,
              name: 'earned',
              params: [veTHE.id, reward.address],
            }
      })
      const bribeAbi = !veTHE.id ? addressBribeAbi : idBribeAbi
      const [resFees, resBribes] = await Promise.all([multicall(bribeAbi, callsFees, networkId), multicall(bribeAbi, callsBribes, networkId)])
      const feeTokens = []
      resFees.forEach((item, index) => {
        const rewardTokenAddress = pool.rewards[index].address.toLowerCase()
        if (Number(item) > 0) feeTokens.push(rewardTokenAddress)
      })
      const bribeTokens = []
      resBribes.forEach((item, index) => {
        const rewardTokenAddress = pool.rewards[index].address.toLowerCase()
        if (Number(item) > 0) bribeTokens.push(rewardTokenAddress)
      })
      const result = {}
      const bribesuuid = uuidv4()
      const feeuuid = uuidv4()
      if (bribeTokens.length > 0) {
        result[bribesuuid] = {
          desc: 'Claim Bribes',
          status: TRANSACTION_STATUS.START,
          hash: null,
        }
      }
      if (feeTokens.length > 0) {
        result[feeuuid] = {
          desc: 'Claim Fees',
          status: TRANSACTION_STATUS.START,
          hash: null,
        }
      }
      dispatch(
        openTransaction({
          key,
          title: `Claim Bribes + Fees for ${pool.symbol}`,
          transactions: result,
        }),
      )
      if (bribeTokens.length > 0) {
        if (!veTHE.id) {
          const params = [[pool.gauge.bribe], [bribeTokens]]
          setPending(true)
          try {
            await sendContract(dispatch, key, bribesuuid, voterContract, 'claimBribes', params, account)
          } catch (err) {
            console.log('bribes claim error :>> ', err)
            setPending(false)
            return
          }
        } else {
          const bribeContract = getBribeContract(web3, pool.gauge.bribe)
          const params = [veTHE.id, bribeTokens]
          setPending(true)
          try {
            await sendContract(dispatch, key, bribesuuid, bribeContract, 'getReward', params, account)
          } catch (err) {
            console.log('bribes claim error :>> ', err)
            setPending(false)
            return
          }
        }
      }
      if (feeTokens.length > 0) {
        if (!veTHE.id) {
          const params = [[pool.gauge.fee], [feeTokens]]
          setPending(true)
          try {
            await sendContract(dispatch, key, feeuuid, voterContract, 'claimFees', params, account)
          } catch (err) {
            console.log('fees claim error :>> ', err)
            setPending(false)
            return
          }
        } else {
          const feeContract = getBribeContract(web3, pool.gauge.fee)
          const params = [veTHE.id, feeTokens]
          setPending(true)
          try {
            await sendContract(dispatch, key, feeuuid, feeContract, 'getReward', params, account)
          } catch (err) {
            console.log('fees claim error :>> ', err)
            setPending(false)
            return
          }
        }
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed Bribes + Fees',
        }),
      )
      setPending(false)
    },
    [account, web3, voterContract],
  )

  return { onClaimBribes: handleClaimBribes, pending }
}

const useClaimFees = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleClaimFees = useCallback(
    async (pool) => {
      const key = uuidv4()
      const harvestuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim fees for ${pool.symbol}`,
          transactions: {
            [harvestuuid]: {
              desc: 'Claim fees',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
      const pairContract = getPairContract(web3, pool.address)
      const params = []
      setPending(true)
      try {
        await sendContract(dispatch, key, harvestuuid, pairContract, 'claimFees', params, account)
      } catch (err) {
        console.log('fees claim error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed Fees',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onClaimFees: handleClaimFees, pending }
}

const useClaimRebase = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const veDist = useVeDist()

  const handleClaimRebase = useCallback(
    async (veTHE) => {
      const key = uuidv4()
      const veClaimuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim rebase for veYAKA #${veTHE.id}`,
          transactions: {
            [veClaimuuid]: {
              desc: 'Claim rebase',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
      const params = [veTHE.id]
      setPending(true)
      try {
        await sendContract(dispatch, key, veClaimuuid, veDist, 'claim', params, account)
      } catch (err) {
        console.log('rebase claim error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed rebase',
        }),
      )
      setPending(false)
    },
    [account, veDist],
  )

  return { onClaimRebase: handleClaimRebase, pending }
}

const useClaimAll = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veDistContract = useVeDist()
  const voterContract = useV3Voter()

  const handleClaimAll = useCallback(
    async (veRewards, veTHEs, veTHE) => {
      const key = uuidv4()
      const bribesuuid = uuidv4()
      const feeuuid = uuidv4()
      const veuuid = uuidv4()
      let txns = {
        [bribesuuid]: {
          desc: 'Claim bribes',
          status: TRANSACTION_STATUS.START,
          hash: null,
        },
        [feeuuid]: {
          desc: 'Claim fees',
          status: TRANSACTION_STATUS.START,
          hash: null,
        },
        [veuuid]: {
          desc: 'Claim rebases',
          status: TRANSACTION_STATUS.START,
          hash: null,
        },
      }
      dispatch(
        openTransaction({
          key,
          title: 'Claim All Rewards',
          transactions: txns,
        }),
      )

      setPending(true)
      // claim bribes
      const bribeRewards = veRewards.filter((item) => item.isBribeExist)
      if (bribeRewards.length > 0) {
        const bribes = bribeRewards.map((item) => item.gauge.bribe)
        const bribeTokens = bribeRewards.map((item) => {
          return item.rewards.map((token) => token.address)
        })
        const bribeParams = !veTHE.id ? [bribes, bribeTokens] : [bribes, bribeTokens, veTHE.id]
        try {
          await sendContract(dispatch, key, bribesuuid, voterContract, 'claimBribes', bribeParams, account)
        } catch (err) {
          console.log('bribes claim error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: bribesuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      // claim fees
      const feeRewards = veRewards.filter((item) => item.isFeeExist)
      if (feeRewards.length > 0) {
        const fees = feeRewards.map((item) => item.gauge.fee)
        const feeTokens = feeRewards.map((item) => {
          return item.rewards.map((token) => token.address)
        })
        const feeParams = !veTHE.id ? [fees, feeTokens] : [fees, feeTokens, veTHE.id]
        try {
          await sendContract(dispatch, key, feeuuid, voterContract, 'claimFees', feeParams, account)
        } catch (err) {
          console.log('fees claim error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: feeuuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const params = veTHEs.map((ele) => ele.id)
      try {
        await sendContract(dispatch, key, veuuid, veDistContract, 'claim_many', [params], account)
      } catch (err) {
        console.log('rebase claim error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed All Rewards',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onClaimAll: handleClaimAll, pending }
}

export { useGetVeRewards, useExpectedRewards, useGetFees, useClaimBribes, useClaimFees, useClaimRebase, useClaimAll }

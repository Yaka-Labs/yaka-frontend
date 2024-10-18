import { useMemo, useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { getTHEAddress, getV3VoterAddress, getVeTHEAddress } from 'utils/addressHelpers'
import { fromWei } from 'utils/formatNumber'
import { TOTAL_VOLUME_DATA } from 'apollo/queries'
import v1Client, { fusionClient } from 'apollo/client'
import { extraRewarderAbi, v3voterAbi } from 'config/abi'
import { multicall } from 'utils/multicall'
import { getCircSupply } from 'utils/api'
import { getERC20Contract } from 'utils/contractHelpers'
import { DEFAULT_CHAIN_ID, DoubleRewarders } from 'config/constants'
import { useAssets } from 'state/assets/hooks'
import { useNetwork } from 'state/settings/hooks'
import { getWeb3NoAccount } from 'utils/web3'
import { ChainId } from 'thena-sdk-core'
import { usePools } from 'state/pools/hooks'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'
import { useMinter, useV3Voter } from './useContract'
import usePrices from './usePrices'

const epoch0 = 1727913600

const useTHEAsset = () => {
  const assets = useAssets()
  const theAsset = useMemo(() => {
    return assets.length > 0 ? assets.find((item) => item.address.toLowerCase() === getTHEAddress(item.chainId).toLowerCase()) : null
  }, [assets])

  return theAsset
}

const useVoteEmissions = () => {
  const [voteEmssions, setVoteEmissions] = useState(null)
  const [lpEmission, setLpEmission] = useState(new BigNumber(0))
  const voterContract = useV3Voter()
  const minterContract = useMinter()
  const theAsset = useTHEAsset()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchSupply = async () => {
      const [totalWeight, weekly_emission] = await Promise.all([voterContract.methods.totalWeight().call(), minterContract.methods.weekly_emission().call()])
      const lpEmissionRes = fromWei(weekly_emission).times(0.675)
      setLpEmission(lpEmissionRes)
      setVoteEmissions(Number(totalWeight) > 0 ? lpEmissionRes.times(theAsset.price).div(100) : new BigNumber(0))
    }
    if (voterContract && minterContract && theAsset) {
      fetchSupply()
    }
  }, [voterContract, minterContract, theAsset, fastRefresh])
  return { voteEmssions, lpEmission }
}

const useEpochTimer = () => {
  const [epochInfo, setEpochInfo] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    epoch: 0,
  })
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const curTime = new Date().getTime() / 1000
    const epoch = Math.floor((curTime - epoch0) / 604800)
    const nextEpoch = Math.ceil(curTime / (86400 * 7)) * (86400 * 7)
    const days = Math.floor((nextEpoch - curTime) / 86400)
    const hours = Math.floor((nextEpoch - curTime - days * 86400) / 3600)
    const mins = Math.floor((nextEpoch - curTime - days * 86400 - hours * 3600) / 60)
    setEpochInfo({
      days,
      hours: hours < 10 ? '0' + hours : hours,
      mins: mins < 10 ? '0' + mins : mins,
      epoch,
    })
  }, [fastRefresh])

  return epochInfo
}

const useEpochYAKAAmount = () => {
  const curTime = new Date().getTime() / 1000
  const epoch = Math.floor((curTime - epoch0) / 604800)
  const epoch0YAKAAmount = 10000000
  // epoch0：10,000,000 YAKA,after every week minus %
  // 0.99^10
  const decayFactor = 0.99
  const epochYAKAAmount = epoch0YAKAAmount * Math.pow(decayFactor, epoch)
  return epochYAKAAmount
}

const useLPApr = (weightPercent, tvl, yakaPrice) => {
  const epochYAKAAmount = useEpochYAKAAmount()
  if (tvl <= 0) {
    return 0
  }
  // (pair Vote weight*every epoch yaka amount*66.5%*yaka price*52)/pair totalstaked
  const apr = (weightPercent * epochYAKAAmount * 0.665 * yakaPrice * 52) / tvl
  return apr
}

const useSupply = () => {
  const [circSupply, setCircSupply] = useState(0)
  const [lockedSupply, setLockedSupply] = useState(0)
  const { fastRefresh } = useRefresh()

  const fetchVolume = useCallback(async () => {
    const web3 = getWeb3NoAccount(DEFAULT_CHAIN_ID)
    const theContract = getERC20Contract(web3, getTHEAddress(DEFAULT_CHAIN_ID))
    const [supply, locked] = await Promise.all([getCircSupply(), theContract.methods.balanceOf(getVeTHEAddress()).call()])
    setCircSupply(supply ? supply.circulating_supply : 0)
    setLockedSupply(fromWei(locked).toNumber())
  }, [fastRefresh])

  useEffect(() => {
    fetchVolume()
  }, [fetchVolume])

  return { circSupply, lockedSupply }
}

const useOneDayVolume = () => {
  const [oneDayVolume, setOneDayVolume] = useState(0)
  const { fastRefresh } = useRefresh()
  const web3 = useWeb3()
  const { networkId } = useNetwork()

  useEffect(() => {
    const fetchVolume = async () => {
      const curblockNumber = await web3.eth.getBlockNumber()
      const last = curblockNumber - 28800

      let v1Volume = 0
      let fusionVolume = 0
      try {
        const [result, oneDayResult] = await Promise.all([
          v1Client[networkId].query({
            query: TOTAL_VOLUME_DATA(),
            fetchPolicy: 'network-only',
          }),
          v1Client[networkId].query({
            query: TOTAL_VOLUME_DATA(last),
            fetchPolicy: 'network-only',
          }),
        ])

        if (result?.data?.factories[0]?.totalVolumeUSD && oneDayResult?.data?.factories[0]?.totalVolumeUSD) {
          v1Volume = Number(result?.data?.factories[0]?.totalVolumeUSD) - Number(oneDayResult?.data?.factories[0]?.totalVolumeUSD)
        }
      } catch (error) {
        console.log('v1 total volume error :>> ', error)
      }

      try {
        const [todayFusionVolume, yesterdayFusionVolume] = await Promise.all([
          fusionClient[networkId].query({
            query: TOTAL_VOLUME_DATA(),
            fetchPolicy: 'network-only',
          }),
          fusionClient[networkId].query({
            query: TOTAL_VOLUME_DATA(last),
            fetchPolicy: 'network-only',
          }),
        ])

        if (todayFusionVolume?.data?.factories[0]?.totalVolumeUSD && yesterdayFusionVolume?.data?.factories[0]?.totalVolumeUSD) {
          fusionVolume = Number(todayFusionVolume?.data?.factories[0]?.totalVolumeUSD) - Number(yesterdayFusionVolume?.data?.factories[0]?.totalVolumeUSD)
        }
      } catch (error) {
        console.log('fusion total volume error :>> ', error)
      }
      setOneDayVolume(v1Volume + fusionVolume)
    }
    fetchVolume()
  }, [fastRefresh, web3, networkId])

  return oneDayVolume
}

export const useTVL = () => {
  const pools = usePools()

  return useMemo(() => {
    return pools.reduce((sum, cur) => {
      return sum.plus(cur.tvl)
    }, new BigNumber(0))
  }, [pools])
}

const useExtraRewardsInfo = () => {
  const [extraRewardsInfo, setExtraRewardsInfo] = useState([])
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  useEffect(() => {
    const fetchInfo = async (rewarders) => {
      const stopcalls = rewarders.map((item) => {
        return {
          address: item.doubleRewarderAddress,
          name: 'stop',
          params: [],
        }
      })
      const stops = await multicall(extraRewarderAbi, stopcalls, networkId)
      const activeRewarders = []
      rewarders.forEach((ele, idx) => {
        if (!stops[idx][0]) {
          activeRewarders.push(ele)
        }
      })
      const calls = activeRewarders.map((item) => {
        return {
          address: item.doubleRewarderAddress,
          name: 'rewardPerSecond',
          params: [],
        }
      })
      const rewardRates = await multicall(extraRewarderAbi, calls, networkId)
      let pendingRewards = []
      if (account) {
        const calls = activeRewarders.map((item) => {
          return {
            address: item.doubleRewarderAddress,
            name: 'pendingReward',
            params: [account],
          }
        })
        pendingRewards = await multicall(extraRewarderAbi, calls, networkId)
      }
      const final = activeRewarders.map((item, index) => {
        return {
          ...item,
          rewardRate: fromWei(Number(rewardRates[index])).toNumber(),
          pendingReward: account ? fromWei(Number(pendingRewards[index])).toNumber() : 0,
        }
      })
      setExtraRewardsInfo(final)
    }
    if (DoubleRewarders[networkId].length > 0) {
      fetchInfo(DoubleRewarders[networkId])
    }
  }, [account, fastRefresh, networkId])

  return extraRewardsInfo
}

const fetchWeightAt = async (pools, networkId) => {
  const curTime = new Date().getTime() / 1000
  const epoch = Math.floor((curTime - epoch0) / 604800)
  const lastEpoch = epoch === 0 ? epoch : epoch - 1
  const lastEpochTime = lastEpoch * 604800 + epoch0

  // useEffect(() => {
  //
  //
  //
  // }, [networkId])
  const stopcalls = pools.map((item) => {
    return {
      address: getV3VoterAddress(),
      name: 'weightsAt',
      params: [item.address, lastEpochTime],
    }
  })
  const stops = await multicall(v3voterAbi, stopcalls, networkId)
  debugger
  const activeRewarders = []
  pools.forEach((ele, idx) => {
    ele.gauge['weightsAtLastEpoch'] = fromWei(Number(stops[idx])).toNumber()
  })
  debugger
  return pools
}

export const useAnalyticsVersion = () => {
  const params = useParams()
  const version = params && params.version ? params.version : 'total'
  return version
}

export { useTHEAsset, useVoteEmissions, useEpochTimer, useSupply, useOneDayVolume, useExtraRewardsInfo, useEpochYAKAAmount, useLPApr, fetchWeightAt }

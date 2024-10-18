import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import useRefresh from 'hooks/useRefresh'
import { getFusions } from 'utils/api'
import { multicall } from 'utils/multicall'
import { fromWei } from 'utils/formatNumber'
import { pairV3APIAbi } from 'config/abi'
import { useAssets } from 'state/assets/hooks'
import { getPairV3APIAddress } from 'utils/addressHelpers'
import { POOL_TYPES } from 'config/constants'
import { fetchWeightAt, useExtraRewardsInfo, useLPApr, useWeightAt } from 'hooks/useGeneral'
import usePrices from 'hooks/usePrices'
import { useNetwork } from 'state/settings/hooks'
import { ChainId } from 'thena-sdk-core'
import { updatePools } from './actions'
import { getFusionsWeight } from 'utils/dexOpApi'

const fetchUserFusions = async (account, pools, chainId) => {
  const calls = pools.map((pool) => {
    return {
      address: getPairV3APIAddress(chainId),
      name: chainId === ChainId.BSC ? 'getPairAccount' : 'getPairAccount',
      params: [pool.address, account],
    }
  })
  const pairInfos = await multicall(pairV3APIAbi, calls, chainId)
  return pairInfos.map((pool) => {
    const { pair_address, claimable0, claimable1, account_lp_balance, account_gauge_earned, account_gauge_balance } = pool[0]
    return {
      address: pair_address, // pair contract address
      walletBalance: fromWei(account_lp_balance._hex), // account LP tokens balance
      gaugeBalance: fromWei(account_gauge_balance._hex), // account pair staked in gauge balance
      totalLp: fromWei(account_lp_balance._hex).plus(fromWei(account_gauge_balance._hex)), // account total LP tokens balance
      gaugeEarned: fromWei(account_gauge_earned._hex).toNumber(), // account earned emissions for this pair
      token0claimable: Number(claimable0._hex), // claimable 1st token from fees (for unstaked positions)
      token1claimable: Number(claimable1._hex), // claimable 2nd token from fees (for unstaked positions)
    }
  })
}

const Updater = () => {
  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()
  const assets = useAssets()
  const prices = usePrices()
  const extraRewardsInfo = useExtraRewardsInfo()
  const windowVisible = useIsWindowVisible()
  const { networkId } = useNetwork()

  const fetchInfo = useCallback(async () => {
    let userInfo = []
    try {
      let fusions = await getFusions(networkId)

      fusions = await fetchWeightAt(fusions, networkId)
      // console.log(fusions)
      // fusions.forEach((fusion) => {
      //   fusion.originSymbol = fusion.symbol
      // })

      // const fusionsWeight = await getFusionsWeight(networkId)
      // const fusionsWeightMap = new Map(fusionsWeight.map((item) => [item.symbol, item.weight]))
      //
      // const getWeightBySymbol = (symbol) => {
      //   return fusionsWeightMap.get(symbol) || 0
      // }

      if (fusions.length > 0) {
        let bnbTheNarrow = '0xed044cd5654ad208b1bc594fd108c132224e3f3c'
        let bnbTheWide = '0xe8ec29b75d98d3cdc47db9797b00dcaabea2b15b'
        let livetheThe = '0x3765476bffe43cf4c0656bf3a7529c54ae247056' // livethe/the
        let theUsdtWide = '0xb420adb29afd0a4e771739f0a29a4e077eff1acb' // the/usdt wide
        let ankrBnbTheNarrow = '0xd2f1045b4e5ba91ee725e8bf50740617a92e4a5f' // ankrbnb/the wide
        let userInfos = []
        if (account) {
          userInfos = await fetchUserFusions(account, fusions, networkId)
        }

        const totalWeight = fusions.reduce((sum, current) => {
          return sum + current.gauge.weight
        }, 0)

        const totalWeightAtLastEpoch = fusions.reduce((sum, current) => {
          return sum + current.gauge.weightsAtLastEpoch
        }, 0)

        userInfo = fusions
          .map((fusion) => {
            const { lpPrice, gauge } = fusion
            let kind
            if (['Narrow', 'Wide', 'Correlated', 'CL_Stable', 'Ichi', 'Defiedge'].includes(fusion.type)) {
              kind = POOL_TYPES.FUSION
            } else {
              kind = POOL_TYPES.V1
            }
            const asset0 = assets.find((ele) => ele.address.toLowerCase() === fusion.token0.address.toLowerCase())
            const asset1 = assets.find((ele) => ele.address.toLowerCase() === fusion.token1.address.toLowerCase())
            const token0 = {
              address: asset0?.address || fusion.token0.address,
              symbol: asset0?.symbol || 'UNKNOWN',
              decimals: asset0?.decimals || 18,
              logoURI: asset0?.logoURI || 'https://cdn.thena.fi/assets/UKNOWN.png',
              price: asset0?.price || 0,
            }
            const token1 = {
              address: asset1?.address || fusion.token1.address,
              symbol: asset1?.symbol || 'UNKNOWN',
              decimals: asset1?.decimals || 18,
              logoURI: asset1?.logoURI || 'https://cdn.thena.fi/assets/UKNOWN.png',
              price: asset1?.price || 0,
            }
            const token0Reserve = fusion.token0.reserve
            const token1Reserve = fusion.token1.reserve
            let totalTvl
            if (token0.price > 0 && token1.price > 0) {
              totalTvl = token0Reserve * token0.price + token1Reserve * token1.price
            } else if (token0.price > 0) {
              totalTvl = token0Reserve * token0.price * 2
            } else if (token1.price > 0) {
              totalTvl = token1Reserve * token1.price * 2
            } else {
              totalTvl = 0
            }
            const gaugeTvl = lpPrice * gauge.totalSupply
            const weightPercent = totalWeight > 0 ? (gauge.weight / totalWeight) * 100 : 0
            const weightPercentAtLastEpoch = totalWeightAtLastEpoch > 0 ? (gauge.weightsAtLastEpoch / totalWeightAtLastEpoch) * 100 : 0
            // debugger
            let bribeUsd = 0
            const poolBribes = gauge.bribes
            let finalBribes = { fee: null, bribe: null }
            if (poolBribes) {
              if (poolBribes.bribe) {
                finalBribes.bribe = []
                poolBribes.bribe.forEach((ele) => {
                  const found = assets.find((asset) => asset.address.toLowerCase() === ele.address.toLowerCase())
                  bribeUsd += ele.amount * (found?.price || 0)
                  finalBribes = {
                    bribe: [
                      ...finalBribes.bribe,
                      {
                        address: ele.address,
                        decimals: (found && found.decimals) || 18,
                        amount: ele.amount,
                        symbol: (found && found.symbol) || 'UNKNOWN',
                      },
                    ],
                  }
                })
              }
              if (poolBribes.fee) {
                finalBribes.fee = []
                poolBribes.fee.forEach((ele) => {
                  const found = assets.find((asset) => asset.address.toLowerCase() === ele.address.toLowerCase())
                  bribeUsd += ele.amount * (found?.price || 0)
                  finalBribes = {
                    ...finalBribes,
                    fee: [
                      ...finalBribes.fee,
                      {
                        address: ele.address,
                        decimals: found.decimals || 18,
                        amount: ele.amount,
                        symbol: found.symbol || 'UNKNOWN',
                      },
                    ],
                  }
                })
              }
            }
            const found = userInfos.find((item) => item.address.toLowerCase() === fusion.address.toLowerCase())
            let user = {
              walletBalance: 0,
              gaugeBalance: 0,
              gaugeEarned: 0,
              totalLp: 0,
              token0claimable: 0,
              token1claimable: 0,
              staked0: 0,
              staked1: 0,
              stakedUsd: 0,
              earnedUsd: 0,
              total0: 0,
              total1: 0,
              totalUsd: 0,
            }
            let extraApr = 0
            let extraRewards = null
            let extraRewardsInUsd = 0
            const foundExtra = extraRewardsInfo.find((ele) => ele.pairAddress === fusion.address)
            if (foundExtra) {
              extraApr = ((foundExtra.rewardRate * 31536000 * prices[foundExtra.doubleRewarderSymbol]) / gaugeTvl) * 100
              extraRewards = {
                amount: foundExtra.pendingReward,
                symbol: foundExtra.doubleRewarderSymbol,
              }
              extraRewardsInUsd = extraRewards.amount * prices[foundExtra.doubleRewarderSymbol]
            }
            if (found) {
              user = {
                ...found,
                token0claimable: fromWei(found.token0claimable, token0.decimals).toString(10),
                token1claimable: fromWei(found.token1claimable, token1.decimals).toString(10),
                walletBalance: found.walletBalance.toString(10),
                gaugeBalance: found.gaugeBalance.toString(10),
                totalLp: found.totalLp.toString(10),
                stakedUsd: found.gaugeBalance.times(lpPrice).toNumber(),
                earnedUsd: found.gaugeEarned * prices.THE + extraRewardsInUsd,
                totalUsd: found.totalLp.times(lpPrice).toNumber(),
                extraRewards,
              }
            }

            return {
              ...fusion,
              stable: fusion.type === 'Stable',
              type: kind,
              title: fusion.type,
              tvl: totalTvl,
              token0: {
                ...token0,
                reserve: fusion.token0.reserve,
              },
              token1: {
                ...token1,
                reserve: fusion.token1.reserve,
              },
              gauge: {
                ...fusion.gauge,
                bribes: finalBribes,
                tvl: gaugeTvl,
                apr: fusion.gauge.apr + extraApr,
                lpapr: useLPApr(weightPercentAtLastEpoch, gaugeTvl, prices.THE),
                weightPercent,
                bribeUsd,
                weightPercentAtLastEpoch,
                pooled0: fusion.totalSupply ? (fusion.token0.reserve * fusion.gauge.totalSupply) / fusion.totalSupply : 0,
                pooled1: fusion.totalSupply ? (fusion.token1.reserve * fusion.gauge.totalSupply) / fusion.totalSupply : 0,
              },
              isValid: true,
              account: user,
              // weight: getWeightBySymbol(fusion.originSymbol),
            }
          })
          .sort((a, b) => {
            return (a.gauge.tvl - b.gauge.tvl) * -1
          })
          .sort((x, y) => {
            return x.address === ankrBnbTheNarrow.toLowerCase() ? -1 : y.address === ankrBnbTheNarrow ? 1 : 0
          })
          .sort((x, y) => {
            return x.address === livetheThe.toLowerCase() ? -1 : y.address === livetheThe ? 1 : 0
          })
          .sort((x, y) => {
            return x.address === theUsdtWide.toLowerCase() ? -1 : y.address === theUsdtWide ? 1 : 0
          })
          .sort((x, y) => {
            return x.address === bnbTheWide.toLowerCase() ? -1 : y.address === bnbTheWide ? 1 : 0
          })
          .sort((x, y) => {
            return x.address === bnbTheNarrow.toLowerCase() ? -1 : y.address === bnbTheNarrow ? 1 : 0
          })
      }
    } catch (e) {
      console.error('user fusions fetched had error', e)
    }
    dispatch(
      updatePools({
        pools: userInfo,
        networkId,
      }),
    )
  }, [dispatch, account, assets, extraRewardsInfo, networkId])

  useEffect(() => {
    if (!windowVisible) return
    fetchInfo()
  }, [windowVisible, fastRefresh, fetchInfo])

  return null
}

export default Updater

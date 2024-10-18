import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import { ZERO_VALUE } from 'utils/formatNumber'
import { useNetwork } from 'state/settings/hooks'
import { POOL_TYPES } from 'config/constants'

export const usePools = () => {
  const { data } = useSelector((state) => state.pools)
  const { networkId } = useNetwork()

  return useMemo(() => {
    return data[networkId].map((fusion) => {
      const { account } = fusion
      return {
        ...fusion,
        tvl: new BigNumber(fusion.tvl),
        gauge: {
          ...fusion.gauge,
          tvl: new BigNumber(fusion.gauge.tvl),
          apr: new BigNumber(fusion.gauge.apr),
          lpapr: new BigNumber(fusion.gauge.lpapr),
          voteApr: new BigNumber(fusion.gauge.voteApr),
          projectedApr: new BigNumber(fusion.gauge.projectedApr),
          weight: new BigNumber(fusion.gauge.weight),
          weightPercent: new BigNumber(fusion.gauge.weightPercent),
          weightPercentAtLastEpoch: new BigNumber(fusion.gauge.weightPercentAtLastEpoch),
          bribeUsd: new BigNumber(fusion.gauge.bribeUsd),
          pooled0: new BigNumber(fusion.gauge.pooled0),
          pooled1: new BigNumber(fusion.gauge.pooled1),
        },
        token0: {
          ...fusion.token0,
          reserve: new BigNumber(fusion.token0.reserve),
        },
        token1: {
          ...fusion.token1,
          reserve: new BigNumber(fusion.token1.reserve),
        },
        account: {
          ...account,
          walletBalance: new BigNumber(account.walletBalance),
          gaugeBalance: new BigNumber(account.gaugeBalance),
          totalLp: new BigNumber(account.totalLp),
          staked0: fusion.totalSupply > 0 ? new BigNumber(account.gaugeBalance).times(fusion.token0.reserve).div(fusion.totalSupply) : ZERO_VALUE,
          staked1: fusion.totalSupply > 0 ? new BigNumber(account.gaugeBalance).times(fusion.token1.reserve).div(fusion.totalSupply) : ZERO_VALUE,
          stakedUsd: new BigNumber(account.stakedUsd),
          earnedUsd: new BigNumber(account.earnedUsd),
          total0: fusion.totalSupply ? new BigNumber(account.totalLp).times(fusion.token0.reserve).div(fusion.totalSupply) : ZERO_VALUE,
          total1: fusion.totalSupply ? new BigNumber(account.totalLp).times(fusion.token1.reserve).div(fusion.totalSupply) : ZERO_VALUE,
          totalUsd: new BigNumber(account.totalUsd),
          gaugeEarned: new BigNumber(account.gaugeEarned),
          token0claimable: new BigNumber(account.token0claimable),
          token1claimable: new BigNumber(account.token1claimable),
        },
      }
    })
  }, [data, networkId])
}

export const useGammas = () => {
  const pools = usePools()

  return useMemo(() => {
    return pools.filter((pool) => pool.type === POOL_TYPES.FUSION && !['Ichi', 'Defiedge'].includes(pool.title))
  }, [pools])
}

export const useDefiedges = () => {
  const pools = usePools()

  return useMemo(() => {
    return pools.filter((pool) => pool.title === 'Defiedge')
  }, [pools])
}

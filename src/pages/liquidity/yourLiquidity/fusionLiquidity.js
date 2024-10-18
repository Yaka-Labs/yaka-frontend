import React, { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoFound from 'components/NoFound'
import PoolTitle from 'components/PoolTitle'
import { VaultsContext } from 'context/VaultsContext'
import { FusionRangeType } from 'config/constants'
import Switch from 'components/Switch'
import { useGammas, usePools } from 'state/pools/hooks'
import { useManuals } from 'state/manuals/hooks'
import ManualPosition from './manualLiquidity/manualPosition'

const TABS = FusionRangeType

const FusionLiquidity = () => {
  const [activeTab, setActiveTab] = useState(FusionRangeType.ICHI_RANGE)
  const pools = usePools()
  const gammas = useGammas()
  const vaults = useContext(VaultsContext)
  const manuals = useManuals()
  const navigate = useNavigate()

  const userGammas = useMemo(() => {
    return gammas.filter((pool) => pool.account.totalLp.gt(0))
  }, [gammas])

  const userIchis = useMemo(() => {
    return pools.filter((pool) => pool.title === 'Ichi' && pool.account.totalLp.gt(0))
  }, [pools])

  const userVaults = useMemo(() => {
    return vaults.filter((vault) => vault.account.totalLp.gt(0)).concat(userIchis)
  }, [vaults, userIchis])

  const userDefiedges = useMemo(() => {
    return pools.filter((pool) => pool.title === 'Defiedge' && pool.account.totalLp.gt(0))
  }, [pools])

  const userManuals = manuals.map((manual) => {
    return {
      ...manual,
      type: 'MANUAL',
    }
  })

  const filteredPools = useMemo(() => {
    switch (activeTab) {
      // case TABS.ALL:
      //   return [...userVaults, ...userGammas, ...userDefiedges, ...userManuals]

      case TABS.ICHI_RANGE:
        return userVaults

      case TABS.GAMMA_RANGE:
        return userGammas

      case TABS.DEFIEDGE_RANGE:
        return userDefiedges

      case TABS.MANUAL_RANGE:
        return userManuals

      default:
        break
    }
  }, [userGammas, userVaults, userManuals, userDefiedges, activeTab])

  return (
    <div>
      <Switch data={Object.values(TABS)} active={activeTab} setActive={setActiveTab} />
      <div className='gradient-bg mt-3 md:mt-[13.6px] p-px w-full rounded-[2.55px]'>
        <div className=' max-h-[323px] overflow-auto rounded-[2.55px] flex flex-col space-y-[13.6px] py-[10.2px] px-[13.6px] lg:px-[20.4px]'>
          {filteredPools.length > 0 ? (
            filteredPools.map((pool, idx) => (
              <div
                key={`pool-${idx}`}
                onClick={() => {
                  if (pool.type === 'MANUAL') {
                    navigate(`/liquidity/manual/${pool.tokenId}`)
                  } else {
                    navigate(`/liquidity/auto/${pool.address}`)
                  }
                }}
                className='w-full px-[17px] py-[13.6px] border border-[#0000AF] bg-[#0D1238] rounded-[4.25px] cursor-pointer'
              >
                {pool.type === 'MANUAL' ? (
                  <ManualPosition position={pool} key={`position-${idx}`} />
                ) : (
                  <div className='flex items-start md:items-center justify-between'>
                    <PoolTitle pool={pool} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className='w-full py-[13.6px]'>
              <NoFound title='No liquidity found' />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FusionLiquidity

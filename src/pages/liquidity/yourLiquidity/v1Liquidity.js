import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NoFound from 'components/NoFound'
import PoolTitle from 'components/PoolTitle'
import { POOL_TYPES } from 'config/constants'
import Switch from 'components/Switch'
import { usePools } from 'state/pools/hooks'

const TABS = {
  STABLE: 'STABLE',
  VOLATILE: 'VOLATILE',
}

const V1Liquidity = () => {
  const [activeTab, setActiveTab] = useState(TABS.STABLE)
  const pools = usePools()
  const navigate = useNavigate()

  const userPools = useMemo(() => {
    return pools.filter((fusion) => fusion.type === POOL_TYPES.V1).filter((pool) => pool.account?.totalLp.gt(0))
  }, [pools])
  const filteredPools = useMemo(() => {
    switch (activeTab) {
      // case TABS.ALL:
      //   return userPools

      case TABS.STABLE:
        return userPools.filter((ele) => ele.stable)

      case TABS.VOLATILE:
        return userPools.filter((ele) => !ele.stable)

      default:
        break
    }
  }, [userPools, activeTab])
  return (
    <div>
      <Switch data={Object.values(TABS)} active={activeTab} setActive={setActiveTab} />
      <div className='gradient-bg mt-3 md:mt-[13.6px] p-px w-full rounded-[2.55px]'>
        <div className='max-h-[323px] overflow-auto rounded-[2.55px] flex flex-col space-y-[13.6px] py-[10.2px] px-[13.6px] lg:px-[20.4px]'>
          {filteredPools.length > 0 ? (
            filteredPools.map((pool) => (
              <div
                key={pool.address}
                onClick={() => {
                  navigate(`/liquidity/v1/${pool.address}`)
                }}
                className='w-full px-[17px] py-[13.6px]  liquidity-block rounded-[6.8px] cursor-pointer'
              >
                <div className='flex items-start md:items-center justify-between'>
                  <PoolTitle pool={pool} />
                </div>
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

export default V1Liquidity

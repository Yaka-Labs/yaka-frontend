import React, { useContext, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PoolTitle from 'components/PoolTitle'
import Settings from 'components/Settings'
import Spinner from 'components/Spinner'
import NoFound from 'components/NoFound'
import TransparentButton from 'components/Buttons/transparentButton'
import { POOL_TYPES, FusionRangeType } from 'config/constants'
import { VaultsContext } from 'context/VaultsContext'
import { formatNumber } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import { usePools } from 'state/pools/hooks'
import { useDefiedgeAUM } from 'hooks/v3/useDefiedge'
import RemoveModal from './components/removeModal'

const AutoLiquidityDetail = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pools = usePools()
  const vaults = useContext(VaultsContext)
  const navigate = useNavigate()
  const { address } = useParams()
  const { total0, total1 } = useDefiedgeAUM(address)

  const pool = useMemo(() => {
    return pools.find((ele) => ele.address === address) || vaults.find((ele) => ele.address === address) || null
  }, [pools, address, total0, total1])

  if (!pools.length || !vaults.length) {
    return (
      <div className='w-full flex justify-center'>
        <Spinner />
      </div>
    )
  }

  if (!pool) {
    return (
      <div className='flex items-center'>
        <button
          className='w-5 lg:w-auto mr-1.5 lg:mr-5'
          onClick={() => {
            navigate('/liquidity')
          }}
        >
          <img alt='' src='/images/swap/back-arrow.svg' />
        </button>
        <NoFound title='No liquidity found' />
      </div>
    )
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <button
            className='w-5 lg:w-auto mr-1.5 lg:mr-5'
            onClick={() => {
              navigate('/liquidity')
            }}
          >
            <img alt='' src='/images/swap/back-arrow.svg' />
          </button>
          <PoolTitle pool={pool} />
        </div>
        <Settings />
      </div>
      <div className='w-full mt-4 lg:mt-7'>
        <div className='flex justify-between items-center'>
          <span className='text-sm lg:text-base font-medium'>Pooled Liquidity</span>
          <span className='text-sm lg:text-base leading-4 lg:leading-5 font-light'>
            {`$${formatNumber(pool.account.totalLp.times(pool.lpPrice))} (${formatNumber(pool.account.totalLp)} LP)`}
          </span>
        </div>
        <div className='flex flex-col space-y-2 mt-2 w-full'>
          <div className='w-full flex justify-between'>
            <div className='flex items-center space-x-[5px]'>
              <img alt='' src={pool.token0.logoURI} className='w-6 lg:w-7' />
              <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{pool.token0.symbol}</span>
            </div>
            <p className='text-white text-sm lg:text-base leading-5'>{formatNumber(pool.account.total0)}</p>
          </div>
          <div className='w-full flex justify-between'>
            <div className='flex items-center space-x-[5px]'>
              <img alt='' src={pool.token1.logoURI} className='w-6 lg:w-7' />
              <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{pool.token1.symbol}</span>
            </div>
            <p className='text-white text-sm lg:text-base leading-5'>{formatNumber(pool.account.total1)}</p>
          </div>
        </div>
      </div>
      {pool.type !== FusionRangeType.DEFIEDGE_RANGE && (
        <div className='w-full border-t border-[#5E6282] pt-3 lg:pt-[18px] mt-4 lg:mt-6'>
          <div className='flex justify-between items-center'>
            <span className='text-sm lg:text-base font-medium'>Staked Liquidity</span>
            <span className='text-sm lg:text-base leading-4 lg:leading-5 font-light'>
              {`$${formatNumber(pool.account.gaugeBalance.times(pool.lpPrice))} (${formatNumber(pool.account.gaugeBalance)} LP)`}
            </span>
          </div>
          <div className='flex flex-col space-y-2 mt-2 w-full'>
            <div className='w-full flex justify-between'>
              <div className='flex items-center space-x-[5px]'>
                <img alt='' src={pool.token0.logoURI} className='w-6 lg:w-7' />
                <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{pool.token0.symbol}</span>
              </div>
              <p className='text-white text-sm lg:text-base leading-5'>{formatNumber(pool.account.staked0)}</p>
            </div>
            <div className='w-full flex justify-between'>
              <div className='flex items-center space-x-[5px]'>
                <img alt='' src={pool.token1.logoURI} className='w-6 lg:w-7' />
                <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{pool.token1.symbol}</span>
              </div>
              <p className='text-white text-sm lg:text-base leading-5'>{formatNumber(pool.account.staked1)}</p>
            </div>
          </div>
        </div>
      )}
      <div className='flex items-center mt-[26px] w-full space-x-5'>
        <TransparentButton
          onClickHandler={() => {
            if (pool.type === POOL_TYPES.V1) {
              navigate(`/add/v1/${pool.address}`)
            } else if (pool.title === 'Ichi') {
              navigate(`/add?type=${FusionRangeType.ICHI_RANGE}&address=${pool.address}`)
            } else if (pool.title === 'Defiedge') {
              navigate(`/add?type=${FusionRangeType.DEFIEDGE_RANGE}&address=${pool.address}`)
            } else if (pool.type === POOL_TYPES.FUSION) {
              navigate(`/add?type=${FusionRangeType.GAMMA_RANGE}&address=${pool.address}`)
            } else {
              navigate(`/add?type=${FusionRangeType.ICHI_RANGE}&address=${pool.address}`)
            }
          }}
          content='ADD LIQUIDITY'
          className='py-[13px] w-1/2 px-[23px]'
          isUpper
        />
        <TransparentButton
          onClickHandler={() => {
            if (pool.account.walletBalance.isZero()) {
              customNotify('Please unstake first.', 'warn')
            } else {
              setIsOpen(true)
            }
          }}
          content='REMOVE'
          className='py-[13px] px-[26px] w-1/2'
          isUpper
        />
      </div>
      {isOpen && <RemoveModal pool={pool} isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  )
}

export default AutoLiquidityDetail

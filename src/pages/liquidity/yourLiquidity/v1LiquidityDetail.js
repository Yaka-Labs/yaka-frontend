import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PoolTitle from 'components/PoolTitle'
import Settings from 'components/Settings'
import Spinner from 'components/Spinner'
import NoFound from 'components/NoFound'
import TransparentButton from 'components/Buttons/transparentButton'
import { POOL_TYPES, FusionRangeType } from 'config/constants'
import { useClaimFees } from 'hooks/useRewards'
import { formatNumber } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import { usePools } from 'state/pools/hooks'
import RemoveModal from './components/removeModal'

const V1LiquidityDetail = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pools = usePools()
  const navigate = useNavigate()
  const { address } = useParams()
  const { onClaimFees, pending } = useClaimFees()

  const pool = useMemo(() => {
    return pools.find((ele) => ele.address === address) || null
  }, [pools, address])

  if (!pools.length) {
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
          className='w-5 md:w-auto mr-1.5 md:mr-5'
          onClick={() => {
            navigate('/liquidity/v1')
          }}
        >
          <img alt='' src='/images/swap/back-arrow.svg' />
        </button>
        <NoFound title='No liquidity found' />
      </div>
    )
  }

  const feesInUsd = pool.account.token0claimable.times(pool.token0.price).plus(pool.account.token0claimable.times(pool.token0.price))

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <button
            className='w-5 md:w-auto mr-1.5 md:mr-5'
            onClick={() => {
              navigate('/liquidity/v1')
            }}
          >
            <img alt='' src='/images/swap/back-arrow.svg' />
          </button>
          <PoolTitle pool={pool} />
        </div>
        <Settings />
      </div>
      <div className='w-full mt-4 lg:mt-7 border-b border-[#5E6282] pb-4 lg:pb-6 mb-3 lg:mb-[18px]'>
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
      <div className='w-full'>
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

      <div className='flex items-center space-x-3 mt-4 pb-4 lg:pb-6 border-b border-[#5E6282] mb-3 lg:mb-[18px]'>
        <TransparentButton
          onClickHandler={() => {
            if (pool.type === POOL_TYPES.V1) {
              navigate(`/add/v1/${pool.address}`)
            } else if (pool.type === POOL_TYPES.FUSION) {
              navigate(`/add?type=${FusionRangeType.GAMMA_RANGE}&address=${pool.address}`)
            } else {
              navigate(`/add?type=${FusionRangeType.ICHI_RANGE}&address=${pool.address}`)
            }
          }}
          content='ADD LIQUIDITY'
          className='py-[13px] px-[26px] w-1/2'
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
      <div className='w-full'>
        <div className='flex items-center justify-between'>
          <span className='text-sm lg:text-base leading-4 lg:leading-5 font-medium'>Unclaimed Fees</span>
          <span className='text-sm lg:text-base leading-4 lg:leading-5 font-light'>${formatNumber(feesInUsd)}</span>
        </div>
        <div className='mt-3.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-[5px]'>
              <img alt='' src={pool.token0.logoURI} className='w-6 lg:w-7' />
              <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{pool.token0.symbol}</span>
            </div>
            <span className='text-lightGray leading-5 font-light'>{formatNumber(pool.account.token0claimable)}</span>
          </div>
          <div className='flex items-center justify-between mt-2'>
            <div className='flex items-center space-x-[5px]'>
              <img alt='' src={pool.token1.logoURI} className='w-6 lg:w-7' />
              <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{pool.token1.symbol}</span>
            </div>
            <span className='text-lightGray leading-5 font-light'>{formatNumber(pool.account.token1claimable)}</span>
          </div>
        </div>
        <TransparentButton
          onClickHandler={() => onClaimFees(pool)}
          disabled={pending}
          content='CLAIM'
          className='mt-[13px] py-[13px] px-[26px] w-full'
          isUpper
        />
      </div>
      {isOpen && <RemoveModal pool={pool} isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  )
}

export default V1LiquidityDetail

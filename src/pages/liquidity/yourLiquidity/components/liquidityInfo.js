import React from 'react'
import { useSettings } from 'state/settings/hooks'
import { formatNumber } from 'utils/formatNumber'

const LiquidityInfo = ({ pool }) => {
  const { slippage } = useSettings()

  return (
    <div className='w-full my-[13.6px]'>
      <div className='text-secondary text-sm md:[13.6px] pb-[3.4px] border-b border-[#757384]'>Reserve Info</div>
      <div className='flex justify-around mt-[13.6px] w-full'>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-white text-sm md:[13.6px] leading-[17px] font-medium'>{formatNumber(pool.token0.reserve)}</p>
          <p className='text-white text-sm md:text-[13.6px leading-[17px]'>{pool.token0.symbol}</p>
        </div>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-white text-sm md:text-[13.6px] leading-[17px] font-medium'>{formatNumber(pool.token1.reserve)}</p>
          <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>{pool.token1.symbol}</p>
        </div>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-white text-sm md:text-[13.6px] leading-[17px] font-medium'>{slippage}%</p>
          <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>Slippage</p>
        </div>
      </div>
      <div className='text-secondary text-sm md:text-[13.6px] mt-[13.6px] pb-[3.4px] border-b border-[#757384]'>Your Balances</div>
      <div className='flex justify-around mt-[13.6px] w-full'>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-white text-sm md:text-[13.6px] leading-[17px] font-medium'>{formatNumber(pool.account.totalLp)}</p>
          <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>Pooled Liquidity</p>
        </div>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-white text-sm md:text-[13.6px] leading-[17px] font-medium'>{formatNumber(pool.account.gaugeBalance)}</p>
          <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>Staked Liquidity</p>
        </div>
      </div>
    </div>
  )
}

export default LiquidityInfo

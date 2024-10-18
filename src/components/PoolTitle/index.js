import DoubleCurrencyLogo from 'components/DoubleCurrencyLogo'
import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import PoolToolTip from './PoolToolTip'
const PoolTitle = ({ pool }) => {
  return (
    <div className='flex items-center space-x-[10.2px]'>
      <DoubleCurrencyLogo logo1={pool.token0.logoURI} logo2={pool.token1.logoURI} />
      <div>
        <p className='flex flex-wrap text-base xl:text-[16.15px] leading-[25.5px] font-medium'>{pool.symbol.replace(/WSEI/g, 'SEI')}</p>
        <div className='flex flex-row'>
          <p className='tracking-[0.78px] text-[11.05px] leading-none mt-[0.85px]'>{pool.title}</p>
          {/*{pool.weight > 0 && (*/}
          {/*  <PoolToolTip type='multiplier' tipView={<span>Deposit over $100 to obtain the points multiplier.</span>}>*/}
          {/*    <p className='tracking-[0.78px] text-[12px] font-medium leading-none bg-[#C211B0]/40 text-[#FFFFFF] rounded-[3px] mx-1.5 px-1.5 py-0.5'>*/}
          {/*      {1 + pool.weight}x*/}
          {/*    </p>*/}
          {/*  </PoolToolTip>*/}

          {/*)}*/}
        </div>
      </div>
    </div>
  )
}

export default PoolTitle

import React from 'react'

const DoubleCurrencyLogo = ({ logo1, logo2, isSmall = false }) => (
  <div className='flex items-center -space-x-[6.8px]'>
    <img className={`relative z-[1] ${isSmall ? 'w-[23.8px] h-[23.8px]' : 'w-[25.5px] h-[25.5px]'}`} src={logo1} alt='THENA Token First Logo' />
    <img className={`relative ${isSmall ? 'w-[23.8px] h-[23.8px]' : 'w-[25.5px] h-[25.5px]'}`} src={logo2} alt='THENA Token Second Logo' />
  </div>
)

export default DoubleCurrencyLogo

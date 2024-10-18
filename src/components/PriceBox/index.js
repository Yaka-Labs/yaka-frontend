import React from 'react'

const Index = ({ className, range, content }) => {
  return (
    <div className={`bg-[#080331] rounded-xl text-center pt-2 md:pt-[10.2px] pb-2 md:pb-[13.6px] flex flex-col items-center justify-center ${className}`}>
      <p className='text-[#B8B6CB] leading-[15px]  md:leading-[13.6px] text-xs md:text-[11.9px]'>{range} Price</p>
      {content}
    </div>
  )
}

export default Index

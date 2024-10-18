import React from 'react'

const Index = ({ className, value, setValue, max, price, firstToken, secondToken }) => {
  return (
    <div className={`bg-[#080331] px-1.5 md:px-3.5 py-2 md:py-[11px] flex flex-col items-center justify-center rounded-xl ${className}`}>
      <p className='text-[#B8B6CB] text-xs md:text-[15px]'>{price} Price</p>
      <div className='flex items-center justify-between space-x-4 mt-[9px] w-full'>
        <button
          onClick={() => {
            value === 0 ? setValue(0) : setValue(value - 1)
          }}
          className='md:w-[34px] w-5 h-5 md:h-[34px] flex flex-col items-center justify-center rounded-full bg-white bg-opacity-[0.09]'
        >
          <img alt='' className='w-3/5 md:w-auto' src='/images/svgs/minus.svg' />
        </button>
        <p className='max-w-[96px] flex items-center justify-center'>
          <span className='text-base md:text-2xl leading-5 md:leading-[29px] text-white font-semibold'>{value}</span>
        </p>
        <button
          onClick={() => {
            value === max ? setValue(max) : setValue(value + 1)
          }}
          className='md:w-[34px] w-5 h-5 md:h-[34px] flex flex-col items-center justify-center rounded-full bg-white bg-opacity-[0.09]'
        >
          <img alt='' className='w-3/5 md:w-auto' src='/images/svgs/plus.svg' />
        </button>
      </div>
      <p className='text-[#B8B6CB] text-xs md:text-[15px] mt-3 md:mt-2.5'>
        {firstToken} per {secondToken}
      </p>
    </div>
  )
}

export default Index

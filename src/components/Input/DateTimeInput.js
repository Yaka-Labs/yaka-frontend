import React from 'react'

const DateTimeInput = ({ className, label, ...rest }) => {
  return (
    <div className={`w-full md:max-w-[314px]${className ? ' ' + className : ''}`}>
      <div className='text-base leading-5 text-lightGray'>{label}</div>
      <div className=' border border-blue w-full rounded-[3px] mt-2'>
        <div className='bg-body flex items-center px-2.5 h-[48px] md:h-[52px] rounded-[3px]'>
          <img alt='' className='w-[24px] h-[24px]' src='/images/svgs/clock.svg' />
          <input
            type='datetime-local'
            className='bg-transparent focus:outline-none w-full pl-[6px] text-lg leading-10 placeholder-[#757384] text-white font-light'
            {...rest}
          />
        </div>
      </div>
    </div>
  )
}

export default DateTimeInput

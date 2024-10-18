import React from 'react'

const SimpleInput = ({ typedString, placeholder, onChange, className, onlyNumber = false, max }) => (
  <div className={`border border-blue w-full  rounded-[3px] flex items-center  relative ${className}`}>
    <input
      type={onlyNumber ? 'number' : 'text'}
      value={typedString}
      maxLength={max && max}
      onChange={onChange}
      placeholder={placeholder}
      className='bg-body placeholder-[#757384] pl-3.5 h-[42px] lg:h-[52px] w-full text-white text-base  pr-4 py-[18px] rounded-[3px] focus:outline-none'
    />
  </div>
)

export default SimpleInput

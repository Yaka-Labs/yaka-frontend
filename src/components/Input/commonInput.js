import React from 'react'

const CommonInput = ({ className, type, value, setValue, placeholder = '' }) => {
  return (
    <input
      type={type || 'text'}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`text-white placeholder:placeholder-[#757384] text-base leading-5 w-full bg-body border border-blue rounded-[3px] focus-within:outline-none${
        className ? ' ' + className : ''
      }`}
    />
  )
}

export default CommonInput

import React from 'react'

const Toggle = ({ onChange, toggleId, small, checked = false, rounded }) => (
  <label htmlFor={toggleId} className='inline-flex relative items-center cursor-pointer'>
    <input onChange={onChange} type='checkbox' checked={checked} id={toggleId} className='sr-only peer focus:outline-none' />
    <div
      className={`${
        small
          ? 'w-[35.428px] h-[18.7px] after:h-[15.3px] after:w-[15.3px] after:top-[2px] after:left-[2px]'
          : 'w-[47.6px] h-[25.5px] after:h-[22.1px] after:w-[22.1px] after:top-[1.5px] after:left-[2px]'
      } ${
        rounded ? 'rounded-full after:rounded-full' : 'rounded-md after:rounded-md'
      } bg-[#A0A3B5]  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute
       after:bg-white after:border-gray-300 after:border after:transition-all peer-checked`}
    />
  </label>
)

export default Toggle

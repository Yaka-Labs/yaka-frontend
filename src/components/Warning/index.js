import React from 'react'

const Warning = ({ text }) => (
  <div className='mt-4 bg-white flex items-start bg-opacity-[0.05] rounded-[3px] bg-clip-padding p-4'>
    <img className='w-4 h-4 lg:w-5 lg:h-5 mt-1' alt='info' src='/images/mark/info-mark.svg' />
    <p className='text-white text-[15px] lg:text-[17px] ml-[10px] font-figtree'>{text}</p>
  </div>
)

export default Warning

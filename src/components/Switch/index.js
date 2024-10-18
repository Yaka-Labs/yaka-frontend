import React from 'react'

const Switch = ({ data, active, setActive }) => (
  <div className='flex items-center space-x-[13.6px] lg:space-x-[27.2px] mt-[16px] md:mt-[17px] tracking-[0.9px] text-white text-[16.3px] leading-[17px] font-light'>
    {data.map((item) => {
      return (
        <div
          className='flex items-center space-x-1.5 md:space-x-[6.8px] cursor-pointer'
          onClick={() => {
            setActive(item)
          }}
          key={item}
        >
          <div className='md:w-[17px] md:h-[17px] w-[18px] h-[18px] flex flex-col items-center justify-center border border-[#B8B6CB] rounded-full'>
            <div className={`md:w-[8.5px] w-2 h-2 md:h-[8.5px] rounded-full ${active === item ? 'bg-white' : 'bg-transparent'}`} />
          </div>
          <span className={`uppercase text-sm md:text-[13.6px]${active === item ? ' font-medium' : ''}`}>{item}</span>
        </div>
      )
    })}
  </div>
)

export default Switch

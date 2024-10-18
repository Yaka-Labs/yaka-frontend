import React from 'react'
import { SIZES } from 'config/constants'

const TabFilter = ({ data, filter, setFilter, className, size = SIZES.MEDIUM, wfull }) => {
  const width = size === SIZES.LARGE ? 'w-[170px]' : size === SIZES.MEDIUM ? (wfull ? 'w-1/3 md:min-w-[85px]' : 'md:min-w-[85px]') : 'px-[13.6px] md:w-[76.5px]'
  return (
    <div className={`flex items-center border border-red p-[3.4px] ${wfull ? 'w-full md:w-fit ' : 'w-fit '} rounded-lg ${className ? ' ' + className : ''}`}>
      {data.map((item, idx) => {
        return (
          <div
            onClick={() => setFilter(item)}
            key={`tab-${idx}`}
            className={`cursor-pointer font-figtree h-[34px] md:h-[34px] rounded-lg flex items-center 
            justify-center uppercase hover:text-white transition-all ${
              filter === item ? 'border-[#C2111F]  border-1-5 rounded-[4px] bg-[#9E2019]  text-white' : 'text-secondary'
            } ${width} font-semibold md:tracking-[0.6px] ${(size = SIZES.SMALL ? 'text-[11.05px] tracking-[1px]' : 'text-[11.05px] lg:text-[11.9px] xl:text-[12.75px]')}`}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}

export default TabFilter

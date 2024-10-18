import React from 'react'

const SearchInput = ({
  searchText,
  setSearchText,
  placeholder,
  full,
  className,
  onlyNumber = false,
  ref,
  max,
  onFocus = () => {},
  disableSearchIcon = false,
}) => (
  <div className={`border w-full gradient-bg-blue  rounded-none flex items-center ${!full && 'lg:max-w-[212.5px]'} relative ${className}`}>
    {!disableSearchIcon && <img className='pointer-events-none absolute left-[10.2px] w-[20.4px] h-[20.4px]' alt='' src='/images/svgs/search.svg' />}
    <input
      type={onlyNumber ? 'number' : 'text'}
      value={searchText}
      maxLength={max && max}
      onFocus={onFocus}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder={placeholder}
      ref={ref}
      className={`${
        !disableSearchIcon ? ' pl-[34.85px]' : 'pl-[11.9px]'
      } bg-body placeholder-[#757384] h-[35.7px] lg:h-[44.2px] w-full text-white text-base  pr-[13.6px] py-[15.3px] rounded-[8.5px] focus:outline-none`}
    />
  </div>
)

export default SearchInput

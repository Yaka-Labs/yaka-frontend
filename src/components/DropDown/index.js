import React, { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

const DropDown = ({ options, sort, setSort }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='max-w-[255px] w-full dropdownwrapper'>
      <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
        <div
          onClick={() => {
            setIsOpen(!isOpen)
          }}
          className='w-full relative flex items-center h-[35.7px] md:h-[44.2px] border  rounded-[3px] gradient-bg px-[13.6px] cursor-pointer'
        >
          <div className='w-full focus:outline-none py-[6.8px] bg-transparent rounded-[3px] text-white flex items-center justify-between'>
            <p className='text-white'>{sort.label}</p>
            <img
              className={`${isOpen ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}
              alt=''
              src='/images/swap/dropdown-arrow.png'
            />
            {isOpen && (
              <div className='bg-[#360e12] w-full border z-[102] border-red top-[40.8px] md:top-[47.6px] right-0 absolute p-[11.9px] bg-clip-padding rounded-[3px]'>
                {options.map((item, idx) => {
                  return (
                    <div
                      onClick={() => {
                        setSort(item)
                        setIsOpen(false)
                      }}
                      key={idx}
                      className='z-[10]'
                    >
                      <p className='text-white text-[13.6px] md:text-[15.3px] leading-[23.8px] tracking-wide'>{item.label}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  )
}

export default DropDown

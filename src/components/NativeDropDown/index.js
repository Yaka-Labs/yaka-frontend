import React, { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

const Index = ({ className, title, arr, getValue = () => {}, setIsSelected, isSelected }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={`${className} dropdownwrapper relative`}>
      <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
        <div
          onClick={() => {
            setIsOpen(!isOpen)
          }}
          className='w-full flex items-center h-[42px] lg:h-[52px] px-4 bg-[#090333] border border-blue rounded-[3px] cursor-pointer'
        >
          {title && <div className='text-white  font-medium whitespace-nowrap pr-3 border-r border-blue font-figtree uppercase'>{title}</div>}
          <div
            className={`${
              title ? 'pl-3' : ''
            } w-full relative focus:outline-none py-2 bg-transparent rounded-[3px] text-white flex items-center justify-between`}
          >
            <p className={`${!isSelected ? 'text-[#B8B6CB]' : 'text-white'} text-lg `}>{isSelected || arr[0]}</p>
            <img
              className={`${isOpen ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}
              alt=''
              src='/images/swap/dropdown-arrow.png'
            />
          </div>
        </div>
        {isOpen && (
          <div className='bg-[#090333] w-full max-h-[200px] overflow-auto border-x border-b z-[102] border-blue absolute p-3.5 bg-clip-padding rounded-[3px]'>
            {arr.map((item, idx) => {
              return (
                <div
                  onClick={() => {
                    setIsSelected(item)
                    setIsOpen(false)
                    getValue(item)
                  }}
                  key={idx}
                  className='z-[10]'
                >
                  <p className='text-white cursor-pointer text-base md:text-lg leading-7 tracking-wide'>{item}</p>
                </div>
              )
            })}
          </div>
        )}
      </OutsideClickHandler>
    </div>
  )
}

export default Index

import React, { useCallback, useState } from 'react'
import { FAUCET_LIST } from 'config/constants'
import './style.scss'
import ClaimModal from './ClaimModal'

const Faucet = ({ setOpen = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showYaka, setShowYaka] = useState(false)
  return (
    <div>
      <div
        className='py-2'
        onMouseEnter={() => {
          setIsOpen(true)
        }}
        onMouseLeave={() => {
          setIsOpen(false)
        }}
      >
        <div className='h-11 px-3 flex items-center space-x-1 cursor-pointer bg-[#FFFFFF1C] bg-opacity-[0.45] rounded-[8px]'>
          <span className='text-[17px]'>Faucet</span>
          <img alt='dropdown' src='/images/header/dropdown-arrow.svg' className={`${isOpen ? 'rotate-0' : 'rotate-180'} transition-all duration-150`} />
        </div>
      </div>
      <div
        className='relative'
        onMouseEnter={() => {
          setIsOpen(true)
        }}
        onMouseLeave={() => {
          setIsOpen(false)
        }}
      >
        <div
          className={`flex flex-col space-y-2 py-3 px-[22px] min-w-[150px] w-max absolute z-40 border border-[#C81F39] bg-[#360E12] rounded-[3px] ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          {Object.values(FAUCET_LIST).map((_item) => {
            return (
              <div
                key={_item.title}
                className='flex items-center space-x-1.5 cursor-pointer hover:text-red'
                onClick={() => {
                  if (_item.title === 'SEI') {
                    window.open(_item.url)
                  } else {
                    setShowYaka(true)
                  }
                  setIsOpen(false)
                }}
              >
                <img src={_item.img} alt='' style={{ width: '24px' }} />
                <span className='text-[17px]'>{_item.title}</span>
              </div>
            )
          })}
        </div>
      </div>
      <ClaimModal isOpen={showYaka} setIsOpen={setShowYaka} />
    </div>
  )
}

export default Faucet

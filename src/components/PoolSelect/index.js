import React, { useState } from 'react'
import PoolTitle from 'components/PoolTitle'
import PoolPopup from '../PoolPopup'

const PoolSelect = ({ setPool, pool, pools }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='gradient-bg mt-1.5 md:mt-[8.5px] p-px w-full rounded-[2.55px]'>
      <div className=' h-12 md:h-[59.5px] rounded-[2.55px] flex items-center relative'>
        <div
          onClick={() => {
            setIsOpen(!isOpen)
          }}
          className='bg-transparent w-full h-full flex items-center cursor-pointer py-[6.8px] lg:py-[12.75px] pl-[8.5px] lg:pl-[13.6px]'
        >
          {pool ? <PoolTitle pool={pool} /> : <div className='w-full h-full font-normal text-[#757384] text-lg md:text-[20.4px] md:leading-[34px]'>Select</div>}
        </div>
        <img
          className={`${isOpen ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out absolute right-4 top-4 md:top-[23.8px] `}
          alt=''
          src='/images/swap/dropdown-arrow.png'
        />
      </div>
      <PoolPopup setSelectedPool={setPool} popup={isOpen} setPopup={setIsOpen} pools={pools} />
    </div>
  )
}

export default PoolSelect

import React, { useState } from 'react'
import { useAssets } from 'state/assets/hooks'
import SearchTokenPopup from '../SearchTokenPopup'

const RewardSelect = ({ asset, setAsset }) => {
  const [isOpen, setIsOpen] = useState(false)
  const assets = useAssets()

  return (
    <div className='gradient-bg mt-1.5 md:mt-2.5 p-px w-full rounded-[3px] relative'>
      <div className=' h-12 md:h-[70px] rounded-[3px] flex items-center'>
        <div
          onClick={() => {
            setIsOpen(!isOpen)
          }}
          className='bg-transparent w-full h-full cursor-pointer flex items-center relative z-10 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4'
        >
          {asset ? (
            <div className='flex items-center space-x-3'>
              <div className='flex items-center'>
                <img className='w-[26px] h-[26px] md:w-[30px] md:h-[30px]' alt='' src={asset.logoURI} />
              </div>
              <p className='text-white text-base md:text-[19px] font-medium leading-5 md:leading-[30px] font-figtree'>{asset.symbol}</p>
            </div>
          ) : (
            <div className='w-full h-full font-normal text-[#757384] text-lg md:text-2xl md:leading-10'>Select</div>
          )}
        </div>
        <img
          className={`${isOpen ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out absolute right-4 top-4 md:top-7 `}
          alt=''
          src='/images/swap/dropdown-arrow.png'
        />
      </div>
      <SearchTokenPopup popup={isOpen} setPopup={setIsOpen} setSelectedAsset={setAsset} baseAssets={assets.filter((asset) => asset.address !== 'SEI')} />
    </div>
  )
}

export default RewardSelect

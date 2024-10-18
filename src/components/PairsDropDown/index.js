import React, { useState } from 'react'
import { useAssets } from 'state/assets/hooks'
import SearchTokenPopup from '../SearchTokenPopup'

const Index = ({ className, asset, setAsset, otherAsset, setOtherAsset, onAssetSelect }) => {
  const [tokenPopup, setTokenPopup] = useState(false)
  const assets = useAssets()
  return (
    <>
      <div
        onClick={() => {
          setTokenPopup(true)
        }}
        className={` ${className} px-4 md:px-5 py-[11px] cursor-pointer flex items-center justify-between bg-white rounded-full bg-opacity-[0.09] w-full`}
      >
        <div className='flex items-center space-x-[9px] md:space-x-1.5'>
          {asset ? (
            <>
              <img className='w-5 md:w-7' alt='' src={asset.logoURI} />
              <span className='text-[15px] md:text-lg font-figtree font-medium text-white leading-[22px]'>{asset.symbol}</span>
            </>
          ) : (
            <span className='text-[15px] md:text-lg font-figtree font-semibold text-white leading-[22px]'>Select a token</span>
          )}
        </div>
        <button className='md:block hidden'>
          <img alt='dropdown' src='/images/svgs/dropdown.svg' />
        </button>
      </div>
      <SearchTokenPopup
        popup={tokenPopup}
        setPopup={setTokenPopup}
        selectedAsset={asset}
        setSelectedAsset={setAsset}
        otherAsset={otherAsset}
        setOtherAsset={setOtherAsset}
        baseAssets={assets}
        onAssetSelect={onAssetSelect}
      />
    </>
  )
}

export default Index

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Modal from '../Modal'
import NoFound from '../NoFound'

const MultiSelectPopup = ({ popup, setPopup, selectedAssets, setSelectedAssets, assets }) => {
  const [searchText, setSearchText] = useState('')
  const inputRef = useRef()

  const filteredAssets = useMemo(() => {
    return searchText
      ? assets.filter(
          (asset) =>
            asset.name.toLowerCase().includes(searchText.toLowerCase()) ||
            asset.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
            asset.address.toLowerCase().includes(searchText.toLowerCase()),
        )
      : assets
  }, [assets, searchText])

  useEffect(() => {
    if (!popup) {
      setSearchText('')
    } else {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 300)
    }
  }, [popup])

  return (
    <Modal popup={popup} setPopup={setPopup} title='Select Tokens' width={459} isToken>
      <>
        <div className='w-full'>
          <div className='px-3 md:px-6'>
            <div className='border border-blue w-full mt-3 rounded-[3px]'>
              <input
                ref={inputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder='Search by name, symbol or address'
                className='placeholder-[#757384] h-14 w-full text-white text-base md:text-lg px-4 py-[18px] rounded-[3px]'
              />
            </div>
          </div>
        </div>
        <div className='w-full mt-3'>
          <div className='flex justify-between text-[13px] md:text-sm tracking-[0.52px] md:tracking-[0.56px] font-figtree text-secondary mb-1 px-3 md:px-6'>
            <span>{selectedAssets.length} Selected</span>
            <span
              className='text-green cursor-pointer'
              onClick={() => {
                if (selectedAssets.length > 0) {
                  setSelectedAssets([])
                } else {
                  setSelectedAssets(assets)
                }
              }}
            >
              {selectedAssets.length > 0 ? 'Clear All' : 'Select All'}
            </span>
          </div>
          <div className='w-full mt-3 md:mt-[13px] max-h-[340px] overflow-auto'>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, idx) => {
                const isSelected = selectedAssets.find((ele) => ele.address === asset.address)
                return (
                  <div
                    key={`asset-${idx}`}
                    className={`flex items-center justify-between py-[6px] px-3 md:px-6 cursor-pointer hover:bg-body${isSelected ? ' bg-[#162052]' : ''}`}
                    onClick={() => {
                      let temp = [...selectedAssets]
                      if (isSelected) {
                        temp = selectedAssets.filter((ele) => ele.address !== asset.address)
                        setSelectedAssets(temp)
                      } else {
                        temp.push(asset)
                        setSelectedAssets(temp)
                      }
                    }}
                  >
                    <div className='flex items-center space-x-2.5 md:space-x-3'>
                      <img alt='' src={asset.logoURI} className='flex-shrink-0' width={28} height={28} loading='lazy' />
                      <div className=''>
                        <p className='text-white text-sm md:text-base font-figtree'>{asset.symbol}</p>
                        <p className='text-[13px] md:text-sm tracking-[0.52px] text-secondary'>{asset.name}</p>
                      </div>
                    </div>
                    {isSelected && <img alt='' src='/images/core/grey-checkmark.svg' />}
                  </div>
                )
              })
            ) : (
              <NoFound title='No tokens found' />
            )}
          </div>
        </div>
      </>
    </Modal>
  )
}

export default MultiSelectPopup

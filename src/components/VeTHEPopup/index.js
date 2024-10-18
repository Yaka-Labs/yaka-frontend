import React, { useEffect, useMemo, useRef, useState } from 'react'
import { formatNumber } from 'utils/formatNumber'
import Modal from '../Modal'
import NoFound from '../NoFound'

const VeTHEPopup = ({ popup, setPopup, setSelectedVeTHE, veTHEs }) => {
  const [searchText, setSearchText] = useState('')
  const inputRef = useRef()

  const filteredVeTHEs = useMemo(() => {
    return searchText ? veTHEs.filter((veTHE) => veTHE.id.includes(searchText.toLowerCase())) : veTHEs
  }, [veTHEs, searchText])

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
    <Modal popup={popup} setPopup={setPopup} title='Choose your veYAKA' width={459} isToken>
      <div className='w-full'>
        <div className='px-[10.2px] md:px-[20.4px]'>
          <div className='w-full mt-[10.2px] md:mt-[17px] rounded-[3px]'>
            <input
              type='number'
              min={0}
              lang='en'
              ref={inputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder='Search by ID'
              className='gradient-bg focus:outline-none placeholder-[#757384] h-[47.6px] w-full text-white text-[13.6px] md:text-[15.3px] px-[13.6px] py-[15.3px] rounded-[3px]'
            />
          </div>
        </div>
      </div>
      <div className='w-full mt-[17px]'>
        <div className='flex justify-between text-[11.05px] md:text-[11.9px] tracking-[0.52px] md:tracking-[0.56px] font-figtree text-secondary mb-1 px-[10.2px] md:px-[20.4px]'>
          <span>veYAKA ID</span>
          <span>veYAKA BALANCE</span>
        </div>
        <div className='w-full mt-[10.2px] md:mt-[11.05px] max-h-[340px] overflow-auto'>
          {filteredVeTHEs.length > 0 ? (
            filteredVeTHEs.map((veTHE, idx) => {
              return (
                <div
                  key={`asset-${idx}`}
                  className='flex items-center justify-between py-[12.75px] px-[10.2px] md:px-[20.4px] cursor-pointer hover:bg-body'
                  onClick={() => {
                    setSelectedVeTHE(veTHE)
                    setPopup(false)
                  }}
                >
                  <p className='text-white text-[11.9px] md:text-[13.6px] font-figtree'>Token #{veTHE.id}</p>
                  <p className='text-[11.9px] md:text-[13.6px] text-white'>{formatNumber(veTHE.voting_amount)}</p>
                </div>
              )
            })
          ) : (
            <NoFound title='No veYAKA found' />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default VeTHEPopup

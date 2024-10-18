import React, { useEffect, useMemo, useRef, useState } from 'react'
import PoolTitle from 'components/PoolTitle'
import Modal from '../Modal'
import NoFound from '../NoFound'

const PoolPopup = ({ popup, setPopup, setSelectedPool, pools }) => {
  const [searchText, setSearchText] = useState('')
  const inputRef = useRef()

  const filteredPools = useMemo(() => {
    return searchText
      ? pools.filter((pool) => pool.symbol.toLowerCase().includes(searchText.toLowerCase()) || pool.address.toLowerCase().includes(searchText.toLowerCase()))
      : pools
  }, [pools, searchText])

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
    <Modal popup={popup} setPopup={setPopup} title='Select Pair' width={459} isToken>
      <div className='w-full'>
        <div className='px-3 md:px-[20.4px]'>
          <div className='border  w-full mt-3 md:mt-[17px] rounded-[2.55px] gradient-bg '>
            <input
              ref={inputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder='Search by name, symbol or address'
              className='bg-[#300e1033] placeholder-[#757384] h-[47.6px] w-full text-white text-base md:text-[15.3px] px-[13.6px] py-[15.3px] rounded-[2.55px] focus:outline-none'
            />
          </div>
        </div>
      </div>
      <div className='w-full mt-[17px]'>
        <div className='flex justify-between text-[13px] md:text-sm tracking-[0.52px] md:tracking-[0.56px] font-figtree text-secondary mb-[3.4px] px-3 md:px-[20.4px]'>
          <span>POOL NAME</span>
        </div>
        <div className='w-full max-h-[340px] overflow-auto'>
          {filteredPools.length > 0 ? (
            filteredPools.map((pool, idx) => {
              return (
                <div
                  key={`pool-${idx}`}
                  className='h-[51px] flex items-center justify-between px-3 md:px-[20.4px] cursor-pointer hover:bg-body'
                  onClick={() => {
                    setSelectedPool(pool)
                    setPopup(false)
                  }}
                >
                  <PoolTitle pool={pool} />
                </div>
              )
            })
          ) : (
            <NoFound title='No pools found' />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default PoolPopup

import React, { useState, useContext, useEffect } from 'react'
import { veTHEsContext } from 'context/veTHEsConetext'
import VeTHEPopup from '../VeTHEPopup'

const VeTHESelect = ({ className, isSelected, setIsSelected }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [init, setIsInit] = useState(false)
  const veTHEs = useContext(veTHEsContext)

  useEffect(() => {
    if (veTHEs.length > 0) {
      if (!init) {
        setIsInit(true)
        setIsSelected(veTHEs[0])
      }
    } else {
      setIsSelected(null)
    }
  }, [veTHEs, init])

  return (
    <div className={`dropdownwrapper${className ? ' ' + className : ''}`}>
      <div className='w-full flex items-center h-[35.7px] md:h-[44.2px] border  rounded-[3px] gradient-bg px-[13.6px]'>
        <div className='text-white font-medium whitespace-nowrap pr-[10.2px] border-r border-[#C81F39] font-figtree'>SELECT veYAKA:</div>
        <div
          className='pl-[10.2px] w-full relative focus:outline-none py-[6.8px] bg-transparent rounded-[3px] text-white flex items-center justify-between cursor-pointer'
          onClick={() => {
            if (veTHEs.length > 0) {
              setIsOpen(true)
            }
          }}
        >
          {isSelected ? <span className='text-white text-[12px]'>{`#${isSelected.id}`}</span> : <div className='text-secondary text-[12px]'>Not found</div>}
          <img
            className={`${isOpen ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}
            width={13.6}
            height={13.6}
            alt=''
            src='/images/swap/dropdown-arrow.png'
          />
        </div>
      </div>
      <VeTHEPopup popup={isOpen} setPopup={setIsOpen} setSelectedVeTHE={setIsSelected} veTHEs={veTHEs} />
    </div>
  )
}

export default VeTHESelect

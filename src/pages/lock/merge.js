import React, { useContext, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { formatNumber } from 'utils/formatNumber'
import { veTHEsContext } from 'context/veTHEsConetext'
import { useMerge } from 'hooks/useLock'
import StyledButton from 'components/Buttons/styledButton'
import VeTHEPopup from 'components/VeTHEPopup'

const MergeTab = ({ selected }) => {
  const [veTHE, setVeTHE] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const veTHEs = useContext(veTHEsContext)
  const filtered = useMemo(() => {
    return veTHEs.filter((item) => item.id !== selected.id && item.voting_amount.gt(0))
  }, [veTHEs])

  const { onMerge, pending } = useMerge()

  const errorMsg = useMemo(() => {
    if (!veTHE) {
      return 'SELECT veYAKA'
    }
    return null
  }, [veTHE])

  const votingPower = useMemo(() => {
    if (veTHE) {
      const end = Math.max(selected.lockEnd, veTHE.lockEnd)
      const current = new Date().getTime() / 1000
      return selected.amount
        .plus(veTHE.amount)
        .times(end - current)
        .div(86400 * 730)
    }
    return new BigNumber(0)
  }, [selected, veTHE])

  return (
    <>
      <div className='mt-[17px] flex flex-col items-center justify-center'>
        <div className='w-full'>
          <div className='flex items-center justify-between'>
            <p className='text-white text-[11.9px] md:text-[13.6px] leading-10'>veYAKA ID</p>
            <p className='text-white text-[11.9px] md:text-[13.6px] leading-10'>veYAKA Balance: {formatNumber(selected.voting_amount)}</p>
          </div>
          <div className='gradient-bg mt-[5.1px] lg:mt-[8.5px] p-px w-full rounded-[3px]'>
            <div className='px-[8.5px] h-[40.8px] lg:h-[59.5px] rounded-[3px] flex items-center justify-between'>
              <p className='text-white text-[15.3px] md:text-[20.4px] font-medium'>{`veYAKA #${selected.id}`}</p>
            </div>
          </div>
        </div>
        <button className='focus:outline-none mt-[17px] z-[8]'>
          <img src='/images/common/square-arrow-down.svg' alt='' />
        </button>
      </div>
      <div className='flex flex-col w-full items-center justify-center'>
        <div className='w-full mb-[17px]'>
          <div className='flex items-center justify-between'>
            <p className='text-white texts-[11.05px] md:text-[13.6px]'>Merge To</p>
            <p className='text-white texts-[11.05px] md:text-[13.6px]'>veYAKA Balance: {veTHE ? formatNumber(veTHE.voting_amount) : '-'}</p>
          </div>
          <div className='gradient-bg mt-[5.1px] md:mt-[8.5px] p-px w-full rounded-[3px] relative'>
            <div className='h-[40.8px] lg:h-[59.5px] rounded-[3px] flex items-center'>
              <div
                onClick={() => {
                  if (filtered && filtered.length > 0) {
                    setIsOpen(true)
                  }
                }}
                className='bg-transparent w-full h-full cursor-pointer flex items-center relative z-10 py-[6.8px] lg:py-[12.75px] pl-[8.5px] lg:pl-[13.6px]'
              >
                <div
                  className={`w-full h-full font-normal ${veTHE ? 'text-white font-medium' : 'text-[#757384]'} text-[15.3px] md:text-[20.4px] md:leading-[34px]`}
                >
                  {veTHE ? 'veYAKA #' + veTHE.id : filtered.length > 0 ? 'Select' : 'Not Found'}
                </div>
              </div>
              <img
                className={`${isOpen ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out absolute right-[13.6px] top-[13.6px] md:top-[23.8px] `}
                alt=''
                src='/images/swap/dropdown-arrow.png'
              />
            </div>
            <VeTHEPopup popup={isOpen} setPopup={setIsOpen} setSelectedVeTHE={setVeTHE} veTHEs={filtered} />
          </div>
        </div>
      </div>
      {veTHE && (
        <div className='mb-[7.65px] sm:flex items-center justify-between'>
          <span className='text-[13.6px] lg:text-[17px] text-white font-light'>veYAKA #{veTHE.id} Balance Will Be:</span>
          <div className='flex space-x-[6.8px]'>
            <span className='text-[15.3px] lg:text-[18.7px] text-white font-medium'>{formatNumber(votingPower)}</span>
            <span className='text-[15.3px] lg:text-[18.7px] text-secondary font-light'>(+{formatNumber(votingPower.minus(veTHE.voting_amount))})</span>
          </div>
        </div>
      )}
      <StyledButton
        disabled={errorMsg || pending}
        pending={pending}
        onClickHandler={() => {
          onMerge(selected, veTHE)
        }}
        content={errorMsg || 'MERGE'}
        className='py-[11.05px] w-full'
      />
    </>
  )
}

export default MergeTab

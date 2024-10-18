import React, { useMemo, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import { useTransfer } from 'hooks/useLock'
import StyledButton from 'components/Buttons/styledButton'

const TransferTab = ({ selected }) => {
  const [address, setAddress] = useState('')
  const { onTransfer, pending } = useTransfer()

  const errorMsg = useMemo(() => {
    if (!address) {
      return 'ENTER ADDRESS'
    }
    if (!isAddress(address)) {
      return 'INVALID ADDRESS'
    }
    return null
  }, [address])

  return (
    <>
      <div className='mt-[17px]'>
        <p className='text-white text-[13.6px] md:text-[18.7px] font-medium'>Transfer veYAKA to</p>
        <p className='mt-[11.05px] text-white text-[11.05px] md:text-[13.6px] font-medium'>Address</p>
        <div className='gradient-bg mt-[5.1px] lg:mt-[8.5px]  p-px w-full rounded-[3px]'>
          <div className='px-[10.2px]  rounded-[3px] flex items-center justify-between'>
            <input
              className='bg-transparent w-full py-[6.8px] lg:py-[12.75px] text-[17px] lg:text-[17px] font-medium leading-[34px] placeholder-[#757384] text-white focus:outline-none'
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
              }}
              placeholder='0x...'
            />
          </div>
        </div>
      </div>
      <StyledButton
        disabled={errorMsg || pending}
        pending={pending}
        onClickHandler={() => {
          onTransfer(selected, address)
        }}
        content={errorMsg || 'TRANSFER'}
        className='py-[11.05px] mt-[17px] w-full'
      />
    </>
  )
}

export default TransferTab

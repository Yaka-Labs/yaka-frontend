import React from 'react'
import 'react-rangeslider/lib/index.css'
import { useCurrencyLogo } from 'hooks/v3/useCurrencyLogo'
import { useAlgebraClaim } from 'hooks/v3/useAlgebra'
import Modal from 'components/Modal'
import StyledButton from 'components/Buttons/styledButton'

const CollectModal = ({ isOpen, setIsOpen, position, feeValue0, feeValue1 }) => {
  const logoURI0 = useCurrencyLogo(feeValue0?.currency)
  const logoURI1 = useCurrencyLogo(feeValue1?.currency)
  const { pending, onAlgebraClaim } = useAlgebraClaim()

  return (
    <Modal popup={isOpen} setPopup={setIsOpen} title='Collect Fees' width={499.8}>
      <div className='px-[13.6px] pt-[17px] pb-[10.2px] rounded-[4.25px] bg-[#0D1238] border border-[#0000AF] mt-[11.05px]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-[4.25px]'>
            <img alt='' src={logoURI0} className='w-[22px] md:w-[20.4px]' />
            <span className='text-[15px] md:text-[15.3px] leading-[18px] md:leading-[18.7px] text-white font-figtree font-semibold'>{feeValue0?.currency.symbol}</span>
          </div>
          <div className='flex items-center space-x-[6.8px]'>
            <span className='text-lightGray leading-[17px]'>{feeValue0?.toSignificant()}</span>
          </div>
        </div>
        <div className='flex items-center justify-between mt-[6.8px]'>
          <div className='flex items-center space-x-[4.25px]'>
            <img alt='' src={logoURI1} className='w-[22px] md:w-[20.4px]' />
            <span className='text-[15px] md:text-[15.3px] leading-[18px] md:leading-[18.7px] text-white font-figtree font-semibold'>{feeValue1?.currency.symbol}</span>
          </div>
          <div className='flex items-center space-x-[6.8px]'>
            <span className='text-lightGray leading-[17px]'>{feeValue1?.toSignificant()}</span>
          </div>
        </div>
        <StyledButton
          pending={pending}
          onClickHandler={() => onAlgebraClaim(position.tokenId, feeValue0, feeValue1)}
          content='CLAIM'
          className='mt-[12.75px] py-[11.05px] w-full'
        />
        <p className='mt-2 md:mt-[5.1px] text-lightGray leading-[17px] text-sm md:text-[13.6px] font-light text-center'>
          Collecting fees will withdraw currently available fees for you.
        </p>
      </div>
    </Modal>
  )
}

export default CollectModal

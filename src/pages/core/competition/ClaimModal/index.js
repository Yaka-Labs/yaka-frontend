import React from 'react'
import Modal from 'components/Modal'
import StyledButton from 'components/Buttons/styledButton'

const ClaimModal = ({ isOpen, setIsOpen, balance = 0, reward = 0, name = '' }) => {
  return (
    <Modal title='Claim' popup={isOpen} setPopup={setIsOpen} width={391}>
      <p className='text-[15px] md:text-base md:leading-6 text-lightGray  w-full mt-1.5'>
        Claim your deposited balance from {name ?? 'Competition'} and your prize.
      </p>
      <div className='mt-3 md:mt-4'>
        <span className='text-base leading-[19px] md:leading-none md:text-[17px] text-lightGray'>Your deposited balance:</span>
        <div className='flex items-center space-x-1'>
          <img alt='' src='https://cdn.thena.fi/assets/USDT.png' className='md:w-5 w-[18px] h-[15px] md:h-5' />
          <p className='mt-0.5 text-xl  md:text-[22px] text-white leading-6 md:leading-[26px] font-semibold'>{balance}</p>
        </div>
      </div>
      <div className=' mt-3'>
        <span className='text-base leading-[19px] md:leading-none md:text-[17px] text-lightGray'>Your prize:</span>
        <div className='flex items-center space-x-1'>
          <img alt='' src='https://cdn.thena.fi/assets/USDT.png' className='md:w-5 w-[18px] h-[15px] md:h-5' />
          <p className='mt-0.5 text-xl  md:text-[22px] text-white leading-6 md:leading-[26px] font-semibold'>{reward}</p>
        </div>
      </div>
      <StyledButton
        onClickHandler={() => {
          setIsOpen(false)
        }}
        className='w-full mt-3 py-[15px] md:py-4'
        content='CLAIM NOW'
      />
    </Modal>
  )
}

export default ClaimModal

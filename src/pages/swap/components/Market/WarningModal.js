import React from 'react'
import { formatNumber } from 'utils/formatNumber'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'

const WarningModal = ({ isOpen, setIsOpen, onClickHandler, priceImpact }) => {
  return (
    <>
      <div
        onClick={() => {
          setIsOpen(false)
        }}
        className={`fixed ${
          isOpen ? 'visible z-[150] opacity-100' : 'z-0 invisible opacity-0'
        } inset-0 w-full h-full transition-all duration-300 ease-in-out bg-opacity-[0.5] bg-body`}
      />

      <div
        className={`${
          isOpen ? 'z-[151] visible opacity-100' : 'z-0 invisible opacity-0'
        } w-full inset-0 fixed transition-all duration-300 ease-in-out flex items-center min-h-screen justify-center flex-col paraent`}
      >
        <div className='max-w-[92%] sm:min-w-[425px] sm:max-w-[425px] md:min-w-[499.8px] md:max-w-[499.8px] mx-auto w-full rounded-[4.25px] gradient-bg p-px'>
          <div className='px-3 py-3 rounded-[4.25px] md:px-[20.4px] md:py-[17px] bg-[#360E12]'>
            <div className='text-center text-white text-[18.7px] lg:text-[22.95px] font-semibold font-figtree'>Are You Sure You Want To Swap?</div>
            <div className='mt-[10.2px] text-center text-lightGray text-[15px] md:text-[15.3px] font-medium'>
              <div>
                Your order will incur a <span className='text-[#CF3A41] font-bold'>{formatNumber(priceImpact)}% price impact</span>.
              </div>
              <div>Are you sure you want to continue?</div>
            </div>
            <div className='flex items-center mt-[17px] w-full space-x-[15.3px]'>
              <StyledButton
                onClickHandler={() => {
                  onClickHandler()
                  setIsOpen(false)
                }}
                content='Swap'
                className='py-[11.05px] w-1/2 px-[19.55px]'
              />
              <TransparentButton onClickHandler={() => setIsOpen(false)} content='CANCEL' className='py-[11.05px] px-[22.1px] w-1/2' isUpper />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WarningModal

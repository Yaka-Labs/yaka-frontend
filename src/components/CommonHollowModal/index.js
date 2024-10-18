import React from 'react'

const CommonHollowModal = ({ popup, setPopup, title, width = 499.8, children }) => {
  return (
    <>
      <div
        onClick={() => {
          setPopup(false)
        }}
        className={`fixed ${
          popup ? 'visible z-[150] opacity-100' : 'z-0 invisible opacity-0'
        } inset-0 w-full h-full transition-all duration-300 ease-in-out bg-opacity-[0.88]`}
      />

      <div
        className={`${
          popup ? 'z-[151] visible opacity-100' : 'z-0 invisible opacity-0'
        } w-full inset-0 fixed transition-all duration-300 ease-in-out flex items-center min-h-screen justify-center flex-col paraent`}
      >
        <div
          className={`max-w-[92%] ${width === 588 * 0.85 ? ' sm:min-w-[425px] sm:max-w-[425px] md:min-w-[499.8px] md:max-w-[499.8px]' : ''} ${
            width === 540 * 0.85 ? ' md:min-w-[459px] max-w-[459px]' : ''
          } mx-auto w-full rounded-[5px] gradient-bg p-px`}
        >
          <div className='popup-gradientbg px-3 py-3 rounded-[4.25px] md:px-[20.4px] md:py-[17px]'>
            <div className='flex items-center justify-between'>
              <p className='text-[0.9775rem] md:text-[22.95px] font-figtree text-white font-medium'>{title.replace(/WSEI/g, 'SEI')}</p>
              <button onClick={() => setPopup(false)} className='focus:outline-none'>
                <img alt='' src='/images/common/close-button1.svg' />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default CommonHollowModal

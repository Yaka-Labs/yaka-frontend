import React from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

let scale = 0.85
const Modal = ({
  popup,
  setPopup,
  title,
  isBack = false,
  setIsBack,
  width = 588*scale,
  isToken = false,
  disableOutside,
  children,
  height,
  isTransaction = false,
  className = '',
}) => {
  return (
    <>
      <div
        onClick={() => {
          setPopup(false)
        }}
        className={`fixed ${
          popup ? (isTransaction ? 'visible z-[202] opacity-100' : 'visible z-[200] opacity-100') : 'z-0 invisible opacity-0'
        } inset-0 w-full h-full transition-all duration-300 ease-in-out bg-opacity-[0.5] bg-body`}
      />

      <div
        className={`${
          popup ? (isTransaction ? 'z-[203] visible opacity-100' : 'z-[201] visible opacity-100') : 'z-0 invisible opacity-0'
        }  w-full h-[100vh] inset-0 fixed transition-all duration-300 ease-in-out flex items-center min-h-screen justify-center flex-col paraent`}
      >
        <OutsideClickHandler
          onOutsideClick={() => {
            if (!disableOutside) {
              setPopup(false)
            }
          }}
        >
          <div
            className={`max-w-[92%] ${className} ${width === 588*scale ? ' md:w-[499.8px] max-h-[90vh] overflow-y-auto' : ''} ${
              width === 460*scale ? ' md:w-[391px] max-h-[90vh] overflow-y-auto' : ''
            } ${width === 700*0.85 ? ' md:w-[595px] max-h-[90vh] overflow-y-auto' : ''}   ${width === 548*0.85 ? ' md:w-[465.8px]' : ''} ${
              width === 540*0.85 ? ' md:w-[459px]' : ''
            } ${!isToken ? 'px-3 md:px-6' : ''} ${
              height === 298*0.85 ? 'max-h-[253.3px] overflow-y-auto' : ''
            } mx-auto w-full py-3 md:py-[17px] rounded-lg border border-[#B51B27] rounded-[6.8px] tool-tip`}
          >
            <div className={`flex items-center justify-between${isToken ? ' px-3 md:px-[20.4px]' : ''}`}>
              <div className='flex items-center'>
                {isBack && (
                  <button
                    className='mr-[17px]'
                    onClick={() => {
                      setIsBack(false)
                    }}
                  >
                    <img alt='' src='/images/swap/back-arrow.svg' />
                  </button>
                )}
                {title && <p className='text-lg md:text-[18.7px] font-figtree text-white font-semibold'>{title}</p>}
              </div>
              <button onClick={() => setPopup(null)} className='focus:outline-none'>
                <img alt='' src='/images/common/close-button2.svg' />
              </button>
            </div>
            {children}
          </div>
        </OutsideClickHandler>
      </div>
    </>
  )
}

export default Modal

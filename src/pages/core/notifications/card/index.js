import React, { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

const Index = ({ children }) => {
  const [options, setOptions] = useState(false)

  return (
    <div className=' p-4 bg-cardBg   relative w-full mb-0.5'>
      <div className='flex items-center'>
        <div className='w-full'>{children}</div>
        <button className='p-2' onClick={() => setOptions(!options)}>
          <img alt='' src='/images/core/options.svg' />
        </button>
      </div>
      {options && (
        <OutsideClickHandler onOutsideClick={() => setOptions(false)}>
          {options && (
            <div className='absolute max-w-[200px] w-full z-10 bg-[#1A265E] px-4 py-3 rounded-[5px] -right-4 top-16  text-white leading-5 text-[15px] text-left'>
              <button className='transition-all duration-150 ease-in-out hover:opacity-70  mb-[0.2rem] flex items-center space-x-1.5'>
                <img alt='' src='/images/notifications/check.svg' />
                <span>Mark as read</span>
              </button>
              <button className='transition-all duration-150 ease-in-out hover:opacity-70 mb-2 '>Delete Notification</button>
              <button className='transition-all duration-150 ease-in-out hover:opacity-70  text-left text-white'>
                Stop receiving these kind of notifications
              </button>
            </div>
          )}
        </OutsideClickHandler>
      )}
    </div>
  )
}

export default Index

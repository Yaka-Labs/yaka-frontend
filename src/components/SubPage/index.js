import React from 'react'
import { useNavigate } from 'react-router-dom'

const SubPage = ({ title, children }) => {
  const navigate = useNavigate()

  return (
    <div className='w-full pt-[113.9px] pb-[95.2px] xl:pb-0 2xl:pb-[127.5px] px-[17px] xl:px-0 '>
      <div className='w-full max-w-[505.75px] gradient-bg p-px rounded-[4.25px] mx-auto relative'>
        <div className='w-full popup-gradientbg px-3 py-3 rounded-[4.25px] md:px-[20.4px] md:py-[17px]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <button
                className='mr-[8.5px] lg:mr-[20.4px]'
                onClick={() => {
                  navigate(-1)
                }}
              >
                <img className='w-[17px] lg:w-[22.1px]' alt='' src='/images/swap/back-arrow.svg' />
              </button>
              <p className='text-[18.7px] lg:text-[22.95px] font-figtree text-white font-semibold'>{title}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default SubPage

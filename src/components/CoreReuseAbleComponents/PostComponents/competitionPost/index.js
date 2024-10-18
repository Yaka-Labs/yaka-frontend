import React from 'react'
import './style.scss'
import StyledButton from 'components/Buttons/styledButton'
import TransparentButton from 'components/Buttons/transparentButton'

const Index = ({ data }) => {
  return (
    <div className='w-full'>
      <p dangerouslySetInnerHTML={{ __html: data.info }} className='text-white mt-5 mb-4 leading-5 px-5' id='paragraph-info' />
      <img alt='' src={data.postImg} className='w-full max-h-[428px] h-full object-cover object-center' />
      <div className='flex items-center justify-between px-5 mt-[15px] relative mb-[34px]'>
        <div>
          <p className='text-[22px] font-medium text-white font-figtree leading-7'>{data.title}</p>
          <div className='flex items-center space-x-3'>
            <p className='text-lightGray leading-5 mt-1'>{data.time}</p>
            <div className=' cursor-pointer text-[15px] uppercase font-medium text-lightGray leading-5 px-2 py-1 bg-white bg-opacity-[0.03] rounded-md'>
              {data.tradingType}
            </div>
          </div>
          <div className='flex items-center space-x-3.5 mt-4'>
            <div className='flex items-center space-x-[6.73px] border-r border-[#44476A] pr-3.5'>
              <img alt='' src='/images/core/participants.svg' />
              <div className='text-lightGray'>{data.members}</div>
            </div>
            <div className='flex items-center space-x-[6.73px] border-r border-[#44476A] pr-3.5'>
              <img alt='' src='/images/core/prize-pool.svg' />
              <div className='text-lightGray'>{data.money}</div>
            </div>
            <div className='flex items-center space-x-[6.73px]'>
              <img alt='' src={data.free ? '/images/core/blue-checkmark.svg' : '/images/core/fee.svg'} />
              <div className='text-lightGray'>{data.free ? 'Free To Join' : `${data.fee}`}</div>
            </div>
          </div>
        </div>
        <div className='flex flex-col space-y-3'>
          <StyledButton content='Join Now' className='py-[9px] px-4' isCap />
          <TransparentButton onClickHandler={() => {}} content='View' className='py-[9px] px-4' />
        </div>
      </div>
    </div>
  )
}

export default Index

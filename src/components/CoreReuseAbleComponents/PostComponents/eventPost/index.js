import React from 'react'
import './style.scss'
import TransparentButton from 'components/Buttons/transparentButton'

const Index = ({ data }) => {
  return (
    <div className='w-full'>
      <p dangerouslySetInnerHTML={{ __html: data.info }} className='text-white mt-5 mb-4 leading-5 px-5' id='paragraph-info' />
      <img alt='' src={data.postImg} className='w-full max-h-[428px] h-full object-cover object-center' />
      <div className='flex items-center justify-between px-5 mt-[15px] relative mb-[34px]'>
        <div>
          <p className='text-[22px] font-medium text-white font-figtree leading-7'>{data.title}</p>
          <p className='text-lightGray leading-5 mt-1'>{data.time}</p>
          <div className='flex items-center space-x-3.5 mt-4'>
            <div className='flex items-center space-x-[6.73px] border-r border-[#44476A] pr-3.5'>
              <img alt='' src='/images/core/participants.svg' />
              <div className='text-lightGray'>{data.members}</div>
            </div>
            <div className='flex items-center space-x-[6.73px] border-r border-[#44476A] pr-3.5'>
              <img alt='' src='/images/core/hourglass.svg' />
              <div className='text-lightGray'>{data.duration}</div>
            </div>
            <a
              href={data.locationLink}
              target='__blank'
              className='flex items-center space-x-[6.73px] hover:text-green text-lightGray transition-all duration-200 ease-in-out'
            >
              <img alt='' src='/images/core/location.svg' />
              <div>{data.location}</div>
            </a>
          </div>
        </div>
        <div className='flex flex-col space-y-3'>
          <TransparentButton
            onClickHandler={(e) => {
              e.stopPropagation()
            }}
            content='Attend'
            className='w-[112px] px-4 py-[9px]'
          />
          <TransparentButton
            onClickHandler={() => {
              //   dispatch(addCompetitionData(item))
              //   route(`/core/competition/${item.name.trim().replaceAll(' ', '-').toLowerCase()}`)
            }}
            content='View'
            className='w-[112px] px-4 py-[9px]'
          />
        </div>
      </div>
    </div>
  )
}

export default Index

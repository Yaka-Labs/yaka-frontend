import React from 'react'
import { useDispatch } from 'react-redux'
import { getChip } from 'utils'
import StyledButton from 'components/Buttons/styledButton'
import TransparentButton from 'components/Buttons/transparentButton'
import { addEventsData } from 'state/application/actions'
import Details from '../eventDetails'

const Index = ({ mainData, setCreateEventComponent, setCreateEvent }) => {
  const dispatch = useDispatch()

  return (
    <div className='absolute inset-0 top-[94px] '>
      <div onClick={() => dispatch(addEventsData({}))} className='z-40 bg-opacity-[0.88] bg-body fixed inset-0 w-full h-full' />
      <div className='w-full z-[100] relative mx-auto max-w-[1104px]'>
        <div className='max-w-[324px] sticky top-[94px] bg-[#101645] w-full px-5 py-4 rounded-[3px]'>
          <p className='leading-[33px] text-[27px] font-figtree text-white font-semibold'>Create Event?</p>
          <p className='text-lightGray text-base leading-[22px] mt-2 mb-3'>Once you create event you can make changes later.</p>
          <StyledButton content='CREATE' className='w-full py-[15.75px]' />
          <TransparentButton
            onClickHandler={() => {
              setCreateEventComponent('SPEAKERS & HOST')
              setCreateEvent(true)
              dispatch(addEventsData({}))
            }}
            content='BACK'
            className='w-full py-[15.75px] mt-3'
            isUpper
          />
        </div>
        <div className='flex justify-end -mt-[247px] pb-10'>
          <Details modal getChip={getChip} data={mainData} />
        </div>
      </div>
    </div>
  )
}

export default Index

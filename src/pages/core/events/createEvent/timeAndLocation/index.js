import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import LabelTooltip from 'components/TooltipLabelComponent'
import SearchInput from 'components/Input/SearchInput'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'

const Index = ({ setFormData, formData, suggestions, setEventName, checkIfTabIsEnabled }) => {
  const durations = [10, 15, 20, 25, 30, 35, 40, 45, 60]
  const [durationBol, setDurationBol] = useState(false)
  const [durationValue, setDurationValue] = useState()

  return (
    <>
      <p className='leading-7 text-[22px] text-white font-figtree font-semibold mt-5'>Date and Time</p>
      <div className='flex items-center space-x-6 mt-4 w-full'>
        <div className='w-full max-w-[314px]'>
          <LabelTooltip
            tooltipID='startDate'
            label='Start Date'
            tooltipDescription='Select the start date and time for your event. This is when the show starts!'
          />
          <div className=' border border-blue w-full rounded-[3px] mt-2'>
            <div className='bg-body flex items-center px-2.5 h-[48px] md:h-[52px] rounded-[3px]'>
              <img alt='' className='w-[32px] lg:w-[40px] h-[32px] lg:h-[40px]' src='/images/common/calendar.svg' />
              <DatePicker
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e })
                }}
                selected={formData.startDate}
                className='bg-transparent focus:outline-none w-full pl-[6px] text-lg leading-10 placeholder-[#757384] text-white font-light'
                dateFormat='yyyy/MM/dd'
              />
            </div>
          </div>
        </div>
        <div className='w-full max-w-[314px]'>
          <LabelTooltip
            tooltipID='startTime'
            label='Start Time (UTC)'
            tooltipDescription='Select the start date and time for your event. This is when the show starts!'
          />
          <div className=' border border-blue w-full rounded-[3px] mt-2'>
            <div className='bg-body flex items-center px-2.5 h-[48px] md:h-[52px] rounded-[3px]'>
              <img alt='' className='w-[32px] lg:w-[40px] h-[32px] lg:h-[40px]' src='/images/svgs/clock.svg' />
              <input
                onChange={(e) => {
                  setFormData({ ...formData, startTime: e.target.value })
                }}
                value={formData.startTime}
                type='time'
                className='bg-transparent focus:outline-none w-full pl-[6px] text-lg leading-10 placeholder-[#757384] text-white font-light'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='w-full max-w-[314px] mt-[18px]'>
        <LabelTooltip
          tooltipID='duration'
          label='Duration (optional)'
          tooltipDescription='Select the start date and time for your event. This is when the show starts!'
        />
        <div
          onClick={() => setDurationBol(!durationBol)}
          className={` border cursor-pointer border-blue w-full rounded-[3px] flex flex-col items-center justify-center  mt-2  overflow-auto ${
            durationBol ? ' h-auto' : 'h-[48px] md:h-[52px]'
          }`}
        >
          <div className='bg-body flex items-start justify-between w-full px-2.5 py-4   rounded-[3px] relative text-lg h-full leading-5 text-white'>
            <div className='w-full flex flex-col space-y-2.5'>
              {!durationBol ? <p>{durationValue ? durationValue + ' min' : 'Select'}</p> : <p>Select</p>}
              {durationBol &&
                durations.map((item, idx) => {
                  return (
                    <p onClick={() => setDurationValue(item)} key={idx}>
                      {item} min
                    </p>
                  )
                })}
            </div>
            <img className='mt-1' alt='' src='/images/svgs/dropdown.svg' />
          </div>
        </div>
      </div>
      <p className='leading-7 text-[22px] text-white font-figtree font-semibold mt-5'>Location</p>

      <LabelTooltip className='mt-4' tooltipID='locationLink' label='Suggestions' tooltipDescription='suggestions' />
      <div className='flex items-center mt-2 space-x-3'>
        {suggestions.map((item, idx) => {
          return (
            <div
              key={idx}
              onClick={() => {
                setFormData({ ...formData, eventLocation: item.link, eventLocationName: item.name })
              }}
              className={`${
                formData.eventLocationName === item.name ? ' bg-blue' : 'bg-white bg-opacity-[0.04]'
              } cursor-pointer px-4 py-1.5 font-figtree leading-[19px] text-white font-medium rounded-full`}
            >
              {item.name}
            </div>
          )
        })}
      </div>
      <div className='w-full mt-[18px]'>
        <LabelTooltip tooltipID='locationLink' label='Event Location Link' tooltipDescription='Example tooltip' />
        <SearchInput
          max={32}
          searchText={formData.eventLocation}
          setSearchText={(e) => {
            setFormData({ ...formData, eventLocation: e })
          }}
          disableSearchIcon
          full
          className='mt-2'
        />
      </div>
      <div className='w-full mt-[18px]'>
        <LabelTooltip tooltipID='locationName' label='Location Name (optional)' tooltipDescription='Example tooltip' />
        <SearchInput
          max={32}
          searchText={formData.eventLocationName}
          setSearchText={(e) => {
            setFormData({ ...formData, eventLocationName: e })
          }}
          disableSearchIcon
          full
          className='mt-2'
        />
      </div>
      <div className='flex items-center justify-center w-full space-x-5 mt-6'>
        <TransparentButton content='BACK' onClickHandler={() => setEventName('DETAILS')} className='px-16 py-3' />
        <StyledButton
          onClickHandler={() => {
            setEventName('SPEAKERS & HOST')
          }}
          disabled={!checkIfTabIsEnabled('SPEAKERS & HOST')}
          content='NEXT'
          className='py-3 px-16'
          isUpper
        />
      </div>
    </>
  )
}

export default Index

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getChip } from 'utils'
import Details from './eventDetails'

const EventDetail = ({ setDetail }) => {
  const mainData = useSelector((state) => state.application.eventsData)

  useEffect(() => {
    setDetail(mainData)
  }, [mainData])

  return (
    mainData && (
      <div className='w-full  2xl:max-w-full'>
        <Details getChip={getChip} data={mainData} />
      </div>
    )
  )
}

export default EventDetail

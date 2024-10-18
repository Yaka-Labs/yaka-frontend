import { EVENT_TYPES } from 'config/constants/core'
import React from 'react'

const getChipFromEvent = (val) => {
  switch (val) {
    case EVENT_TYPES.LIVE:
      return 'bg-success text-success'
    case EVENT_TYPES.ENDED:
      return 'bg-error text-error'
    case EVENT_TYPES.UPCOMING:
      return 'bg-info text-info'
    default:
      return 'bg-white text-[#CFCCE6]'
  }
}

const EventChip = ({ value }) => (
  <div className={`px-2 py-1 leading-5 text-[15px] font-semibold w-fit rounded-md bg-opacity-10 ${getChipFromEvent(value)}`}>{value}</div>
)

export default EventChip

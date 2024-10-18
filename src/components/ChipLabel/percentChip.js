import React from 'react'
import { formatNumber } from 'utils/formatNumber'

const PercentChip = ({ value }) => (
  <div
    className={`px-2 py-1 leading-5 text-[15px] table rounded-md bg-opacity-10 ${
      value > 0 ? 'bg-[#51B961] text-[#51B961]' : value < 0 ? 'bg-[#ED00DB] text-[#ED00DB]' : 'text-white bg-white'
    }`}
  >
    {value > 0 ? '+' : value < 0 ? '-' : ''}
    {formatNumber(Math.abs(value))}%
  </div>
)

export default PercentChip

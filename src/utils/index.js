import { EVENT_TYPES } from 'config/constants/core'

export const getLibrary = (provider = null) => provider

export const getChip = (e) => {
  switch (e) {
    case 'LIVE':
    case 'APPROVED':
      return 'bg-success text-success'
    case 'ENDED':
      return 'bg-error text-error'
    case 'UPCOMING':
    case 'ACTIVE':
      return 'bg-info text-info'
    case 'ARCHIVED':
      return 'bg-white text-[#CFCCE6]'
    default:
      return ''
  }
}

export const getEventType = (detail) => {
  const currentTimStamp = Date.now() / 1000
  let event = ''
  if (detail?.startTimestamp > currentTimStamp) {
    event = EVENT_TYPES.UPCOMING
  } else if (currentTimStamp < detail?.endTimestamp) {
    event = EVENT_TYPES.LIVE
  } else {
    event = EVENT_TYPES.ENDED
  }
  return event
}

export const convertNumber = (number) => {
  return number
    .toString()
    .split(/(?=(?:\d{3})+(?:\.|$))/g)
    .join(',')
}

export const numFormater = (numStr, dec = 18, fixed = 3) => {
  if (numStr.length <= dec) {
    let paddingLength = dec - numStr.length
    let paddingZeros = '0'.repeat(paddingLength)
    return parseFloat('0.' + paddingZeros + numStr).toFixed(fixed)
  } else {
    let decimalPosition = numStr.length - dec
    let wholePart = numStr.substring(0, decimalPosition)
    let decimalPart = numStr.substring(decimalPosition)
    return parseFloat(wholePart + '.' + decimalPart).toFixed(fixed)
  }
}

export const checkIfZeroAfterDecimal = (value) => {
  let array = value.split('.')
  if (array[1].includes('00')) return array[0]
  return value
}

export const sliceAddress = (string) => {
  return `${string.slice(0, 6)}...${string.slice(-4)}`
}

export const convertTimestamp = (timeStamp) => {
  const date = new Date(timeStamp * 1000)
  return date
}

export const ordinals = (n) => {
  return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th'
}

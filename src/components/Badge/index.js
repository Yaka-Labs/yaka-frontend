import React, { useMemo } from 'react'
import { BADGE_TYPES } from 'config/constants/core'

const Badge = ({ type, children }) => {
  const style = useMemo(() => {
    switch (type) {
      case BADGE_TYPES.SUCCESS:
        return 'bg-success text-success'
      case BADGE_TYPES.ERROR:
        return 'bg-error text-error'
      case BADGE_TYPES.INFO:
        return 'bg-info text-info'
      default:
        return 'bg-white text-white'
    }
  }, [type])

  return <div className={`px-2 py-1 leading-5 text-[13px] lg:text-[15px] tracking-[0.78px] w-fit rounded-md bg-opacity-10 ${style}`}>{children}</div>
}

export default Badge

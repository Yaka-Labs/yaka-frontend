import moment from 'moment'
import React, { useState, useEffect } from 'react'

const Timer = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = moment().utc()
      const distance = targetTime - now

      if (distance < 0) {
        clearInterval(timerId)
        setTimeLeft(0)
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timerId)
  }, [targetTime])

  if (timeLeft === null) {
    return <span>Countdown is running...</span>
  } else if (timeLeft === 0) {
    return <span>Time is up!</span>
  }

  return (
    <span>
      {timeLeft.hours} hours {timeLeft.minutes} minutes {timeLeft.seconds} seconds
    </span>
  )
}

export default Timer

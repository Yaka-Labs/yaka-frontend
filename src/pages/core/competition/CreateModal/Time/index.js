import React, { useEffect, useMemo } from 'react'
import LabelTooltip from 'components/TooltipLabelComponent'
import { TC_TIMESTAMP, TC_PARTICIPANTS } from 'config/constants/core'
import DateTimeInput from 'components/Input/DateTimeInput'

const { MIN_REG, MAX_REG, MIN_TS, MAX_TS } = TC_TIMESTAMP

const getIsoString = (timestamp) => {
  const curTimeStamp = new Date().getTime()
  const finalTS = (timestamp || curTimeStamp) - (new Date().getTimezoneOffset() / 60) * 3600 * 1000
  const finalDate = new Date(finalTS)
  return finalDate.toISOString().slice(0, new Date().toISOString().lastIndexOf(':'))
}

const Time = ({ data, setData }) => {
  const regStartTime = useMemo(() => {
    return getIsoString(data.timestamp.registrationStart)
  }, [data.timestamp.registrationStart])

  const regEndTime = useMemo(() => {
    return getIsoString(data.timestamp.registrationEnd)
  }, [data.timestamp.registrationEnd])

  const tsStartTime = useMemo(() => {
    return getIsoString(data.timestamp.startTimestamp)
  }, [data.timestamp.startTimestamp])

  const tsEndTime = useMemo(() => {
    return getIsoString(data.timestamp.endTimestamp)
  }, [data.timestamp.endTimestamp])

  const minReg = useMemo(() => {
    const minTimestamp = new Date(regStartTime).getTime() + MIN_REG
    if (new Date(regEndTime).getTime() < minTimestamp) {
      setData({
        ...data,
        timestamp: {
          ...data.timestamp,
          registrationEnd: minTimestamp,
        },
      })
    }
    return getIsoString(minTimestamp)
  }, [regStartTime])

  const maxReg = useMemo(() => {
    const maxTimestamp = new Date(regStartTime).getTime() + MAX_REG
    if (new Date(regEndTime).getTime() > maxTimestamp) {
      setData({
        ...data,
        timestamp: {
          ...data.timestamp,
          registrationEnd: maxTimestamp,
        },
      })
    }
    return getIsoString(maxTimestamp)
  }, [regStartTime])

  const minTs = useMemo(() => {
    const minTimestamp = new Date(tsStartTime).getTime() + MIN_TS
    if (new Date(tsEndTime).getTime() < minTimestamp) {
      setData({
        ...data,
        timestamp: {
          ...data.timestamp,
          endTimestamp: minTimestamp,
        },
      })
    }
    return getIsoString(minTimestamp)
  }, [tsStartTime])

  const maxTs = useMemo(() => {
    const maxTimestamp = new Date(tsStartTime).getTime() + MAX_TS
    if (new Date(tsEndTime).getTime() > maxTimestamp) {
      setData({
        ...data,
        timestamp: {
          ...data.timestamp,
          endTimestamp: maxTimestamp,
        },
      })
    }
    return getIsoString(maxTimestamp)
  }, [tsStartTime])

  const handleParticipants = (val) => {
    const res = Math.min(Math.max(TC_PARTICIPANTS.MIN, val), TC_PARTICIPANTS.MAX)
    setData({
      ...data,
      maxParticipants: res,
    })
  }

  useEffect(() => {
    if (new Date(tsStartTime).getTime() < new Date(regEndTime).getTime()) {
      setData({
        ...data,
        timestamp: {
          ...data.timestamp,
          startTimestamp: new Date(regEndTime).getTime(),
        },
      })
    }
  }, [regEndTime, tsStartTime])

  return (
    <>
      <div className='w-full'>
        <LabelTooltip
          tooltipID='maxParticipants'
          label='Max Participants'
          tooltipDescription='Select how many participants you would like to have in your trading competition.'
        />
        <div className='relative md:max-w-[314px] border border-blue w-full rounded-[3px] mt-1.5 md:mt-2'>
          <input
            type='number'
            max={TC_PARTICIPANTS.MAX}
            min={TC_PARTICIPANTS.MIN}
            value={data.maxParticipants}
            onChange={(e) => {
              handleParticipants(parseInt(e.target.value))
            }}
            className='w-full bg-body focus:outline-none placeholder-[#757384] h-[42px] lg:h-[52px] text-white text-base pl-4 py-[18px] rounded-[3px]'
          />
          <div className='flex items-center space-x-3 absolute right-3 top-2.5'>
            <button
              onClick={() => {
                handleParticipants(data.maxParticipants - 1)
              }}
              disabled={data.maxParticipants <= TC_PARTICIPANTS.MIN}
              className='bg-white disabled:cursor-not-allowed disabled:bg-opacity-[0.02] bg-opacity-[0.05] w-8 h-8 flex flex-col items-center justify-center rounded-[3px]'
            >
              <img src='/images/svgs/minus.svg' alt='minus icon' />
            </button>
            <button
              onClick={() => {
                handleParticipants(data.maxParticipants + 1)
              }}
              disabled={data.maxParticipants >= TC_PARTICIPANTS.MAX}
              className='bg-white disabled:cursor-not-allowed disabled:bg-opacity-[0.02] bg-opacity-[0.05] w-8 h-8 flex flex-col items-center justify-center rounded-[3px]'
            >
              <img src='/images/svgs/plus.svg' alt='plus icon' />
            </button>
          </div>
        </div>
      </div>
      <div className='md:flex items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-5 w-full'>
        <DateTimeInput
          label='Registration Start Time'
          value={regStartTime}
          onChange={(e) => {
            const newDate = new Date(e.target.value).getTime()
            const curDate = new Date().getTime()
            const res = Math.max(newDate, curDate)
            setData({
              ...data,
              timestamp: {
                ...data.timestamp,
                registrationStart: res,
              },
            })
          }}
          min={getIsoString()}
        />
        <DateTimeInput
          label='Registration End Time'
          value={regEndTime}
          onChange={(e) => {
            const newDate = new Date(e.target.value).getTime()
            const minDate = new Date(minReg).getTime()
            const maxDate = new Date(maxReg).getTime()
            const res = Math.min(Math.max(newDate, minDate), maxDate)
            setData({
              ...data,
              timestamp: {
                ...data.timestamp,
                registrationEnd: res,
              },
            })
          }}
          min={minReg}
          max={maxReg}
        />
      </div>
      <div className='md:flex items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-5 w-full'>
        <DateTimeInput
          label='Competition Start Time'
          value={tsStartTime}
          onChange={(e) => {
            const newDate = new Date(e.target.value).getTime()
            const curDate = new Date().getTime()
            const res = Math.max(newDate, curDate)
            setData({
              ...data,
              timestamp: {
                ...data.timestamp,
                startTimestamp: res,
              },
            })
          }}
          min={regEndTime}
        />
        <DateTimeInput
          label='Competition End Time'
          value={tsEndTime}
          onChange={(e) => {
            const newDate = new Date(e.target.value).getTime()
            const minDate = new Date(minTs).getTime()
            const maxDate = new Date(maxTs).getTime()
            const res = Math.min(Math.max(newDate, minDate), maxDate)
            setData({
              ...data,
              timestamp: {
                ...data.timestamp,
                endTimestamp: res,
              },
            })
          }}
          min={minTs}
          max={maxTs}
        />
      </div>
    </>
  )
}

export default Time

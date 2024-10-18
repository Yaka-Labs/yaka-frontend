import React, { useState, useEffect, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { formatNumber, isInvalidAmount } from 'utils/formatNumber'
import { useIncreaseAmount, useIncreaseDuration } from 'hooks/useLock'
import { customNotify } from 'utils/notify'
import { PERIOD_LEVELS } from 'config/constants'
import StyledButton from 'components/Buttons/styledButton'
import BalanceInput from 'components/Input/BalanceInput'
import YAKAICON from 'img/YAKA.png'

const week = 86400 * 7 * 1000
const minTimeStamp = 86400 * 14 * 1000
const maxTimeStamp = 86400 * 730 * 1000
const maxDate = new Date(Math.floor((new Date().getTime() + maxTimeStamp) / week) * week)

const ManageTab = ({ selected, theAsset }) => {
  const [amount, setAmount] = useState('')
  const [periodLevel, setPeriodLevel] = useState(0)

  const minDate = useMemo(() => {
    return new Date(selected.lockEnd * 1000 + minTimeStamp)
  }, [selected])
  const [selectedDate, setSelectedDate] = useState(minDate)

  const votingPower = useMemo(() => {
    return selected.amount.times(selectedDate.getTime() - new Date().getTime()).div(maxTimeStamp)
  }, [selected, selectedDate])

  const unlockTime = useMemo(() => {
    return moment(selectedDate).diff(moment(), 'seconds')
  }, [selectedDate])

  const { onIncreaseAmount, pending: amountPending } = useIncreaseAmount()
  const { onIncreaseDuration, pending: durationPending } = useIncreaseDuration()

  const errorMsg = useMemo(() => {
    if (isInvalidAmount(amount)) {
      return 'Enter an amount'
    }
    if (!theAsset || theAsset.balance.lt(amount)) {
      return 'Insufficient balance'
    }
    return null
  }, [amount, theAsset])

  useEffect(() => {
    let timestamp = 0
    if (periodLevel < 0) return
    switch (periodLevel) {
      case 0:
        timestamp = minTimeStamp
        break
      case 1:
        timestamp = 3600 * 24 * (30 * 6) * 1000
        break
      case 2:
        timestamp = 3600 * 24 * 364 * 1000
        break
      case 3:
        timestamp = maxTimeStamp
        break

      default:
        break
    }
    let period
    if (periodLevel === 3) {
      period = new Date().getTime() + timestamp
    } else {
      period = selected.lockEnd * 1000 + timestamp
    }
    const date = new Date(Math.min(Math.floor(period / week) * week, maxDate))
    setSelectedDate(date)
  }, [periodLevel, selected])

  return (
    <div className='mt-[17ppx]'>
      <BalanceInput title='Amount' inputAmount={amount} setInputAmount={setAmount} symbol='YAKA' balance={theAsset?.balance} logoURIs={[YAKAICON]} />
      <StyledButton
        disabled={errorMsg || amountPending}
        pending={amountPending}
        onClickHandler={() => {
          if (errorMsg) {
            customNotify(errorMsg, 'warn')
            return
          }
          onIncreaseAmount(selected.id, amount)
        }}
        content={errorMsg || 'INCREASE LOCK AMOUNT'}
        className='py-[11.05px] mt-[13.6] w-full'
      />
      <p className='mt-[20.4px] text-white text-[13.6px] md:text-[15.3px]'>Lock Until</p>
      <div className='gradient-bg mt-[5.1px] md:mt-[8.5px] p-px w-full rounded-[3px]'>
        <div className='flex items-center px-[8.5px] h-[40.8px] md:h-[52.7px] rounded-[3px]'>
          <img alt='' className='w-[27.2px] lg:w-[34px] h-[27.2px] lg:h-[34px]' src='/images/common/calendar.svg' />
          <DatePicker
            className='bg-transparent w-full pl-[5.1px] text-[17px] lg:text-[20.4px] leading-[34px] placeholder-[#757384] text-white font-light'
            selected={selectedDate}
            dateFormat='yyyy/MM/dd'
            onChange={(date) => {
              if (periodLevel >= 0) {
                setPeriodLevel(-1)
              }
              if (date.getTime() === selectedDate.getTime()) {
                return
              }
              setSelectedDate(new Date(Math.floor(date.getTime() / week) * week))
            }}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      </div>
      <div className='mt-[13.6px] grid grid-cols-2 md:grid-cols-4 gap-[9.35px] text-white text-[11.9px] lg:text-[13.6px] font-semibold'>
        {PERIOD_LEVELS.map((level, index) => {
          if (level.value === periodLevel) {
            return (
              <div
                className='h-[34px] gradient-bg-selected rounded-[3px] flex items-center justify-center cursor-pointer font-medium'
                key={`level-${index}`}
                onClick={() => setPeriodLevel(level.value)}
              >
                {level.label}
              </div>
            )
          } else {
            return (
              <div
                className='h-[34px] gradient-bg rounded-[3px] flex items-center justify-center cursor-pointer border border-blue font-light'
                key={`level-${index}`}
                onClick={() => setPeriodLevel(level.value)}
              >
                {level.label}
              </div>
            )
          }
        })}
      </div>
      <div className='my-[10.2px] lg:my-[17px] flex items-center justify-between'>
        <span className='text-[13.6px] lg:text-[15.3px] text-white font-light'>New veYAKA Voting Power:</span>
        <div className='flex space-x-2'>
          <span className='text-[15.3px] lg:text-[18.7px] text-white font-medium'>{formatNumber(votingPower)}</span>
          <span className='text-[15.3px] lg:text-[18.7px] text-secondary font-light'>{`(+${formatNumber(votingPower.minus(selected.voting_amount))})`}</span>
        </div>
      </div>
      <StyledButton
        disabled={durationPending}
        pending={durationPending}
        onClickHandler={() => {
          if (unlockTime === 0) {
            customNotify('Already Max Locked', 'warn')
            return
          }
          onIncreaseDuration(selected.id, unlockTime)
        }}
        content='EXTEND DURATION'
        className='py-[11.05px] mt-[13.6px] w-full'
      />
    </div>
  )
}

export default ManageTab

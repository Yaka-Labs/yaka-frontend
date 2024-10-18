import React, { useState, useEffect, useMemo, useCallback } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import BalanceInput from 'components/Input/BalanceInput'
import StyledButton from 'components/Buttons/styledButton'
import { formatNumber, isInvalidAmount } from 'utils/formatNumber'
import CommonHollowModal from 'components/CommonHollowModal'
import { useCreateLock } from 'hooks/useLock'
import { customNotify } from 'utils/notify'
import { PERIOD_LEVELS } from 'config/constants'
import YAKAICON from 'img/YAKA.png'

const week = 86400 * 7 * 1000

const minTimeStamp = 86400 * 14 * 1000
const maxTimeStamp = 86400 * 728 * 1000
const minDate = new Date(Math.floor((new Date().getTime() + minTimeStamp) / week) * week)
const maxDate = new Date(Math.floor((new Date().getTime() + maxTimeStamp) / week) * week)

const CreateModal = ({ isOpen, setIsOpen, theAsset }) => {
  const [amount, setAmount] = useState('')
  const [selectedDate, setSelectedDate] = useState(minDate)
  const [periodLevel, setPeriodLevel] = useState(0)
  const unlockTime = useMemo(() => {
    return moment(selectedDate).diff(moment(), 'seconds')
  }, [selectedDate])
  const { onCreateLock, pending } = useCreateLock(amount, selectedDate)

  const errorMsg = useMemo(() => {
    if (isInvalidAmount(amount)) {
      return 'Enter an amount'
    }
    if (!theAsset || theAsset.balance.lt(amount)) {
      return 'Insufficient balance'
    }
    return null
  }, [amount, theAsset])

  const votingPower = useMemo(() => {
    if (amount && amount > 0) {
      return formatNumber((amount * unlockTime) / (86400 * 365 * 2))
    } else {
      return '-'
    }
  }, [amount, unlockTime])

  useEffect(() => {
    let timestamp = 0
    if (periodLevel < 0) return
    switch (periodLevel) {
      case 0:
        timestamp = minTimeStamp
        break
      case 1:
        timestamp = 86400 * 180 * 1000
        break
      case 2:
        timestamp = 86400 * 364 * 1000
        break
      case 3:
        timestamp = 86400 * 730 * 1000
        break

      default:
        break
    }
    const date = new Date(Math.floor((new Date().getTime() + timestamp) / week) * week)
    setSelectedDate(date)
  }, [periodLevel])

  const onCreate = useCallback(() => {
    if (errorMsg) {
      customNotify(errorMsg, 'warn')
      return
    }
    onCreateLock(amount, unlockTime)
  }, [amount, unlockTime, errorMsg])

  return (
    <CommonHollowModal popup={isOpen} width={499.8} setPopup={setIsOpen} title='Create New Lock'>
      <div className='mt-[17px]'>
        <BalanceInput title='Amount' inputAmount={amount} setInputAmount={setAmount} symbol='YAKA' balance={theAsset?.balance} logoURIs={[YAKAICON]} />
        <p className='mt-[20.4px] text-white text-[11.9px] md:text-[15.3px]'>Lock Until</p>
        <div className='gradient-bg mt-[5.1px] md:mt-[8.5px] p-px w-full rounded-[3px]'>
          <div className=' flex items-center px-[8.5px] h-[40.8px] lg:h-[52.7px] rounded-[3px]'>
            <img alt='' className='w-[27.2px] h-[27.2px]' src='/images/common/calendar.svg' />
            <DatePicker
              className='bg-transparent w-full pl-[5.1px] text-[17px] lg:text-[20.4px] leading-[34px] placeholder-[#757384] text-white font-light '
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
        <div className='mt-[13.6px] grid grid-cols-2 md:grid-cols-4 gap-[9.35px] text-white text-[11.9px] lg:text-[13.6px]'>
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
          <span className='text-[13.6px] lg:text-[15.3px] text-white font-light'>veYAKA Voting Power:</span>
          <span className='text-[15.3px] lg:text-[18.7px] text-white font-medium'>{votingPower}</span>
        </div>
        <StyledButton
          disabled={errorMsg || pending}
          pending={pending}
          onClickHandler={onCreate}
          content={errorMsg || 'LOCK'}
          className='py-[11.05px] mt-[13.6px] w-full'
        />
      </div>
    </CommonHollowModal>
  )
}

export default CreateModal

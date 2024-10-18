import React, { useMemo } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import TransparentButton from 'components/Buttons/transparentButton'
import EventChip from 'components/ChipLabel/eventChip'
import { EVENT_TYPES } from 'config/constants/core'
import { sliceAddress, convertTimestamp, getEventType } from 'utils'
import { formatNumber, fromWei } from 'utils/formatNumber'
import TCButtion from '../TCButtion'

const Card = ({ item }) => {
  const navigate = useNavigate()

  const {
    entryFee,
    prize: { token: prizeToken },
    competitionRules: { winningToken },
  } = item

  const eventType = useMemo(() => {
    return getEventType(item.timestamp)
  }, [item])

  return (
    <div
      className='p-3 rounded-[5px] bg-[#101645] w-full mt-4 lg:mt-6 lg:flex-row flex flex-col space-y-2.5 lg:space-y-0 lg:space-x-3.5'
      key={item.tradingCompetition}
    >
      <div className='max-w-[360px] h-[203px] w-full relative rounded-[5px]'>
        {item.img ? (
          <img alt='' src={item.img && item.img} className='w-full h-full rounded-[5px]' />
        ) : (
          <div className='w-full h-full rounded-[5px] flex flex-col items-center justify-center bg-body'>
            <div className='text-2xl text-white f-f-fb mb-11'>
              <div>COMPETE FOR</div>
              <div className='flex items-center justify-center space-x-2'>
                <span>
                  {formatNumber(fromWei(item.prize.totalPrize, prizeToken.decimals))} {prizeToken.symbol}
                </span>
                <img alt='' src={prizeToken.logoURI} className='w-6 h-6' />
              </div>
            </div>
          </div>
        )}
        <div className='py-2 lg:py-2.5 bg-[#000076] w-full absolute bottom-0 z-10 text-white text-sm lg:text-base text-center rounded-b-[5px]'>
          {moment(convertTimestamp(item.timestamp.startTimestamp)).format('lll')}
        </div>
      </div>
      <div className='lg:flex items-start justify-between w-full relative'>
        <div className='flex flex-col items-start justify-between h-full'>
          <div className='flex items-start justify-between'>
            <div>
              <div className='max-w-[300px]'>
                <span className='text-white text-xl lg:text-[22px] font-figtree font-medium'>{item.name}</span>
              </div>
              <div className='flex items-center space-x-[11px] mt-[8.3px]'>
                <EventChip value={eventType} />
                <EventChip value={item.market} />
              </div>
              <div className='flex items-center space-x-1.5 mt-[8.3px]'>
                <img alt='' src={item.profilePic ? item.profilePic : '/images/settings/placeholderProfilePic.svg'} className='w-7 h-7 rounded-full' />
                <span className='text-white text-sm lg:text-base font-figtree'>{sliceAddress(item.owner.id)}</span>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-[9px] lg:space-x-3.5 mt-3.5 lg:mt-0'>
            <div className='flex items-center space-x-1 text-sm lg:text-base lg:space-x-[6.73px] border-r border-[#44476A] pr-[9px] lg:pr-3.5'>
              <img alt='' src='/images/core/participants.svg' />
              <div className='text-lightGray'>
                {[EVENT_TYPES.LIVE, EVENT_TYPES.ENDED].includes(eventType) ? item.participantCount : `${item.participantCount} / ${item.maxParticipants}`}
              </div>
            </div>
            <div className='flex items-center space-x-1 text-sm lg:text-base lg:space-x-[6.73px] border-r border-[#44476A] pr-[9px] lg:pr-3.5'>
              <img alt='' src='/images/core/prize-pool.svg' />
              <div className='text-lightGray'>{formatNumber(fromWei(item.prize.totalPrize, prizeToken.decimals))}</div>
              <div className='text-lightGray'>{prizeToken.symbol}</div>
              <img alt='' src={prizeToken.logoURI} className='w-6 h-6' />
            </div>
            <div className='flex items-center space-x-1 text-sm lg:text-base lg:space-x-[6.73px]'>
              <img alt='' src={fromWei(entryFee).isZero() ? '/images/core/blue-checkmark.svg' : '/images/core/fee.svg'} />
              <div className='text-lightGray'>
                {fromWei(entryFee).isZero() ? (
                  'Free To Join'
                ) : (
                  <div className='flex items-center space-x-1.5'>
                    <div className='text-lightGray'>{formatNumber(fromWei(item.entryFee, winningToken.decimals))}</div>
                    <img alt='' src={winningToken.logoURI} className='w-6 h-6' />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex-row-reverse flex lg:flex-col w-full lg:w-auto lg:space-y-3 lg:absolute mt-4 lg:mt-0 right-0'>
          <TCButtion item={item} />
          <TransparentButton
            onClickHandler={() => {
              navigate(`/core/comps/${item.id.toLowerCase()}`)
            }}
            content='View'
            className='py-[9px] w-full lg:w-auto px-4'
          />
        </div>
      </div>
    </div>
  )
}

export default Card

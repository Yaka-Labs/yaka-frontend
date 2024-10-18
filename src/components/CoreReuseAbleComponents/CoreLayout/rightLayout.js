import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { squidClient } from 'apollo/client'
import { LEADERBOARD } from 'apollo/coreQueries'
import JoinModal from 'pages/core/competition/JoinModal'
import ClaimModal from 'pages/core/competition/ClaimModal'
import TCButtion from 'pages/core/competition/TCButtion'
import { convertNumber, getEventType, sliceAddress } from 'utils'
import { EVENT_TYPES } from 'config/constants/core'
import StyledButton from '../../Buttons/styledButton'
import TransparentButton from '../../Buttons/transparentButton'

const events = [
  {
    name: 'Ankr Discord AMA',
    date: 'Mar 14, 2023, 4 PM UTC',
  },
  {
    name: 'Ankr Discord AMA',
    date: 'Mar 14, 2023, 4 PM UTC',
  },
  {
    name: 'Ankr Discord AMA',
    date: 'Mar 14, 2023, 4 PM UTC',
  },
  {
    name: 'Ankr Discord AMA',
    date: 'Mar 14, 2023, 4 PM UTC',
  },
]

const prices = [
  { price: '4,642,625', label: 'Total Value Locked' },
  { price: '2,354,323', label: 'Thena Volume (Last 24 h)' },
  { price: '3,111,111', label: 'THE Price' },
]

const topGainers = [
  {
    name: 'John Doe',
    price: '87.58',
    rank: 1,
  },
  {
    name: 'Referencer',
    price: '38,456',
    rank: 2,
  },
  {
    name: 'John Doe',
    price: '87.58',
    rank: 3,
  },
  {
    name: 'Referencer',
    price: '38,456',
    rank: 4,
  },
  {
    name: 'John Doe',
    price: '87.58',
    rank: 5,
  },

  {
    name: 'Referencer',
    price: '38,456',
    rank: 6,
  },
  {
    name: 'John Doe',
    price: '87.58',
    rank: 7,
  },

  {
    name: 'Referencer',
    price: '38,456',
    rank: 8,
  },
  {
    name: 'John Doe',
    price: '87.58',
    rank: 9,
  },
]

const RightLayout = ({ detail }) => {
  const [attenEvent, setAttendEvent] = useState(false)
  const [index, setIndex] = useState(0)
  const [leaderboardData, setLeaderBoardData] = useState([])
  const timeoutRef = useRef(null)
  const [joinNow, setJoinNow] = useState(false)
  const [claimNow, setClaimNow] = useState(false)

  const [time, setTime] = useState('')
  const location = useLocation()

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setIndex((prevIndex) => (prevIndex === events.length - 2 ? 0 : prevIndex + 1)), 2500)
    return () => {}
  }, [index])

  // fetch leaderboard data
  const fetchLeaderboard = () => {
    squidClient
      .query({
        query: LEADERBOARD(),
      })
      .then((res) => {
        setLeaderBoardData(res.data.leaderboard)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const currentEvent = useMemo(() => {
    return getEventType(detail?.timestamp)
  }, [detail])

  useEffect(() => {
    if (detail?.timestamp) {
      const timer = setInterval(() => {
        if (currentEvent !== EVENT_TYPES.ENDED) {
          const timestamp = currentEvent === EVENT_TYPES.UPCOMING ? detail.timestamp.startTimestamp : detail.timestamp.endTimestamp
          const timee = timestamp * 1000 - Date.now()
          const timeStamp = Math.abs(timee)
          const days = Math.floor(timeStamp / (1000 * 60 * 60 * 24))
          const hours = Math.floor((timeStamp / (1000 * 60 * 60)) % 24)
          const minutes = Math.floor((timeStamp / 1000 / 60) % 60)
          // const seconds = Math.floor((timeStamp / 1000) % 60)
          setTime(`${days}d: ${hours}h: ${minutes}m`)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [detail, currentEvent])

  const renderRightSidebar = () => {
    if (location.pathname === '/core/comps') {
      return (
        <div className='bg-cardBg pt-4 pb-2 w-full rounded-[5px] mt-5'>
          <p className='leading-[27px] text-[22px] font-figtree text-white  px-4'>
            <span className='font-semibold'>Top Gainers</span> <span className='font-regular text-lightGray'>(All Time)</span>
          </p>
          <div className='mt-[19px]'>
            {topGainers.map((item, idx) => {
              return (
                <Link
                  to={`/core/profile/${idx}/activity`}
                  key={idx}
                  className={`${idx % 2 !== 0 ? 'bg-white bg-opacity-[0.04]' : ''} flex text-white items-center justify-between ${
                    idx > 0 ? 'py-[11px]' : 'pb-[11px]'
                  }  px-4`}
                >
                  <div className='text-[17px] leading-5 font-figtree flex items-center space-x-[18px]'>
                    {item.rank === 1 ? (
                      <img className='w-6 h-6' alt='' src='/images/core/one.png' />
                    ) : item.rank === 2 ? (
                      <img alt='' className='w-6 h-6' src='/images/core/two.png' />
                    ) : item.rank === 3 ? (
                      <img alt='' className='w-6 h-6' src='/images/core/three.png' />
                    ) : (
                      <div className='font-bold w-6 flex items-center justify-center'>{item.rank}</div>
                    )}
                    <span>{item.name}</span>
                  </div>
                  <span className='text-[15px] leading-5'>${item.price}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )
    } else if (location.pathname.includes('/core/comps')) {
      return (
        <div className='bg-cardBg p-4 w-full rounded-[5px] mt-5 sticky top-24'>
          <p className='font-semibold text-[27px] leading-[26px] font-figtree text-white'>
            {currentEvent === EVENT_TYPES.UPCOMING ? 'Registration Open' : currentEvent === EVENT_TYPES.LIVE ? 'Live' : 'Ended'}
          </p>
          <div className='flex items-center space-x-3 mt-4 text-white'>
            <img alt='' src='/images/core/participants.svg' width={24} height={24} />
            <span>
              {[EVENT_TYPES.LIVE, EVENT_TYPES.ENDED].includes(currentEvent)
                ? detail?.participantCount
                : `${detail?.participantCount} / ${detail?.maxParticipants}`}{' '}
              Participants
            </span>
          </div>
          {currentEvent !== EVENT_TYPES.ENDED && (
            <div className='flex items-center space-x-3 mt-3'>
              <img alt='clock svg' src='/images/svgs/clock.svg' width={24} height={24} />
              <span className='text-lg leading-5 text-white'>
                <span className='font-semibold'>{currentEvent === EVENT_TYPES.UPCOMING ? 'Starts: ' : 'Ends: '}</span>
                {time}
              </span>
            </div>
          )}
          {detail && (
            <div className='mt-4'>
              <TCButtion item={detail} isFull />
            </div>
          )}
        </div>
      )
    } else if (location.pathname.includes('eventDetail')) {
      const JOIN = (
        <div className='flex items-center justify-center w-full space-x-1.5'>
          <p>JOIN</p>
          <img alt='' src='/images/core/redirect.png' />
        </div>
      )
      return (
        <div className='bg-cardBg p-4 w-full rounded-[5px] mt-5 '>
          <p className=' font-semibold text-[27px] leading-[26px] font-figtree text-white'>Join Event</p>
          <div className='flex items-center space-x-3 mt-4'>
            <img alt='' src='/images/core/participants.svg' />
            <span className='text-lg leading-5 text-white'>246</span>
          </div>
          <div className='flex items-center space-x-3 mt-3'>
            <img alt='' src='/images/svgs/clock.svg' className='clock icon' />
            <span className='text-lg leading-5 text-white'>
              <span className='font-semibold'>Ends: </span> 3d : 10h : 13m
            </span>
          </div>
          {detail.event !== EVENT_TYPES.ENDED && (
            <div className='mt-4 w-full'>
              {detail.event === EVENT_TYPES.UPCOMING ? (
                <TransparentButton
                  onClickHandler={() => {
                    setAttendEvent(!attenEvent)
                  }}
                  className='px-[30px] py-[15px]'
                  content={
                    attenEvent ? (
                      <div className='flex items-center justify-center w-full space-x-1.5'>
                        <p>ATTENDING</p>
                        <img alt='' src='/images/header/chevron.svg' />
                      </div>
                    ) : (
                      'ATTEND'
                    )
                  }
                  isUpper
                />
              ) : (
                <StyledButton className='w-full py-[15px]' content={JOIN} />
              )}
            </div>
          )}
        </div>
      )
    } else {
      return (
        <>
          <div className='lg:bg-cardBg p-4 w-full rounded-[5px] mt-5'>
            <p className='leading-[27px] text-[22px] font-figtree text-white font-semibold'>Next Trading Competition</p>
            <div className='flex items-center text-white text-4xl  2xl:text-[42px] leading-[52px] font-figtree my-2.5'>
              1d &nbsp;<span className='text-secondary'> : </span>&nbsp; 3h &nbsp;<span className='text-secondary'> : </span>&nbsp;13m
            </div>
            <button className='font-medium text-lg  w-full leading-5 flex justify-start text-green '>View Competition</button>
          </div>
          <div className='lg:bg-cardBg py-4 w-full rounded-[5px] mt-5 max-h-[500px] overflow-x-auto'>
            <p className='leading-[27px] text-[22px] font-figtree text-white font-semibold px-4'>Daily Leaderboard</p>
            <div className='mt-[19px]'>
              {leaderboardData.map((item, idx) => {
                return (
                  <Link
                    to={`/core/profile/${item.address}/activity`}
                    key={idx}
                    className={`${idx % 2 !== 0 ? 'bg-white bg-opacity-[0.04]' : ''} flex text-white items-center justify-between py-[11px] px-4`}
                  >
                    <div className='text-[17px] leading-5 font-figtree flex items-center space-x-7'>
                      {item.rank === 1 ? (
                        <img className='w-6 h-6' alt='' src='/images/core/one.png' />
                      ) : item.rank === 2 ? (
                        <img alt='' className='w-6 h-6' src='/images/core/two.png' />
                      ) : item.rank === 3 ? (
                        <img alt='' className='w-6 h-6' src='/images/core/three.png' />
                      ) : (
                        <div className='font-bold w-6 flex items-center justify-center'>{item.rank}</div>
                      )}
                      <span>{item.address ? sliceAddress(item.address) : ''}</span>
                    </div>
                    <span className='text-[15px] leading-5'>${convertNumber(Math.floor(item.volume))}</span>
                  </Link>
                )
              })}
            </div>
            <button className='font-medium text-lg  w-full leading-5 flex justify-start text-green px-4 mt-[11px]'>View Leaderboard</button>
          </div>
          <div className='lg:bg-cardBg p-4 w-full rounded-[5px] mt-5'>
            <div className='overflow-hidden max-w-[1000px] mx-auto mb-2.5'>
              <div className='whitespace-nowrap transition-all duration-1000 ease-linear' style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
                {prices.map((item, idx) => {
                  return (
                    <div className='w-full inline-block' key={idx}>
                      <p className='leading-[27px] text-xl 2xl:text-[22px] font-figtree text-white font-semibold'>{item.label}</p>
                      <div className='text-white text-4xl 2xl:text-[42px]   leading-[52px] font-figtree w-full'>${item.price}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='flex items-center space-x-3 justify-center'>
              {prices.map((_, idx) => {
                return (
                  <div
                    key={idx}
                    onClick={() => setIndex(idx)}
                    className={`${idx === index ? 'bg-green' : 'bg-body'} cursor-pointer w-3 h-3  rounded-full transition-all duration-700 ease-in`}
                  />
                )
              })}
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <>
      {/* <div className={`${location.pathname.includes('comps') || location.pathname.includes('eventDetail') ? 'sticky top-24' : ''} w-full`}> */}
      {/* <div className='bg-cardBg p-4 w-full rounded-[5px]'>
        <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Search' full />
      </div> */}
      {renderRightSidebar()}
      {/* </div> */}
      {joinNow && <JoinModal isOpen={joinNow} setIsOpen={setJoinNow} data={detail} />}
      {claimNow && <ClaimModal isOpen={claimNow} setIsOpen={setClaimNow} name={detail?.name} />}
    </>
  )
}

export default RightLayout

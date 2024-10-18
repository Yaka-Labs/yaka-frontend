import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import StyledButton from 'components/Buttons/styledButton'
import TransparentButton from 'components/Buttons/transparentButton'
import { addEventsData } from 'state/application/actions'
import Modal from 'components/Modal'
import Details from '../tabs/details'
import Attendies from '../tabs/attending'
import Comments from '../tabs/comments'

const Index = ({ data, getChip, modal = false }) => {
  const tabs = [
    { name: 'DETAILS', route: null },
    { name: 'ATTENDING', route: 'attending' },
    // { name: 'COMMENTS', route: 'comments' },
  ]
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(false)
  const [share, setShare] = useState(false)
  const [tabRoute, setTabRoute] = useState(null)
  const dispatch = useDispatch()
  const location = useLocation()
  const [deletEvent, setDeletEvent] = useState(false)

  useEffect(() => {
    setTabRoute(location.pathname.split('/')[3])
  }, [location])

  // json for attendies
  const attendiesData = [
    {
      rank: '219',
      userName: 'Lara Thompson',
      profilePic: '/images/core/p3.png',
      volume: '219',
    },
    {
      rank: '219',
      userName: 'John Doe',
      profilePic: '/images/core/p3.png',
      volume: '9,999',
    },
    {
      rank: '219',
      userName: 'Xermes',
      profilePic: '/images/core/p3.png',
      volume: '$8,999',
    },
    {
      rank: '219',
      userName: 'Lara Thompson',
      profilePic: '/images/core/p3.png',
      volume: '219',
    },
    {
      rank: '219',
      userName: 'John Doe',
      profilePic: '/images/core/p3.png',
      volume: '9,999',
    },
    {
      rank: '219',
      userName: 'Xermes',
      profilePic: '/images/core/p3.png',
      volume: '$8,999',
    },
    {
      rank: '219',
      userName: 'Lara Thompson',
      profilePic: '/images/core/p3.png',
      volume: '219',
    },
    {
      rank: '219',
      userName: 'John Doe',
      profilePic: '/images/core/p3.png',
      volume: '9,999',
    },
    {
      rank: '219',
      userName: 'Xermes',
      profilePic: '/images/core/p3.png',
      volume: '$8,999',
    },
    {
      rank: '219',
      userName: 'Lara Thompson',
      profilePic: '/images/core/p3.png',
      volume: '219',
    },
    {
      rank: '219',
      userName: 'John Doe',
      profilePic: '/images/core/p3.png',
      volume: '9,999',
    },
    {
      rank: '219',
      userName: 'Xermes',
      profilePic: '/images/core/p3.png',
      volume: '$8,999',
    },
    {
      rank: '219',
      userName: 'Lara Thompson',
      profilePic: '/images/core/p3.png',
      volume: '219',
    },
    {
      rank: '219',
      userName: 'John Doe',
      profilePic: '/images/core/p3.png',
      volume: '9,999',
    },
    {
      rank: '219',
      userName: 'Xermes',
      profilePic: '/images/core/p3.png',
      volume: '$8,999',
    },
  ]

  const renderTabs = (tab) => {
    switch (tab) {
      case 'attending':
        return <Attendies attendiesData={attendiesData} />
      case 'comments':
        return <Comments />
      default:
        return <Details />
    }
  }

  const renderJoined = () => {
    return (
      <div className='flex items-center space-x-1'>
        <p>Join Now</p>
        <img alt='' src='/images/core/redirect.png' />
      </div>
    )
  }

  return (
    <>
      <div className={`${modal ? 'max-w-[760px] w-full' : 'w-full'} relative`}>
        <div className='bg-[#101645] rounded-[5px]'>
          <div className='relative w-full min-h-[428px]'>
            <img alt='' src={data.img ? data.img : '/images/core/no-image.png'} className='w-full h-full rounded-t-[5px]' />
            {!modal && (
              <div className='flex items-center space-x-2.5 absolute z-10 left-9 top-5 cursor-pointer' onClick={() => dispatch(addEventsData({}))}>
                <img alt='' src='/images/swap/back-arrow.svg' />
                <span className='text-[22px] font-semibold text-white font-figtree'>Back</span>
              </div>
            )}
          </div>
          <div className='p-5 w-full'>
            <div className='flex items-start justify-between'>
              <div>
                <div className={`${getChip(data.event)} table text-[15px] uppercase font-semibold  leading-5 px-2 py-1  bg-opacity-[0.08]  rounded-md`}>
                  {data.event}
                </div>
                <div className='flex items-center space-x-1 mt-2'>
                  <span className='text-white text-[27px] leading-8 font-figtree font-medium '>{data.name}</span>
                </div>
                {data.eventType && (
                  <div className='flex items-center space-x-6 mt-2'>
                    <div className={`flex items-center ${data.eventType.includes('Meme') ? '' : 'space-x-1.5'}`}>
                      {!data.eventType.includes('Meme') && (
                        <img alt='audio/video icon' src={`${data.eventType.includes('Audio') ? '/images/core/audio-icon.svg' : '/images/core/video.svg'}`} />
                      )}
                      <p className='text-lightGray text-lg leading-5'>{data.eventType}</p>
                    </div>
                    <div className='flex items-center space-x-1.5'>
                      <img alt='' src='/images/core/hourglass.svg' />
                      <p className='text-lightGray text-lg leading-5'>{data.timeRemaining}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex  space-x-3 relative'>
                <button
                  onClick={() => {
                    setShare(!share)
                  }}
                  className='w-[50px] h-[50px] flex flex-col items-center justify-center rounded-[3px] border border-[#0000AF] -mr-3'
                >
                  <img alt='' src='/images/core/share.svg' />
                </button>
                <OutsideClickHandler onOutsideClick={() => setShare(false)}>
                  {share && (
                    <div className='absolute max-w-[177.67px] w-full z-10 bg-[#1A265E] p-4 rounded-[5px] -left-2.5 top-[58px] flex flex-col'>
                      <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                        Share on Feed
                      </div>
                      <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                        Share on X
                      </div>
                      <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                        Share on Facebook
                      </div>
                      <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                        Share on Group
                      </div>
                      <div className='mt-2.5 pt-2.5 border-t border-white border-opacity-[0.31]'>
                        <button className='text-white leading-[27px] text-[15px] hover:opacity-70 transition-all duration-150 ease-in-out'>Copy Link</button>
                      </div>
                    </div>
                  )}
                </OutsideClickHandler>
                <TransparentButton
                  onClickHandler={() => setNotifications(true)}
                  content={<img alt='' src={notifications ? '/images/core/notification-active.svg' : '/images/core/notification.svg'} />}
                  className='w-[50px] h-[50px]'
                />
                {!modal &&
                  (data.event === 'ENDED' ? (
                    <StyledButton onClickHandler={() => {}} disabled className='px-9' content='ENDED' />
                  ) : data.event === 'UPCOMING' ? (
                    <TransparentButton onClickHandler={() => {}} className='px-[30px] py-[15px]' content='ATTEND' isUpper />
                  ) : (
                    <StyledButton onClickHandler={() => {}} className='px-6' content={renderJoined()} isCap />
                  ))}
                {/* <TransparentButton
                  onClickHandler={() => {}}
                  className={'px-11 py-[15px] font-figtree font-bold leading-5 text-[17px] text-white'}
                  content={'EDIT'}
                />
                <TransparentButton
                  onClickHandler={() => {
                    setDeletEvent(true)
                  }}
                  content={<img alt='' src={'/images/core/trash.svg'} />}
                  className={'w-[50px] h-[50px] flex flex-col items-center justify-center'}
                /> */}
              </div>
            </div>
            <div className='mt-[26px] grid grid-cols-3 gap-x-[78px]'>
              <div>
                <div className='text-lightGray text-[17px] leading-5'>Start:</div>
                <p className='text-lg leading-[26px] mt-[7px] text-white font-light'>{data.time}</p>
              </div>
              <div className='flex flex-col'>
                <div className='text-lightGray text-[17px] leading-5'>{data.event === 'ENDED' ? 'Recording:' : 'Location:'} </div>
                <a href={data.locationLink} rel='nofollow noopener' target='__blank' className='text-lg leading-[26px] mt-[7px] text-green font-semibold'>
                  {data.location ? data.location : 'Event Link'}
                </a>
              </div>
              <div>
                <div className='text-lightGray text-[17px] leading-5'>Attendees:</div>
                <p className='text-lg leading-[26px] mt-[7px] text-white font-semibold'>{data.people}</p>
              </div>
            </div>
          </div>
          {!modal && (
            <div className='flex items-center w-full mt-[38px]'>
              {tabs.map((item, idx) => {
                return (
                  <div
                    onClick={() => {
                      setTabRoute(item.route)
                      navigate(
                        !item.route
                          ? `/core/events/${data.name.trim().replaceAll(' ', '-').toLowerCase()}`
                          : `/core/events/${data.name.trim().replaceAll(' ', '-').toLowerCase()}/${item.route}`,
                      )
                    }}
                    className={`text-xl font-figtree pb-2.5 flex items-center justify-center leading-6  cursor-pointer w-1/2 ${
                      item.route
                        ? item.route === location.pathname.split('/')[3]
                          ? 'text-white border-b-2 border-green font-semibold'
                          : 'text-secondary font-medium'
                        : !tabRoute
                        ? 'text-white border-b-2 border-green font-semibold'
                        : 'text-secondary font-medium'
                    }`}
                    key={idx}
                  >
                    {item.name}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {renderTabs(tabRoute)}
      </div>
      <Modal popup={deletEvent} title='Delete Event' setPopup={setDeletEvent} width={459}>
        <p className='mt-2 leading-[22px] text-lightGray'>
          Are you sure you want to delete "<span className=' font-semibold'>{data.name}</span>" event?
        </p>
        <div className='flex items-center space-x-5 mt-5'>
          <TransparentButton
            onClickHandler={() => {
              setDeletEvent(false)
            }}
            className='w-full px-9 py-[15px]'
            content='DELETE'
            isUpper
          />
          <StyledButton
            onClickHandler={() => {
              setDeletEvent(false)
            }}
            className='w-full px-9 py-[15px]'
            content='CANCEL'
          />
        </div>
      </Modal>
    </>
  )
}

export default Index

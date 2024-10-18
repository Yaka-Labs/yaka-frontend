import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import TransparentButton from 'components/Buttons/transparentButton'
import TabFilter from 'components/TabFilter'
import TopTabs from 'components/CoreReuseAbleComponents/CoreTabs'
import StyledButton from 'components/Buttons/styledButton'
import { getChip } from 'utils'
import { addEventsData } from 'state/application/actions'

const Tabs = ['ALL', 'UPCOMING', 'LIVE', 'ENDED']

const Index = ({ eventsFeedData, setEventsFeedData, setCreateEvent }) => {
  const topTabs = ['All Events', 'Attending', 'Hosted']
  const [topTab, setTopTab] = useState('All Events')
  // const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('ALL')
  const [loadMore, setLoadMore] = useState(4)
  const [eventDropDown, setEventDropDown] = useState({ bol: false, id: null })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const renderContent = () => {
    return (
      <div className='flex items-center space-x-2 px-7 2xl:px-3  3xl:px-7 h-[52px] relative z-10'>
        <img src='/images/whiteList/add-icon.svg' alt='' />
        <span>CREATE EVENT</span>
      </div>
    )
  }

  const filteredData = useMemo(() => {
    let filter =
      activeTab === 'ALL'
        ? eventsFeedData
        : activeTab === 'ALL'
        ? eventsFeedData.filter((item) => {
            return item.trading === activeTab
          })
        : activeTab === 'ALL'
        ? eventsFeedData.filter((item) => {
            return item.event === activeTab
          })
        : eventsFeedData.filter((item) => {
            return item.event === activeTab
          })

    return filter
  }, [eventsFeedData, activeTab])

  const renderJoined = () => {
    return (
      <div className='flex items-center space-x-1'>
        <p>Join Now</p>
        <img alt='' src='/images/core/redirect.png' />
      </div>
    )
  }

  const updateData = (id, status) => {
    let dup = [...eventsFeedData]
    dup[id].eventStatus = status
    setEventsFeedData(dup)
  }

  return (
    // max-w-[940px]
    <div className='w-full  2xl:max-w-full'>
      <TopTabs setTab={setTopTab} tab={topTab} tabs={topTabs} />
      <div className='mt-5 flex space-x-2 items-center justify-between '>
        {/* <div className='max-w-[300px] w-full'>
          <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder={'Events, Host Name'} full />
        </div> */}
        <TabFilter data={Tabs} filter={activeTab} setFilter={setActiveTab} />
        <TransparentButton content={renderContent()} onClickHandler={() => setCreateEvent(true)} isUpper />
      </div>
      {filteredData.length > 0 ? (
        <>
          {filteredData.slice(0, loadMore).map((item, idx) => {
            return (
              <div
                onClick={() => {
                  dispatch(addEventsData(item))
                  navigate(`/core/events/${item.name.trim().replaceAll(' ', '-').toLowerCase()}`)
                }}
                className='p-3 cursor-pointer rounded-[5px] bg-[#101645] w-full mt-6 flex space-x-3.5'
                key={idx}
              >
                <div className='max-w-[360px] h-[203px] w-full relative rounded-[5px]'>
                  <img alt='' src={item.img ? item.img : '/images/core/no-image.png'} className='w-full h-full rounded-[5px]' />
                  <div className='py-2.5 bg-[#000076] w-full absolute bottom-0 z-10 text-white font-medium text-center rounded-b-[5px]'>{item.time}</div>
                </div>
                <div className='flex  items-start justify-between w-full relative'>
                  <div className='flex flex-col items-start justify-between h-full'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <p className='text-white text-xl 2xl:text-[22px] leading-[27px] font-figtree font-medium max-w-[200px] 2xl:max-w-[390px]'>
                          {item.name}
                        </p>
                        <div
                          onClick={() => {
                            setActiveTab(item.event)
                          }}
                          className={` ${getChip(
                            item.event,
                          )} cursor-pointer table text-[15px] uppercase font-medium  leading-5 px-2 py-1  bg-opacity-[0.08]  rounded-md`}
                        >
                          {item.event}
                        </div>
                        <div className={`flex items-center mt-4 ${item.eventType.includes('Meme') ? '' : 'space-x-1.5'}`}>
                          {!item.eventType.includes('Meme') && (
                            <img
                              alt=''
                              src={`${item.eventType.includes('Audio') ? '/images/core/events/audio-icon.svg' : '/images/core/events/video.svg'}`}
                              className={`${item.eventType.includes('Audio') ? 'w-4' : 'w-5'} `}
                            />
                          )}
                          <span className='text-secondary text-base'>{item.eventType}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center space-x-3.5'>
                      <div className='flex items-center space-x-[6.73px] border-r border-[#44476A] pr-3.5'>
                        <img alt='' src='/images/core/participants.svg' />
                        <div className='text-lightGray'>{item.people}</div>
                      </div>
                      <div className='flex items-center space-x-[6.73px] border-r border-[#44476A] pr-3.5'>
                        <img alt='' src='/images/core/events/hourglass.svg' />
                        <div className='text-lightGray'>{item.timeRemaining}</div>
                      </div>
                      <a
                        href={item.locationLink}
                        target='__blank'
                        className='flex items-center space-x-[6.73px] hover:text-green text-lightGray transition-all duration-200 ease-in-out'
                      >
                        <img alt='location svg' src='/images/core/events/location.svg' />
                        <div>{item.location}</div>
                      </a>
                    </div>
                  </div>
                  <div className='flex flex-col space-y-3 absolute right-0'>
                    {item.event === 'ENDED' ? (
                      <StyledButton
                        onClickHandler={(e) => {
                          e.stopPropagation()
                        }}
                        disabled
                        content='ENDED'
                        className='py-[9px] px-4'
                      />
                    ) : item.event === 'LIVE' ? (
                      <StyledButton
                        onClickHandler={(e) => {
                          e.stopPropagation()
                        }}
                        content={renderJoined()}
                        className='py-[9px] px-4'
                      />
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEventDropDown({ bol: !eventDropDown, id: item.id })
                        }}
                        className='gradientBorder2 py-[9px] text-white text-base 2xl::text-lg tracking-[1.12px] md:tracking-[1.44px]  leading-[30px] px-4 2xl:px-[19px]  rounded-[3px]'
                      >
                        {eventDropDown && eventDropDown.id === item.id ? (
                          <>
                            <div
                              onClick={(e) => {
                                updateData(item.id, 'Attending')
                                setEventDropDown({ bol: !eventDropDown, id: null })
                                e.stopPropagation()

                                console.log('capiche')
                              }}
                              className='flex items-center space-x-1.5'
                            >
                              <span>Attending</span>
                              <img alt='' src='/images/header/chevron.svg' />
                            </div>
                            <div
                              onClick={(e) => {
                                updateData(item.id, 'Leave')
                                setEventDropDown({ bol: !eventDropDown, id: null })
                                e.stopPropagation()
                              }}
                              className='w-full text-left text-white'
                            >
                              Leave
                            </div>
                          </>
                        ) : (
                          <div className='flex items-center space-x-1.5'>
                            <span>{item.eventStatus ? item.eventStatus : 'Attending'}</span>
                            <img alt='' src='/images/header/chevron.svg' />
                          </div>
                        )}
                      </button>
                    )}
                    <TransparentButton
                      onClickHandler={() => {
                        dispatch(addEventsData(item))
                        navigate(`/core/events/${item.name.trim().replaceAll(' ', '-').toLowerCase()}`)
                      }}
                      content='View'
                      className='px-4 py-[9px]'
                    />
                  </div>
                </div>
              </div>
            )
          })}
          {filteredData.length > 3 && (
            <button
              onClick={() => {
                setLoadMore(loadMore + 4)
              }}
              disabled={filteredData.length <= loadMore - 1}
              className={` ${
                filteredData.length <= loadMore - 1 ? ' !cursor-not-allowed' : ''
              } font-medium text-xl flex items-center justify-center w-full leading-6 text-green mt-6`}
            >
              Load More
            </button>
          )}
        </>
      ) : (
        <div className='font-medium text-white text-lg text-center mt-6'>No data. Please change your filters</div>
      )}
    </div>
  )
}

export default Index

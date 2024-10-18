import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import moment from 'moment'
import EventChip from 'components/ChipLabel/eventChip'
import { sliceAddress, convertTimestamp, getEventType } from 'utils'
import { customNotify } from 'utils/notify'
import { formatNumber, fromWei } from 'utils/formatNumber'
import Home from './home'
import Leaderboard from './leaderboard'
import Participants from './participants'
import Comments from './comments'
import TCButtion from '../TCButtion'

const DetailTabs = ['DETAILS', 'LEADERBOARD', 'PARTICIPANTS']

const Details = ({ data, isPreview = false }) => {
  const [activeTab, setActiveTab] = useState(DetailTabs[0])
  const [share, setShare] = useState(false)
  const navigate = useNavigate()

  const renderTabs = (tab) => {
    switch (tab) {
      case DetailTabs[0]:
        return <Home data={data} />
      case DetailTabs[1]:
        return <Leaderboard id={data.id} />
      case DetailTabs[2]:
        return <Participants participantsData={data.participants} />
      default:
        return <Comments />
    }
  }

  return (
    <div>
      {data && (
        <div className={`${isPreview ? 'max-w-[760px] w-full' : 'w-full'} relative`}>
          <div className='bg-[#101645] rounded-[5px]'>
            <div className='relative w-full min-h-[320px] md:min-h-[428px]'>
              {data.img ? (
                <img alt='' src={data.img} className='w-full h-full rounded-t-[5px]' />
              ) : (
                <div className='w-full min-h-[320px] md:min-h-[428px] rounded-[5px] flex flex-col items-center justify-center bg-body'>
                  <div className='text-2xl md:text-4xl text-white font-figtree'>
                    <div>COMPETE FOR</div>
                    <div className='flex items-center justify-center space-x-2'>
                      <span>
                        {formatNumber(fromWei(data.prize.totalPrize, data.prize.token.decimals))} {data.prize.token.symbol}
                      </span>
                      <img alt='' src={data.prize.token.logoURI} className='w-8 h-8' />
                    </div>
                  </div>
                </div>
              )}
              {!isPreview && (
                <div className='flex items-center space-x-2.5 absolute z-10 md:left-9 top-5 cursor-pointer' onClick={() => navigate(-1)}>
                  <img alt='' src='/images/swap/back-arrow.svg' />
                  <span className='text-lg md:text-[22px] font-semibold text-white font-figtree'>Back</span>
                </div>
              )}
            </div>
            <div className='p-3 md:p-5 w-full'>
              <div className='md:flex items-start justify-between'>
                <div>
                  <EventChip value={getEventType(data.timestamp)} />
                  <div className='flex items-center space-x-1 mt-1.5 md:mt-2'>
                    {data?.locked && <img alt='' className='w-6 h-6' src='/images/core/password-icon.svg' />}
                    <span className='text-white text-xl md:text-[27px] leading-6 md:leading-8 font-figtree font-medium '>{data.name}</span>
                  </div>
                  <Link to={`/core/profile/${data.owner}/activity`} className='flex items-center space-x-1.5 mt-5'>
                    <img
                      alt=''
                      src={data.profilePic ? data.profilePic : '/images/settings/placeholderProfilePic.svg'}
                      className='md:w-9 w-[30px] h-[30px] md:h-9 rounded-full'
                    />
                    <div>
                      <p className='text-white md:text-[17px] font-figtree leading-5'>
                        <span className='text-secondary'>By</span> {sliceAddress(data.owner.id)}
                      </p>
                      {/* <button className='text-green text-[17px] leading-5 font-medium'>Follow</button> */}
                    </div>
                  </Link>
                </div>
                {!isPreview && (
                  <div className='mt-4 md:mt-0 flex space-x-3 relative'>
                    <button
                      onClick={() => {
                        setShare(!share)
                      }}
                      className='md:w-[50px] h-[46px] w-[46px] md:h-[50px] flex flex-col items-center justify-center rounded-[3px] border border-[#0000AF] -mr-3'
                    >
                      <img alt='' src='/images/core/share.svg' />
                    </button>
                    <OutsideClickHandler onOutsideClick={() => setShare(false)}>
                      {share && (
                        <div className='absolute max-w-[177.67px] w-full z-10 bg-[#1A265E] p-4 rounded-[5px] -left-2.5 top-[58px] flex flex-col'>
                          <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-sm md:text-[15px] mb-2.5 w-full'>
                            Share on Feed
                          </div>
                          <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-sm md:text-[15px] mb-2.5 w-full'>
                            Share on X
                          </div>
                          <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-sm md:text-[15px] mb-2.5 w-full'>
                            Share on Facebook
                          </div>
                          <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-sm md:text-[15px] mb-2.5 w-full'>
                            Share on Group
                          </div>
                          <div className='mt-2.5 pt-2.5 border-t border-white border-opacity-[0.31]'>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href)
                                customNotify('Copied!', 'info')
                              }}
                              className='text-white md:leading-[27px] text-sm md:text-[15px] hover:opacity-70 transition-all duration-150 ease-in-out'
                            >
                              Copy Link
                            </button>
                          </div>
                        </div>
                      )}
                    </OutsideClickHandler>
                    <TCButtion item={data} />
                  </div>
                )}
              </div>
              <div className='mt-5 md:mt-[26px] grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 md:gap-y-[18px] md:gap-x-[78px]'>
                <div>
                  <div className='text-lightGray text-base  md:text-[17px] leading-5'>Registration Deadline:</div>
                  <p className='text-base md:text-lg leading-[23px] md:leading-[26px] md:mt-[7px] text-white font-light'>
                    {moment(convertTimestamp(data.timestamp.registrationEnd)).format('lll')}
                  </p>
                </div>
                <div>
                  <div className='text-lightGray text-base  md:text-[17px] leading-5'>Start:</div>
                  <p className='text-base md:text-lg leading-[23px] md:leading-[26px] md:mt-[7px] text-white font-light'>
                    {moment(convertTimestamp(data.timestamp.startTimestamp)).format('lll')}
                  </p>
                </div>
                <div>
                  <div className='text-lightGray text-base  md:text-[17px] leading-5'>End:</div>
                  <p className='text-base md:text-lg leading-[23px] md:leading-[26px] md:mt-[7px] text-white font-light'>
                    {moment(convertTimestamp(data.timestamp.endTimestamp)).format('lll')}
                  </p>
                </div>
                {/* <div className=''>
              <label className='text-lightGray text-[17px] leading-5'>Ends In:</label>
              <div className='flex items-center text-white text-[22px] leading-[26px] font-semibold font-figtree mt-[7px]'>
                1d &nbsp;<span className='text-secondary'> : </span>&nbsp; 3h &nbsp;<span className='text-secondary'> : </span>&nbsp;13m
              </div>
              <div className='flex items-center space-x-1.5 mt-1'>
                <img alt='' src='/images/core/participants.svg' />
                <div className='text-white text-lg leading-5 font-semibold'>
                  {data.people} {data.event === 'UPCOMING' ? `/ ${data.total} Joined` : ''}
                </div>
              </div>
            </div> */}
              </div>
            </div>
            {data && !isPreview && (
              <div className='flex items-center w-full mt-6 md:mt-[38px] space-x-2 md:space-x-0'>
                {DetailTabs.map((item, idx) => {
                  return (
                    <div
                      onClick={() => setActiveTab(item)}
                      className={`text-[13px] md:text-xl font-figtree pb-2 md:pb-2.5 flex items-center justify-center leading-6 
                      cursor-pointer w-[30.33%] md:w-1/4 ${
                        item === activeTab ? 'text-white border-b-2 border-green font-semibold' : 'text-secondary font-medium'
                      }`}
                      key={idx}
                    >
                      {item}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          {renderTabs(activeTab)}
        </div>
      )}
    </div>
  )
}

export default Details

import React, { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import TopTabs from 'components/CoreReuseAbleComponents/CoreTabs'
import Toggle from 'components/Toggle'
import NotificationRender from './notificationsRenderer'

const Notifications = () => {
  const topTabs = ['All Notifications', 'Unread']
  const [topTab, setTopTab] = useState('All Notifications')
  const [filter, setFilter] = useState(false)
  const [allNotifications, setAllnotifications] = useState([
    {
      type: 'competitionWithReward',
      icon: '/images/core/prize-pool.svg',
      des: "<p>You finished second on <span id='contestName'>Pip Hunter Trading Contest</span> trading competition and won 1,200 USDT. Claim your reward now!</p>",
      time: '6 hours ago',
    },
    {
      type: 'comment',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Markos</span> commented on your post.</p>",
      time: '15 min ago',
    },
    {
      type: 'follow',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Tomas</span> started following you.</p>",
      time: '19 min ago',
    },
    {
      type: 'like',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Tomas, Lara Thompson</span> and others liked your post.</p>",
      time: '19 min ago',
    },
    {
      type: 'invitation',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Markos</span>  has invite you to join Newbies group.</p>",
      time: '44 min ago',
    },
    {
      type: 'mentioned',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Lara Thompson</span> mentioned you in a comment.</p>",
      time: '40 min ago',
    },
    {
      type: 'achievement',
      icon: '/images/profile/badges/2.png',
      des: '<p>You have completed Rising Star Achievement.</p>',
      time: '40 min ago',
    },
    {
      type: 'transiction',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Tomas</span> has sent you 250 USDT.</p>",
      time: '40 min ago',
    },
    {
      type: 'nftOffer',
      icon: '/images/notifications/thenft.svg',
      des: "<p>Your received an offer for your <span id='nftName'>theNFT</span> on OpenSea.</p>",
      time: '40 min ago',
    },
    {
      type: 'competition',
      icon: '/images/core/prize-pool.svg',
      des: "<p> <span id='contestName'>Pip Hunter Trading Contest</span> trading competition starts in 1 hour.</p>",
      time: '2 hours ago',
    },
    {
      type: 'competition',
      icon: '/images/core/prize-pool.svg',
      des: "<p> <span id='contestName'>Pip Hunter Trading Contest</span> trading competition starts in 1 hour.</p>",
      time: '3 hours ago',
    },
    {
      type: 'competition',
      icon: '/images/core/prize-pool.svg',
      des: "<p> <span id='contestName'>Pip Hunter Trading Contest</span> trading competition starts in 1 hour.</p>",
      time: '1 hours ago',
    },
    {
      type: 'events',
      icon: '/images/notifications/calendar.svg',
      des: "<p><span id='contestName'>Ankr Discord AMA</span> event has ended.</p>",
      time: '1 hours ago',
    },
    {
      type: 'lottery',
      icon: '/images/notifications/confeti.svg',
      des: '<p>You just won a lottery! 250 BUSD has been transferred to your wallet.</p>',
      time: '2 hours ago',
    },
    {
      type: 'pool',
      icon: '/images/core/vote.svg',
      des: '<p>New epoch will start in 2 hours. Use your veYAKA to vote for your favorite pool.</p>',
      time: '5 hours ago',
    },
  ])
  const [read, setRead] = useState([
    {
      type: 'comment',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Markos</span> commented on your post.</p>",
      time: '15 min ago',
    },
    {
      type: 'follow',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Tomas</span> started following you.</p>",
      time: '19 min ago',
    },
    {
      type: 'like',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Tomas, Lara Thompson</span> and others liked your post.</p>",
      time: '19 min ago',
    },
    {
      type: 'invitation',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Markos</span>  has invite you to join Newbies group.</p>",
      time: '44 min ago',
    },
    {
      type: 'mentioned',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Lara Thompson</span> mentioned you in a comment.</p>",
      time: '40 min ago',
    },
    {
      type: 'achievement',
      icon: '/images/profile/badges/2.png',
      des: '<p>You have completed Rising Star Achievement.</p>',
      time: '40 min ago',
    },
    {
      type: 'transiction',
      icon: '/images/core/p3.png',
      des: "<p><span id='userName'>Tomas</span> has sent you 250 USDT.</p>",
      time: '40 min ago',
    },
    {
      type: 'nftOffer',
      icon: '/images/notifications/thenft.svg',
      des: "<p>Your received an offer for your <span id='nftName'>theNFT</span> on OpenSea.</p>",
      time: '40 min ago',
    },
  ])
  const [notifications, setNotifications] = useState([
    {
      val: false,
      key: 'Likes',
    },
    {
      val: false,
      key: 'Comments',
    },
    {
      val: false,
      key: 'Follows',
    },
    {
      val: false,
      key: 'Tags & Mentions',
    },
    {
      val: false,
      key: 'Invites',
    },
    {
      val: false,
      key: 'Posts',
    },
    {
      val: false,
      key: 'Achievements',
    },
    {
      val: false,
      key: 'Events',
    },
    {
      val: false,
      key: 'Lottery',
    },
    {
      val: false,
      key: 'pool',
    },
  ])
  const handleNotificationValue = (idx) => {
    const dup = [...notifications]
    dup[idx].val = !dup[idx].val
    setNotifications(dup)
  }
  return (
    <div className='w-full  2xl:max-w-full relative'>
      <OutsideClickHandler onOutsideClick={() => setFilter(false)}>
        <div className='w-full mb-4 flex items-center justify-between'>
          <TopTabs setTab={setTopTab} tab={topTab} tabs={topTabs} />
          <div className='flex items-center space-x-3'>
            <button className='flex items-center space-x-1.5'>
              <img alt='' src='/images/notifications/checkGreen.svg' />
              <span className='leading-5 text-green'>Mark all as read</span>
            </button>
            <button
              onClick={() => {
                setFilter(!filter)
              }}
              className='w-10 2xl:w-12  flex-shrink-0 h-[42px]'
            >
              <img alt='' className='w-full h-full' src='/images/common/filter.svg' />
            </button>
            <button>
              <img alt='' src='/images/notifications/settings.svg' />
            </button>
          </div>
        </div>
        {filter && (
          <div className='absolute  w-full top-14 right-10  bg-[#1A265E] max-h-[326px] overflow-auto max-w-[328px] rounded-[5px] p-4 z-20'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-lightGray leading-5'>Show only</span>
              <button className='text-green leading-5 font-medium focus-within:outline-none'>Clear</button>
            </div>
            {notifications.map((item, idx) => {
              return (
                <div key={idx} className={`${idx !== notifications.length - 1 ? 'mb-4' : ''} w-full  flex items-center space-x-2.5`}>
                  <Toggle
                    onChange={() => {
                      handleNotificationValue(idx)
                    }}
                    small
                    checked={item.val}
                    toggleId={item.key}
                  />
                  <p className='text-lightGray text-[16px] whitespace-nowrap'>{item.key}</p>
                </div>
              )
            })}
          </div>
        )}
      </OutsideClickHandler>
      {topTab === 'All Notifications' ? (
        <NotificationRender notifications={allNotifications} setNotifications={setAllnotifications} />
      ) : (
        <NotificationRender notifications={read} setNotifications={setRead} />
      )}
    </div>
  )
}

export default Notifications

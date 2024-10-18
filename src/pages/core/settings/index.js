import React, { useState } from 'react'
import TopTabs from 'components/CoreReuseAbleComponents/CoreTabs'
import ProfileSettings from './profileSettings'
import Notification from './notifications'
import AutoPosts from './autoPosts'

const Settings = () => {
  const topTabs = ['Profile Settings', 'Notifications', 'Auto Posts']
  const [topTab, setTopTab] = useState('Profile Settings')
  const renderTabs = (tab) => {
    switch (tab) {
      case 'Profile Settings':
        return <ProfileSettings />
      case 'Notifications':
        return <Notification />
      case 'Auto Posts':
        return <AutoPosts />
      default:
    }
  }
  return (
    <div className='w-full  2xl:max-w-full'>
      <TopTabs setTab={setTopTab} tab={topTab} tabs={topTabs} />
      <div className='mt-4'>{renderTabs(topTab)}</div>
    </div>
  )
}

export default Settings

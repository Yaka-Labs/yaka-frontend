import React, { Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import CoreLayout from 'components/CoreReuseAbleComponents/CoreLayout'

const Home = lazy(() => import('./home'))
const HomeDetail = lazy(() => import('./home/detail'))
const Competition = lazy(() => import('./competition'))
const CompetitionDetail = lazy(() => import('./competition/detail'))
const Trade = lazy(() => import('./competition/trade'))
const Profile = lazy(() => import('./profile'))
const Settings = lazy(() => import('./settings'))
const WaitList = lazy(() => import('./waitlist'))
const Notifications = lazy(() => import('./notifications'))
const ThenaIds = lazy(() => import('./thenaIds'))
const ThenaIdDetail = lazy(() => import('./thenaIds/detail'))
const Events = lazy(() => import('./events'))
const EventDetail = lazy(() => import('./events/detail'))
const Mint = lazy(() => import('./mint'))

const Core = () => {
  return (
    <CoreLayout>
      <Suspense>
        <Routes>
          <Route index element={<Navigate to='comps' replace />} exact />
          <Route path='home' element={<Home />} exact />
          <Route path='home/:id' element={<HomeDetail />} exact />
          <Route path='comps' element={<Competition />} exact />
          <Route path='comps/:id' element={<CompetitionDetail />} exact />
          <Route path='comps/:id/trade' element={<Trade />} exact />
          <Route path='profile/:id?/:slug?' element={<Profile />} exact />
          <Route path='settings' element={<Settings />} exact />
          <Route path='waitlists' element={<WaitList />} exact />
          <Route path='notifications' element={<Notifications />} exact />
          <Route path='thenaIds' element={<ThenaIds />} exact />
          <Route path='thenaIds/:id' element={<ThenaIdDetail />} exact />
          <Route path='events' element={<Events />} exact />
          <Route path='events/:id' element={<EventDetail />} exact />
          <Route path='mint' element={<Mint />} exact />
        </Routes>
      </Suspense>
    </CoreLayout>
  )
}

export default Core

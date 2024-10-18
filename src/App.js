import React, { Suspense, lazy, useState, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify'
import Header from 'layouts/Header'
import Footer from 'layouts/Footer'
// import Lottie from 'layouts/Lottie'
import { RefreshContextProvider } from 'context/RefreshContext'
import { VeTHEsContextProvider } from 'context/veTHEsConetext'
import { CompsContextProvider } from 'context/CompsContext'
import { PairsContextProvider } from 'context/PairsContext'
import { VaultsContextProvider } from 'context/VaultsContext'
import ApplicationUpdater from 'state/application/updater'
import MultiCallV3Updater from 'state/multicall/v3/updater'
import AssetsUpdater from 'state/assets/updater'
import PoolsUpdater from 'state/pools/updater'
import ManualsUpdater from 'state/manuals/updater'
import TokenDataContextProvider from 'context/TokenData'
import GlobalDataContextProvider from 'context/GlobalData'
import PairDataContextProvider from 'context/PairData'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactGA from 'react-ga4'
import './App.scss'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import TotalTvlUpdater from 'state/totaltvl/updater'

const queryClient = new QueryClient()

// const Home = lazy(() => import('./pages/home'))
const Swap = lazy(() => import('./pages/swap'))
const Liquidity = lazy(() => import('./pages/liquidity'))
const AddLiquidity = lazy(() => import('./pages/liquidity/addLiquidity'))
const Pools = lazy(() => import('./pages/pools1'))
const Vaults = lazy(() => import('./pages/vaults'))
const Lock = lazy(() => import('./pages/lock'))
const Vote = lazy(() => import('./pages/vote'))
const Rewards = lazy(() => import('./pages/rewards'))
const WhiteList = lazy(() => import('./pages/whiteList'))
const AddBribe = lazy(() => import('./pages/whiteList/bribeModal'))
const AddGauge = lazy(() => import('./pages/whiteList/gaugeModal'))
const PageNotFound = lazy(() => import('./pages/404'))
const Referral = lazy(() => import('./pages/referral'))
const Mint = lazy(() => import('./pages/mint'))
const AnalyticsOverview = lazy(() => import('./pages/analytics'))
const AnalyticsTokens = lazy(() => import('./pages/analytics/tokens'))
const AnalyticsPairs = lazy(() => import('./pages/analytics/pairs'))
const TokenDetails = lazy(() => import('./pages/analytics/token'))
const PairDetails = lazy(() => import('./pages/analytics/pair'))
const Campaign = lazy(() => import('./pages/campaign'))
const Nft = lazy(() => import('./pages/nft'))
const Lanunchpad = lazy(() => import('./pages/lanunchpad'))
const LanunchpadDetail = lazy(() => import('./pages/lanunchpad/detail'))

const Partner = lazy(() => import('./pages/partner/index'))

// const Core = lazy(() => import('./pages/core'))
// const MintThenaId = lazy(() => import('./pages/core/mint'))

const ContextProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <VeTHEsContextProvider>
        <VaultsContextProvider>
          <CompsContextProvider>
            <PairsContextProvider>
              <TokenDataContextProvider>
                <GlobalDataContextProvider>
                  <PairDataContextProvider>{children}</PairDataContextProvider>
                </GlobalDataContextProvider>
              </TokenDataContextProvider>
            </PairsContextProvider>
          </CompsContextProvider>
        </VaultsContextProvider>
      </VeTHEsContextProvider>
    </QueryClientProvider>
  )
}

const Updaters = () => {
  return (
    <>
      <ApplicationUpdater />
      <MultiCallV3Updater />
      <AssetsUpdater />
      <PoolsUpdater />
      <ManualsUpdater />
      <TotalTvlUpdater />
    </>
  )
}

const App = () => {
  const { pathname } = useLocation()
  ReactGA.initialize('G-QYCRTTD1XT')

  // const [isWidthGreaterThanHeight, setIsWidthGreaterThanHeight] = useState(false)
  //
  // useEffect(() => {
  //   const checkDimensions = () => {
  //     const { innerWidth, innerHeight } = window
  //     console.log(`Window dimensions: ${innerWidth} x ${innerHeight}`)
  //     setIsWidthGreaterThanHeight(innerWidth > innerHeight)
  //   }
  //
  //   checkDimensions()
  //   window.addEventListener('resize', checkDimensions)
  //
  //   return () => {
  //     window.removeEventListener('resize', checkDimensions)
  //   }
  // }, [])

  return (
    // <div className={`main ${isWidthGreaterThanHeight ? 'width-greater-than-height' : ''}`}>
    <div className='main'>
      <RefreshContextProvider>
        <ContextProviders>
          <Updaters />
          {pathname !== '/core/mint' && <Header />}
          <Suspense>
            <Routes>
              <Route path='/' element={<Swap />} exact />
              <Route path='/swap/*' element={<Swap />} />
              <Route path='/pools' element={<Pools />} exact />
              <Route path='/vaults' element={<Vaults />} exact />
              <Route path='/add/*' element={<AddLiquidity />} />
              <Route path='/liquidity/*' element={<Liquidity />} />
              <Route path='/lock' element={<Lock />} exact />
              <Route path='/vote' element={<Vote />} exact />
              <Route path='/vote/:veId' element={<Vote />} exact />
              <Route path='/rewards' element={<Rewards />} exact />
              <Route path='/whitelist' element={<WhiteList />} exact />
              <Route path='/whitelist/bribe' element={<AddBribe />} exact />
              <Route path='/whitelist/gauge' element={<AddGauge />} exact />
              <Route path='/theNFT' element={<Mint />} exact />
              <Route path='/referral' element={<Referral />} exact />
              <Route path='/analytics/:version?' element={<AnalyticsOverview />} exact />
              <Route path='/analytics/:version/pairs' element={<AnalyticsPairs />} exact />
              <Route path='/analytics/:version/tokens' element={<AnalyticsTokens />} exact />
              <Route path='/analytics/:version/token/:id' element={<TokenDetails />} exact />
              <Route path='/analytics/:version/pair/:id' element={<PairDetails />} exact />
              <Route path='/campaign' element={<Campaign />} exact />
              <Route path='/nft' element={<Nft />} exact />
              <Route path='/launchpad' element={<Lanunchpad />} exact />
              <Route path='/launchpad/:projectId/:inviterAddress' element={<LanunchpadDetail />} exact />
              <Route path='/ve33airdrop' element={<Partner />} exact />

              {/* <Route path='/core/*' element={<Core />} /> */}
              <Route path='*' element={<PageNotFound />} exact />
            </Routes>
            {pathname !== '/core/mint' && <Footer />}
          </Suspense>
        </ContextProviders>
      </RefreshContextProvider>
      <ToastContainer
        className='notify-class'
        position='bottom-left'
        theme='dark'
        closeOnClick={false}
        transition={Zoom}
        autoClose={5000}
        hideProgressBar
        closeButton={false}
      />
      <div id='widget-dom-id' />
    </div>
  )
}

export default App

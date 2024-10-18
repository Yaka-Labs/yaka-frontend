import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { TC_TIMESTAMP, TC_MARKET_TYPES, TC_STEPS, EVENT_TYPES } from 'config/constants/core'
import { ZERO_ADDRESS, fromWei } from 'utils/formatNumber'
import TopTabs from 'components/CoreReuseAbleComponents/CoreTabs'
import SearchInput from 'components/Input/SearchInput'
import TransparentButton from 'components/Buttons/transparentButton'
import { customNotify } from 'utils/notify'
import TabFilter from 'components/TabFilter'
import { SIZES } from 'config/constants'
import { CompsContext } from 'context/CompsContext'
import DropDown from 'components/NativeDropDown'
import Toggle from 'components/Toggle'
import { useWalletModal } from 'state/settings/hooks'
import { useTCManagerInfo } from 'hooks/core/useTCManager'
import { getEventType } from 'utils'
import Card from './NewsFeed/card'
import Preview from './Preview'
import CreateModal from './CreateModal'

const { MIN_REG, MIN_TS } = TC_TIMESTAMP

const INIT_VALUE = {
  entryFee: 0, // entry fee of 0 prize token
  maxParticipants: 1000, // max participants
  owner: {
    id: '',
  }, // owner address
  tradingCompetitionSpot: ZERO_ADDRESS, // trading competition contract address
  name: '', // competition name
  description: '', // competition description
  market: TC_MARKET_TYPES.SPOT, // market type

  timestamp: {
    registrationStart: new Date().getTime() + 60 * 60 * 24 * 1000, // start timestamp
    registrationEnd: new Date().getTime() + 60 * 60 * 24 * 1000 + MIN_REG, // end timestamp
    startTimestamp: new Date().getTime() + 60 * 60 * 24 * 1000 + MIN_REG, // registration start timestamp
    endTimestamp: new Date().getTime() + 60 * 60 * 24 * 1000 + MIN_REG + MIN_TS, // registration end timestamp
  },
  participantCount: 0,
  participants: [],
  prize: {
    placements: 2, //  number of placements
    ownerFee: 0, //  owner fee
    totalPrize: 0, //  total prize amounts
    token: '', //  prize tokens
    weights: [0, 0], //  placement weights
    // winType: false, //  win type
  },

  competitionRules: {
    startingBalance: 0, //  starting balance
    winningToken: null, //  winning token
    tradingTokens: [], //  trading tokens
  },
}

const filters = ['Default', 'Prize Pool Size', 'Most Attendees', 'Low Entry Fee']
const TOP_TABS = ['All Competitions', 'Hosted']

const Competition = () => {
  const [topTab, setTopTab] = useState(TOP_TABS[0])
  const [eventTab, setEventTab] = useState(EVENT_TYPES.ALL)
  const [marketTab, setMarketTab] = useState(TC_MARKET_TYPES.ALL)
  const [searchText, setSearchText] = useState('')
  const [loadMore, setLoadMore] = useState(4)
  const [sort, setSort] = useState(false)
  const [isSelected, setIsSelected] = useState()
  const [isFree, setisFree] = useState(false)
  const [data, setData] = useState(INIT_VALUE)
  const [currentStep, setCurrentStep] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { openWalletModal } = useWalletModal()
  const { isAllowed } = useTCManagerInfo()
  const { account } = useWeb3React()
  const compWithAssets = useContext(CompsContext)

  const renderContent = () => {
    return (
      <div className='flex items-center space-x-2 px-7 py-2.5 z-10'>
        <img src='/images/whiteList/add-icon.svg' alt='' />
        <span>CREATE COMPETITION</span>
      </div>
    )
  }

  const filteredData = useMemo(() => {
    let result = compWithAssets
    if (topTab !== TOP_TABS[0]) result = result.filter((ele) => account && ele.owner.id.toLowerCase() === account.toLowerCase())
    if (searchText) result = result.filter((ele) => ele.name.toLowerCase().includes(searchText.toLowerCase()))
    if (eventTab !== EVENT_TYPES.ALL) result = result.filter((ele) => getEventType(ele.timestamp) === eventTab)
    if (marketTab !== TC_MARKET_TYPES.ALL) result = result.filter((ele) => ele.market === marketTab)
    if (isFree) result = result.filter((ele) => fromWei(ele.entryFee).isZero())
    return result
  }, [compWithAssets, account, topTab, eventTab, marketTab, searchText, isFree])

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const isNearBottom = scrollY + windowHeight >= documentHeight - 100
      // setIsBottom(isNearBottom)
      if (isNearBottom) {
        setLoadMore(loadMore + 4)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div className='w-full 2xl:max-w-full'>
        <TopTabs setTab={setTopTab} tab={topTab} tabs={TOP_TABS} />
        <div className='mt-5 lg:flex-row flex flex-col-reverse items-center justify-between'>
          <div className='max-w-[300px] w-full hidden xl:block'>
            <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Competition, Host Name' full />
          </div>
          {account ? (
            <TransparentButton
              content={renderContent()}
              onClickHandler={() => {
                if (isAllowed) {
                  setIsCreateOpen(true)
                } else {
                  customNotify('No permssion', 'warn')
                }
              }}
              className='w-full lg:w-auto'
              isUpper
            />
          ) : (
            <TransparentButton onClickHandler={() => openWalletModal()} content='CONNECT WALLET' className='w-full lg:w-auto px-[25px] py-2.5' isUpper />
          )}
        </div>
        <div className='flex items-center justify-between mt-3 lg:mt-6 xl:space-x-4 2xl:space-x-9'>
          <TabFilter className='hidden xl:flex' data={Object.values(EVENT_TYPES)} filter={eventTab} setFilter={setEventTab} />
          <TabFilter className='hidden xl:flex' data={Object.values(TC_MARKET_TYPES)} filter={marketTab} setFilter={setMarketTab} />
          <div className='relative w-full xl:w-auto'>
            <div className='flex items-center space-x-3 xl:space-x-0 xl:block w-full'>
              {/* for mobile  */}
              <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Competition, Host Name' full className='xl:hidden' />
              <button
                onClick={() => {
                  setSort(!sort)
                }}
                className='w-10 2xl:w-12 xl:mt-2 flex-shrink-0 h-[42px]'
              >
                <img alt='' className='w-full h-full' src='/images/common/filter.svg' />
              </button>
            </div>

            {sort && (
              <div className='absolute right-0 w-full top-14 min-w-[328px] bg-[#1A265E] rounded-[5px] p-3 xl:p-4 z-20'>
                <p className='text-xl leading-6 font-figtree font-semibold xl:hidden text-white'>Filters</p>
                <TabFilter className='xl:hidden mt-3' size={SIZES.SMALL} data={Object.values(EVENT_TYPES)} filter={eventTab} setFilter={setEventTab} />
                <TabFilter className='xl:hidden mt-3' size={SIZES.SMALL} data={Object.values(TC_MARKET_TYPES)} filter={marketTab} setFilter={setMarketTab} />
                <div className='flex items-center space-x-2.5 mt-3.5 xl:mt-0'>
                  <span className='text-white whitespace-nowrap'>Sort by</span>
                  <DropDown arr={filters} setIsSelected={setIsSelected} isSelected={isSelected} className='w-full' />
                </div>
                <div className='flex items-center space-x-2 mt-5'>
                  <Toggle toggleId='freeToJoin' checked={isFree} onChange={() => setisFree(!isFree)} />
                  <p className='text-lightGray text-sm xl:text-[17px] whitespace-nowrap'>Free To Join</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* news feed cards */}
        <div className='w-full'>
          {filteredData?.length > 0 ? (
            <>
              {filteredData?.slice(0, loadMore).map((item, idx) => {
                return <Card key={idx} item={item} setActiveTab={setEventTab} setActiveTab2={setMarketTab} topTab={topTab} />
              })}
              {filteredData.length > 3 && (
                <button
                  onClick={() => {
                    setLoadMore(loadMore + 4)
                  }}
                  disabled={filteredData.length <= loadMore - 1}
                  className={` ${
                    filteredData.length <= loadMore - 1 ? 'hidden' : ''
                  } font-medium text-xl flex items-center justify-center w-full leading-6 text-green mt-6`}
                >
                  Load More
                </button>
              )}
            </>
          ) : (
            <div className='mt-6 flex flex-col items-center justify-center'>
              <p className='font-medium text-white text-lg text-center'>No data. Please change your filters</p>
              <button
                onClick={() => {
                  setSearchText(null)
                  setTopTab(TOP_TABS[0])
                  setEventTab(EVENT_TYPES.ALL)
                  setMarketTab(TC_MARKET_TYPES.ALL)
                  setIsSelected()
                }}
                className='px-5 py-2 rounded-lg bg-blue leading-5 mt-2.5 text-white'
              >
                Browse All Competitions
              </button>
            </div>
          )}
        </div>
      </div>
      {isCreateOpen && (
        <CreateModal
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isCreateOpen={isCreateOpen}
          setIsCreateOpen={setIsCreateOpen}
          data={data}
          setData={setData}
        />
      )}
      {currentStep === TC_STEPS.length && <Preview setIsCreateOpen={setIsCreateOpen} currentStep={currentStep} setCurrentStep={setCurrentStep} data={data} />}
    </>
  )
}

export default Competition

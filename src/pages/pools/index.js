import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StyledButton from 'components/Buttons/styledButton'
import Toggle from 'components/Toggle'
import TransparentButton from 'components/Buttons/transparentButton'
import TabFilter from 'components/TabFilter'
import MobileFilterModal from 'components/MobileFilterModal'
import { useAllHarvest } from 'hooks/useGauge'
import { NEW_POOLS, NEXT_EPOCH_TIMESTAMP, POOL_FILTERS } from 'config/constants'
import { ZERO_ADDRESS, getPoolType } from 'utils/formatNumber'
import SearchInput from 'components/Input/SearchInput'
import { usePools } from 'state/pools/hooks'
import { useNetwork } from 'state/settings/hooks'
import { ChainId } from 'thena-sdk-core'
import TablePairs from './components/tablePairs'
import NewTablePairs from './components/newTablePairs'
import useAutoDocumentTitle from '../../hooks/useAutoDocumentTitle'

const sortOptions = [
  {
    label: 'APR',
    value: 'apr',
    isDesc: true,
  },
  {
    label: 'TVL',
    value: 'tvl',
    isDesc: true,
  },
  {
    label: 'My Pool',
    value: 'pool',
    isDesc: true,
  },
  // {
  //   label: 'My Stake',
  //   value: 'stake',
  //   isDesc: true,
  // },
  {
    label: 'Fees',
    value: 'fees',
    isDesc: true,
  },
]
const newSortOptions = [
  {
    label: 'Projected APR',
    value: 'apr',
    isDesc: true,
  },
  {
    label: 'Total Staked',
    value: 'tvl',
    isDesc: true,
  },
  {
    label: 'My Pool',
    value: 'pool',
    isDesc: true,
  },
  {
    label: 'My Stake',
    value: 'stake',
    isDesc: true,
  },
  {
    label: 'Earnings',
    value: 'earn',
    isDesc: true,
  },
]

const renderContent = () => {
  return (
    <div className='flex items-center space-x-[6.8px] py-[6.8px].5 z-10 w-auto'>
      <img src='/images/whiteList/add-icon.svg' alt='' />
      <span>ADD LIQUIDITY</span>
    </div>
  )
}

const Pools = () => {
  useAutoDocumentTitle('Pools')
  const [filter, setFilter] = useState(POOL_FILTERS.ALL)
  const [isUpcomingShow, setIsUpcomingShow] = useState(true)
  const [isActiveShow, setIsActiveShow] = useState(true)
  const [mobileFilter, setMobileFilter] = useState(false)
  const [isStaked, setIsStaked] = useState(false)
  const [isInactive, setIsInactive] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [sort, setSort] = useState({
    label: 'TVL',
    value: 'tvl',
    isDesc: true,
  })
  const [newSort, setNewSort] = useState({})
  let pools = usePools()
  const { onAllHarvest } = useAllHarvest()
  const { networkId } = useNetwork()
  const filteredPools = useMemo(() => {
    // let final
    // if (isInactive) {
    //   final = pools.filter((ele) => ele.gauge.apr.isZero())
    // } else {
    //   final = pools.filter((ele) => !ele.gauge.apr.isZero())
    // }
    // const result = final.filter((item) => {
    //   const isCorrect = item.gauge.address !== ZERO_ADDRESS && item.isValid
    //   return isCorrect && ((isStaked && !item.account.gaugeBalance.isZero()) || !isStaked)
    // })
    // console.log(result)
    // const res = filter === POOL_FILTERS.ALL ? result : result.filter((item) => getPoolType(item) === filter)
    // if (!searchText || searchText === '') {
    //   return res
    // }

    pools = filter === POOL_FILTERS.ALL ? pools : pools.filter((item) => getPoolType(item) === filter)
    if (!searchText || searchText === '') {
      return pools
    }
    return (
      pools &&
      pools
        .filter((item) => {
          const withSpace = item.symbol.replace('/', ' ')
          const withComma = item.symbol.replace('/', ',')
          return (
            item.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
            withSpace.toLowerCase().includes(searchText.toLowerCase()) ||
            withComma.toLowerCase().includes(searchText.toLowerCase())
          )
        })
        .sort((a, b) => b.tvl - a.tvl)
    )
  }, [pools, filter, searchText, isStaked, isInactive])

  const newFilteredPools = useMemo(() => {
    if (new Date().getTime() / 1000 < NEXT_EPOCH_TIMESTAMP) {
      const result = pools.filter((item) => NEW_POOLS[networkId].includes(item.address))
      const res = filter === POOL_FILTERS.ALL ? result : result.filter((item) => getPoolType(item) === filter)
      if (!searchText || searchText === '') {
        return res
      }
      return (
        res &&
        res.filter((item) => {
          const withSpace = item.symbol.replace('/', ' ')
          const withComma = item.symbol.replace('/', ',')
          return (
            item.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
            withSpace.toLowerCase().includes(searchText.toLowerCase()) ||
            withComma.toLowerCase().includes(searchText.toLowerCase())
          )
        })
      )
    }
    return []
  }, [pools, searchText, filter, networkId])

  const oldFilteredPools = useMemo(() => {
    // if (new Date().getTime() / 1000 < timestamp) {
    //   return filteredPairs.filter((item) => !NewPools.includes(item.address))
    // }
    return filteredPools
  }, [filteredPools])

  console.log({ oldFilteredPools })

  const sortedPools = useMemo(() => {
    return oldFilteredPools.sort((a, b) => {
      let res
      switch (sort.value) {
        case 'apr':
          res = a.gauge.apr
            .minus(b.gauge.apr)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'tvl':
          // res = a.gauge.tvl
          //   .minus(b.gauge.tvl)
          //   .times(sort.isDesc ? -1 : 1)
          //   .toNumber()
          res = a.tvl
            .minus(b.tvl)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'pool':
          res = a.account.totalUsd
            .minus(b.account.totalUsd)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'stake':
          res = a.account.stakedUsd
            .minus(b.account.stakedUsd)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'earn':
          res = a.account.earnedUsd
            .minus(b.account.earnedUsd)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break

        default:
          break
      }
      return res
    })
  }, [oldFilteredPools, sort])

  const newSortedPools = useMemo(() => {
    return newFilteredPools.sort((a, b) => {
      let res
      switch (newSort.value) {
        case 'apr':
          res = a.gauge.projectedApr
            .minus(b.gauge.projectedApr)
            .times(newSort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'tvl':
          // res = a.gauge.tvl
          //   .minus(b.gauge.tvl)
          //   .times(newSort.isDesc ? -1 : 1)
          //   .toNumber()
          res = a.tvl
            .minus(b.tvl)
            .times(newSort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'pool':
          res = a.account.totalUsd
            .minus(b.account.totalUsd)
            .times(newSort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'stake':
          res = a.account.stakedUsd
            .minus(b.account.stakedUsd)
            .times(newSort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'earn':
          res = a.account.earnedUsd
            .minus(b.account.earnedUsd)
            .times(newSort.isDesc ? -1 : 1)
            .toNumber()
          break

        default:
          break
      }
      return res
    })
  }, [newFilteredPools, newSort])

  const earnedPools = useMemo(() => {
    return pools.filter((pool) => !pool.account.earnedUsd.isZero())
  }, [pools, isInactive])

  const navigate = useNavigate()

  const handlePopup = () => {
    navigate('/add/v1')
  }

  return (
    <div
      className='max-w-[1020px] px-5 sm:px-[54.4px] md:px-[95.2px] mdLg:px-[136px] lg:px-[17px] xl:px-0 pt-[68px] mx-auto
'
    >
      <div className='lg:flex items-end justify-between'>
        <div className='w-full'>
          <h1
            className='text-[34px] md:text-[35.7px] font-semibold text-white  font-figtree
'
          >
            Pools
          </h1>
          <p className='text-[#b8b6cb] text-base md:text-[16.3px] leading-[22px] md:leading-[20.4px] mt-[3.4px]'>
            Pair your tokens to provide liquidity.&nbsp;
            {/* Stake the LP tokens to earn YAKA.&nbsp; */}
            <a href='https://yaka.gitbook.io/yaka-finance' target='_blank' rel='noreferrer' className='text-red'>
              Learn More
            </a>
          </p>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row justify-between mt-[13.6px]'>
        <div className='mt-3 lg:mt-0 flex-col flex md:flex-row items-center space-y-3 md:space-y-0 md:space-x-[10.2px] '>
          {/* <StyledButton
            disabled={earnedPools.length === 0}
            onClickHandler={() => {
              onAllHarvest(earnedPools)
            }}
            content={`CLAIM ALL EARNINGS (${earnedPools.length})`}
            className='px-[33px] py-[13px] w-full md:w-1/2 mdLg:w-auto'
          /> */}
          {/*mdLg:w-auto 解决mac小屏幕Add Liquidity分行问题*/}
          <TransparentButton content={renderContent()} className='h-[42px] md:h-[44.2px] px-7 lg:hidden w-full md:w-1/2' onClickHandler={handlePopup} isUpper />
          <div className='w-full'>
            <TabFilter data={Object.values(POOL_FILTERS)} filter={filter} setFilter={setFilter} />
          </div>
        </div>
        <div className='mt-3 lg:mt-0 flex lg:items-center space-x-3 lg:space-x-[17px]'>
          <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Search Pair or Token' />
          <TransparentButton content={renderContent()} className='h-[44.2px] px-[10.2px] lg:px-[23.8px]  hidden lg:flex' onClickHandler={handlePopup} isUpper />
          <button
            onClick={() => {
              setMobileFilter(!mobileFilter)
            }}
            className='w-[40.8px] flex-shrink-0 h-[35.7px] lg:hidden'
          >
            <img alt='' className='w-[40.8px] h-[35.7px]' src='/images/common/filter.svg' />
          </button>
        </div>
      </div>
      <div className='flex items-center justify-between w-full mt-[19.55px] lg:space-x-[27.2px] xl:space-x-[51px] relative'>
        {/* for desktop */}
        <div className='w-full hidden lg:flex items-center space-x-[27.2px]'>
          {/* <TabFilter data={Object.values(POOL_FILTERS)} filter={filter} setFilter={setFilter} /> */}
          {/* <div className='flex items-center space-x-2'>
            <Toggle checked={isStaked} onChange={() => setIsStaked(!isStaked)} toggleId='isStaked' />
            <p className='text-lightGray text-sm xl:text-[17px] whitespace-nowrap'>Staked Only</p>
          </div>
          <div className='flex items-center space-x-2'>
            <Toggle checked={isInactive} onChange={() => setIsInactive(!isInactive)} toggleId='isInactive' />
            <p className='text-lightGray text-sm xl:text-[17px] whitespace-nowrap'>Inactive Pools</p>
          </div> */}
        </div>

        {/* mobile filters popup */}
        {mobileFilter && (
          <MobileFilterModal
            setMobileFilter={setMobileFilter}
            setFilter={setFilter}
            filter={filter}
            tabs={Object.values(POOL_FILTERS)}
            isStaked={isStaked}
            setIsStaked={setIsStaked}
            isInactive={isInactive}
            setIsInactive={setIsInactive}
            sort={sort}
            setSort={setSort}
            sortOptions={sortOptions}
          />
        )}
      </div>
      {newSortedPools.length > 0 && (
        <>
          <div className='flex items-center justify-between mt-[26.35px] pb-[9.35px] line-red'>
            <div className='flex items-center space-x-[3.4px].5'>
              <span className='text-white text-[15.3px] lg:text-[18.7px] font-semibold font-figtree'>UPCOMING POOLS</span>
              {/* <img alt='' src='/images/swap/question-mark.png' /> */}
            </div>
            <div className='text-red text-[12.75px] lg:text-[15.3px] font-medium cursor-pointer' onClick={() => setIsUpcomingShow(!isUpcomingShow)}>
              {isUpcomingShow ? 'Hide -' : 'Show +'}
            </div>
          </div>
          {isUpcomingShow && (
            <div className='mt-[13.6px]'>
              <NewTablePairs pools={newSortedPools} sort={newSort} setSort={setNewSort} sortOptions={newSortOptions} filter={filter} searchText={searchText} />
            </div>
          )}
        </>
      )}
      <div className='flex items-center justify-between mt-[26.35px] pb-[9.35px] line-red'>
        <div className='flex items-center space-x-[5.1px]'>
          {/* <span className='text-white text-[18px] lg:text-[22px] font-semibold font-figtree'>{isInactive ? 'INACTIVE' : 'ACTIVE'} POOLS</span> */}
          {/* <img alt='' src='/images/swap/question-mark.png' /> */}
        </div>
        <div className='text-red text-[12.75px] lg:text-[15.3px] font-medium cursor-pointer' onClick={() => setIsActiveShow(!isActiveShow)}>
          {isActiveShow ? 'Hide -' : 'Show +'}
        </div>
      </div>
      {isActiveShow && (
        <div className='mt-[13.6px]'>
          <TablePairs pools={sortedPools} sort={sort} setSort={setSort} sortOptions={sortOptions} filter={filter} searchText={searchText} isStaked={isStaked} />
        </div>
      )}
    </div>
  )
}

export default Pools

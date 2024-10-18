import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchInput from 'components/Input/SearchInput'
import Pagination from 'components/Pagination'
import { NUMBER_OF_NOWS } from 'config/constants'
import { sliceAddress } from 'utils'
import { formatNumber, fromWei } from 'utils/formatNumber'
import Clock from 'components/Clock'
import { squidClient } from 'apollo/client'
import { TC_PARTCIPANTS_BY_COMPETITION_ID } from 'apollo/coreQueries'

const sortOptions = [
  {
    label: 'Rank',
    value: 'rank',
    isDesc: true,
  },
  {
    label: 'Username',
    value: 'username',
    isDesc: true,
  },
  {
    label: 'Profit & Loss',
    value: 'volume',
    isDesc: true,
  },
  {
    label: 'Potential Reward',
    value: 'rewards',
    isDesc: true,
  },
]

const Leaderboard = ({ id }) => {
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)
  const [leaderboardData, setLeaderboardData] = useState([])

  useEffect(() => {
    squidClient
      .query({
        query: TC_PARTCIPANTS_BY_COMPETITION_ID(id),
      })
      .then((res) => {
        setLeaderboardData(res.data.tcParticipants)
      })
  }, [id])

  const filteredData = useMemo(() => {
    return searchText ? leaderboardData.filter((item) => item.id.toLowerCase().includes(searchText.toLowerCase())) : leaderboardData
  }, [leaderboardData, searchText])

  const pageCount = useMemo(() => {
    return Math.ceil(filteredData.length / pageSize)
  }, [filteredData, pageSize])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  return (
    leaderboardData && (
      <>
        <div className='bg-[#101645] rounded-[5px]  pt-5 md:pt-4 mt-5'>
          <div className='md:flex items-center justify-between px-3 md:px-5'>
            <div className='flex items-center space-x-4 justify-between w-full md:w-auto md:justify-start'>
              <p className='text-lg md:text-[22px] leading-[22px] md:leading-[27px] font-semibold text-white font-figtree'>LEADERBOARD</p>
              <Clock />
            </div>
            <div className='md:max-w-[260px] w-full mt-2 md:mt-0'>
              <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Search' full />
            </div>
          </div>
          <div className='mt-5 lg:flex justify-between hidden z-[100] px-3 md:px-5 py-[0.475rem]'>
            {sortOptions.map((option, index) => (
              <div
                className={`${index === 0 && 'w-[20%]'} ${index === 1 && 'w-[45%]'} ${index === 2 && 'w-[30%]'} ${
                  index === 3 && 'w-[25%] flex items-center justify-end'
                } font-medium text-[17px] xl:text-[18px] text-white font-figtree`}
                key={`header-${index}`}
              >
                <p>{option.label}</p>
              </div>
            ))}
          </div>
          {filteredData.length > 0 ? (
            filteredData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((item, idx) => {
              return (
                <div
                  key={idx + 2}
                  className={`${idx === 0 ? 'mt-3 lg:mt-0' : ''} px-4 lg:px-5 flex flex-wrap lg:flex-nowrap items-start lg:items-center
             w-full justify-between  transition-all duration-150 ease-in-out text-lightGray py-4 ${idx % 2 !== 0 ? '' : 'bg-[#1A265E]'} `}
                >
                  <div className='flex flex-col w-1/2 lg:w-[20%] items-start justify-center'>
                    <p className='lg:hidden text-[13px] font-figtree font-semibold'>Rank</p>
                    {idx + 1 === 1 ? (
                      <img className='w-9 h-9 lg:w-auto lg:h-auto' alt='' src='/images/core/one.png' />
                    ) : idx + 1 === 2 ? (
                      <img alt='' className='w-9 h-9 lg:w-auto lg:h-auto' src='/images/core/two.png' />
                    ) : idx + 1 === 3 ? (
                      <img alt='' className='w-9 h-9 lg:w-auto lg:h-auto' src='/images/core/three.png' />
                    ) : (
                      <div className='text-xl font-bold'>{idx + 1}</div>
                    )}
                  </div>
                  <div className='flex flex-col w-1/2 lg:w-[45%] items-start justify-center'>
                    <p className='lg:hidden text-[13px] font-figtree font-semibold'>Username</p>
                    <Link
                      to={`/core/profile/${item?.participant?.id.toUpperCase()}/activity`}
                      className='flex items-center space-x-1.5 md:space-x-2.5 text-white hover:text-green'
                    >
                      <img
                        alt=''
                        src={item?.profilePic ? item?.profilePic : '/images/settings/placeholderProfilePic.svg'}
                        className='md:w-9 w-7 h-7 md:h-9 rounded-full'
                      />
                      <div className='font-figtree text-[15px] xl:text-[17px]'>{sliceAddress(item?.id)}</div>
                    </Link>
                  </div>
                  <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[30%] items-start justify-center'>
                    <p className='lg:hidden text-[13px] font-figtree font-semibold'>Profit & Loss</p>
                    <div className='text-base '>{formatNumber(fromWei(item.pnl, item.tradingCompetition.competitionRules?.winningTokenDecimal))}</div>
                  </div>
                  <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[25%] lg:items-end justify-center'>
                    <p className='lg:hidden text-[13px] font-figtree font-semibold'>Potential Reward</p>
                    <div className='text-base'>{formatNumber(fromWei(item.winAmount, item.tradingCompetition.competitionRules?.winningTokenDecimal))}</div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className='text-center py-10 text-white font-figtree text-lg font-semibold'>No participants</p>
          )}
        </div>
        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          handlePageClick={handlePageClick}
          pageCount={pageCount}
          currentPage={currentPage}
          total={filteredData.length}
        />
      </>
    )
  )
}

export default Leaderboard

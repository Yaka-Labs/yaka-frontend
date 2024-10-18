import React, { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import SearchInput from 'components/Input/SearchInput'
import Pagination from 'components/Pagination'
import { NUMBER_OF_NOWS } from 'config/constants'
import TransparentButton from 'components/Buttons/transparentButton'
import { addEventsData } from 'state/application/actions'

const Index = ({ attendiesData }) => {
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)
  const dispatch = useDispatch()
  const sortOptions = [
    {
      label: 'Username',
      value: 'username',
      isDesc: true,
    },
    {
      label: 'Profile Rank',
      value: 'profileRank',
      isDesc: true,
    },
    {
      label: 'Total Trading Volume',
      value: 'totalTradingVolume',
      isDesc: true,
    },
    {
      label: '',
      value: '',
    },
  ]

  const filteredData = useMemo(() => {
    return searchText ? attendiesData.filter((item) => item.userName.toLowerCase().includes(searchText.toLowerCase())) : attendiesData
  }, [attendiesData, searchText])

  const pageCount = useMemo(() => {
    return Math.ceil(filteredData.length / pageSize)
  }, [filteredData, pageSize])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  return (
    <>
      <div className='bg-[#101645] rounded-[5px]  pt-4 mt-5'>
        <div className='flex items-center justify-between px-5'>
          <p className='text-[22px] leading-[27px] font-semibold text-white font-figtree'>Attendees ({attendiesData.length})</p>
          <div className='max-w-[260px] w-full'>
            <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Search' full />
          </div>
        </div>
        <div className='mt-5 lg:flex justify-between hidden z-[100] px-5 py-[0.475rem]'>
          {sortOptions.map((option, index) => (
            <div
              className={`${index === 0 && 'w-[40%]'} ${index === 1 && 'w-[40%]'} ${index === 2 && 'w-[40%]'} ${
                index === 3 && 'w-[20%] flex items-center justify-end'
              } font-medium text-[17px] xl:text-[18px] text-white font-figtree`}
              key={`header-${index}`}
            >
              <div
                // onClick={() => {
                //   setSort({
                //     ...option,
                //     isDesc: sort.value === option.value ? !sort.isDesc : true,
                //   })
                // }}
                className='flex items-center cursor-pointer space-x-1 -ml-1 relative'
              >
                {/* {sort.value === option.value && (
                <button className={`${sort.isDesc ? '' : 'rotate-180'} transform absolute -left-3.5`}>
                  <img alt='' src='/images/common/filter-arrow.svg' />
                </button>
              )} */}
                <p className='flex items-center'>{option.label}</p>
              </div>
            </div>
          ))}
        </div>
        {filteredData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((item, idx) => {
          return (
            <div
              key={idx}
              className={`px-5 flex flex-wrap lg:flex-nowrap items-start lg:items-center
              w-full justify-between hover:bg-[#1A265E] transition-all duration-150 ease-in-out text-lightGray py-4 ${
                idx % 2 !== 0 ? '' : 'bg-white bg-opacity-[0.04]'
              }`}
            >
              <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[40%] items-start justify-center'>
                <p className='lg:hidden text-sm font-figtree font-semibold'>Username</p>
                <Link
                  onClick={() => dispatch(addEventsData({}))}
                  to={`/core/profile/${idx}/activity`}
                  className='flex items-center space-x-2.5 text-white hover:text-green'
                >
                  <img alt='' src={item.profilePic} className='w-9 h-9 rounded-full' />
                  <div className='text-base  font-figtree sm:text-[17px] lg:text-[15px] xl:text-[17px]'>{item.userName}</div>
                </Link>
              </div>
              <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[40%] items-start justify-center'>
                <p className='lg:hidden text-sm font-figtree font-semibold'>Profile Rank</p>
                <div className='text-base font-semibold'>{item.rank}</div>
              </div>
              <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[40%] items-start justify-center'>
                <p className='lg:hidden text-sm font-figtree font-semibold'>Total Trading Volume</p>
                <div className='text-base font-semibold'>${item.volume}</div>
              </div>
              <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[20%] items-end justify-center'>
                <p className='lg:hidden text-sm font-figtree font-semibold' />
                <TransparentButton content='Follow' className='px-5 py-2' />
              </div>
            </div>
          )
        })}
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
}

export default Index

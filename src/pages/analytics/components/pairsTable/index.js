import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from 'components/Pagination'
import DoubleCurrencyLogo from 'components/DoubleCurrencyLogo'
import { NUMBER_OF_NOWS } from 'config/constants'
import { useAnalyticsVersion } from 'hooks/useGeneral'
import { useBookmarkPairs } from 'state/application/hooks'
import { formatNumber } from 'utils/formatNumber'

const MaxLength = 10

const SORT_FIELD = {
  NAME: 'name',
  LIQ: 'trackedReserveUSD',
  DAYVOL: 'oneDayVolumeUSD',
  WEEKVOL: 'oneWeekVolumeUSD',
  FEES: 'oneDayFeesUSD',
  WEEKFEES: 'oneWeekFeesUSD',
}

const HeaderOptions = [
  {
    label: 'Name',
    sort: SORT_FIELD.NAME,
  },
  {
    label: 'Liquidity',
    sort: SORT_FIELD.LIQ,
  },
  {
    label: '24H Volume',
    sort: SORT_FIELD.DAYVOL,
  },
  {
    label: '7D Volume',
    sort: SORT_FIELD.WEEKVOL,
  },
  {
    label: '24H Fees',
    sort: SORT_FIELD.FEES,
  },
  {
    label: '7D Fees',
    sort: SORT_FIELD.WEEKFEES,
  },
]

const PairsTable = ({ pairsData, isTop = false }) => {
  const { bookmarkPairs, addBookmarkPair, removeBookmarkPair } = useBookmarkPairs()
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ)
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)
  const version = useAnalyticsVersion()
  const navigate = useNavigate()

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  const pageCount = useMemo(() => {
    return Math.ceil(pairsData.length / pageSize)
  }, [pairsData, pageSize])

  const sortedList = useMemo(() => {
    return (
      pairsData &&
      pairsData
        .sort((a, b) => {
          if (sortedColumn === SORT_FIELD.NAME) {
            return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
          }
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn]) ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        })
        .slice(0, isTop ? MaxLength : pairsData.length)
        .slice(pageSize * currentPage, (currentPage + 1) * pageSize)
    )
  }, [pairsData, pageSize, currentPage, sortDirection, sortedColumn])

  const renderData = (data) => {
    return (
      <>
        <div className='w-1/2 lg:w-[13%] mt-[11px] lg:mt-0'>
          <p className='lg:hidden text-sm font-figtree font-semibold'>{HeaderOptions[1].label}</p>
          <div className='text-lightGray leading-5 '>${formatNumber(data.trackedReserveUSD)}</div>
        </div>
        <div className='w-1/2 lg:w-[13%] mt-[11px] lg:mt-0'>
          <p className='lg:hidden text-sm font-figtree font-semibold'>{HeaderOptions[2].label}</p>
          <div className='text-lightGray leading-5 '>${formatNumber(data.oneDayVolumeUSD)}</div>
        </div>
        <div className='w-1/2 lg:w-[13%] mt-[15px] lg:mt-0'>
          <p className='lg:hidden text-sm font-figtree font-semibold'>{HeaderOptions[3].label}</p>
          <div className='text-lightGray leading-5'>${formatNumber(data.oneWeekVolumeUSD)}</div>
        </div>
        <div className='w-1/2 lg:w-[13%] mt-[15px] lg:mt-0'>
          <p className='lg:hidden text-sm font-figtree font-semibold'>{HeaderOptions[4].label}</p>
          <div className='text-lightGray leading-5'>${formatNumber(data.oneDayFeesUSD)}</div>
        </div>
        <div className='w-1/2 lg:w-[13%] mt-[15px] lg:mt-0'>
          <p className='lg:hidden text-sm font-figtree font-semibold'>{HeaderOptions[5].label}</p>
          <div className='text-lightGray leading-5'>${formatNumber(data.oneWeekFeesUSD)}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='w-full border border-[#0000AF] bg-[#111642] rounded-[5px] lg:px-6 pb-2.5 lg:pb-6 pt-4 mt-3.5'>
        <div className='lg:flex justify-between hidden text-white font-figtree font-medium text-[17px] xl:text-[18px] pb-3.5 border-b border-[#0000AF]'>
          {HeaderOptions.map((option, idx) => {
            return (
              <div key={idx} className={`${idx === 0 ? 'w-[35%]' : idx > 3 ? 'w-[13%]' : 'w-[13%]'}`}>
                <button
                  onClick={() => {
                    setSortedColumn(option.sort)
                    setSortDirection(sortedColumn !== option.sort ? true : !sortDirection)
                  }}
                  className='flex items-center space-x-[3px]'
                >
                  <span className={`${sortedColumn === option.sort ? 'text-[#26FFFE]' : ''}`}>{option.label}</span>
                  {sortedColumn === option.sort && (
                    <svg
                      className={`${!sortDirection ? 'rotate-180 text-[#26FFFE]' : 'text-[#26FFFE]'} `}
                      xmlns='http://www.w3.org/2000/svg'
                      width={16}
                      height={16}
                      viewBox='0 0 16 16'
                    >
                      <g id='arrow-bottom' transform='translate(-368 -325)'>
                        <rect id='Rectangle_9736' data-name='Rectangle 9736' width={16} height={16} transform='translate(368 325)' fill='none' />
                        <path
                          id='svgexport-9'
                          d='M16,10,14.942,8.943,10.75,13.127V4H9.25v9.127L5.065,8.935,4,10l6,6Z'
                          transform='translate(366 323)'
                          fill='currentColor'
                        />
                      </g>
                    </svg>
                  )}
                </button>
              </div>
            )
          })}
        </div>
        {sortedList.length > 0 ? (
          sortedList.map((pair, index) => {
            return (
              <div
                className={`${index > 0 ? 'lg:pt-7 pt-[17px]' : 'lg:pt-5'} ${
                  index !== sortedList.length - 1 ? 'border-b lg:border-b-0 border-[#0000AF] pb-2.5 lg:pb-0' : 'pb-2.5 lg:pb-0'
                }  flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between px-4 lg:px-0  text-lightGray`}
                key={`token-${index}`}
              >
                <div className='flex items-center space-x-3 w-full lg:w-[35%]'>
                  <button
                    onClick={() => {
                      const tokenIndex = bookmarkPairs.indexOf(pair.id)
                      if (tokenIndex === -1) {
                        addBookmarkPair(pair.id)
                      } else {
                        removeBookmarkPair(pair.id)
                      }
                    }}
                    className={`${bookmarkPairs.indexOf(pair.id) > -1 ? 'text-[#EDB831]' : 'text-[#757384]'}`}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='icon icon-tabler icon-tabler-star-filled'
                      width={24}
                      height={24}
                      viewBox='0 0 24 24'
                      strokeWidth={2}
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                      <path
                        d='M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z'
                        strokeWidth={0}
                        fill='currentColor'
                      />
                    </svg>
                  </button>
                  <div
                    className='flex items-center space-x-1.5 cursor-pointer'
                    onClick={() => {
                      navigate(`/analytics/${version}/pair/${pair.id}`)
                    }}
                  >
                    <DoubleCurrencyLogo logo1={pair.token0.logoURI} logo2={pair.token1.logoURI} />
                    <div className='flex items-center space-x-2'>
                      <p className='text-lightGray text-[17px] leading-5 font-medium'>
                        {pair.token0.symbol}/{pair.token1.symbol}
                      </p>
                      {pair.fee && (
                        <div className='py-1 px-2 w-fit rounded-md bg-white bg-opacity-[0.07] leading-4 text-sm'>{Number(pair.fee) / 10000}% Fee</div>
                      )}
                    </div>
                  </div>
                </div>
                {renderData(pair, index)}
              </div>
            )
          })
        ) : (
          <div className='pt-[38.5px] pb-3 flex items-center justify-center w-full text-[22px] leading-7 font-medium text-white font-figtree'>No Results</div>
        )}
      </div>
      {!isTop && pairsData.length > MaxLength && (
        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          handlePageClick={handlePageClick}
          pageCount={pageCount}
          currentPage={currentPage}
          total={pairsData.length}
        />
      )}
    </>
  )
}

export default PairsTable

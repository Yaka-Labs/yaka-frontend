import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from 'components/Pagination'
import { NUMBER_OF_NOWS } from 'config/constants'
import { useBookmarkTokens } from 'state/application/hooks'
import { formatNumber } from 'utils/formatNumber'
import PercentChip from 'components/ChipLabel/percentChip'

const MaxLength = 10

const SORT_FIELD = {
  NAME: 'name',
  LIQ: 'totalLiquidityUSD',
  VOL: 'oneDayVolumeUSD',
  PRICE: 'priceUSD',
  CHANGE: 'priceChangeUSD',
}

const HeaderOptions = [
  {
    label: 'Name',
    sort: SORT_FIELD.NAME,
  },
  {
    label: 'Price',
    sort: SORT_FIELD.PRICE,
  },
  {
    label: 'Price Change',
    sort: SORT_FIELD.CHANGE,
  },
  {
    label: '24H Volume',
    sort: SORT_FIELD.VOL,
  },
  {
    label: 'Liquidity',
    sort: SORT_FIELD.LIQ,
  },
]

const TokensTable = ({ tokensData, version, isTop = false }) => {
  const { bookmarkTokens, addBookmarkToken, removeBookmarkToken } = useBookmarkTokens()
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.VOL)
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)
  const navigate = useNavigate()
  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  const pageCount = useMemo(() => {
    return Math.ceil(tokensData.length / pageSize)
  }, [tokensData, pageSize])

  const sortedList = useMemo(() => {
    return (
      tokensData &&
      tokensData
        .sort((a, b) => {
          if (sortedColumn === SORT_FIELD.NAME) {
            return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
          }
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn]) ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        })
        .slice(0, isTop ? MaxLength : tokensData.length)
        .slice(pageSize * currentPage, (currentPage + 1) * pageSize)
    )
  }, [tokensData, pageSize, currentPage, sortDirection, sortedColumn])

  const renderData = (data) => {
    return (
      <>
        <div className='w-1/2 lg:w-[15%] mt-[11px] lg:mt-0'>
          <p className='lg:hidden text-sm font-figtree font-semibold'>{HeaderOptions[1].label}</p>
          <div className='text-lightGray leading-5 '>${formatNumber(data.priceUSD)}</div>
        </div>
        <div className='w-1/2 lg:w-[15%] mt-[11px] lg:mt-0'>
          <p className='lg:hidden text-sm font-figtree font-semibold'>{HeaderOptions[2].label}</p>
          <div className='leading-5 w-full'>
            <PercentChip value={data.priceChangeUSD} />
          </div>
        </div>
        <div className='w-1/2 lg:w-[15%] mt-[15px] lg:mt-0'>
          <p className='lg:hidden text-sm font-figtree font-semibold'>{HeaderOptions[3].label}</p>
          <div className='text-lightGray leading-5'>${formatNumber(data.oneDayVolumeUSD)}</div>
        </div>
        <div className='w-1/2 lg:w-[15%] mt-[15px] lg:mt-0'>
          <p className='lg:hidden text-sm font-figtree font-semibold'>{HeaderOptions[4].label}</p>
          <div className='text-lightGray leading-5'>${formatNumber(data.totalLiquidityUSD)}</div>
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
              <div key={idx} className={`${idx === 0 ? 'w-[30%]' : 'w-[15%]'}`}>
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
          sortedList.map((token, index) => {
            return (
              <div
                className={`${index > 0 ? 'lg:pt-7 pt-[17px]' : 'lg:pt-5'} ${
                  index !== sortedList.length - 1 ? 'border-b lg:border-b-0 border-[#0000AF] pb-2.5 lg:pb-0' : 'pb-2.5 lg:pb-0'
                }  flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between px-4 lg:px-0  text-lightGray`}
                key={`token-${index}`}
              >
                <div className='flex items-center space-x-3 w-full lg:w-[30%]'>
                  <button
                    onClick={() => {
                      const tokenIndex = bookmarkTokens.indexOf(token.id)
                      if (tokenIndex === -1) {
                        addBookmarkToken(token.id)
                      } else {
                        removeBookmarkToken(token.id)
                      }
                    }}
                    className={`${bookmarkTokens.indexOf(token.id) > -1 ? 'text-[#EDB831]' : 'text-[#757384]'}`}
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
                    className='flex items-center space-x-2 cursor-pointer'
                    onClick={() => {
                      navigate(`/analytics/${version}/token/${token.id}`)
                    }}
                  >
                    <img className='w-[30px] h-[30px]' alt='' src={token.logoURI} />
                    <div className='flex items-center space-x-1.5'>
                      <p className='text-lightGray text-[17px] leading-5 font-medium'>{token.name}</p>
                      <p className='text-sm leading-[17px] text-[#B8B6CB]'>{token.symbol}</p>
                    </div>
                  </div>
                </div>
                {renderData(token, index)}
              </div>
            )
          })
        ) : (
          <div className='pt-[38.5px] pb-3 flex items-center justify-center w-full text-[22px] leading-7 font-medium text-white font-figtree'>No Results</div>
        )}
      </div>
      {!isTop && tokensData.length > 10 && (
        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          handlePageClick={handlePageClick}
          pageCount={pageCount}
          currentPage={currentPage}
          total={tokensData.length}
        />
      )}
    </>
  )
}

export default TokensTable

import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import Pagination from 'components/Pagination'
import { NUMBER_OF_NOWS, SCAN_URLS, TXN_TYPE } from 'config/constants'
import { formatNumber } from 'utils/formatNumber'
import { useNetwork } from 'state/settings/hooks'

function getTransactionType(event, symbol0, symbol1) {
  const formattedS0 = symbol0?.length > 8 ? symbol0.slice(0, 7) + '...' : symbol0
  const formattedS1 = symbol1?.length > 8 ? symbol1.slice(0, 7) + '...' : symbol1
  switch (event) {
    case TXN_TYPE.ADD:
      return 'Add ' + formattedS0 + ' and ' + formattedS1
    case TXN_TYPE.REMOVE:
      return 'Remove ' + formattedS0 + ' and ' + formattedS1
    case TXN_TYPE.SWAP:
      return 'Swap ' + formattedS0 + ' for ' + formattedS1
    default:
      return ''
  }
}

const formatTime = (unix) => {
  const now = dayjs()
  const timestamp = dayjs.unix(unix)

  const inSeconds = now.diff(timestamp, 'second')
  const inMinutes = now.diff(timestamp, 'minute')
  const inHours = now.diff(timestamp, 'hour')
  const inDays = now.diff(timestamp, 'day')

  if (inHours >= 24) {
    return `${inDays} ${inDays === 1 ? 'day' : 'days'} ago`
  } else if (inMinutes >= 60) {
    return `${inHours} ${inHours === 1 ? 'hour' : 'hours'} ago`
  } else if (inSeconds >= 60) {
    return `${inMinutes} ${inMinutes === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return `${inSeconds} ${inSeconds === 1 ? 'second' : 'seconds'} ago`
  }
}

const SORT_FIELD = {
  TOTAL_VALUE: 'amountUSD',
  TOKEN_AMOUNT_0: 'token0Amount',
  TOKEN_AMOUNT_1: 'token1Amount',
  ACCOUNT: 'account',
  TIME: 'timestamp',
}

const HeaderOptions = [
  {
    label: 'Total Value',
    sort: SORT_FIELD.TOTAL_VALUE,
  },
  {
    label: 'Token Amount',
    sort: SORT_FIELD.TOKEN_AMOUNT_0,
  },
  {
    label: 'Token Amount',
    sort: SORT_FIELD.TOKEN_AMOUNT_1,
  },
  {
    label: 'Account',
    sort: SORT_FIELD.ACCOUNT,
  },
  {
    label: 'Time',
    sort: SORT_FIELD.TIME,
  },
]

const TransactionTable = ({ data }) => {
  const [filter, setFilter] = useState(TXN_TYPE.ALL)
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.TIME)
  const { networkId } = useNetwork()
  const txnData = useMemo(() => {
    if (filter === TXN_TYPE.ALL) {
      return data
    }
    return data.filter((ele) => ele.type === filter)
  }, [filter, data])
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)
  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  const pageCount = useMemo(() => {
    return Math.ceil(txnData.length / pageSize)
  }, [txnData, pageSize])

  const sortedList = useMemo(() => {
    return (
      txnData &&
      txnData
        .sort((a, b) => {
          if (sortedColumn === SORT_FIELD.ACCOUNT) {
            return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
          }
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn]) ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        })
        .slice(pageSize * currentPage, (currentPage + 1) * pageSize)
    )
  }, [txnData, pageSize, currentPage, sortDirection, sortedColumn])

  return (
    <>
      <div className='w-full border border-[#0000AF] bg-[#111642] rounded-[5px] px-4 lg:px-6 py-3 lg:pb-6 lg:pt-4 mt-3.5'>
        <div className='lg:flex justify-between hidden text-white font-figtree font-medium text-[17px] xl:text-[18px] pb-3.5 border-b border-[#0000AF]'>
          <div className='w-[25%]'>
            <div className=' flex items-center text-lg leading-[22px]  font-normal  space-x-3 w-full'>
              {Object.values(TXN_TYPE).map((option, idx) => {
                return (
                  <button className={`${filter === option ? 'text-[#26FFFE]' : 'text-[#757384]'}`} onClick={() => setFilter(option)} key={idx}>
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
          {HeaderOptions.map((option, idx) => {
            return (
              <div key={idx} className='w-[15%]'>
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
          sortedList.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  index > 0 ? 'lg:pt-7' : 'lg:pt-5'
                } flex flex-wrap lg:flex-nowrap items-start !font-normal lg:items-center w-full justify-between  text-lightGray`}
              >
                <div
                  className={`w-full pb-[7px] lg:pb-0 lg:border-b-0 border-b border-[#0000AF]  lg:w-[25%] cursor-pointer ${
                    index === 0 ? '' : 'mt-[30px]'
                  }  lg:mt-0`}
                  onClick={() => {
                    window.open(`${SCAN_URLS[networkId]}/tx/${item.hash}/`, '_blank')
                  }}
                >
                  <div className='text-[#26FFFE] leading-5'>{getTransactionType(item.type, item.token1Symbol, item.token0Symbol)}</div>
                </div>
                <div className='w-1/2 lg:w-[15%] mt-[15px] lg:mt-0'>
                  <p className='lg:hidden text-sm font-figtree font-semibold'>Total Value</p>
                  <div className='text-lightGray leading-5'>${formatNumber(item.amountUSD)}</div>
                </div>
                <div className='w-1/2 lg:w-[15%] mt-[15px] lg:mt-0'>
                  <p className='lg:hidden text-sm font-figtree font-semibold'>Token Amount</p>
                  <div className='text-lightGray leading-5'>
                    {formatNumber(item.token0Amount)} {item.token0Symbol}
                  </div>
                </div>
                <div className='w-1/2 lg:w-[15%] mt-[15px] lg:mt-0'>
                  <p className='lg:hidden text-sm font-figtree font-semibold'>Token Amount</p>
                  <div className='text-lightGray leading-5'>
                    {formatNumber(item.token1Amount)} {item.token1Symbol}
                  </div>
                </div>
                <div className='w-1/2 lg:w-[15%] mt-[15px] lg:mt-0'>
                  <p className='lg:hidden text-sm font-figtree font-semibold'>Account</p>
                  <div
                    className='text-[#26FFFE] leading-5 cursor-pointer'
                    onClick={() => {
                      window.open(`${SCAN_URLS[networkId]}/address/${item.account}`, '_blank')
                    }}
                  >
                    {item.account && item.account.slice(0, 6) + '...' + item.account.slice(38, 42)}
                  </div>
                </div>
                <div className='w-1/2 lg:w-[15%] mt-[15px] lg:mt-0'>
                  <p className='lg:hidden text-sm font-figtree font-semibold'>Time</p>
                  <div className='text-lightGray leading-5'>{formatTime(item.timestamp)}</div>
                </div>
              </div>
            )
          })
        ) : (
          <div className='pt-[38.5px] pb-3 flex items-center justify-center w-full text-[22px] leading-7 font-medium text-white font-figtree'>No results.</div>
        )}
      </div>
      {txnData.length > 10 && (
        <Pagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          handlePageClick={handlePageClick}
          pageCount={pageCount}
          currentPage={currentPage}
          total={txnData.length}
        />
      )}
    </>
  )
}

export default TransactionTable

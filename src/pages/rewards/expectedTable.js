import React, { useState, useMemo, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import Sticky from 'react-stickynode'
import { useWeb3React } from '@web3-react/core'
import { NUMBER_OF_NOWS } from 'config/constants'
import { formatNumber } from 'utils/formatNumber'
import Pagination from 'components/Pagination'
import NoFound from 'components/NoFound'
import DoubleCurrencyLogo from 'components/DoubleCurrencyLogo'

const sortEnabled = false

const sortOptions = [
  {
    label: 'Your Position',
    value: 'votes',
    isDesc: true,
  },
  {
    label: 'Reward',
    value: 'rewards',
    isDesc: true,
  },
]

const ExpectedTable = ({ rewards }) => {
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)
  const [arrowReverse, setArrowReverse] = useState()
  const [sort, setSort] = useState(sortOptions[0])
  const { account } = useWeb3React()

  const pageCount = useMemo(() => {
    return Math.ceil(rewards.length / pageSize)
  }, [rewards, pageSize])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  useEffect(() => {
    setCurrentPage(0)
  }, [pageSize])

  const tableData = useMemo(() => {
    return rewards.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }, [rewards, currentPage, pageSize])

  return (
    <>
      {/* for desktop */}
      {tableData.length > 0 ? (
        <div className='w-full mt-[30.6px]'>
          <div className='w-full'>
            <Sticky
              enabled
              innerActiveClass='gradientBorder'
              top={80.75}
              activeClass=''
              innerClass='px-[20.4px]  lg:flex justify-between hidden z-[5] py-[0.475rem] lg:!-mb-[16.15px] xl:!mb-0 lg:!top-[-16.15px] xl:!top-[0]'
              className='z-[5]'
            >
              <div className='w-[40%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree'>Gauge</div>
              <div className='w-[30%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree'>
                <div
                  onClick={() => {
                    if (sortEnabled) {
                      setSort({
                        ...sortOptions[0],
                        isDesc: sort.value === sortOptions[0].value ? !sort.isDesc : true,
                      })
                    }
                  }}
                  className='flex items-center cursor-pointer space-x-1 -ml-1 relative'
                >
                  {sort.value === sortOptions[0].value && (
                    <button className={`${sort.isDesc ? '' : 'rotate-180'} transform absolute -left-[11.9px]`}>
                      <img alt='' src='/images/common/filter-arrow.svg' />
                    </button>
                  )}
                  <div className='flex items-center'>{sortOptions[0].label}</div>
                </div>
              </div>
              <div className='w-[30%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree'>
                <div
                  onClick={() => {
                    if (sortEnabled) {
                      setSort({
                        ...sortOptions[1],
                        isDesc: sort.value === sortOptions[1].value ? !sort.isDesc : true,
                      })
                    }
                  }}
                  className='flex items-center cursor-pointer space-x-1 -ml-1 relative'
                >
                  {sort.value === sortOptions[1].value && (
                    <button className={`${sort.isDesc ? '' : 'rotate-180'} transform absolute -left-[11.9px]`}>
                      <img alt='' src='/images/common/filter-arrow.svg' />
                    </button>
                  )}
                  <div className='flex items-center'>{sortOptions[1].label}</div>
                </div>
              </div>
            </Sticky>
            <div className='flex flex-col gradient-bg p-px rounded-[5px] shadow-box'>
              {tableData.map((pool, idx) => {
                return (
                  <div
                    key={idx}
                    className={`${idx === 0 && 'rounded-t-[5px]'} ${
                      idx === tableData.length - 1 ? 'rounded-b-[5px]' : ''
                    } mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-lightGray p-[13.6px] lg:py-[17px] lg:px-[20.4px] bg-[#16033A]`}
                  >
                    <div className='flex  w-full lg:w-[40%] items-center  space-x-[10.2px]'>
                      <DoubleCurrencyLogo logo1={pool.token0.logoURI} logo2={pool.token1.logoURI} />
                      <div>
                        <p className='text-[13.6px] xl:text-[16.15px] leading-[25.5px] font-medium'>{`${pool.symbol} (${pool.title})`}</p>
                        <p className='tracking-[0.78px] text-[11.05px] leading-none'>{pool.rewards ? 'Bribes + Fees' : 'Fees From Unstaked Position'}</p>
                      </div>
                    </div>
                    <div className='flex flex-col mt-[6.8px] lg:mt-0 w-1/2 lg:w-[30%] items-start justify-center'>
                      <p className='lg:hidden text-[11.9px] font-figtree font-medium'>Your Position</p>
                      <div
                        onMouseEnter={() => {
                          setArrowReverse(`tip2${idx}`)
                        }}
                        onMouseLeave={() => {
                          setArrowReverse(null)
                        }}
                        data-tip
                        data-for={`tip2${idx}`}
                        className='text-[13.6px] flex items-center cursor-pointer space-x-[5.1px]'
                      >
                        <p className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>${formatNumber(pool.account.totalUsd)}</p>
                        <button className={`${arrowReverse === `tip2${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
                          <img alt='' src='/images/common/triangle.svg' />
                        </button>
                      </div>
                      <ReactTooltip
                        className='max-w-[153px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-[13.6px] !py-[7.65px] !px-[20.4px] !opacity-100 after:!bg-body '
                        id={`tip2${idx}`}
                        place='right'
                        effect='solid'
                      >
                        {formatNumber(pool.account.total0)} {pool.token0.symbol}
                        <br />
                        {formatNumber(pool.account.total1)} {pool.token1.symbol}
                      </ReactTooltip>
                    </div>
                    <div className='flex flex-col items-start mt-[6.8px] lg:mt-0 w-1/2 lg:w-[30%] justify-center'>
                      <p className='lg:hidden text-[11.9px] font-figtree font-medium'>Reward</p>
                      <div
                        onMouseEnter={() => {
                          setArrowReverse(`tip4${idx}`)
                        }}
                        onMouseLeave={() => {
                          setArrowReverse(null)
                        }}
                        data-tip
                        data-for={`tip4${idx}`}
                        className='text-[13.6px] flex items-center cursor-pointer space-x-[5.1px]'
                      >
                        <p className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>${formatNumber(pool.totalUsd)}</p>
                        <button className={`${arrowReverse === `tip4${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
                          <img alt='' src='/images/common/triangle.svg' />
                        </button>
                      </div>
                      <ReactTooltip
                        className='max-w-[153px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-[13.6px] !py-[7.65px] !px-[20.4px] !opacity-100 after:!bg-body '
                        id={`tip4${idx}`}
                        place='right'
                        effect='solid'
                      >
                        {pool.rewards.map((reward, index) => {
                          return <p key={`reward-${index}`}>{`${formatNumber(reward.amount, false, 5)} ${reward.symbol}`}</p>
                        })}
                      </ReactTooltip>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <Pagination
            pageSize={pageSize}
            setPageSize={setPageSize}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            currentPage={currentPage}
            total={rewards.length}
          />
        </div>
      ) : (
        <div className='w-full mt-[30.6px]'>
          <NoFound title={account ? 'No rewards found' : 'Please connect your wallet'} />
        </div>
      )}
    </>
  )
}

export default ExpectedTable

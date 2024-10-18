import React, { useState, useMemo, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { useWeb3React } from '@web3-react/core'
import Sticky from 'react-stickynode'
import { useNavigate } from 'react-router-dom'
import { NUMBER_OF_NOWS } from 'config/constants'
import Pagination from 'components/Pagination'
import TransparentButton from 'components/Buttons/transparentButton'
import NoFound from 'components/NoFound'
import PoolTitle from 'components/PoolTitle'
import { useWalletModal } from 'state/settings/hooks'
import { useHarvest } from 'hooks/useGauge'
import { formatNumber, ZERO_ADDRESS } from 'utils/formatNumber'
import DepositModal from './depositModal'

const ItemWithTooltip = ({ usd, account, idx, type, children }) => {
  const [arrowReverse, setArrowReverse] = useState()
  return account || type === 'tvl' ? (
    <div className='flex flex-col items-start justify-center'>
      <div
        data-tip
        data-for={`${type}-${idx}`}
        onMouseEnter={() => {
          setArrowReverse(`${type}-${idx}`)
        }}
        onMouseLeave={() => {
          setArrowReverse(null)
        }}
        className='text-base sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px] flex items-center cursor-pointer space-x-[5.1px]'
      >
        <p>{'$' + formatNumber(usd, true)}</p>
        <button className={`${arrowReverse === `${type}-${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
          <img alt='' src='/images/common/triangle.svg' />
        </button>
      </div>
      <ReactTooltip
        className='max-w-[153px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-[13.6px] !py-[7.65px] !px-[20.4px] !opacity-100 after:!bg-body'
        id={`${type}-${idx}`}
        place='right'
        effect='solid'
      >
        {children}
      </ReactTooltip>
    </div>
  ) : (
    <div className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>-</div>
  )
}

const ItemWithTooltip1 = ({ usd, account, idx, type, children, lp }) => {
  const [arrowReverse, setArrowReverse] = useState()
  return account || type === 'tvl' ? (
    <div className='flex flex-col items-start justify-center'>
      <div
        data-tip
        data-for={`${type}-${idx}`}
        onMouseEnter={() => {
          setArrowReverse(`${type}-${idx}`)
        }}
        onMouseLeave={() => {
          setArrowReverse(null)
        }}
        className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px] flex items-center cursor-pointer space-x-[5.1px]'
      >
        <div>
          <span className='w-[80%]'>{usd}</span>
          <br />
          <span className='w-[80%] text-[11.05px]'>{lp}</span>
        </div>

        <button className={`${arrowReverse === `${type}-${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
          <img alt='' src='/images/common/triangle.svg' />
        </button>
      </div>
      <ReactTooltip
        className='max-w-[180px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body'
        id={`${type}-${idx}`}
        place='right'
        effect='solid'
      >
        {children}
      </ReactTooltip>
    </div>
  ) : (
    <div className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>-</div>
  )
}

const TableRow = ({ pool, isLast, idx }) => {
  const [isOpen, setIsOpen] = useState(!pool.account.gaugeBalance.isZero())
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const navigate = useNavigate()
  const { onHarvest, pending } = useHarvest()
  const [manage, setManage] = useState(false)

  return (
    <div
      key={idx}
      className={`
    ${isLast ? 'rounded-b-[5px]' : ''}
    ${idx === 0 && 'rounded-t-lg'}
    mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  p-[13.6px] lg:py-[17px] px-[13.6px] xl:px-[20.4px] line-red-1`}
    >
      <div className='w-full lg:w-[25%]'>
        <div className='flex items-center justify-between'>
          <PoolTitle pool={pool} />
          <button
            className='lg:hidden'
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          >
            <img alt='' className={`${isOpen ? 'rotate-180' : ''} transform`} src='/images/swap/dropdown-arrow.png' />
          </button>
        </div>
      </div>
      <div className='flex flex-col mt-[6.8px] lg:mt-0 w-1/2 lg:w-[11%] items-start justify-center'>
        <p className='lg:hidden text-sm font-figtree font-semibold'>APR</p>
        <div className='flex flex-col items-start justify-center text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>
          {/*{formatNumber(pool.gauge.apr, true)}%*/}
          {formatNumber(pool.gauge.lpapr, true)}%
        </div>
      </div>
      <div className='flex flex-col w-1/2 mt-[6.8px] lg:mt-0 items-start lg:w-[11%] justify-center'>
        <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>TVL</p>
        <ItemWithTooltip account={account} type='tvl' usd={pool.tvl} idx={idx}>
          {formatNumber(pool.token0.reserve)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.token1.reserve)} {pool.token1.symbol}
        </ItemWithTooltip>
      </div>
      <div className='flex flex-col w-1/2 mt-[6.8px] lg:mt-0 items-start lg:w-[11%] justify-center'>
        <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>Total Staked</p>
        <ItemWithTooltip account={account} type='tvl' usd={pool.gauge.tvl} idx={idx}>
          {formatNumber(pool.gauge.pooled0)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.gauge.pooled1)} {pool.token1.symbol}
        </ItemWithTooltip>
      </div>
      {/* second row */}
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-start mt-[10.2px] lg:mt-0 w-1/2 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>My Pool</p>
        <ItemWithTooltip account={account} type='pool' usd={pool.account.totalUsd} idx={idx}>
          {formatNumber(pool.account.total0)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.account.total1)} {pool.token1.symbol}
        </ItemWithTooltip>
      </div>
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-start w-1/2 mt-[10.2px] lg:mt-0 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>My Stake</p>
        <ItemWithTooltip account={account} type='stake' usd={pool.account.stakedUsd} idx={idx}>
          {formatNumber(pool.account.staked0)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.account.staked1)} {pool.token1.symbol}
        </ItemWithTooltip>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block  w-1/2 lg:w-[8%] mt-[6.8px] lg:mt-0`}>
        <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>Earnings</p>
        <ItemWithTooltip account={account} type='earning' usd={pool.account.earnedUsd} idx={idx}>
          {pool.account.extraRewards ? (
            <>
              {formatNumber(pool.account.gaugeEarned)} YAKA
              <br />
              {formatNumber(pool.account.extraRewards.amount)} {pool.account.extraRewards.symbol}
            </>
          ) : (
            <>{formatNumber(pool.account.gaugeEarned)} YAKA</>
          )}
        </ItemWithTooltip>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[25%] mt-[11.9px] lg:mt-0`}>
        {account ? (
          <div className='space-x-[17px] xl:space-x-[20.4px] w-full flex items-center lg:justify-end'>
            <TransparentButton
              content='Manage'
              onClickHandler={() => {
                if (pool && pool.gauge.address === ZERO_ADDRESS) {
                  navigate(`/add/v1/${pool.address}`)
                } else {
                  setManage(true)
                }
              }}
              className='h-[34px] px-[22.1px] w-full max-w-[81.6px] whitespace-nowrap pool-manage-btn'
            />
            <button
              disabled={pool.account.gaugeEarned.isZero() || pending}
              className={`${pool.account.gaugeEarned.isZero() || pending ? ' cursor-not-allowed ' : ''}text-[13.6px] text-red`}
              onClick={() => {
                onHarvest(pool)
              }}
            >
              Claim Earnings
            </button>
          </div>
        ) : (
          <div className='w-full flex items-center lg:justify-end'>
            <TransparentButton onClickHandler={openWalletModal} content='Connect Wallet' className='h-[34px] w-full lg:max-w-[147.05px]' />
          </div>
        )}
      </div>
      {manage && <DepositModal isOpen={manage} setIsOpen={setManage} pool={pool} />}
    </div>
  )
}

const TablePairs = ({ pools, sort, setSort, sortOptions, /* active, */ filter, searchText, isStaked }) => {
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)

  const pageCount = useMemo(() => {
    return Math.ceil(pools.length / pageSize)
  }, [pools, pageSize])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  // useEffect(() => {
  //   setCurrentPage(0)
  // }, [pageSize, active, filter])

  useEffect(() => {
    setCurrentPage(0)
  }, [pageSize, filter, searchText, isStaked])

  return (
    <div className='w-full'>
      {pools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
        <>
          <Sticky
            enabled
            innerActiveClass='gradientBorder'
            top={95}
            bottomBoundary={1200}
            activeClass=''
            innerClass='px-[20.4px] lg:flex justify-between hidden z-[5] py-[0.475rem] lg:!-mb-[16.15px] xl:!mb-0 lg:!top-[-16.15px] xl:!top-[0]'
            className='z-[5]'
          >
            <div className='w-[25%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree' />
            {sortOptions.map((option, index) => (
              <div
                className={`${index === 5 ? 'w-[8%]' : 'w-[11%]'} font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree`}
                key={`header-${index}`}
              >
                <div
                  onClick={() => {
                    setSort({
                      ...option,
                      isDesc: sort.value === option.value ? !sort.isDesc : true,
                    })
                  }}
                  className='flex items-center cursor-pointer space-x-1 -ml-1 relative'
                >
                  {sort.value === option.value && (
                    <button className={`${sort.isDesc ? '' : 'rotate-180'} transform absolute -left-[11.9px]`}>
                      <img alt='' src='/images/common/filter-arrow.svg' />
                    </button>
                  )}
                  <p className='flex items-center'>{option.label}</p>
                </div>
              </div>
            ))}
            <div className='w-[25%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree' />
          </Sticky>
          <div className='flex flex-col rounded-[5px] pool-bg p-px shadow-box'>
            {pools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((pool, idx) => {
              return (
                <TableRow
                  isLast={idx === pools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length - 1}
                  idx={idx}
                  pool={pool}
                  key={`row-${idx}`}
                />
              )
            })}
          </div>
          <Pagination
            pageSize={pageSize}
            setPageSize={setPageSize}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            currentPage={currentPage}
            total={pools.length}
          />
        </>
      ) : (
        <NoFound title='No pools found' />
      )}
    </div>
  )
}

export default TablePairs

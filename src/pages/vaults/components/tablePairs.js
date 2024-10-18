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
        className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px] flex items-center cursor-pointer space-x-1.5'
      >
        <p>{'$' + formatNumber(usd, true)}</p>
        {usd.gt(0) && (
          <button className={`${arrowReverse === `${type}-${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
            <img alt='' src='/images/common/triangle.svg' />
          </button>
        )}
      </div>
      {usd.gt(0) && (
        <ReactTooltip
          className='max-w-[180px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body'
          id={`${type}-${idx}`}
          place='right'
          effect='solid'
        >
          {children}
        </ReactTooltip>
      )}
    </div>
  ) : (
    <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>-</div>
  )
}

const TableRow = ({ pool, idx }) => {
  const [isOpen, setIsOpen] = useState(!pool.account.gaugeBalance.isZero())
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const navigate = useNavigate()
  const { onHarvest, pending } = useHarvest()
  const [manage, setManage] = useState(false)
  const allowedToken = pool.token0.allowed ? pool.token0 : pool.token1

  return (
    <div
      key={idx}
      className='last:rounded-b-[5px] first:rounded-t-lg mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-lightGray p-4 lg:py-5 px-4 xl:px-6 bg-[#16033A]'
    >
      <div className='flex flex-col w-full lg:w-[15%] items-start justify-center'>
        <div className='w-full flex items-center justify-between'>
          <div>
            <p className='lg:hidden text-sm font-figtree font-semibold'>Your Deposit</p>
            <div className='flex items-center space-x-3'>
              <img className='relative w-[30px] h-[30px]' src={allowedToken.logoURI} alt='' />
              <p className='flex flex-wrap text-base xl:text-[19px] leading-[30px] font-medium'>{allowedToken.symbol}</p>
            </div>
          </div>
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
      <div className='w-1/2 lg:w-[20%] mt-2 lg:mt-0'>
        <p className='lg:hidden text-sm font-figtree font-semibold'>Vault</p>
        <PoolTitle pool={pool} />
      </div>
      <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[12%] items-start justify-center'>
        <p className='lg:hidden text-sm font-figtree font-semibold'>APR</p>
        <div className='flex flex-col items-start justify-center text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>
          {formatNumber(pool.gauge.apr, true)}%
        </div>
      </div>
      <div className='flex flex-col w-1/2 mt-2 lg:mt-0 items-start lg:w-[12%] justify-center'>
        <p className='lg:hidden text-sm font-figtree font-semibold'>Total Staked</p>
        <ItemWithTooltip account={account} type='tvl' usd={pool.gauge.tvl} idx={idx}>
          {formatNumber(pool.gauge.pooled0)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.gauge.pooled1)} {pool.token1.symbol}
        </ItemWithTooltip>
      </div>
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-start w-1/2 mt-3 lg:mt-0 lg:w-[12%] justify-center`}>
        <p className='lg:hidden text-sm font-figtree font-semibold'>My Stake</p>
        <ItemWithTooltip account={account} type='stake' usd={pool.account.stakedUsd} idx={idx}>
          {formatNumber(pool.account.staked0)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.account.staked1)} {pool.token1.symbol}
        </ItemWithTooltip>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block  w-1/2 lg:w-[12%] mt-2 lg:mt-0`}>
        <p className='lg:hidden text-sm font-figtree font-semibold'>Earnings</p>
        <ItemWithTooltip account={account} type='earning' usd={pool.account.earnedUsd} idx={idx}>
          <>
            {pool.account.earned2 && pool.account.earned2.gt(0) && (
              <>
                {formatNumber(pool.account.earned2)} {pool.reward.symbol}
                <br />
              </>
            )}
            {pool.account.earned0.gt(0) && (
              <>
                {formatNumber(pool.account.earned0)} {pool.token0.symbol}
                <br />
              </>
            )}
            {pool.account.earned1.gt(0) && (
              <>
                {formatNumber(pool.account.earned1)} {pool.token1.symbol}
                <br />
              </>
            )}
          </>
        </ItemWithTooltip>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[20%] mt-3.5 lg:mt-0`}>
        {account ? (
          <div className='space-x-5 xl:space-x-6 w-full flex items-center lg:justify-end'>
            <TransparentButton
              content='Manage'
              onClickHandler={() => {
                if (pool && pool.gauge.address === ZERO_ADDRESS) {
                  navigate(`/add/v1/${pool.address}`)
                } else {
                  setManage(true)
                }
              }}
              className='h-10 px-[26px] w-full max-w-[96px] whitespace-nowrap'
            />
            <button
              disabled={pool.account.earnedUsd.isZero() || pending}
              className={`${pool.account.earnedUsd.isZero() || pending ? 'opacity-[0.33] cursor-not-allowed ' : ''}text-base text-green`}
              onClick={() => {
                onHarvest(pool)
              }}
            >
              Claim Earnings
            </button>
          </div>
        ) : (
          <div className='w-full flex items-center lg:justify-end'>
            <TransparentButton onClickHandler={openWalletModal} content='Connect Wallet' className='h-10 w-full lg:max-w-[173px]' />
          </div>
        )}
      </div>
      {manage && <DepositModal isOpen={manage} setIsOpen={setManage} pool={pool} />}
    </div>
  )
}

const TablePairs = ({ pools, sort, setSort, sortOptions, searchText, isStaked }) => {
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
  }, [pageSize, searchText, isStaked])

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
            innerClass='px-6 lg:flex justify-between hidden z-[5] py-[0.475rem] lg:!-mb-[19px] xl:!mb-0 lg:!top-[-19px] xl:!top-[0]'
            className='z-[5]'
          >
            {sortOptions.map((option, index) => (
              <div
                className={`${index === 0 ? 'w-[15%]' : index === 1 ? 'w-[20%]' : 'w-[12%]'} font-medium text-[17px] xl:text-[18px] text-white font-figtree`}
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
                    <button className={`${sort.isDesc ? '' : 'rotate-180'} transform absolute -left-3.5`}>
                      <img alt='' src='/images/common/filter-arrow.svg' />
                    </button>
                  )}
                  <p className='flex items-center'>{option.label}</p>
                </div>
              </div>
            ))}
            <div className='w-[20%] font-medium text-[17px] xl:text-[18px] text-white font-figtree' />
          </Sticky>
          <div className='flex flex-col rounded-[5px] gradient-bg p-px shadow-box'>
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
        <NoFound title='No vaults found' />
      )}
    </div>
  )
}

export default TablePairs

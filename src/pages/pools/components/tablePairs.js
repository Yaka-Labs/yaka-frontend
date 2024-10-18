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
import RemoveModal from '../../liquidity/yourLiquidity/components/removeModal'
import { customNotify } from 'utils/notify'
import { useClaimFees } from 'hooks/useRewards'
import PoolToolTip from '../../../components/PoolTitle/PoolToolTip'
import { useTotalTvl } from '../../../state/totaltvl/hooks'
import totalTvl from '../../../layouts/Header/TotalTvl'

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
        className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px] flex items-center cursor-pointer space-x-[5.1px]'
      >
        <p>{'$' + formatNumber(usd, true)}</p>
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
  const [isOpenWithdraw, setIsOpenWithdraw] = useState(false)

  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const navigate = useNavigate()
  const { onHarvest, pending } = useHarvest()
  const [manage, setManage] = useState(false)
  const { onClaimFees, pending: pendingClaim } = useClaimFees()

  console.log('pool', pool)
  console.log('pooltvl', pool.tvl.toString())

  const totalTvl = useTotalTvl()

  // 365 * 100 * 175000 * 0.05 / Total TVL * (1 + A)
  const [pointApr, setPointApr] = useState(0)
  useEffect(() => {
    setPointApr(Math.round((((365 * 100 * 175000 * 0.05) / totalTvl) * (1 + pool.weight) * 100) / 100))
  }, [pool, totalTvl])

  return (
    <div
      key={idx}
      className={`
    ${isLast ? 'rounded-b-[4.25px]' : ''}
    ${idx === 0 && 'rounded-t-lg'}
    mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  p-[13.6px] lg:py-[17px] px-[13.6px] xl:px-[20.4px] line-red-1`}
    >
      <div className='w-full lg:w-[20%]'>
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
      <div className='flex flex-col mt-[6.8px] lg:mt-0 w-1/2 lg:w-[11%] items-center justify-center'>
        <p className='lg:hidden text-sm font-figtree font-semibold'>APR</p>
        <div className='flex flex-col items-center justify-center text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>
          <span>{formatNumber(pool.gauge.apr, true)}%</span>
          {/*<PoolToolTip type='apr' tipView={<span>Points APR: Estimated APR for depositors, assuming a $10M total market cap at the time of the airdrop.</span>}>*/}
          {/*  <span className='tracking-[0.78px] text-[12px] font-medium leading-none bg-[#BC2632]/20 text-[#FFFFFF] rounded-[2.55px] mx-[5.1px] px-[5.1px] py-[1.7px]'>*/}
          {/*    +~{pointApr}%*/}
          {/*  </span>*/}
          {/*</PoolToolTip>*/}
        </div>
      </div>
      <div className='flex flex-col w-1/2 mt-[6.8px] lg:mt-0 items-center lg:w-[16%] justify-center'>
        {/* <p className='lg:hidden text-sm font-figtree font-semibold'>Total Staked</p> */}
        <p className='lg:hidden text-sm font-figtree font-semibold'>TVL</p>
        {/* {`$${formatNumber(pool.account.totalLp.times(pool.lpPrice))} (${formatNumber(pool.account.totalLp)} LP)`} */}
        <ItemWithTooltip1 account={account} type='tvl' usd={`$${formatNumber(pool.tvl.toString())}`} idx={idx}>
          {formatNumber(pool.token0.reserve)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.token1.reserve)} {pool.token1.symbol}
        </ItemWithTooltip1>
      </div>
      {/* second row */}
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-center mt-[10.2px] lg:mt-0 w-1/2 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-sm font-figtree font-semibold'>My Pool</p>
        <ItemWithTooltip account={account} type='pool' usd={pool.account.totalUsd} idx={idx}>
          {formatNumber(pool.account.total0)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.account.total1)} {pool.token1.symbol}
        </ItemWithTooltip>
      </div>
      {/* <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-start w-1/2 mt-3 lg:mt-0 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-sm font-figtree font-semibold'>My Stake</p>
        <ItemWithTooltip account={account} type='stake' usd={pool.account.stakedUsd} idx={idx}>
          {formatNumber(pool.account.staked0)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.account.staked1)} {pool.token1.symbol}
        </ItemWithTooltip>
      </div> */}
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-center mt-[10.2px] lg:mt-0 w-1/2 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-sm font-figtree font-semibold'>Fees</p>
        <ItemWithTooltip1
          account={account}
          type='earning'
          usd={`$${formatNumber(pool.account.token0claimable.times(pool.token0.price).plus(pool.account.token1claimable.times(pool.token1.price))).toString()}`}
          idx={idx}
        >
          {formatNumber(pool.account.token0claimable)} {pool.token0.symbol}
          <br />
          {formatNumber(pool.account.token1claimable)} {pool.token1.symbol}
        </ItemWithTooltip1>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[35%] mt-[11.9px] lg:mt-0`}>
        {account ? (
          <div className='space-x-[17px] xl:space-x-[20.4px] w-full flex items-center lg:justify-end'>
            <TransparentButton
              content='Deposit'
              onClickHandler={() => {
                navigate(`/add/v1/${pool.address}`)
                // if (pool && pool.gauge.address === ZERO_ADDRESS) {
                //   navigate(`/add/v1/${pool.address}`)
                // } else {
                //   setManage(true)
                // }
              }}
              className='h-[34px] px-[22.1px] w-full max-w-[81.6px] whitespace-nowrap pool-manage-btn'
            />
            <TransparentButton
              content='Withdraw'
              onClickHandler={() => {
                if (pool.account.walletBalance.isZero()) {
                  customNotify('Please unstake first.', 'warn')
                } else {
                  setIsOpenWithdraw(true)
                }
              }}
              className='h-[34px] px-[22.1px] w-full max-w-[81.6px] whitespace-nowrap pool-manage-btn'
            />
            <button
              disabled={pendingClaim || (Number(formatNumber(pool.account.token0claimable)) === 0 && Number(pool.account.token1claimable) === 0)}
              className={`${
                pendingClaim || (Number(formatNumber(pool.account.token0claimable)) === 0 && Number(pool.account.token1claimable) === 0)
                  ? ' cursor-not-allowed '
                  : ''
              }text-base `}
              style={{ color: Number(formatNumber(pool.account.token0claimable)) === 0 && Number(pool.account.token1claimable) === 0 ? '#aeaeae' : 'red' }}
              onClick={() => {
                onClaimFees(pool)
              }}
            >
              Claim Fees
            </button>
          </div>
        ) : (
          <div className='w-full flex items-center lg:justify-end'>
            <TransparentButton onClickHandler={openWalletModal} content='Connect Wallet' className='h-[34px] w-full lg:max-w-[147.05px]' />
          </div>
        )}
      </div>
      {manage && <DepositModal isOpen={manage} setIsOpen={setManage} pool={pool} />}
      {isOpenWithdraw && <RemoveModal pool={pool} isOpen={isOpenWithdraw} setIsOpen={setIsOpenWithdraw} />}
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
            innerClass='px-[20.4px] lg:flex justify-between hidden z-[5] py-[0.4rem] lg:!-mb-[16.15px] xl:!mb-0 lg:!top-[-16.15px] xl:!top-[0]'
            className='z-[5]'
          >
            <div className='w-[20%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree' />
            {sortOptions.map((option, index) => (
              <div
                className={`${index === 4 ? 'w-[11%]' : index === 1 ? 'w-[16%]' : 'w-[11%]'} font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree`}
                key={`header-${index}`}
              >
                <div
                  onClick={() => {
                    setSort({
                      ...option,
                      isDesc: sort.value === option.value ? !sort.isDesc : true,
                    })
                  }}
                  className='flex items-center cursor-pointer space-x-[3.4px] -ml-[3.4px] relative justify-center'
                >
                  {sort.value === option.value && (
                    // absolute -left-3.5
                    <button className={`${sort.isDesc ? '' : 'rotate-180'} transform `}>
                      <img alt='' src='/images/common/filter-arrow.svg' />
                    </button>
                  )}
                  <p className='flex items-center'>{option.label}</p>
                </div>
              </div>
            ))}
            <div className='w-[35%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree' />
          </Sticky>
          <div className='flex flex-col rounded-[4.25px] pool-bg p-px shadow-box'>
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

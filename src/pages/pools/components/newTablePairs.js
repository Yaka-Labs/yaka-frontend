import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import { useWeb3React } from '@web3-react/core'
import Sticky from 'react-stickynode'
import { useNavigate } from 'react-router-dom'
import TransparentButton from 'components/Buttons/transparentButton'
import PoolTitle from 'components/PoolTitle'
import { useWalletModal } from 'state/settings/hooks'
import { useHarvest } from 'hooks/useGauge'
import { formatNumber, ZERO_ADDRESS } from 'utils/formatNumber'
import DepositModal from './depositModal'

const Item = ({ usd, children, account, idx, type }) => {
  const [arrowReverse, setArrowReverse] = useState()
  return account || type === 'tvl' ? (
    <div className='flex flex-col items-start justify-center'>
      <div
        data-tip
        data-for={`new-${type}-${idx}`}
        onMouseEnter={() => {
          setArrowReverse(`new-${type}-${idx}`)
        }}
        onMouseLeave={() => {
          setArrowReverse(null)
        }}
        className='text-base sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px] flex items-center cursor-pointer space-x-[5.1px]'
      >
        <p>{'$' + formatNumber(usd, true)}</p>
        <button className={`${arrowReverse === `new-${type}-${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
          <img alt='' src='/images/common/triangle.svg' />
        </button>
      </div>
      <ReactTooltip
        className='max-w-[153px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[7.65px] !px-[20.4px] !opacity-100 after:!bg-body'
        id={`new-${type}-${idx}`}
        place='right'
        effect='solid'
      >
        {children}
      </ReactTooltip>
    </div>
  ) : (
    <div className='text-base sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>-</div>
  )
}

const TableRow = ({ item, isLast, idx }) => {
  const [isOpen, setIsOpen] = useState(!item.account.gaugeBalance.isZero())
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const navigate = useNavigate()
  const { onHarvest, pending } = useHarvest()
  const [manage, setManage] = useState(false)

  return (
    <div
      key={idx}
      className={`
    ${isLast ? 'rounded-b-[4.25px]' : ''}
    ${idx === 0 && 'rounded-t-lg'}
    mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-lightGray p-[13.6px] lg:py-[17px] px-[13.6px] xl:px-[20.4px] gradient-bg-new`}
    >
      <div className='w-full lg:w-[25%]'>
        <div className='flex items-center justify-between'>
          <PoolTitle pool={item} />
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
      <div className='flex flex-col mt-[6.8px] lg:mt-0 w-1/2 lg:w-[14%] items-start justify-center'>
        <p className='lg:hidden text-sm font-figtree font-semibold'>Projected APR</p>
        <div className='flex flex-col items-start justify-center text-base sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>
          {formatNumber(item.gauge.projectedApr, true)}%
        </div>
      </div>
      <div className='flex flex-col w-1/2 mt-[6.8px] lg:mt-0 items-start lg:w-[11%] justify-center'>
        <p className='lg:hidden text-sm font-figtree font-semibold'>Total Staked</p>
        <Item account={account} type='tvl' usd={item.gauge.tvl} idx={idx}>
          {formatNumber(item.gauge.pooled0)} {item.token0.symbol}
          <br />
          {formatNumber(item.gauge.pooled1)} {item.token1.symbol}
        </Item>
      </div>
      {/* second row */}
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-start mt-[10.2px] lg:mt-0 w-1/2 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-sm font-figtree font-semibold'>My Pool</p>
        <Item account={account} type='pool' usd={item.account.totalUsd} idx={idx}>
          {formatNumber(item.account.total0)} {item.token0.symbol}
          <br />
          {formatNumber(item.account.total1)} {item.token1.symbol}
        </Item>
      </div>
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-start w-1/2 mt-[10.2px] lg:mt-0 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-sm font-figtree font-semibold'>My Stake</p>
        <Item account={account} type='stake' usd={item.account.stakedUsd} idx={idx}>
          {formatNumber(item.account.staked0)} {item.token0.symbol}
          <br />
          {formatNumber(item.account.staked1)} {item.token1.symbol}
        </Item>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block  w-1/2 lg:w-[8%] mt-[6.8px] lg:mt-0`}>
        <p className='lg:hidden text-sm font-figtree font-semibold'>Earnings</p>
        <Item account={account} type='earning' usd={item.account.earnedUsd} idx={idx}>
          {formatNumber(item.account.gaugeEarned)} THE
        </Item>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[25%] mt-[11.9px] lg:mt-0`}>
        {account ? (
          <div className='space-x-[17px] xl:space-x-[20.4px] w-full flex items-center lg:justify-end'>
            <TransparentButton
              content='Manage'
              onClickHandler={() => {
                if (item && item.gauge.address === ZERO_ADDRESS) {
                  navigate(`/add/v1/${item.address}`)
                } else {
                  setManage(true)
                }
              }}
              className='h-[34px] px-[22.1px] w-full max-w-[81.6px] whitespace-nowrap'
            />
            <button
              disabled={item.account.gaugeEarned.isZero() || pending}
              className={`${item.account.gaugeEarned.isZero() || pending ? 'opacity-[0.33] cursor-not-allowed ' : ''}text-base text-green`}
              onClick={() => {
                onHarvest(item)
              }}
            >
              Claim Earnings
            </button>
          </div>
        ) : (
          <div className='w-full flex items-center lg:justify-end'>
            <TransparentButton
              onClickHandler={openWalletModal}
              content='Connect Wallet'
              className='h-[34px] px-[22.01px] w-full lg:max-w-[147.05px] whitespace-nowrap'
            />
          </div>
        )}
      </div>
      {manage && <DepositModal isOpen={manage} setIsOpen={setManage} pool={item} />}
    </div>
  )
}

const NewTablePairs = ({ pools, sort, setSort, sortOptions }) => {
  return (
    <div className='w-full'>
      {pools.length > 0 && (
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
            <div className='w-[25%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree' />
            {sortOptions.map((option, index) => (
              <div
                className={`${index === 4 ? 'w-[8%]' : index === 0 ? 'w-[14%]' : 'w-[11%]'} font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree`}
                key={`header-${index}`}
              >
                <div
                  onClick={() => {
                    setSort({
                      ...option,
                      isDesc: sort.value === option.value ? !sort.isDesc : true,
                    })
                  }}
                  className='flex items-center cursor-pointer space-x-[3.4px] -ml-[3.4px] relative'
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
          <div className='flex flex-col rounded-[4.25px] gradient-bg p-px shadow-box'>
            {pools.map((item, idx) => {
              return <TableRow isLast={idx === pools.length - 1} idx={idx} item={item} key={`row-${idx}`} />
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default NewTablePairs

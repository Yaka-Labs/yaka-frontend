import React, { useState, useMemo, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import ReactTooltip from 'react-tooltip'
import Sticky from 'react-stickynode'
// import useWalletModal from 'hooks/useWalletModal'
import { NUMBER_OF_NOWS, POOL_FILTERS } from 'config/constants'
import { formatNumber, getPoolType } from 'utils/formatNumber'
import { useWalletModal } from 'state/settings/hooks'
import { useVote } from 'hooks/useVote'
import { customNotify } from 'utils/notify'
import { usePoke, useReset } from 'hooks/useLock'
import NoFound from 'components/NoFound'
import StyledButton from 'components/Buttons/styledButton'
import TransparentButton from 'components/Buttons/transparentButton'
import Max from 'components/Buttons/max'
import Pagination from 'components/Pagination'
import PoolTitle from 'components/PoolTitle'

const Item = ({ usd, children, idx, type }) => {
  const [arrowReverse, setArrowReverse] = useState()
  return !usd.isZero() ? (
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
        <p>{'$' + formatNumber(usd)}</p>
        <button className={`${arrowReverse === `${type}-${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
          <img alt='' src='/images/common/triangle.svg' />
        </button>
      </div>
      <ReactTooltip
        className='max-w-[153px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body'
        id={`${type}-${idx}`}
        place='right'
        effect='solid'
      >
        {children}
      </ReactTooltip>
    </div>
  ) : (
    <div className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>$0</div>
  )
}

const Row = ({ idx, isLast, pool, percent, setPercent, totalPercent }) => {
  const { openWalletModal } = useWalletModal()
  const { account } = useWeb3React()

  return (
    <div
      key={idx}
      className={`${idx === 0 && 'rounded-t-[5px]'} ${isLast ? 'rounded-b-[5px]' : ''}
      border-b
      border-solid
      border-[#9552528a] 
      last:border-[#fff0] 
      mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-lightGray p-[13.6px] lg:py-[17px] lg:px-[20.4px] bg-[#360E12]`}
    >
      <div className='w-full lg:w-[25%]'>
        <PoolTitle pool={pool} />
      </div>
      <div className='flex flex-col mt-[6.8px] lg:mt-0 w-1/2 lg:w-[15%] items-start justify-center'>
        <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>Voting APR</p>
        <div className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>{formatNumber(pool.gauge.voteApr, true)}%</div>
      </div>
      <div className='flex flex-col mt-[6.8px] lg:mt-0 w-1/2 lg:w-[15%] items-start justify-center'>
        <div className='text-[11.9px] xl:text-[13.6px] flex items-center space-x-[5.1px]'>
          <div className='flex flex-col items-start justify-center'>
            <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>Total Votes</p>
            <div className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>{formatNumber(pool.gauge.weight)}</div>
            <p className='leading-[18.7px] text-secondary text-[12.75px]'>{formatNumber(pool.gauge.weightPercent)}%</p>
          </div>
        </div>
      </div>
      {/* second row */}
      {/* Rewards */}
      <div className='flex flex-col mt-[10.2px] lg:mt-0 w-1/2 lg:w-[15%] items-start justify-center'>
        <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>Rewards</p>
        <Item type='rewards' usd={pool.gauge.bribeUsd} idx={idx}>
          {pool.gauge.bribes && pool.gauge.bribes.bribe && (
            <>
              <div className='text-green'>Bribes</div>
              {pool.gauge.bribes.bribe.map((bribe, idx) => {
                return (
                  <p key={`bribe-${idx}`}>
                    {formatNumber(bribe.amount)} {bribe.symbol}
                  </p>
                )
              })}
            </>
          )}
          {pool.gauge.bribes && pool.gauge.bribes.fee && (
            <>
              <div className='text-green'>Projected Fees</div>
              {pool.gauge.bribes.fee.map((fee, idx) => {
                return (
                  <p key={`fee-${idx}`}>
                    {formatNumber(fee.amount)} {fee.symbol}
                  </p>
                )
              })}
            </>
          )}
        </Item>
      </div>
      <div className='flex flex-col mt-[10.2px] lg:mt-0 w-1/2 lg:w-[20%] items-start justify-center'>
        <div className='text-[11.9px] xl:text-[13.6px] flex items-center space-x-[5.1px]'>
          <div className='flex flex-col items-start justify-center'>
            <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>Reward Estimate</p>
            <div className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>${formatNumber(pool.votes.perRewards)}</div>
            <p className='leading-[18.7px] text-secondary text-[12.75px]'>per 1000 votes</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col mt-[10.2px] lg:mt-0 w-1/2 lg:w-[12%] items-start justify-center'>
        <p className='lg:hidden text-[11.9px] font-figtree font-semibold'>Your Vote</p>
        <div className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>{formatNumber(pool.votes.weight)}</div>
        <p className='leading-[18.7px] text-secondary text-[12.75px]'>{formatNumber(Math.ceil(pool.votes.weightPercent.toNumber()))}%</p>
        {/* {!pool.votes.rewards.isZero() && <p className='leading-[22px] text-secondary text-[15px]'>${formatNumber(pool.votes.rewards)}</p>} */}
      </div>
      <div className='w-full lg:w-[24%] mt-[11.9px] lg:mt-0'>
        {!account ? (
          <div className='w-full flex items-center lg:justify-end'>
            <TransparentButton onClickHandler={openWalletModal} content='Connect Wallet' className='h-[34px] lg:w-[147.05px]' />
          </div>
        ) : (
          <div className='flex flex-col lg:items-end justify-end w-full'>
            <div className='relative w-full lg:w-auto'>
              <input
                className='placeholder-secondary w-full lg:max-w-[172.55px] gradient-bg h-[44.2px] rounded-[3px] z-[10] text-white pl-[17px] pr-[6.8px] text-[15.3px]   focus:!placeholder-transparent  block focus:outline-none'
                placeholder='Enter Vote'
                type='number'
                lang='en'
                min={0}
                step={1}
                value={percent[pool.address] || ''}
                onChange={(e) => {
                  const val = isNaN(Number(percent[pool.address])) ? 0 : Number(percent[pool.address])
                  const newVal = isNaN(Number(e.target.value)) || Number(e.target.value) < 0 ? 0 : Math.floor(Number(e.target.value))
                  const maxValue = 100 - totalPercent + val === 0 ? '' : 100 - totalPercent + val
                  let final = newVal === 0 ? '' : totalPercent - val + newVal > 100 ? maxValue : newVal
                  setPercent({
                    ...percent,
                    [pool.address]: !e.target.value ? '' : final,
                  })
                }}
              />
              {!!percent[pool.address] && <p className='text-[15.3px] text-white absolute top-[10.2px] right-[68px] z-[1]'>%</p>}
              <Max
                className='absolute z-[1] right-[6.8px] top-[6.8px]'
                onClickHanlder={() => {
                  const val = isNaN(Number(percent[pool.address])) ? 0 : Number(percent[pool.address])
                  const maxValue = 100 - totalPercent + val
                  setPercent({
                    ...percent,
                    [pool.address]: maxValue === 0 ? '' : maxValue,
                  })
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Table = ({ pools, sort, setSort, sortOptions, filter, searchText, isVoted, veTHE, percent, setPercent, totalPercent }) => {
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)
  const { onVote, pending } = useVote()
  const { onReset, pending: resetPending } = useReset()
  const { onPoke, pending: pokePending } = usePoke()
  const { account } = useWeb3React()

  const filteredPools = useMemo(() => {
    const result = pools.filter((pool) => {
      return (isVoted && !pool.votes.weight.isZero()) || !isVoted
    })
    const res = filter === POOL_FILTERS.ALL ? result : result.filter((item) => getPoolType(item) === filter)
    if (!searchText || searchText === '') {
      return res
    }
    return (
      res &&
      res.filter((item) => {
        const withSpace = item.symbol.replace('/', ' ')
        const withComma = item.symbol.replace('/', ',')
        return (
          item.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
          withSpace.toLowerCase().includes(searchText.toLowerCase()) ||
          withComma.toLowerCase().includes(searchText.toLowerCase())
        )
      })
    )
  }, [pools, filter, searchText, isVoted])

  const sortedPools = useMemo(() => {
    return filteredPools.sort((a, b) => {
      let res
      switch (sort.value) {
        case sortOptions[0].value:
          res = a.gauge.voteApr
            .minus(b.gauge.voteApr)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case sortOptions[1].value:
          res = a.gauge.weight
            .minus(b.gauge.weight)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case sortOptions[2].value:
          res = a.gauge.bribeUsd
            .minus(b.gauge.bribeUsd)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case sortOptions[3].value:
          res = a.votes.perRewards
            .minus(b.votes.perRewards)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case sortOptions[4].value:
          res = a.votes.weight
            .minus(b.votes.weight)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break

        default:
          break
      }
      return res
    })
  }, [filteredPools, sort])

  const pageCount = useMemo(() => {
    return Math.ceil(sortedPools.length / pageSize)
  }, [sortedPools, pageSize])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  useEffect(() => {
    setCurrentPage(0)
  }, [pageSize, filter, isVoted, searchText])

  const errorMsg = useMemo(() => {
    if (!veTHE) {
      return 'veYAKA is not selected'
    }
    if (veTHE.voting_amount.isZero()) {
      return 'Voting power is zero'
    }
    if (totalPercent !== 100) {
      return 'Total should be 100%'
    }
    return null
  }, [totalPercent, veTHE])

  return (
    <>
      <div className='w-full lg:mt-[6.8px] xl:mt-0'>
        {sortedPools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
          <div className='w-full'>
            <Sticky
              enabled
              innerActiveClass='gradientBorder'
              top={95}
              activeClass=''
              innerClass='px-[20.4px] lg:flex justify-between hidden z-[5] py-[0.475rem] lg:!-mb-[19px] xl:!mb-0 lg:!top-[-19px] xl:!top-[0]'
              className='z-[5]'
            >
              <div className='w-[25%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree' />
              {sortOptions.map((option, index) => (
                <div className={`${option.width} font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree`} key={`header-${index}`}>
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
              <div className='w-[24%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree' />
            </Sticky>
            <div className='flex flex-col gradient-bg p-px rounded-[5px] shadow-box'>
              {sortedPools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((pool, idx) => {
                return (
                  <Row
                    isLast={idx === sortedPools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length - 1}
                    pool={pool}
                    idx={idx}
                    key={idx}
                    percent={percent}
                    setPercent={setPercent}
                    totalPercent={totalPercent}
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
              total={sortedPools.length}
            />
          </div>
        ) : (
          <NoFound title='No pools found' />
        )}
      </div>
      {account && (
        <div className='bottom-0 md:bottom-[13.6px] transition-all duration-300 ease-in-out md:flex items-center  fixed md:max-w-[507.45px] mx-auto w-full  left-0 right-0 z-30 border-[#0000AF] border-t md:border-l md:border-r md:border-b md md:rounded-[5px] shadow-[0px_0px_30px_#000053] bg-[#090333] px-[17px] py-[10.2px] md:py-[11.9px]'>
          <p>
            <span className='text-white text-[13.6px] md:text-[18.7px] font-figtree'>Voting Power Used:&nbsp;</span>
            <span className={`${veTHE && veTHE.votedCurrentEpoch ? 'text-[#2CBA52]' : 'text-error'} text-[15.3px] md:text-[20.4px] font-semibold`}>
              {veTHE && veTHE.votedCurrentEpoch ? 'Yes' : 'No'}
            </span>
          </p>
          <div className='flex items-center mt-[6.8px] md:mt-0 w-full justify-between md:w-auto space-x-[10.2px]'>
            <StyledButton
              disabled={pending}
              pending={pending}
              onClickHandler={() => {
                if (errorMsg) {
                  customNotify(errorMsg, 'warn')
                  return
                }
                onVote(veTHE.id, percent)
              }}
              content='CAST VOTES'
              className='w-full md:w-auto px-[17.85px] h-[35.7px] md:h-[44.2px] md:ml-[10.2px]'
            />
            <button
              className='text-green'
              disabled={!veTHE || !veTHE.voted || resetPending}
              onClick={() => {
                if (veTHE.voted) {
                  onReset(veTHE.id)
                }
              }}
            >
              Reset
            </button>
            <button
              className='text-green'
              disabled={!veTHE || !veTHE.voted || pokePending}
              onClick={() => {
                if (veTHE.voted) {
                  onPoke(veTHE.id)
                }
              }}
            >
              Revote
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Table

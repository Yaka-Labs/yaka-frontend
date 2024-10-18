import React, { useState, useMemo, useEffect } from 'react'
import Sticky from 'react-stickynode'
import ReactTooltip from 'react-tooltip'
import { NUMBER_OF_NOWS, SIZES } from 'config/constants'
import { useEpochTimer } from 'hooks/useGeneral'
import { formatNumber } from 'utils/formatNumber'
import { useDibsLotteryData } from 'hooks/useReferral'
import Pagination from 'components/Pagination'
import TabFilter from 'components/TabFilter'
import Timer from 'components/Timer'

const Timestamp = 1688601600
const isEnded = new Date().getTime() / 1000 > Timestamp
const rewardsTypes = isEnded ? ['Previous Epoch'] : ['Current Epoch', 'Previous Epoch']

const TableRow = ({ item, idx, isLast }) => {
  return (
    <div
      key={idx}
      className={`
  ${isLast ? 'rounded-b-[5px]' : ''}
  ${idx === 0 && 'rounded-t-lg'}
  mb-px flex flex-wrap lg:flex-nowrap items-start lg:min-h-[85px] lg:items-center w-full justify-between  text-lightGray p-4 lg:py-5 px-4 xl:px-6 bg-[#16033A]`}
    >
      <div className='w-1/2  lg:w-[20%]'>
        <p className='lg:hidden font-figtree text-[13px] leading-[15px] font-semibold '>Rank</p>
        {typeof item.rank === 'number' ? (
          <p className='text-[22px] font-figtree leading-6 text-lightGray'>{item.rank}</p>
        ) : (
          <img alt='token' className='mt-0.5 w-[34px] lg:w-auto' src={item.rank} />
        )}
      </div>
      <div className='w-1/2  lg:w-[35%]'>
        <p className='lg:hidden font-figtree text-[13px] leading-[15px] font-semibold '>Codename</p>
        {item.code}
      </div>
      <div className='w-1/2  lg:w-[20%] mt-[18px] lg:mt-0'>
        <p className='lg:hidden font-figtree text-[13px] leading-[15px] font-semibold '>Volume</p>${formatNumber(item.volume)}
      </div>
      <div className='w-1/2  lg:w-[25%] flex lg:items-end flex-col mt-[18px] lg:mt-0 lg:justify-end'>
        <div className='w-full lg:hidden'>
          <div
            data-tip
            data-for='custom-tooltip2'
            className=' font-figtree text-[13px] leading-[15px] font-semibold flex items-center cursor-pointer space-x-1.5'
          >
            <p>Potential Reward</p>
            <img alt='' src='/images/swap/question-mark.png' />
          </div>
          <ReactTooltip
            className='max-w-[180px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-sm !py-[6px] !px-3 !opacity-100 after:!bg-body '
            id='custom-tooltip2'
            place='top'
            effect='solid'
          >
            <p>
              The amount of rewards you will receive if you hold a current ranking in the leaderboard by the time we conclude the Ranking Score index
              calculation at the end of every Epoch.
            </p>
          </ReactTooltip>
        </div>
        {item.amount}
      </div>
    </div>
  )
}

const Leaderboard = () => {
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)
  const [filter, setFilter] = useState(rewardsTypes[0])
  const { days, hours, mins } = useEpochTimer()
  const { rewardAmounts } = useDibsLotteryData()
  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  const totalPrize = useMemo(() => {
    return rewardAmounts.reduce((sum, cur) => {
      return sum + cur
    }, 0)
  }, [rewardAmounts])

  const updatedData = useMemo(() => {
    const final = []
    return final.map((data, index) => {
      if (index < 8) {
        return {
          ...data,
          rank: `/images/referral/${index + 1}.png`,
          amount: formatNumber(rewardAmounts[index]) + ' BUSD',
        }
      } else {
        return {
          ...data,
          rank: index + 1,
          amount: '-',
        }
      }
    })
  }, [filter, rewardAmounts])

  useEffect(() => {
    setCurrentPage(0)
  }, [pageSize, filter])

  const pageCount = useMemo(() => {
    return Math.ceil(updatedData.length / pageSize)
  }, [updatedData, pageSize])

  const totalInfo = useMemo(() => {
    return [
      {
        title: 'Daily Reward',
        balance: `${formatNumber(totalPrize)} BUSD`,
      },
      {
        title: 'Epoch Timer',
        balance: `${hours}h ${mins}m`,
      },
    ]
  }, [days, hours, mins, totalPrize])

  return (
    <div className='lg:ml-6 w-full mt-3 lg:mt-0'>
      <div className=' lg:flex items-center justify-between'>
        <div className='lg:max-w-[357px]'>
          <h3 className='font-figtree text-[27px] leading-6  md:text-4xl font-medium gradient-text'>Leaderboard</h3>
        </div>
        {!isEnded && <Timer className='mt-3 lg:mt-0 w-full lg:max-w-[410px]' arr={totalInfo} />}
      </div>
      <TabFilter data={rewardsTypes} filter={filter} setFilter={setFilter} className='max-w-[440px] xl:max-w-[480px] mt-4 lg:mt-10' size={SIZES.LARGE} />

      <div className='mt-5 lg:mt-7 w-full'>
        <div className='w-full'>
          {updatedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
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
                <div className='w-[20%] font-semibold text-[17px] xl:text-[18px] text-white font-figtree'>Rank</div>
                <div className='w-[35%] font-semibold text-[17px] xl:text-[18px] text-white font-figtree'>Codename</div>
                <div className='w-[20%] font-semibold text-[17px] xl:text-[18px] text-white font-figtree'>Volume</div>
                <div className='w-[25%] font-semibold text-[17px] xl:text-[18px] text-white font-figtree flex items-center justify-end'>
                  <div data-tip data-for='custom-tooltip' className='flex items-center cursor-pointer space-x-1.5'>
                    <p>Potential Reward</p>
                    <img alt='' src='/images/swap/question-mark.png' />
                  </div>
                  <ReactTooltip
                    className=' !bg-[#090333]  !max-w-[200px] !border !border-blue  !text-[#E6E6E6] !text-sm !py-[6px] !px-2 !opacity-100 after:!bg-body '
                    id='custom-tooltip'
                    place='top'
                    effect='solid'
                  >
                    <p>
                      The amount of rewards you will receive if you hold a current ranking in the leaderboard by the time we conclude the Ranking Score index
                      calculation at the end of every Epoch.
                    </p>
                  </ReactTooltip>
                </div>
              </Sticky>
              <div className='flex flex-col rounded-[5px] gradient-bg p-px shadow-box'>
                {updatedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((item, idx) => {
                  return (
                    <TableRow
                      isLast={idx === updatedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length - 1}
                      idx={idx}
                      item={item}
                      key={`row-${idx}`}
                    />
                  )
                })}
              </div>
            </>
          ) : (
            <div className='rounded-[3px] gradient-bg p-px shadow-box'>
              <div className='py-9 px-4 flex flex-col items-center justify-center bg-[#16033A] rounded-[3px]'>
                <p className='font-figtree text-[23px] md:text-[27px] leading-[33px] text-white font-medium'>No Data</p>
                {/* <div className='flex items-center  space-x-3.5 cursor-pointer group mt-1'>
                  <span className='text-lg md:text-xl text-green'>Invite a Friend</span>
                  <img className={`group-hover:w-[40px] w-[30px] duration-300 ease-in-out`} src='/images/common/spear.svg' alt='' />
                </div> */}
              </div>
            </div>
          )}
        </div>
        {updatedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
          <Pagination
            pageSize={pageSize}
            setPageSize={setPageSize}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            currentPage={currentPage}
            total={updatedData.length}
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default Leaderboard

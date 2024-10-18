import React, { useEffect, useMemo, useState } from 'react'
import Sticky from 'react-stickynode'
import BigNumber from 'bignumber.js'
import { NUMBER_OF_NOWS, REFERRAL_TABS } from 'config/constants'
import { useClaimFees, useClaimPrize, useDibsLotteryUserData } from 'hooks/useReferral'
import { formatNumber } from 'utils/formatNumber'
import Pagination from 'components/Pagination'
import StyledButton from 'components/Buttons/styledButton'

const TableRow = ({ item, idx, isLast }) => {
  const { onClaimFees, pending } = useClaimFees()
  return (
    <div
      key={idx}
      className={`
    ${isLast ? 'rounded-b-[5px]' : ''}
    ${idx === 0 && 'rounded-t-lg'}
    mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-lightGray p-4 lg:py-5 px-4 xl:px-6 bg-[#16033A]`}
    >
      <div className='w-1/2 lg:w-[40%]'>
        <p className='lg:hidden font-figtree text-[13px] leading-[15px] font-semibold '>Earned</p>
        <div className='w-full  flex items-center lg:space-x-2'>
          <img alt='token' className='lg:block hidden' src={item.logoURI} width={30} height={30} />
          <p>
            {formatNumber(item.balanceToClaim)} {item.symbol}
          </p>
        </div>
      </div>
      <div className='w-1/2 lg:w-[30%]'>
        <p className='lg:hidden font-figtree text-[13px] leading-[15px] font-semibold '>In USD</p>${formatNumber(item.balanceToClaim.times(item.price))}
      </div>
      <div className='w-full lg:w-[30%] flex justify-end mt-[9px] lg:mt-0'>
        <StyledButton
          content='CLAIM'
          className='w-full lg:w-auto py-[9px] px-[30px]'
          disabled={pending}
          pending={pending}
          onClickHandler={() => {
            onClaimFees(item)
          }}
        />
      </div>
    </div>
  )
}

const PrizeTableRow = ({ rewardsInUsd }) => {
  const { onClaimPrize, pending } = useClaimPrize()
  return (
    <div className='rounded-b-[5px] rounded-t-lg mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-lightGray p-4 lg:py-5 px-4 xl:px-6 bg-[#16033A]'>
      <div className='w-1/2 lg:w-[40%]'>
        <p className='lg:hidden font-figtree text-[13px] leading-[15px] font-semibold '>Earned</p>
        <div className='w-full  flex items-center lg:space-x-2'>
          <img alt='token' className='lg:block hidden' src='https://cdn.thena.fi/assets/BUSD.png' width={30} height={30} />
          <p>{formatNumber(rewardsInUsd)} BUSD</p>
        </div>
      </div>
      <div className='w-1/2 lg:w-[30%]'>
        <p className='lg:hidden font-figtree text-[13px] leading-[15px] font-semibold '>In USD</p>${formatNumber(rewardsInUsd)}
      </div>
      <div className='w-full lg:w-[30%] flex justify-end mt-[9px] lg:mt-0'>
        <StyledButton
          content='CLAIM'
          className='w-full lg:w-auto py-[9px] px-[30px]'
          disabled={pending}
          pending={pending}
          onClickHandler={() => {
            onClaimPrize()
          }}
        />
      </div>
    </div>
  )
}

const Rewards = ({ setActiveTab, balancesToClaim }) => {
  const [pageSize, setPageSize] = useState(NUMBER_OF_NOWS[0])
  const [currentPage, setCurrentPage] = useState(0)
  const { rewardsInUsd } = useDibsLotteryUserData()
  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  useEffect(() => {
    setCurrentPage(0)
  }, [pageSize])
  const pageCount = useMemo(() => {
    return Math.ceil(balancesToClaim.length / pageSize)
  }, [balancesToClaim, pageSize])

  const totalUsd = useMemo(() => {
    return balancesToClaim.reduce((sum, current) => {
      return sum.plus(current.balanceToClaim.times(current.price))
    }, new BigNumber(0))
  }, [balancesToClaim])

  return (
    <div className='lg:ml-6 w-full mt-3 lg:mt-0'>
      <div className='border-b border-[#757384] pb-2 lg:pb-3 flex items-center justify-between'>
        <h3 className='text-[27px] leading-8  md:text-4xl font-figtree font-medium gradient-text'>Rewards</h3>
      </div>
      <div className='mt-4 lg:mt-[18.5px] w-full'>
        <div className='md:flex items-center justify-between '>
          <div className='flex items-center space-x-2 lg:space-x-3'>
            <img alt='' className='w-6 md:w-auto' src='/images/svgs/earned-fees-icon.svg' />
            <span className='font-figtree text-white text-[23px] lg:text-[27px] leading-7 lg:leading-[34px] font-light'>
              Earned Fees ({balancesToClaim.length})
            </span>
          </div>
          <div className=' bg-white mt-[11px] md:mt-0 flex items-center justify-between lg:justify-start bg-opacity-[0.05] space-x-[9px] rounded-[3px] bg-clip-padding px-[13px] md:px-5 py-2.5 md:py-[13px] text-white'>
            <p className='font-figtree text-sm lg:text-base leading-5'>Total Claimable Fees in USD</p>
            <span className='text-xl lg:text-[27px] leading-5 lg:leading-8'>${formatNumber(totalUsd)}</span>
          </div>
        </div>
        <div className='mt-[15px] lg:mt-8 xl:mt-[15px]'>
          <div className='w-full'>
            {balancesToClaim.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
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
                  <div className='w-[40%] font-semibold text-[17px] xl:text-[18px] text-white font-figtree'>Earned</div>
                  <div className='w-[30%] font-semibold text-[17px] xl:text-[18px] text-white font-figtree'>In USD</div>
                  <div className='w-[30%] font-medium text-[17px] xl:text-[18px] text-white font-figtree' />
                </Sticky>

                <div className='flex flex-col rounded-[5px] gradient-bg p-px shadow-box w-full'>
                  {balancesToClaim.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((item, idx) => {
                    return (
                      <TableRow
                        isLast={idx === balancesToClaim.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length - 1}
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
                  <p className='font-figtree text-[23px] md:text-[27px] leading-[33px] text-white font-medium'>No Fees to be Claimed</p>
                  <div className='flex items-center  space-x-3.5 cursor-pointer group mt-1' onClick={() => setActiveTab(REFERRAL_TABS[0])}>
                    <span className='text-lg md:text-xl text-green'>Invite a Friend</span>
                    <img className='group-hover:w-[40px] w-[30px] duration-300 ease-in-out' src='/images/common/spear.svg' alt='' />
                  </div>
                </div>
              </div>
            )}
          </div>
          {balancesToClaim.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              handlePageClick={handlePageClick}
              pageCount={pageCount}
              currentPage={currentPage}
              total={balancesToClaim.length}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
      <div className='mt-4 lg:mt-10 w-full'>
        <div className='md:flex items-center justify-between '>
          <div className='flex items-center space-x-2 lg:space-x-3'>
            <img alt='' className='w-6 md:w-auto' src='/images/svgs/earned-fees-icon.svg' />
            <span className='font-figtree text-white text-[23px] lg:text-[27px] leading-7 lg:leading-[34px] font-light'>Earned Prizes</span>
          </div>
        </div>
        <div className='mt-[15px] lg:mt-8 xl:mt-[15px]'>
          <div className='w-full'>
            {rewardsInUsd.gt(0) ? (
              <PrizeTableRow rewardsInUsd={rewardsInUsd} />
            ) : (
              <div className='rounded-[3px] gradient-bg p-px shadow-box'>
                <div className='py-9 px-4 flex flex-col items-center justify-center bg-[#16033A] rounded-[3px]'>
                  <p className='font-figtree text-[23px] md:text-[27px] leading-[33px] text-white font-medium'>No Prizes to be Claimed</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rewards

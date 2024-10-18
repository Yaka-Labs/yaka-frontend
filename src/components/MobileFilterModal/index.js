import React from 'react'
import { SIZES } from 'config/constants'
import Toggle from '../Toggle'
import TabFilter from '../TabFilter'
import DropDown from '../DropDown'

const MobileFilterModal = ({
  setMobileFilter,
  setFilter,
  filter,
  tabs,
  isStaked,
  setIsStaked,
  sortOptions,
  sort,
  setSort,
  isVote = false,
  isVoted,
  setIsVoted,
  isInactive,
  setIsInactive,
}) => {
  return (
    <>
      <div className='fixed bg-transparent w-full h-full lg:hidden inset-0 z-40' onClick={() => setMobileFilter(false)} />
      <div className='absolute w-full bg-[#101645] lg:hidden border-blue border rounded-[5px] p-[10.2px] z-50 top-[47.6px]'>
        {filter && (
          <>
            <p className='text-white font-semibold font-figtree text-[17px] mb-[10.2px]'>Filters</p>
            <TabFilter data={tabs} filter={filter} setFilter={setFilter} size={SIZES.SMALL} />
          </>
        )}
        <div className='w-full flex items-center space-x-[23.8px] mt-[13.6px]'>
          <p className='text-white font-medium whitespace-nowrap'>Sort by</p>
          <DropDown options={sortOptions} sort={sort} setSort={setSort} />
        </div>
        {isVote ? (
          <div className='flex items-center space-x-[6.8px] mt-[13.6px]'>
            <Toggle checked={isVoted} onChange={() => setIsVoted(!isVoted)} small toggleId='votes' />
            <p className='text-lightGray text-[13.6px] whitespace-nowrap'>Show My Votes</p>
          </div>
        ) : (
          <div className='flex items-center space-x-[6.8px] mt-[13.6px]'>
            <div className='flex items-center space-x-[6.8px] w-1/2'>
              <Toggle checked={isStaked} onChange={() => setIsStaked(!isStaked)} small toggleId='staked' />
              <p className='text-lightGray text-[16px] whitespace-nowrap'>Staked Only</p>
            </div>
            <div className='flex items-center space-x-[6.8px] w-1/2'>
              <Toggle checked={isInactive} onChange={() => setIsInactive(!isInactive)} small toggleId='inactive' />
              <p className='text-lightGray text-[13.6px] whitespace-nowrap'>Inactive Pools</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MobileFilterModal

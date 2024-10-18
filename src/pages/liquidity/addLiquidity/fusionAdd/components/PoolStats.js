import React from 'react'
import Spinner from 'components/Spinner'

const PoolStats = ({ fee, noLiquidity, loading }) => {
  if (loading) {
    return (
      <div className='flex justify-center items-center'>
        <Spinner />
      </div>
    )
  }

  return (
    <div className='w-1/2 px-2.5 md:px-5 py-2 md:py-3 rounded-2xl bg-[#080331]'>
      <span className='text-[13px] md:text-[15px] text-[#DAD8ED] leading-4 md:leading-[19px]'>{noLiquidity ? 'New pool' : 'Current pool stats'}</span>
      <div className='mt-1 md:mt-2 flex items-center space-x-[5px] md:space-x-2'>
        <div className='bg-[#152343] px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[11px] md:text-sm leading-[13px] md:leading-4 text-white font-medium'>
          {fee}
        </div>
      </div>
    </div>
  )
}

export default PoolStats

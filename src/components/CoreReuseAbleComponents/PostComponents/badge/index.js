import React from 'react'

const Index = ({ data }) => {
  return (
    <div className='flex flex-col items-center justify-center mt-[15px] mb-11 px-5'>
      <img alt='' src={data.icon} className='w-[173px] h-[173px]' />
      <p className='text-[27px] leading-8 font-semibold text-white font-figtree'>{data.info}</p>
      <p className='text-secondary text-lg leading-5 mt-1'>{data.reason}</p>
    </div>
  )
}

export default Index

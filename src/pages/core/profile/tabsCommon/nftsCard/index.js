import React from 'react'
import { useNavigate } from 'react-router-dom'

const Index = ({ item }) => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/core/thenaIds/${item.userName.replaceAll(' ', '-')}`)}
      className='bg-cardBg rounded-[5px] border border-blue p-2.5 cursor-pointer'
    >
      <img alt='' className='w-full' src={item.img ? item.img : '/images/profile/nfts/noImage.png'} />
      <div className='p-2'>
        <p className='text-[19px] font-semibold text-white leading-6 font-figtree'>{item.userName}</p>
        <p className='mt-1.5 text-secondary text-[15px] leading-5'>Price on OpenSea</p>
        <p className='text-xl font-medium text-white leading-6 mt-px'>{item.price ? item.price : 'Not for Sale'}</p>
      </div>
    </div>
  )
}

export default Index

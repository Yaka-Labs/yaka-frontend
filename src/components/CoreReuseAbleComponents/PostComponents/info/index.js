import React from 'react'

const Index = ({ data }) => {
  return (
    <div className='flex items-center space-x-3 mt-5 mb-4 px-5'>
      <img src={data.svg} alt='' />
      <p className=' leading-5 text-white'>{data.info}</p>
    </div>
  )
}

export default Index

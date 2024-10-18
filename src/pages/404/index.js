import React from 'react'
import { Link } from 'react-router-dom'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const index = () => {
  useAutoDocumentTitle('404')
  return (
    <div className='max-w-[564.96px] mx-auto flex flex-col items-center justify-center pt-[90px] md:pt-[120px] px-5 xl:px-0'>
      <h1 className='text-white font-semibold text-[27px] md:text-[42px] leading-9 md:leading-[48px] font-figtree'>Lost in Cyberspace?</h1>
      <p className='text-base md:text-lg leading-6 md:leading-[30px] text-[#E6E6E6] opacity-[0.88] mt-2.5 md:my-3 text-center'>
        The page you are looking for does not seem to exist.
      </p>
      <Link className='flex items-center space-x-[13.5px] mt-2 md:mt-0' to='/'>
        <p className='text-lg md:text-xl text-green font-medium'>Go to Homepage</p>
        <img className='mt-[5px]' alt='' src='/images/common/spear.svg' />
      </Link>
      <img alt='' className='mt-[33px] md:mt-[50px]' src='/images/common/404-image.png' />
    </div>
  )
}

export default index

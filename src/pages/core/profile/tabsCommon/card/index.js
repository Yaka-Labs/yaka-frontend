import React from 'react'

const Index = ({ title, className, children, disableRightPadding = false, count }) => {
  return (
    <div className={`${className} bg-cardBg ${disableRightPadding ? 'pl-5' : 'px-5'}  py-6 rounded-[5px]`}>
      <p className='text-[22px] leading-[27px] text-white font-figtree font-semibold'>
        {title} {count && <span className=' !font-normal'>({count})</span>}
      </p>
      {children}
    </div>
  )
}

export default Index

import ReactTooltip from 'react-tooltip'
import React from 'react'

const PoolToolTip = ({ type, children, tipView }) => {
  const idx = Math.random()
  return (
    <div className='flex flex-col items-start justify-center'>
      <div data-tip data-for={`${type}-${idx}`} className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px] flex items-center cursor-pointer space-x-[5.1px]'>
        {children}
      </div>
      <ReactTooltip
        className='max-w-[180px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body'
        id={`${type}-${idx}`}
        place='right'
        effect='solid'
      >
        {tipView}
      </ReactTooltip>
    </div>
  )
}

export default PoolToolTip

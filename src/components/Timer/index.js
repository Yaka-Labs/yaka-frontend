import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'

const Index = ({ className, arr }) => {
  const [arrow, setArrow] = useState(false)
  return (
    <div className={`${className} bg-white lg:flex items-center bg-opacity-[0.05] rounded-[3px] bg-clip-padding px-[17px] py-[13.6px]`}>
      {arr.map((item, idx) => {
        return (
          <div
            key={idx}
            className={`border-b w-full lg:border-b-0 lg:border-r text-white  ${
              idx === arr.length - 1 ? 'border-transparent' : 'border-[#757384] pb-[10.2px] lg:pb-0 pr-[16.15px]'
            } ${idx > 0 && 'pt-[10.2px] lg:pt-0 lg:pl-[17px] '} `}
          >
            <p className='font-figtree text-[11.9px]'>{item.title}</p>
            <div
              onMouseEnter={() => {
                if (item.toolTip) {
                  setArrow(true)
                }
              }}
              onMouseLeave={() => {
                if (item.toolTip) {
                  setArrow(false)
                }
              }}
              data-tip={item.toolTip}
              data-for='custom-tooltip'
              className={` ${item.toolTip ? 'cursor-pointer max-w-[170px]' : ''} flex items-center space-x-1`}
            >
              <p className='text-[#E9E9F2] font-medium text-[15.3px] lg:text-[18.7px] leading-[27.2px]'>{item.balance}</p>
              {item.toolTip && (
                <>
                  <img alt='' className={`${arrow ? 'rotate-180' : 'rotate-0'} transition-all duration-300 ease-in-out`} src='/images/common/triangle.svg' />
                  <ReactTooltip
                    className='max-w-[153px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-[13.6px] !py-[7.65px] !px-[20.4px] !opacity-100 after:!bg-body '
                    id='custom-tooltip'
                    place='top'
                    effect='solid'
                  >
                    <p>{item.toolTip}</p>
                  </ReactTooltip>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Index

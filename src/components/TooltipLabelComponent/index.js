import React from 'react'
import ReactTooltip from 'react-tooltip'

const Index = ({ label, tooltipID, tooltipDescription, className = '', textClass }) => {
  return (
    <div className={`${className} flex items-center space-x-1.5`}>
      <p className={`${textClass || 'text-[13px] md:text-base leading-4 md:leading-5 text-lightGray'} `}>{label}</p>
      {tooltipID && (
        <>
          <img alt='' data-tip data-for={tooltipID} src='/images/swap/question-mark.png' />
          <ReactTooltip
            className='max-w-[318.77px] !bg-body !text-[#E6E6E6] !text-base !p-[10px] !border !border-blue !opacity-100 after:!bg-body '
            id={tooltipID}
            place='right'
            effect='solid'
          >
            {tooltipDescription}
          </ReactTooltip>
        </>
      )}
    </div>
  )
}

export default Index

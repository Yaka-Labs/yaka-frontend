import React from 'react'
import '../style.scss'
import StyledButton from 'components/Buttons/styledButton'

const Index = ({ data }) => {
  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex items-center space-x-4'>
        <div className='w-9 h-9'>
          <img alt='' src={data.icon} />
        </div>
        <div>
          <p dangerouslySetInnerHTML={{ __html: data.des }} className='text-white leading-4' id='dangerously-set-data' />
          <p className=' text-secondary text-sm leading-4 mt-0.5'>{data.time}</p>
        </div>
      </div>
      {data.type === 'competitionWithReward' && (
        <StyledButton
          onClickHandler={(e) => {
            e.stopPropagation()
          }}
          content='Claim Reward'
          className='py-2 px-3'
          isCap
        />
      )}
    </div>
  )
}

export default Index

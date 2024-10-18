import React from 'react'
import { useNavigate } from 'react-router-dom'
import CTA from 'components/Buttons/cta'
import './style.scss'

const Start = () => {
  const navigate = useNavigate()

  return (
    <div className='mx-auto container-2 relative z-20'>
      <div className='start-img-item'>
        <div className='start-img-item-body font-figtree'>
          <div className='left-part'>
            <div className='gradient-text left-title font-figtree'>Start Now</div>
            <div className='left-para'>
              <p>Start building your passive income streams right away.</p>
              <p>No registration required.</p>
            </div>
          </div>
          <div className='right-part'>
            <div className='first'>
              <CTA
                icon
                title='SWAP NOW'
                onClickHandler={() => {
                  navigate('/swap')
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Start

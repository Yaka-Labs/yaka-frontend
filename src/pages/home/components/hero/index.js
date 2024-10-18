import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CTA from 'components/Buttons/cta'
import './hero.scss'

const Index = () => {
  const videoRef = useRef(null)
  const navigate = useNavigate()
  const checkScroll = () => {
    const video = videoRef.current
    if (!video) return

    const y = video.offsetTop
    const h = video.offsetHeight
    const b = y + h // bottom
    const visibleY = Math.max(0, Math.min(h, window.scrollY + window.innerHeight - y, b - window.scrollY))

    if (visibleY > 0) {
      video.play()
    } else {
      video.pause()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScroll, false)
    window.addEventListener('resize', checkScroll, false)
    return () => {
      window.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  return (
    <div className='relative hero-wrapper'>
      <div className='video-wrapper'>
        <video
          className='bg-index'
          ref={videoRef}
          playsInline
          autoPlay
          muted
          loop
          src='https://cdn.thena.fi/videos/hero.mp4'
          data-src='https://cdn.thena.fi/videos/hero.mp4'
        />
      </div>
      <div className='container-1 mx-auto hero-box'>
        <svg className='arrows'>
          <path className='a1' d='M0 0 L30 32 L60 0' />
          <path className='a2' d='M0 20 L30 52 L60 20' />
          <path className='a3' d='M0 40 L30 72 L60 40' />
        </svg>
        <div className='box-gradient why-img-item'>
          <div className='why-img-item-body font-figtree'>
            <h2 className='heading'>The Native Liquidity Layer On BNB.</h2>
            <CTA
              icon
              title='SWAP NOW'
              onClickHandler={() => {
                navigate('/swap')
              }}
            />
          </div>
        </div>
        <div className='box-gradient h-[46px] lg:h-[60px] -mt-[23px] lg:-mt-[30px]'>
          <div className='h-full bg-[#090333] flex px-4 lg:px-6 items-center space-x-[5px] lg:space-x-[10px] rounded-[4px] font-figtree'>
            <div className='text-white font-medium text-[12px] lg:text-[15px]'>Audited By</div>
            <img
              className='cursor-pointer h-5 lg:h-7'
              src='/images/logos/openzeppelin.png'
              alt='thena-audit'
              onClick={() => {
                window.open('https://blog.openzeppelin.com/retro-thena-audit', '_blank')
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index

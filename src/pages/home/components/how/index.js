import React, { useState, useMemo, useRef } from 'react'
import Slider from 'react-slick'
import './style.scss'

const veCards = [
  {
    img: '/images/home/how-1.svg',
    title: 'Lock YAKA Token',
    subtitle: 'and Receive veYAKA',
    para: 'Lock YAKA for up to 2 years to receive vote-escrowed YAKA (veYAKA). The longer the lock, the more veYAKA you receive.',
  },
  {
    img: '/images/home/how-2.svg',
    title: 'Use veYAKA to Vote',
    subtitle: 'for Your Favorite Pools',
    para: 'veYAKA gives you the power to decide which pools should receive YAKA emissions.',
  },
  {
    img: '/images/home/how-3.svg',
    title: 'Receive Bribes',
    subtitle: 'and Trading Fees',
    para: 'Voting for a pool lets you claim a share of the weekly bribes and trading fees.',
  },
]

const protocolCards = [
  {
    img: '/images/home/how-4.svg',
    title: 'Request Gauge',
    subtitle: 'Whitelisting',
    para: 'Protocols that seek to open a gauge to be voted on have to request a whitelisting by presenting a proposal.',
  },
  {
    img: '/images/home/how-5.svg',
    title: 'Create a Bribe With',
    subtitle: 'Few Clicks',
    para: 'Once the gauge has been initiated, anyone can bribe it with just a few clicks. Bribes are set per epoch, which lasts for 7 days.',
  },
  {
    img: '/images/home/how-6.svg',
    title: 'Receive Emissions',
    subtitle: 'From veTHE Holders Votes',
    para: 'The emissions are distributed to the gauges for the new epoch based on votes from veTHE holders.',
  },
]

const settings = {
  slidesToShow: 1.2,
  slidesToScroll: 1,
  infinite: true,
  dots: true,
  initialSlide: 0,
  arrows: false,
}

const How = () => {
  const [isProtocols, setIsProtocols] = useState(false)
  const activeCards = useMemo(() => {
    return isProtocols ? protocolCards : veCards
  }, [isProtocols])
  const slider = useRef()

  return (
    <div className='how-wrapper relative lg:overflow-hidden'>
      <img src='/images/home/how-it-works-bg.svg' alt='' className='hidden lg:block lg:top-[228px] w-full absolute bg-index' />
      <img src='/images/home/how-it-works-bg.svg' alt='' className='lg:hidden top-[50%] h-[399px] sm:h-auto w-full absolute bg-index' />
      <div className='how-to-work-wrapper mx-auto container-3'>
        <div className='heading-section'>
          <div className='heading-title gradient-text font-figtree'>How It Works</div>
          <div className='heading-desc'>
            {isProtocols ? 'Control THENA’s emissions by locking into veYAKA' : 'Control THENA’s destiny by locking into veYAKA.'}
          </div>
          <div className='heading-switch'>
            <div
              className={`heading-switch-item${isProtocols ? '' : ' active'}`}
              onClick={() => {
                setIsProtocols(false)
                slider.current.slickGoTo(0)
              }}
            >
              veTHE Holders
            </div>
            <div
              className={`heading-switch-item${isProtocols ? ' active' : ''}`}
              onClick={() => {
                setIsProtocols(true)
                slider.current.slickGoTo(0)
              }}
            >
              Protocols
            </div>
          </div>
        </div>
        <div className='cards-wrapper-desktop'>
          {activeCards.map((item, idx) => {
            return (
              <div key={idx} className='card-wrapper'>
                <div className='inner-card'>
                  <p className='step'>STEP {idx + 1}</p>
                  <img alt='' src={item.img} />
                  <p className='card-title gradient-text font-figtree'>{item.title}</p>
                  <p className='card-subtitle font-figtree'>{item.subtitle}</p>
                  <p className='card-para'>{item.para}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Slider ref={slider} className='slider-main' {...settings}>
        {activeCards.map((item, idx) => {
          return (
            <div key={idx} className='card-wrapper-mobile'>
              <div className='inner-card-mobile min-h-[370px]'>
                <p className='step-mobile'>STEP {idx + 1}</p>
                <img className='step-img-mobile' alt='' src={item.img} />
                <p className='card-title-mobile gradient-text font-figtree'>{item.title}</p>
                <p className='card-subtitle-mobile font-figtree'>{item.subtitle}</p>
                <p className='card-para-mobile'>{item.para}</p>
              </div>
            </div>
          )
        })}
      </Slider>
      <img alt='' src='/images/common/bg-b.png' className='w-full bottom-shadow' />
    </div>
  )
}

export default How

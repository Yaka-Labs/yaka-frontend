import React from 'react'
import Slider from 'react-slick'
import './style.scss'

const cards = [
  {
    img: '/images/mint/icon-1.svg',
    title: 'Connect Your Wallet',
    para: 'Connect your compatible DeFi wallet using BNB Chain.',
  },
  {
    img: '/images/mint/icon-2.svg',
    title: 'Stake Your theNFT',
    para: 'Select your theNFTs and stake them. You can unstake each of them anytime.',
  },
  {
    img: '/images/mint/icon-3.svg',
    title: 'Earn Income',
    para: 'Claim weekly trading fees and royalties.',
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

const Index = () => {
  return (
    <div className='main-wrapper'>
      <div className='how-to-mint-wrapper mx-auto container-3'>
        <p className='heading font-figtree'>How To Stake?</p>
        <div className='cards-wrapper-desktop'>
          {cards.map((item, idx) => {
            return (
              <div key={idx} className='card-wrapper'>
                <div className='inner-card h-full'>
                  <p className='step'>STEP {idx + 1}</p>
                  <div className='animate-icon'>
                    <img alt='' src={item.img} />
                  </div>
                  <h4 className='card-title text-xl lg:text-[27px] font-figtree'>{item.title}</h4>
                  <p className='card-para  max-w-[280px]'>{item.para}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Slider className='slider-main' {...settings}>
        {cards.map((item, idx) => {
          return (
            <div key={idx} className='card-wrapper-mobile w-full'>
              <div className='inner-card-mobile'>
                <p className='step-mobile'>STEP {idx + 1}</p>
                <img className='step-img-mobile' alt='' src={item.img} />
                <p className='card-title-mobile font-figtree'>{item.title}</p>
                <p className='card-para-mobile'>{item.para}</p>
              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

export default Index

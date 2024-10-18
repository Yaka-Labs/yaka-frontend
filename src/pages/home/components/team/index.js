import React from 'react'
import Slider from 'react-slick'
import './style.scss'

const cards = [
  {
    img: '/images/home/team-1.png',
    title: 'Theseus',
    subtitle: 'Founder',
    para: 'DeFi native, self-appointed tokenomist. Started as a consultant in web3 back in early 2020, and quickly realized he wanted to build his own systems. Always keen on engaging with the citizens of THENA. Together we build.',
  },
  {
    img: '/images/home/team-2.png',
    title: '0xApollo',
    subtitle: 'Head of Marketing',
    para: 'DeFi maven with over a decade of experience in various industries. Inspired by the god of truth and prophecy. Passionate about seeking higher knowledge. Claims to live in a simulation.',
  },
  {
    img: '/images/home/team-3.png',
    title: 'Xermes',
    subtitle: 'Community Manager',
    para: 'Enjoys turning chaos into functional organizations. Believes in direct communication, hates misinformation. Wandering around DeFi playgrounds for a while. Famous for herding the cats.',
  },
  {
    img: '/images/home/team-4.png',
    title: 'Theonysus',
    subtitle: 'Partnerships Lead',
    para: 'Son of Zeus and a Thenian, Theonysus studied the ancient economics and worked in the banking industry within the realm of gods. Keen to renew with his maternal roots and aware of the revolution, he left the realm to serve THENA.',
  },
  {
    img: '/images/home/team-5.png',
    title: 'Prometheus',
    subtitle: 'Lead Solidity Developer',
    para: 'Security minded master of smart contract engineering. Best known for defying the gods by stealing fire from them and giving it to humanity in the form of technology, knowledge, and civilization. He is also credited with the creation of humanity from clay.',
  },
  {
    img: '/images/home/team-6.png',
    title: 'Hyperion',
    subtitle: 'Full Stack Developer',
    para: 'A wizard of all things web, now building THENA inside and out. Stacking sats with the gods since the birth of Bitcoin.',
  },
  {
    img: '/images/home/team-7.png',
    title: 'Homer',
    subtitle: 'Advisor',
    para: 'Legend of the ancient world and rumored ruler of the cosmos.',
  },
  {
    img: '/images/home/team-8.png',
    title: 'Morpheus',
    subtitle: 'Strategic Advisor',
    para: 'Web3 native, founder & advisor. Morpheus is the ancient Greek god of dreams. The myth says that he would appear in people’s dreams and convey messages from the Thenian gods.',
  },
]

const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  dots: true,
  initialSlide: 0,
  arrows: false,
}

const Team = () => {
  return (
    <div className='team-section relative z-20'>
      <div className='team-wrapper mx-auto container-3'>
        <div className='heading-section gradient-text font-figtree'>Team</div>
        <div className='cards-wrapper-desktop'>
          {cards.map((item, idx) => {
            return (
              <div key={idx} className='inner-card'>
                <img alt='' src={item.img} />
                <p className='card-title font-figtree'>{item.title}</p>
                <p className='card-subtitle font-figtree'>{item.subtitle}</p>
                <p className='card-para'>{item.para}</p>
              </div>
            )
          })}
        </div>
      </div>
      <Slider className='slider-main' {...settings}>
        {cards.map((item, idx) => {
          return (
            <div key={idx} className='inner-card-mobile'>
              <img className='step-img-mobile' src={item.img} alt='' />
              <p className='card-title-mobile font-figtree'>{item.title}</p>
              <p className='card-subtitle-mobile font-figtree'>{item.subtitle}</p>
              <p className='card-para-mobile'>{item.para}</p>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

export default Team

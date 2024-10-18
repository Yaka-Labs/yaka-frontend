import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from './card'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const Index = () => {
  useAutoDocumentTitle('WhiteList')
  const navigate = useNavigate()
  const cards = [
    {
      img: '/images/whiteList/icon-4.svg',
      title: 'Add Gauge',
      para: 'Create a new gauge which can be used for staking and voting.',
      button: 'ADD GAUGE',
      route: '/whitelist/gauge',
      CTA: true,
    },
    {
      img: '/images/whiteList/icon-5.svg',
      title: 'Add Bribe',
      para: 'Add a bribe reward for an existing gauge to incentivize votes on it.',
      button: 'ADD BRIBE',
      route: '/whitelist/bribe',
      CTA: false,
    },
  ]

  return (
    <div className='max-w-[1020px] px-[17px] sm:px-[54.4px] md:px-[95.2px] mdLg:px-[136px] lg:px-[17px] xl:px-0 pt-[68px]  md:pt-[102px] mx-auto lg:pb-[63.75px]'>
      <div className='lg:flex items-end justify-between lg:space-x-[51px]'>
        <div className='w-full'>
          <h1 className='text-[34px] md:text-[35.7px] font-semibold text-white  font-figtree'>Gauges</h1>
          <p className='text-[#b8b6cb] text-base md:text-[16.3px] leading-[22px] md:leading-[20.4px] mt-[3.4px]'>
            Create a new Gauge or add a bribe on existing gauge.&nbsp;
            <a href='https://yaka.gitbook.io/yaka-finance' target='_blank' rel='noreferrer' className='text-green'>
              Learn More
            </a>
          </p>
        </div>
        {/* <Timer arr={balance} className={`w-full lg:w-1/2 mt-4 lg:mt-0`} /> */}
      </div>
      <div className='w-full mt-[37.4px] grid lg:grid-cols-2 gap-6'>
        {cards.map((item, idx) => {
          return (
            <Card
              title={item.title}
              img={item.img}
              para={item.para}
              button={item.button}
              cta={item.CTA}
              key={idx}
              setOpen={() => {
                navigate(item.route)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Index

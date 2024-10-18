import React from 'react'
import HomePara from '../HomePara'
import './style.scss'

const links = [
  {
    label: 'Swap Now',
    value: '/swap',
    external: false,
  },
  {
    label: 'Start Staking',
    value: '/liquidity',
    external: false,
  },
  {
    label: 'Go Vote',
    value: '/vote',
    external: false,
  },
]

const Statue = () => {
  return (
    <div className='statue-section'>
      <div className='relative'>
        <HomePara
          reverse
          src='/images/home/statue-1.png'
          title='Swap Your Tokens'
          span='With Low Slippage'
          para='THENA’s smart routing, deep liquidity, and latest AMM technology allow you to enjoy low slippage and high return when swapping one cryptocurrency for another.'
          link={links[0]}
        />
        <img alt='' src='/images/common/bg-circle.png' className='absolute bg-index left-blob dekstop' />
        <img alt='' src='/images/common/bg-circle.png' className='absolute bg-index left-blob mobile' />
      </div>
      <HomePara
        reverse={false}
        src='/images/home/statue-2.png'
        title='Stake and Earn'
        large
        span='Passive Income'
        para='Stake your assets for instant passive income streams. No deposit or withdrawal fees. You have full control over your funds.'
        link={links[1]}
      />
      <div className='relative overflow-x-clip'>
        <HomePara
          reverse
          src='/images/home/statue-3.png'
          title='Liquidity Layer'
          span='for SEI Chain'
          para='YAKA FINANCE was designed to onboard the next generation of protocols to the SEI chain by opening up a free market for THE emissions. Protocols can bribe veYAKA holders or acquire veYAKA to redirect emissions to their pools, offering a flexible and capital efficient solution to bootstrap and scale liquidity.'
          link={links[2]}
        />
        <img alt='' src='/images/common/bg-circle.png' className='absolute bg-index right-blob' />
      </div>
    </div>
  )
}

export default Statue

import React from 'react'
import HomePara from '../HomePara'

const links = [
  {
    label: 'Learn More',
    value: 'https://yaka.gitbook.io/yaka-finance',
    external: true,
  },
]

const Diagram = () => {
  return (
    <div className='diagram-section'>
      <div className='relative'>
        <HomePara
          reverse={false}
          src='/images/home/statue-4.png'
          title='Novel ve(3,3)'
          span='Tokenomics'
          larger
          para='Inspired by the vote-escrow model from Curve and the anti-dilution mechanism from Olympus, veYAKA holders control 100% of THENA’s emissions allocated to gauges and benefit from weekly rebases, reducing dilution from emissions over time. THE Model rewards long-term supporters, and aligns stakeholders interests by incentivizing fee generation.'
          link={links[0]}
        />
        <img alt='' src='/images/common/bg-circle.png' className='absolute bg-index left-blob dekstop' />
        <img alt='' src='/images/common/bg-circle.png' className='absolute bg-index left-blob mobile' />
      </div>
      <HomePara
        reverse
        src='/images/home/statue-5.png'
        title='A Community-Owned'
        span='Protocol'
        para='No VCs, no seed round. THENA had a decentralized distribution that targeted regular users of core protocols on the BNB chain and supported protocols that intend to leverage THENA to build their liquidity. The novel NFT fundraising mechanism allows us to incentivize best practices from stakeholders and bootstrap an amazing community of Thenians without the need to sell tokens at discounts.'
      />
      <div className='relative overflow-x-clip'>
        <HomePara
          reverse={false}
          src='/images/home/statue-6.png'
          title='Low Fee Hybrid'
          small
          span='vAMM/ sAMM'
          para='With fees ranging from 0.01% for stable pools to 0.2% for variable pools, THENA allows traders to execute trades with minimal slippage. Executing a trade will follow the cheapest route based on available liquidity in the pools, with trading fees incurred.'
        />
        <img alt='' src='/images/common/bg-circle.png' className='absolute bg-index right-blob z-30' />
      </div>
    </div>
  )
}

export default Diagram

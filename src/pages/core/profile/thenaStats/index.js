import React, { useState } from 'react'
import Card from '../tabsCommon/card'
import { LineChart } from './lineGraph'

const Index = ({ earnings }) => {
  const competitonsTabs = ['ALL', 'SPOT', 'PERPETUAL']
  const [competitons, setCompetitons] = useState('ALL')
  const allTrades = ['ALL TRADES', 'BUY SIDE', 'SELL SIDE']
  const [tradesTab, setTradesTab] = useState('ALL TRADES')

  const Spot = {
    joinedCompetitions: '8',
    hostedCompetitions: '0',
    highestRankAchieved: '3',
    totalTradingVolume: '$72,170.60',
    totalPNL: '-$12,170.60',
    totalRewards: '$36,290.11',
  }
  const Prepetual = {
    joinedCompetitions: '2',
    hostedCompetitions: '8',
    highestRankAchieved: '3',
    totalTradingVolume: '$72,170.60',
    totalPNL: '+$78,170.60',
    totalRewards: '$36,290.11',
  }

  const profitLossData = [
    {
      time: 'Last 24 Hours',
      value: '$314.12',
      percentage: '-4.05%',
      color: '#C4373E',
      data: [
        { x: 0, y: 90 },
        { x: 2, y: 12 },
        { x: 3, y: 34 },
        { x: 4, y: 53 },
        { x: 5, y: 98 },
      ],
    },
    {
      time: 'Past 30 Days',
      value: '$6,384.73',
      percentage: '+116.05%',
      color: '#55A361',
      data: [
        { x: 0, y: 10 },
        { x: 2, y: 8 },
        { x: 3, y: 60 },
        { x: 4, y: 14 },
        { x: 5, y: 18 },
      ],
    },
    {
      time: 'Total',
      value: '$52,384.73',
      percentage: '+956.05%',
      color: '#55A361',
      data: [
        { x: 0, y: 20 },
        { x: 2, y: 24 },
        { x: 3, y: 22 },
        { x: 4, y: 32 },
        { x: 5, y: 98 },
      ],
    },
  ]
  const volume = [
    {
      time: 'Last 24 Hours',
      value: '$3,736.60',
    },
    {
      time: 'Past 30 days',
      value: '$3,736.60',
    },
    {
      time: 'Total',
      value: '$422,170.60',
    },
  ]

  const trades = [
    {
      time: 'Daily',
      value: '2',
    },
    {
      time: 'Weekly',
      value: '13',
    },
    {
      time: 'Monthly',
      value: '54',
    },
  ]
  const liquidity = [
    {
      time: 'Your Liquidity',
      value: '$30,736.60',
    },
    {
      time: 'Your Staked Amount',
      value: '$28,736.60',
    },
    {
      time: 'Total Earnings',
      value: '$6,136.60',
    },
  ]
  const referral = [
    {
      time: 'Successful Referrals',
      value: '13',
    },
    {
      time: 'Total Earned Fees',
      value: '$28,736.60',
    },
  ]

  const allHeadings = [
    {
      title: 'Joined Competitions',
      key: 'joinedCompetitions',
    },
    {
      title: 'Hosted Competitions',
      key: 'hostedCompetitions',
    },
    {
      title: 'Highest Rank Achieved',
      key: 'highestRankAchieved',
    },
    {
      title: 'Total Trading Volume',
      key: 'totalTradingVolume',
    },
    {
      title: 'Total PNL',
      key: 'totalPNL',
    },
    {
      title: 'Total Rewards',
      key: 'totalRewards',
    },
  ]

  const All = {
    joinedCompetitions: '8',
    hostedCompetitions: '0',
    highestRankAchieved: '3',
    totalTradingVolume: '$72,170.60',
    totalPNL: '+$32,170.60',
    totalRewards: '$36,290.11',
  }
  const Data = ({ data, all, earnings }) => {
    return data.map((item, idx) => {
      return (
        <div key={idx} className='bg-white bg-opacity-[0.04] px-4 py-5 rounded-[5px]'>
          <p className='text-lightGray leading-5 font-figtree text-[17px]'>{item.title}</p>
          {earnings && (item.key === 'totalPNL' || item.key === 'totalRewards') ? (
            <div className='h-10 bg-white bg-opacity-[0.04] rounded-[3px] w-full mt-1.5' />
          ) : (
            <p
              className={`${
                item.key === 'totalPNL' ? (all[item.key].includes('+') ? 'text-success' : 'text-error') : 'text-white'
              }  text-[22px] leading-[26px] font-semibold mt-0.5`}
            >
              {all[item.key]}
            </p>
          )}
        </div>
      )
    })
  }

  const renderTabs = (tab) => {
    switch (tab) {
      case 'ALL':
        return <Data data={allHeadings} all={All} earnings={earnings} />
      case 'SPOT':
        return <Data data={allHeadings} all={Spot} />
      case 'PERPETUAL':
        return <Data data={allHeadings} all={Prepetual} />
      default:
    }
  }

  const allTradesData = [
    {
      img: 'https://cdn.thena.fi/assets/BTCB.png',
      name: 'BTCB',
      chain: 'Bitcoin Bep2',
      per: '33.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BUSD.png',
      name: 'BUSD',
      chain: 'Binance USD',
      per: '21.2%',
    },
    {
      img: 'https://cdn.thena.fi/assets/ETH.png',
      name: 'ETH',
      chain: 'Ethereum',
      per: '19.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BTCB.png',
      name: 'BTCB',
      chain: 'Bitcoin Bep2',
      per: '33.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BUSD.png',
      name: 'BUSD',
      chain: 'Binance USD',
      per: '21.2%',
    },
    {
      img: 'https://cdn.thena.fi/assets/ETH.png',
      name: 'ETH',
      chain: 'Ethereum',
      per: '19.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BTCB.png',
      name: 'BTCB',
      chain: 'Bitcoin Bep2',
      per: '33.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BUSD.png',
      name: 'BUSD',
      chain: 'Binance USD',
      per: '21.2%',
    },
    {
      img: 'https://cdn.thena.fi/assets/ETH.png',
      name: 'ETH',
      chain: 'Ethereum',
      per: '19.8%',
    },
  ]
  const buySide = [
    {
      img: 'https://cdn.thena.fi/assets/ETH.png',
      name: 'ETH',
      chain: 'Ethereum',
      per: '19.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BTCB.png',
      name: 'BTCB',
      chain: 'Bitcoin Bep2',
      per: '33.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BUSD.png',
      name: 'BUSD',
      chain: 'Binance USD',
      per: '21.2%',
    },
    {
      img: 'https://cdn.thena.fi/assets/ETH.png',
      name: 'ETH',
      chain: 'Ethereum',
      per: '19.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BTCB.png',
      name: 'BTCB',
      chain: 'Bitcoin Bep2',
      per: '33.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BUSD.png',
      name: 'BUSD',
      chain: 'Binance USD',
      per: '21.2%',
    },
    {
      img: 'https://cdn.thena.fi/assets/ETH.png',
      name: 'ETH',
      chain: 'Ethereum',
      per: '19.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BTCB.png',
      name: 'BTCB',
      chain: 'Bitcoin Bep2',
      per: '33.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BUSD.png',
      name: 'BUSD',
      chain: 'Binance USD',
      per: '21.2%',
    },
  ]
  const sellSide = [
    {
      img: 'https://cdn.thena.fi/assets/BTCB.png',
      name: 'BTCB',
      chain: 'Bitcoin Bep2',
      per: '33.8%',
    },

    {
      img: 'https://cdn.thena.fi/assets/ETH.png',
      name: 'ETH',
      chain: 'Ethereum',
      per: '19.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BTCB.png',
      name: 'BTCB',
      chain: 'Bitcoin Bep2',
      per: '33.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BUSD.png',
      name: 'BUSD',
      chain: 'Binance USD',
      per: '21.2%',
    },
    {
      img: 'https://cdn.thena.fi/assets/ETH.png',
      name: 'ETH',
      chain: 'Ethereum',
      per: '19.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BUSD.png',
      name: 'BUSD',
      chain: 'Binance USD',
      per: '21.2%',
    },
    {
      img: 'https://cdn.thena.fi/assets/ETH.png',
      name: 'ETH',
      chain: 'Ethereum',
      per: '19.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BTCB.png',
      name: 'BTCB',
      chain: 'Bitcoin Bep2',
      per: '33.8%',
    },
    {
      img: 'https://cdn.thena.fi/assets/BUSD.png',
      name: 'BUSD',
      chain: 'Binance USD',
      per: '21.2%',
    },
  ]

  const Row = ({ data }) => {
    return data.map((item, idx) => {
      return (
        <div key={idx} className={`flex items-center justify-between px-5 py-[9px] ${idx % 2 === 0 ? 'bg-white bg-opacity-[0.04]' : ''}`}>
          <div className='flex items-center space-x-1.5'>
            <div className='flex items-center space-x-2.5'>
              <img alt='' src={item.img} className='w-6 h-6' />
              <span className='text-white text-base leading-5 font-figtree'>{item.name}</span>
            </div>
            <span className='text-sm leading-4 text-secondary'>{item.chain}</span>
          </div>
          <p className='text-base leading-5 text-white'>{item.per}</p>
        </div>
      )
    })
  }

  const renderTradeTabs = (tab) => {
    switch (tab) {
      case 'ALL TRADES':
        return <Row data={allTradesData} />
      case 'BUY SIDE':
        return <Row data={buySide} />
      case 'SELL SIDE':
        return <Row data={sellSide} />
      default:
    }
  }

  return (
    <>
      <Card title='Profit / Loss ($)' className='mt-5'>
        <div className='grid grid-cols-3 gap-5 mt-2.5'>
          {profitLossData.map((item, idx) => {
            return (
              <div key={idx} className='bg-white bg-opacity-[0.04] px-4 pt-2.5 pb-3.5 rounded-[5px]'>
                <p className='text-lightGray leading-5 font-figtree text-[17px]'>{item.time}</p>
                <p className='text-white text-[22px] leading-[26px] font-semibold mt-0.5'>{item.value}</p>
                {earnings ? (
                  <div className='h-10 bg-white bg-opacity-[0.04] rounded-[3px] w-full mt-1.5' />
                ) : (
                  <LineChart className='mt-[3px]' width={193.37} height={35.04} data={item.data} stroke={item.color} stats={item.percentage} />
                )}
              </div>
            )
          })}
        </div>
      </Card>
      <Card title='Volume' className='mt-5'>
        <div className='grid grid-cols-3 gap-5 mt-2.5'>
          {volume.map((item, idx) => {
            return (
              <div key={idx} className='bg-white bg-opacity-[0.04] px-4 py-5 rounded-[5px]'>
                <p className='text-lightGray leading-5 font-figtree text-[17px]'>{item.time}</p>
                <p className='text-white text-[22px] leading-[26px] font-semibold mt-0.5'>{item.value}</p>
              </div>
            )
          })}
        </div>
      </Card>
      <Card title='Average Number Of Trades' className='mt-5'>
        <div className='grid grid-cols-3 gap-5 mt-2.5'>
          {trades.map((item, idx) => {
            return (
              <div key={idx} className='bg-white bg-opacity-[0.04] px-4 py-5 rounded-[5px]'>
                <p className='text-lightGray leading-5 font-figtree text-[17px]'>{item.time}</p>
                <p className='text-white text-[22px] leading-[26px] font-semibold mt-0.5'>{item.value}</p>
              </div>
            )
          })}
        </div>
      </Card>
      <Card title='Trading Competitions' className='mt-5'>
        <div className='flex items-center pt-3 pb-4 space-x-[18px]'>
          {competitonsTabs.map((item, idx) => {
            return (
              <button
                key={idx}
                onClick={() => setCompetitons(item)}
                className={`${
                  competitons === item ? 'text-lightGray border-green' : 'text-placeholder border-transparent'
                } pb-0.5 leading-5 font-semibold border-b`}
              >
                {item}
              </button>
            )
          })}
        </div>
        <div className='grid grid-cols-3 gap-5 mt-2.5'>{renderTabs(competitons)}</div>
      </Card>
      <Card title='Liquidity' className='mt-5'>
        <div className='grid grid-cols-3 gap-5 mt-2.5'>
          {liquidity.map((item, idx) => {
            return (
              <div key={idx} className='bg-white bg-opacity-[0.04] px-4 py-5 rounded-[5px]'>
                <p className='text-lightGray leading-5 font-figtree text-[17px]'>{item.time}</p>
                <p className='text-white text-[22px] leading-[26px] font-semibold mt-0.5'>{item.value}</p>
              </div>
            )
          })}
        </div>
      </Card>
      <Card title='Referral' className='mt-5'>
        <div className='grid grid-cols-3 gap-5 mt-2.5'>
          {referral.map((item, idx) => {
            return (
              <div key={idx} className='bg-white bg-opacity-[0.04] px-4 py-5 rounded-[5px]'>
                <p className='text-lightGray leading-5 font-figtree text-[17px]'>{item.time}</p>
                <p className='text-white text-[22px] leading-[26px] font-semibold mt-0.5'>{item.value}</p>
              </div>
            )
          })}
        </div>
      </Card>
      <Card title='Most Traded Assets' className='mt-5'>
        <div className='flex items-center pt-3 pb-4 space-x-[18px]'>
          {allTrades.map((item, idx) => {
            return (
              <button
                key={idx}
                onClick={() => setTradesTab(item)}
                className={`${
                  tradesTab === item ? 'text-lightGray border-green' : 'text-placeholder border-transparent'
                } pb-0.5 leading-5 font-semibold border-b`}
              >
                {item}
              </button>
            )
          })}
        </div>
        {allTradesData.length > 0 && buySide.length > 0 && sellSide.length > 0 ? (
          <div className='max-h-[200px] overflow-auto'>{renderTradeTabs(tradesTab)}</div>
        ) : (
          <div className='mt-4 text-center'>
            <p className='text-xl leading-6 text-white font-figtree font-medium'>You have no trades.</p>
            <p className='text-lg leading-5 text-green mt-1.5 cursor-pointer'>Trade Now</p>
          </div>
        )}
      </Card>
    </>
  )
}

export default Index

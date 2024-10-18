import React, { useState } from 'react'
import Modal from 'components/Modal'
import Card from '../tabsCommon/card'
import Slider from './slider'

const gettingStartedAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 1,
    percent: 21,
    total: 1,
    title: 'Rookie Trader',
    des: 'Complete your first trade on Thena',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 1,
    percent: 40,
    total: 1,
    title: 'Twitter Connect',
    des: 'Connect your Twitter account',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 1,
    percent: 21,
    total: 1,
    title: 'THENA Identity',
    des: 'Acquire a .thena username',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 1,
    percent: 1,
    total: 3,
    title: 'Thenian Fellow',
    des: 'Follow 3 Thenians.',
  },
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 1,
    percent: 1,
    total: 3,
    title: 'Social Fellow',
    des: 'Publish your first post.',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 1,
    percent: 1,
    total: 3,
    title: 'Thenian Fellow',
    des: 'Follow 3 Thenians.',
  },
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 1,
    percent: 21,
    total: 3,
    title: 'Social Fellow',
    des: 'Publish your first post.',
  },
]
const tradingVolumeAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 1000,
    percent: 11,
    total: 1000,
    title: 'Thousand Dollar Club',
    des: 'Reach a trading volume of $1,000 USD',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 25000,
    percent: 12,
    total: 25000,
    title: 'Rising Star',
    des: 'Reach a trading volume of $25,000 USD',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 19531,
    percent: 13,
    total: 50000,
    title: 'Market Mover',
    des: 'Reach a trading volume of $50,000 USD',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 19531,
    percent: 1,
    total: 50000,
    title: 'Six-Figure Trader',
    des: 'Reach a trading volume of $100,000 USD',
  },
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 0,
    percent: 22,
    total: 500000,
    title: 'Half-Million Hero',
    des: 'Reach a trading volume of $500,000 USD',
  },
]
const tokenTradingAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 10,
    total: 10,
    percent: 1,
    title: 'Slippery Slope',
    des: 'Occur over 10% slippage on a single trade',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 10,
    total: 10,
    percent: 1,
    title: 'Market Explorer',
    des: 'Trade 10 different tokens',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 12,
    total: 50,
    title: 'Asset Collector',
    des: 'Trade 50 different tokens',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 12,
    total: 100,
    title: 'Token Hunter',
    des: 'Trade 100 different tokens',
  },
]
const referalAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 5,
    total: 5,
    title: 'Social Butterfly',
    des: 'Refer 5 friends to the Thena platform',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 25,
    total: 25,
    title: 'Ambassador',
    des: 'Refer 25 friends to the Thena platform',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 31,
    total: 100,
    title: 'Master Recruiter',
    des: 'Refer 100 friends to the Thena platform',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 31,
    total: 100,
    title: 'Thena Tycoon',
    des: 'Refer 1000 friends to the Thena platform',
  },
]
const votingAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 3,
    total: 3,
    title: 'veYAKA Voter',
    des: 'Vote on 3 different pools with your veYAKA',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 3,
    total: 10,
    percent: 1,
    title: 'Democracy Enthusiast',
    des: 'Vote on 10 different pools with your veYAKA',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 3,
    total: 10,
    percent: 1,
    title: 'Governance Guru',
    des: 'Vote on 100 different pools with your veYAKA',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 31,
    total: 100,
    title: 'Supreme Legislator',
    des: 'Vote on 1,000 different pools with your veYAKA',
  },
]
const rewardClaimingAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 100,
    total: 500,
    percent: 1,
    title: 'Reward Hunter',
    des: 'Claim a total of $100 USD voting rewards',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 100,
    total: 500,
    percent: 1,
    title: 'Reward Collector',
    des: 'Claim a total of $500 USD voting rewards',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 20,
    percent: 1,
    total: 1000,
    title: 'Voting Victor',
    des: 'Claim a total of $1,000 USD voting rewards',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 31,
    percent: 1,
    total: 5000,
    title: 'Voting Veteran',
    des: 'Claim a total of $5,000 USD voting rewards',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 100,
    percent: 1,
    total: 10000,
    title: 'Voting Virtuoso',
    des: 'Claim a total of $10,000 USD voting rewards',
  },
]
const bribaryAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 3,
    total: 3,
    percent: 1,
    title: 'Bribe Buddy',
    des: 'Add a bribe to 3 different gauges',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 10,
    total: 10,
    percent: 1,
    title: 'Bribe Boss',
    des: 'Add a bribe to 10 different gauges',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 10,
    total: 100,
    percent: 1,
    title: 'Bribe Baron',
    des: 'Add a bribe to 100 different gauges',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 101,
    total: 1000,
    percent: 1,
    title: 'Bribery Beginner',
    des: 'Add total bribes worth $1,000 USD',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 101,
    percent: 1,
    total: 10000,
    title: 'Bribery Bonanza',
    des: 'Add total bribes worth $10,000 USD',
  },
]
const theNFTsAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 1,
    total: 1,
    title: 'theNFT Novice',
    des: 'Own & stake at least 1 theNFTs',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 5,
    total: 5,
    title: 'theNFT Collector',
    des: 'Own & stake at least 5 theNFTs.',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 5,
    total: 10,
    percent: 1,
    title: 'theNFT Connoisseur',
    des: 'Own & stake at least 10 theNFTs',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 5,
    total: 100,
    title: 'theNFT King',
    des: 'Own & stake at least 100 theNFTs',
  },
]
const tradingConsistencyAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 1,
    total: 1,
    title: 'Weekly Warrior',
    des: 'Trade on THENA every day for a week',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 1,
    total: 1,
    title: 'Monthly Master',
    des: 'Trade on THENA every day for a month',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 0,
    total: 1,
    title: 'Yearly Victor',
    des: 'Trade on THENA every day for a year',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 0,
    total: 2,
    title: 'Double-Year Devotee',
    des: 'Trade on THENA every day for 2 years',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 0,
    total: 2,
    title: 'Three-Year Veteran',
    des: 'de on THENA every day for 3 years',
  },
]
const liquidityProvidingAchievementsAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 1000,
    total: 1000,
    title: 'Liquidity Launchpad',
    des: 'Add a total of $1,000 USD in liquidity',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 10000,
    total: 10000,
    title: 'Liquidity Leader',
    des: 'Add a total of $10,000 USD in liquidity',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 10000,
    total: 100000,
    title: 'Six-Figure Support',
    des: 'Add a total of $100,000 USD in liquidity',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 10000,
    total: 1000000,
    title: 'Million-Dollar Provider',
    des: 'Add a total of $1,000,000 USD in liquidity',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 1000,
    total: 5000000,
    title: 'Five Million Fountain',
    des: 'Add a total of $5,000,000 USD in liquidity',
  },
]
const socialMediaAndIdentityAchievements = [
  {
    badgeImg: '/images/profile/badges/1.png',
    points: 5,
    total: 5,
    title: 'Social Butterfly',
    des: 'Refer 5 friends to the Thena platform',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 25,
    total: 25,
    title: 'Ambassador',
    des: 'Refer 25 friends to the Thena platform',
  },

  {
    badgeImg: '/images/profile/badges/3.png',
    points: 31,
    total: 100,
    title: 'Master Recruiter',
    des: 'Refer 100 friends to the Thena platform',
  },
  {
    badgeImg: '/images/profile/badges/2.png',
    points: 31,
    total: 100,
    title: 'Thena Tycoon',
    des: 'Refer 1000 friends to the Thena platform',
  },
]
const Index = () => {
  const [unlock, setUnlock] = useState(false)
  const [badge] = useState({
    img: '/images/profile/badges/2.png',
    title: 'Rising Star Achievement Completed!',
    desc: 'Reach a trading volume of $25,000 USD.',
    social: [
      { link: '', icon: '/images/profile/social/fb.png' },
      { link: '', icon: '/images/profile/social/twitter.png' },
      { link: '', icon: '/images/profile/social/linkedin.png' },
      { link: '', icon: '/images/profile/social/telegram.png' },
    ],
  })

  return (
    <>
      <Modal popup={unlock} setPopup={setUnlock} width={595}>
        <div className='flex flex-col items-center justify-center w-full py-11'>
          <img alt='' className='w-[173px] h-[173px]' src={badge.img} />
          <p className='text-[27px] font-semibold font-figtree leading-8 text-white'>{badge.title}</p>
          <p className='text-lg leading-5 mt-1 text-secondary'>{badge.title}</p>

          <p className='mt-7 text-[22px] leading-8 font-figtree text-white font-medium'>Share This Achievement</p>
          <div className='flex items-center justify-center space-x-4 mt-[9px]'>
            {badge.social.map((item, idx) => {
              return (
                <a target='__blank' href={item.link} key={idx}>
                  <img alt='' src={item.icon} />
                </a>
              )
            })}
          </div>
        </div>
      </Modal>
      <Card className='mt-5 relative' disableRightPadding count={gettingStartedAchievements.length} title='Getting Started Achievements '>
        <Slider className=' !mt-5' data={gettingStartedAchievements} id='gettingStartedAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding count={tradingVolumeAchievements.length} title='Trading Volume Achievements'>
        <Slider className=' !mt-5' data={tradingVolumeAchievements} id='tradingVolumeAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding count={tokenTradingAchievements.length} title='Token Trading Achievements'>
        <Slider className=' !mt-5' data={tokenTradingAchievements} id='tokenTradingAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding count={referalAchievements.length} title='Referral Achievements'>
        <Slider className=' !mt-5' data={referalAchievements} id='referalAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding count={votingAchievements.length} title='Voting Achievements'>
        <Slider className=' !mt-5' data={votingAchievements} id='votingAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding count={rewardClaimingAchievements.length} title='Reward Claiming Achievements'>
        <Slider className=' !mt-5' data={rewardClaimingAchievements} id='rewardClaimingAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding count={bribaryAchievements.length} title='Bribary Achievements'>
        <Slider className=' !mt-5' data={bribaryAchievements} id='bribaryAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding title='theNFTs Achievements' count={theNFTsAchievements.length}>
        <Slider className=' !mt-5' data={theNFTsAchievements} id='theNFTsAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding title='Trading Consistency Achievements ' count={tradingConsistencyAchievements.length}>
        <Slider className=' !mt-5' data={tradingConsistencyAchievements} id='tradingConsistencyAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding title='Liquidity Providing Achievements' count={liquidityProvidingAchievementsAchievements.length}>
        <Slider className=' !mt-5' data={liquidityProvidingAchievementsAchievements} id='liquidityProvidingAchievementsAchievements' />
      </Card>
      <Card className='mt-5 relative' disableRightPadding title='Social Media And Identity Achievements' count={socialMediaAndIdentityAchievements.length}>
        <Slider className=' !mt-5' data={socialMediaAndIdentityAchievements} id='socialMediaAndIdentityAchievements' />
      </Card>
    </>
  )
}

export default Index

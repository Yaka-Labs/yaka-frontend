import React, { useEffect, useState } from 'react'

import './style.scss'
import Tab from 'components/Tab'
import useWeb3 from 'hooks/useWeb3'
import { getTokenSaleContract, getSeiCampaignStage2Contract } from '../../utils/contractHelpers'
import axios from 'axios'
import discordSvg from './img/discord.svg'
import twitterSvg from './img/twitter.svg'
import tgSvg from './img/tg.svg'
import websiteSvg from './img/website.svg'
import StyledButton from 'components/Buttons/styledButton'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formatEther } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getTokenSaleAddress } from 'utils/addressHelpers'
import { formatNumber } from 'utils/formatNumber'
import { IdoTokenName, RaiseTokenName, StagesDict } from './constant'
import { isAddress } from '@ethersproject/address'
import { zeroAddress } from '@defi.org/web3-candies'
import InviteButton from './invite'

const Tabs = ['ALL', 'Live', 'Upcoming', 'Closed']

export const getLinkLogo = (type) => {
  if (type === 'discord') {
    return discordSvg
  }
  if (type === 'twitter') {
    return twitterSvg
  }
  if (type === 'tg') {
    return tgSvg
  }
  if (type === 'website') {
    return websiteSvg
  }
}

export const lanunchpadProjects = [
  {
    id: '1',
    projectName: 'YAKA Finance',
    status: 'Live',
    type: 'Dex',
    tabBanner: '/images/lanunchpad/tabBanner.png',
    banner: '/images/lanunchpad/banner.png',
    logo: '/images/lanunchpad/logo.png',
    links: [
      {
        type: 'website',
        url: 'https://yaka.finance',
      },
      {
        type: 'twitter',
        url: 'https://x.com/YakaFinance',
      },
      {
        type: 'discord',
        url: 'https://discord.com/invite/yaka-finance',
      },
      {
        type: 'tg',
        url: 'https://t.me/YAKA_Finance',
      },
    ],
    desc: 'Yaka Finance stands as the cornerstone of SEI’s liquidity infrastructure. Our...',
    descFull:
      'Yaka Finance stands as the cornerstone of SEI’s liquidity infrastructure. Our ve(3,3) model paired with a strategic launchpad cultivates deep, responsive liquidity — the lifeblood of DeFi innovation.',
    stage: '0',
    // time: '1d 1h 1m 1s',
    time: '----',
    totalRaise: '0',
    totalSold: '0',
    totalAllocation: '0',
    yourAllocation: '0',
    yourAllocation_1: '0',
    yourAllocation_2: '0',
    publicSaleOf: '0',
    publicSaleRemainOf: '0',
    yourPay: '0',
    price: StagesDict[0].price ? StagesDict[0].price + ' ' + RaiseTokenName : undefined,
    yourSeiBalanceWei: '0',
    PURCHASE_PERSON_REMAIN: '0',
    curLeftYAKA: '0',
    publicClaimable: '0',
    whitelistClaimable: '0',
    totalClaimed: '0',
  },
]

const Lanunchpad = () => {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(Tabs[0])
  const web3 = useWeb3()
  const [projects, setProjects] = useState(lanunchpadProjects)
  const navigate = useNavigate()
  const { account, chainId } = useWeb3React()

  let inviter = searchParams.get('inviter')
  if (isAddress(inviter)) {
    console.log('inviter', inviter)
  } else {
    console.log('inviter is not address')
    inviter = zeroAddress
  }

  const getRaise = () => {}

  const getData = async () => {
    // const contract = getSeiCampaignStage2Contract(web3)
    try {
      const contract = getTokenSaleContract(web3)
      console.log({ contract })

      const stageData = await contract.methods.stage().call()
      console.log('stageData', stageData, typeof stageData)
      const claimBegin = await contract.methods.claimBegin().call()

      const seiBalanceWei = await web3.eth.getBalance(getTokenSaleAddress())
      console.log('seiBalanceWei', seiBalanceWei)

      const raise1_1 = await contract.methods.wlTotalSupply1().call()
      const totalAllocation1_1 = await contract.methods.WL_TOTAL_SUPPLY_MAX_1().call()

      const raise1_2 = await contract.methods.wlTotalSupply2().call()
      const totalAllocation1_2 = await contract.methods.WL_TOTAL_SUPPLY_MAX_2().call()

      const raise2 = await contract.methods.publicTotalSupply().call()
      const totalAllocation2 = await contract.methods.PUBLIC_TOTAL_SUPPLY_MAX().call()
      let yourAllocation = 0
      if (account) {
        const userInfo_1 = await contract.methods.userInfoOf1(account).call()
        console.log('userInfo_1', userInfo_1)

        const userInfo_2 = await contract.methods.userInfoOf2(account).call()
        console.log('userInfo_2', userInfo_2)

        const publicSaleOf = await contract.methods.publicSaleOf(account).call()
        console.log('publicSaleOf', publicSaleOf)

        yourAllocation = formatEther(BigNumber(userInfo_1.purchase).plus(BigNumber(userInfo_2.purchase)).plus(BigNumber(publicSaleOf)).toFixed())
      }

      const data = projects.map((item, index) => {
        if (index === 0) {
          item.stage = stageData
          item.price = StagesDict[stageData].price ? StagesDict[stageData].price + ' ' + RaiseTokenName : undefined
          item.totalRaise = formatEther(seiBalanceWei)
          item.totalAllocation = formatEther(BigNumber(totalAllocation1_1).plus(BigNumber(totalAllocation1_2)).plus(BigNumber(totalAllocation2)).toFixed())
          item.yourAllocation = yourAllocation
          if (item.stage + '' === '0') {
            item.time = 'Sep 21, 12:00 PM UTC'
          } else {
            item.time = '----'
          }
        }
        return item
      })
      setProjects(data)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className='mx-auto flex flex-col items-center justify-center pt-[76.5px] md:pt-[102px] px-[17px] xl:px-0'>
      <div className='max-w-[952px] w-full mt-[27.2px]'>
        <div className='gradient-bg p-[13.6px]'>
          <div className='font-semibold text-[22.1px] text-white'>Live and Upcoming Projects on YAKA</div>

          <div className='my-[17px]'>
            <Tab activeTab={activeTab} setActiveTab={setActiveTab} tabData={Tabs} />
          </div>

          {projects.map((item, index) => {
            return (
              <div key={index} className='w-[289px] bg-[#C81F391A] rounded-xl'>
                <div className='relative'>
                  <img className=' rounded-tl-xl rounded-tr-xl' width={289} height={153} src={item.tabBanner} />
                  <div className='flex gap-[6.8px] absolute top-[17px] left-[12.75px]'>
                    <div className='bg-[#FFC700] text-[10.2px] font-semibold py-[2px] px-[6.8px] rounded-lg text-black'>{item.status}</div>
                    <div className='bg-[#00000066] text-[13px] font-semibold py-[2px] px-[6.8px] rounded-lg'>{item.type}</div>
                  </div>
                  <div className='absolute w-full bottom-[-42.5px] flex justify-between px-[12.75px]'>
                    <img className=' rounded-tl-xl rounded-tr-xl' width={74.8} height={74.8} src={item.logo} />
                    <div className='flex gap-[6.8px] items-end justify-between'>
                      {item.links.map((item, index) => {
                        return (
                          <div key={index} onClick={() => window.open(item.url)} className='cursor-pointer'>
                            <img width={30} height={30} src={getLinkLogo(item.type)} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-[6.8px] p-[13.6px] mt-[54.4px]'>
                  <div className='font-semibold text-[18.7px]'>{item.projectName}</div>
                  <div className='text-[11.9px]'>{item.desc}</div>
                  <div className='flex flex-col gap-[6.8px]'>
                    <div>
                      <span className='text-gray-400'>Stage:</span> {StagesDict[item.stage].title}
                    </div>
                    {StagesDict[item.stage].timeText && (
                      <div>
                        <span className='text-gray-400'>{StagesDict[item.stage].timeText} at:</span> {item.time}
                      </div>
                    )}

                    <div>
                      <span className='text-gray-400'>Total Raised:</span> {formatNumber(item.totalRaise, true)} {RaiseTokenName}
                    </div>
                    <div>
                      <span className='text-gray-400'>Total Allocation:</span> {formatNumber(item.totalAllocation, true)} {IdoTokenName}
                    </div>
                    <div>
                      <span className='text-gray-400'>Your Allocation:</span> {formatNumber(item.yourAllocation)} {IdoTokenName}
                    </div>
                    {item.price && (
                      <div>
                        <span className='text-gray-400'>Price:</span> {item.price}
                      </div>
                    )}
                  </div>
                  {item.stage + '' === '0' && account !== undefined && <InviteButton account={account} w={'w-full'}></InviteButton>}
                  {StagesDict[item.stage].buttonText && (
                    <StyledButton
                      disabled={account === undefined}
                      onClickHandler={() => {
                        navigate(`/launchpad/${item.id}/${inviter}`)
                      }}
                      content={StagesDict[item.stage].buttonText}
                      className='py-[7.65px] px-[13.6px]'
                      isCap
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Lanunchpad

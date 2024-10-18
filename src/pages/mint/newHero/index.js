import React, { useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import StyledButton from 'components/Buttons/styledButton'
import Tab from 'components/Tab'
import { useRoyaltyClaim, useTheNftInfo } from 'hooks/useTheNft'
import { formatNumber } from 'utils/formatNumber'
import { useWalletModal } from 'state/settings/hooks'
import usePrices from 'hooks/usePrices'
import StakeModal from './stakeModal'
import Counter from './counter'
import './style.scss'
import OldPool from './oldPool'
import NewPool from './newPool'

const Tabs = ['NEW POOL', 'OLD POOL']

const Index = () => {
  const [activeTab, setActiveTab] = useState(Tabs[0])
  const [isOpen, setIsOpen] = useState(false)
  const {
    walletIds,
    stakedIds,
    oldStakedIds,
    pendingReward,
    oldPendingReward,
    rewardPerSecond,
    oldRewardPerSecond,
    totalStaked,
    oldTotalStaked,
    floorPrice,
    claimable,
    isOriginal,
  } = useTheNftInfo()

  const prices = usePrices()
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const { onClaim, pending: claimPending } = useRoyaltyClaim()

  const newApr = useMemo(() => {
    const newApr =
      totalStaked > 0
        ? rewardPerSecond
            .times(86400)
            .times(365)
            .times(prices.THE)
            .div(totalStaked * floorPrice)
            .times(100)
        : new BigNumber(0)
    return formatNumber(newApr) + '%'
  }, [floorPrice, prices, totalStaked, oldTotalStaked, rewardPerSecond, oldRewardPerSecond])

  // const oldApr = useMemo(() => {
  //   const floorInUsd = prices.ETH * floorPrice
  //   const oldApr =
  //     oldTotalStaked > 0
  //       ? oldRewardPerSecond
  //           .times(86400)
  //           .times(365)
  //           .times(prices.BNB)
  //           .div(oldTotalStaked * floorInUsd)
  //           .times(100)
  //       : new BigNumber(0)
  //   return formatNumber(oldApr) + '%'
  // }, [floorPrice, prices, totalStaked, oldTotalStaked, rewardPerSecond, oldRewardPerSecond])

  return (
    <div className='relative'>
      <img src='/images/mint/hero-bg.png' alt='' className='bg w-full min-h-[500px] md:min-h-full absolute object-cover object-center' />
      <img src='/images/common/bg-b.png' className='bg-index absolute bottom-0 w-full' alt='' />
      <div className='mx-auto container-1 hero relative z-10'>
        <div className='pt-[120px] md:pt-[220px]'>
          <div className='lg:flex items-center lg:space-x-[27px]'>
            <div className='max-w-[538px]'>
              <p className='font-figtree text-[40px] md:text-[47px] md:leading-[3.3rem] lg:text-[58px] leading-[2.7rem] max-w-[315px] md:max-w-full w-full lg:leading-[63px] text-white font-semibold'>
                <span className='gradient-text'>Stake Your theNFT </span>
                for Passive Income
              </p>
              <p className='text-white mt-3 md:mt-0.5 text-base md:text-xl leading-6 md:leading-[26px] font-light'>
                Stake your theNFT for weekly trading fees and royalties.
              </p>
              <div className='flex items-center space-x-[54.55px] mt-3 md:mt-[25px]'>
                <Counter title='Floor Price APR' count={newApr} />
                <Counter title='Last Epoch’s Earnings' count={`$${formatNumber(rewardPerSecond.times(prices.THE).times(604800))}`} />
              </div>
              <StyledButton
                content='BUY theNFTs ON ELEMENT'
                onClickHandler={() => {
                  window.open('https://element.market/collections/thenian', '_blank')
                }}
                className='w-full py-3 mt-3 md:mt-[25px]'
              />
            </div>
            <div className='lg:max-w-[540px] mt-10 lg:mt-0 shadow-[0px_0px_50px_#4E0042] w-full border-[#E400ED] border rounded-[5px] py-[13px] lg:pb-[19px] lg:pt-4 px-3 lg:px-[22.5px] solid-bg'>
              <h2 className='text-white font-figtree text-[22px] lg:text-[27px] leading-8 font-medium'>STAKE theNFT</h2>
              <Tab className='mt-4 md:mt-[21px]' activeTab={activeTab} setActiveTab={setActiveTab} tabData={Tabs} />
              {activeTab === Tabs[0] && (
                <NewPool walletIds={walletIds} stakedIds={stakedIds} pendingReward={pendingReward} totalStaked={totalStaked} prices={prices} />
              )}
              {activeTab === Tabs[1] && (
                <OldPool walletIds={walletIds} stakedIds={oldStakedIds} pendingReward={oldPendingReward} totalStaked={oldTotalStaked} prices={prices} />
              )}
            </div>
          </div>
          <div className='bg-animate w-full mt-[73px] md:mt-[203px] rounded-[5px]'>
            <div className='bg-[#090333] p-3 md:p-6 xl:p-[40.9px] rounded-[5px] lg:flex items-center justify-between'>
              <div className='max-w-[400px] xl:max-w-[577px]'>
                <p className='gradient-text text-[22px] md:text-4xl'>Claim theNFT Minter Royalties</p>
                <p className='text-white mt-2 md:mt-[10.27px] text-[16px] md:text-lg leading-[25px] md:leading-[26px]'>
                  The original minters of the 1734 theNFTs earn 2% from the secondary sales of theNFTs, seeded to this pool weekly.
                </p>
              </div>
              <div className='flex flex-col items-center justify-center lg:max-w-[300px] xl:max-w-[400px] mt-[18px] lg:mt-0 w-full'>
                <div className=' flex items-center'>
                  <span className='text-sm md:text-lg leading-5 font-medium font-figtree text-lightGray'>Claimable Fees:</span>
                  <span className='text-white text-[27px] leading-8 font-medium'>{account ? '$' + formatNumber(claimable.times(prices.BNB)) : '-'}</span>
                </div>
                {account ? (
                  <StyledButton
                    disabled={!isOriginal || claimable.isZero() || claimPending}
                    onClickHandler={() => {
                      onClaim()
                    }}
                    content={isOriginal ? 'CLAIM FEES' : 'NOT ORIGINAL MINTER'}
                    className='w-full mt-[5.36px] py-3'
                  />
                ) : (
                  <StyledButton
                    content='CONNECT WALLET'
                    onClickHandler={() => {
                      openWalletModal()
                    }}
                    className='w-full mt-[5.36px] py-3'
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <StakeModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  )
}

export default Index

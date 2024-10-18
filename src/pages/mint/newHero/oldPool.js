import React from 'react'
import { useWeb3React } from '@web3-react/core'
import StyledButton from 'components/Buttons/styledButton'
import { formatNumber } from 'utils/formatNumber'
import { useWalletModal } from 'state/settings/hooks'
import TransparentButton from 'components/Buttons/transparentButton'
import { useOldHarvest, useRestake } from 'hooks/useTheNft'
import Counter from './counter'

const OldPool = ({ walletIds, stakedIds, pendingReward, totalStaked, prices }) => {
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const { onHarvest, pending } = useOldHarvest()
  const { onRestake, pending: restakePending } = useRestake()

  return (
    <div>
      <div className='flex items-center lg:justify-start mt-4 lg:mt-5'>
        <Counter className='w-1/2' small title='Total Staked' count={`${totalStaked}/1734`} />
        <Counter className='w-1/2' small title='My Wallet' count={account ? walletIds.length + ' theNFTs' : '-'} />
      </div>
      <div className='flex items-center lg:justify-start mt-4 lg:mt-5'>
        <Counter className='w-1/2' small title='My Stake' count={account ? stakedIds.length + ' theNFTs' : '-'} />
        <Counter className='w-1/2' small title='Claimable Fees' count={account ? '$' + formatNumber(pendingReward.times(prices.BNB)) : '-'} />
      </div>
      {account ? (
        <div className='flex-col md:flex-row flex space-y-2.5 md:space-y-0 md:space-x-5 mt-2.5 md:mt-[22px]'>
          <StyledButton
            content='CLAIM FEES'
            disabled={pendingReward.isZero() || pending}
            onClickHandler={() => {
              onHarvest()
            }}
            className='w-full py-3'
          />
          <TransparentButton
            disabled={restakePending}
            content='RESTAKE'
            onClickHandler={() => {
              if (stakedIds.length > 0) {
                onRestake(stakedIds, pendingReward)
              }
            }}
            className='w-full py-3'
            isUpper
          />
        </div>
      ) : (
        <StyledButton
          content='CONNECT WALLET'
          onClickHandler={() => {
            openWalletModal()
          }}
          className='w-full py-3 mt-2.5 md:mt-6'
        />
      )}
    </div>
  )
}

export default OldPool

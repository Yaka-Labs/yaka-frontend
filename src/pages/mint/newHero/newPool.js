import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import StyledButton from 'components/Buttons/styledButton'
import TransparentButton from 'components/Buttons/transparentButton'
import { useHarvest } from 'hooks/useTheNft'
import { formatNumber } from 'utils/formatNumber'
import { useWalletModal } from 'state/settings/hooks'
import StakeModal from './stakeModal'
import Counter from './counter'

const NewPool = ({ walletIds, stakedIds, pendingReward, totalStaked, prices }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const { onHarvest, pending } = useHarvest()

  const TIP = account ? `$${formatNumber(pendingReward.times(prices.THE))} ` : ''
  const FEES = account ? `${formatNumber(pendingReward)} THE` : '-'

  return (
    <div>
      <div className='flex items-center lg:justify-start mt-4 lg:mt-5'>
        <Counter className='w-1/2' small title='Total Staked' count={`${totalStaked}/1734`} />
        <Counter className='w-1/2' small title='My Wallet' count={account ? walletIds.length + ' theNFTs' : '-'} />
      </div>
      <div className='flex lg:justify-start mt-4 lg:mt-5'>
        <Counter className='w-1/2' small title='My Stake' count={account ? stakedIds.length + ' theNFTs' : '-'} />
        <Counter className='w-1/2' small title='Claimable Fees' count={FEES} tip={TIP} />
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
            content='MANAGE'
            onClickHandler={() => {
              setIsOpen(true)
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
      {isOpen && <StakeModal isOpen={isOpen} setIsOpen={setIsOpen} walletIds={walletIds} stakedIds={stakedIds} />}
    </div>
  )
}

export default NewPool

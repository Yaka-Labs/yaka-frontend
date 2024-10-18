import React, { useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import StyledButton from 'components/Buttons/styledButton'
import BalanceInput from 'components/Input/BalanceInput'
import SubPage from 'components/SubPage'
import PoolSelect from 'components/PoolSelect'
import RewardSelect from 'components/RewardSelect'
import { useAddBribe } from 'hooks/useWhitelist'
import { useWalletModal } from 'state/settings/hooks'
import { isInvalidAmount, ZERO_ADDRESS } from 'utils/formatNumber'
import { usePools } from 'state/pools/hooks'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const BribeModal = () => {
  useAutoDocumentTitle('AddBribe')
  const [pool, setPool] = useState(null)
  const [rewardToken, setRewardToken] = useState(null)
  const [amount, setAmount] = useState('')
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const fusions = usePools()
  const pools = useMemo(() => {
    return fusions.filter((pair) => pair && pair.gauge.address !== ZERO_ADDRESS && pair.isValid)
  }, [fusions])

  const { onAddBribe, pending } = useAddBribe()

  const errorMsg = useMemo(() => {
    if (!pool) {
      return 'Select Pair'
    }
    if (!rewardToken) {
      return 'Select Reward Token'
    }
    if (isInvalidAmount(amount)) {
      return 'Enter an amount'
    }
    if (rewardToken.balance.lt(amount)) {
      return 'Insufficient balance'
    }
    return null
  }, [pool, rewardToken, amount])

  return (
    <SubPage title='Add Bribe'>
      {/* <CommonHollowModal popup={isOpen} width={499.8} setPopup={setIsOpen} title='Add Bribe'> */}
      <div className='mt-5'>
        <div className='flex flex-col w-full items-center justify-center'>
          <div className='w-full'>
            <p className='text-secondary texts-[13px] md:text-base'>Select Pair</p>
            <PoolSelect pool={pool} setPool={setPool} pools={pools} />
          </div>
        </div>
        <div className='flex flex-col w-full items-center justify-center my-3 md:my-5'>
          <div className='w-full'>
            <p className='text-[#B8B6CB] texts-[13px] md:text-base'>Select Reward Token</p>
            <RewardSelect asset={rewardToken} setAsset={setRewardToken} />
          </div>
        </div>
        <BalanceInput
          title='Amount'
          inputAmount={amount}
          setInputAmount={setAmount}
          symbol=''
          balance={rewardToken ? rewardToken.balance : null}
          logoURIs={[]}
        />
        {account ? (
          <StyledButton
            disabled={errorMsg || pending}
            pending={pending}
            onClickHandler={() => {
              onAddBribe(pool, rewardToken, amount)
            }}
            content={errorMsg || 'CONFIRM'}
            className='w-full h-[42px] sm:h-12 mdLg:h-[60px] mt-[18px] px-[23px]'
          />
        ) : (
          <StyledButton onClickHandler={openWalletModal} content='CONNECT WALLET' className='py-[13px] mt-4 w-full' />
        )}
      </div>
    </SubPage>
  )
}

export default BribeModal

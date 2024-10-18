import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useStakeNft, useUnstakeNft } from 'hooks/useTheNft'
import StyledButton from 'components/Buttons/styledButton'
import CommonHollowModal from 'components/CommonHollowModal'
import Tab from 'components/Tab'
import CheckBoxDropDown from 'components/CheckBoxInputDropDown'

const Tabs = ['STAKE', 'UNSTAKE']

const StakeModal = ({ isOpen, setIsOpen, walletIds, stakedIds }) => {
  const [activeTab, setActiveTab] = useState(Tabs[0])
  const [stakingIds, setStakingsIds] = useState([])
  const [unstakingIds, setUnStakingIds] = useState([])
  const { onStake, pending } = useStakeNft()
  const { onUnstake, pending: unstakePending } = useUnstakeNft()
  const { final } = useSelector((state) => state.transactions)

  useEffect(() => {
    if (['Unstake Successful'].includes(final)) {
      setUnStakingIds([])
    }
    if (['Stake Successful'].includes(final)) {
      setStakingsIds([])
    }
  }, [final])

  const stakeErrorMsg = useMemo(() => {
    if (stakingIds.length === 0) {
      return 'SELECT theNFTs'
    }
    return null
  }, [stakingIds])

  const unstakeErrorMsg = useMemo(() => {
    if (unstakingIds.length === 0) {
      return 'SELECT theNFTs'
    }
    return null
  }, [unstakingIds])

  return (
    <CommonHollowModal popup={isOpen} width={499.8} setPopup={setIsOpen} title='Manage theNFTs'>
      <Tab className='mt-4 md:mt-[29px]' activeTab={activeTab} setActiveTab={setActiveTab} tabData={Tabs} />
      {activeTab === Tabs[0] ? (
        <>
          <CheckBoxDropDown tokenIds={stakingIds} setTokenIds={setStakingsIds} className='mt-4 md:mt-5' data={walletIds} />
          <StyledButton
            content={stakeErrorMsg || 'STAKE'}
            disabled={stakingIds.length === 0 || pending}
            onClickHandler={() => {
              onStake(stakingIds)
            }}
            className='w-full py-[13px] md:py-[18px] mt-2.5 md:mt-6'
          />
        </>
      ) : (
        <>
          <CheckBoxDropDown tokenIds={unstakingIds} setTokenIds={setUnStakingIds} className='mt-4 md:mt-5' data={stakedIds} />
          <StyledButton
            content={unstakeErrorMsg || 'UNSTAKE'}
            disabled={unstakingIds.length === 0 || unstakePending}
            onClickHandler={() => {
              onUnstake(unstakingIds)
            }}
            className='w-full py-[13px] md:py-[18px] mt-2.5 md:mt-6'
          />
        </>
      )}
    </CommonHollowModal>
  )
}

export default StakeModal

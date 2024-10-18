import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStake, useUnstake } from 'hooks/useGauge'
import { isInvalidAmount } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'
import CommonHollowModal from 'components/CommonHollowModal'
import Tab from 'components/Tab'
import BalanceInput from 'components/Input/BalanceInput'
import { POOL_TYPES, FusionRangeType } from 'config/constants'

const Tabs = ['STAKE', 'UNSTAKE']

const DepositModal = ({ isOpen, setIsOpen, pool }) => {
  const [activeTab, setActiveTab] = useState(Tabs[0])
  const [stakeAmount, setStakeAmount] = useState('')
  const { onStake, pending: stakePending } = useStake()
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const { onUnstake, pending: unstakePending } = useUnstake()
  const navigate = useNavigate()

  const stakeErrorMsg = useMemo(() => {
    if (pool) {
      if (isInvalidAmount(stakeAmount)) {
        return 'Invalid Amount'
      }
      if (pool.account.walletBalance.lt(stakeAmount)) {
        return 'Insufficient ' + pool.symbol + ' Balance'
      }
    }
    return null
  }, [stakeAmount, pool])

  const unstakeErrorMsg = useMemo(() => {
    if (pool) {
      if (isInvalidAmount(withdrawAmount)) {
        return 'Invalid Amount'
      }
      if (pool.account.gaugeBalance.lt(withdrawAmount)) {
        return 'Insufficient ' + pool.symbol + ' Balance'
      }
    }
    return null
  }, [withdrawAmount, pool])

  const onRedirect = useCallback(() => {
    if (pool.type === POOL_TYPES.V1) {
      navigate(`/add/v1/${pool.address.toLowerCase()}`)
    } else if (pool.title === 'Ichi') {
      navigate(`/add?type=${FusionRangeType.ICHI_RANGE}&address=${pool.address.toLowerCase()}`)
    } else if (pool.title === 'Defiedge') {
      navigate(`/add?type=${FusionRangeType.DEFIEDGE_RANGE}&address=${pool.address.toLowerCase()}`)
    } else {
      navigate(`/add?type=${FusionRangeType.GAMMA_RANGE}&address=${pool.address.toLowerCase()}`)
    }
  }, [pool])

  return (
    <CommonHollowModal popup={isOpen} width={499.8} setPopup={setIsOpen} title={`Manage ${pool.symbol} (${pool.title}) LP`}>
      <div className='w-full mt-[24.65px] flex items-center justify-center flex-col'>
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} tabData={Tabs} />
        {activeTab === Tabs[0] ? (
          <div className='w-full flex items-center justify-center flex-col mt-[17px]'>
            <BalanceInput
              title='Amount'
              inputAmount={stakeAmount}
              setInputAmount={setStakeAmount}
              symbol={pool.symbol}
              balance={pool.account.walletBalance}
              logoURIs={[pool.token0.logoURI, pool.token1.logoURI]}
            />
            <div className='flex items-center space-x-[11.9px] mt-[17px] group cursor-pointer' href='#' onClick={() => onRedirect()}>
              <p className='text-[1.17rem] md:text-[17px] text-green font-medium'>{`Get ${pool.symbol.replace(/WSEI/g, 'SEI')} (${pool.title}) LP`}</p>
              <img className='group-hover:w-[34px] w-[25.5px] duration-300 ease-in-out' alt='' src='/images/common/spear.svg' />
            </div>
            <div className='flex items-center mt-[22.1px] w-full space-x-[17px]'>
              <StyledButton
                pending={stakePending}
                onClickHandler={() => {
                  if (stakeErrorMsg) {
                    customNotify(stakeErrorMsg, 'warn')
                    return
                  }
                  onStake(pool, stakeAmount)
                }}
                content='STAKE LP'
                className='py-[11.05px] w-1/2 px-[19.55px]'
              />
              <TransparentButton onClickHandler={() => setIsOpen(false)} content='CANCEL' className='py-[11.05px] px-[22.1px] w-1/2' isUpper />
            </div>
          </div>
        ) : (
          <div className='w-full flex items-center justify-center flex-col mt-[17px]'>
            <BalanceInput
              title='Amount'
              inputAmount={withdrawAmount}
              setInputAmount={setWithdrawAmount}
              symbol={pool.symbol}
              balance={pool.account.gaugeBalance}
              logoURIs={[pool.token0.logoURI, pool.token1.logoURI]}
            />
            <div className='flex items-center mt-[22.1px] w-full space-x-[17px]'>
              <StyledButton
                pending={unstakePending}
                onClickHandler={() => {
                  if (unstakeErrorMsg) {
                    customNotify(unstakeErrorMsg, 'warn')
                    return
                  }
                  onUnstake(pool, withdrawAmount)
                }}
                content='UNSTAKE LP'
                className='py-[11.05px] w-1/2 px-[19.55px]'
              />
              <TransparentButton onClickHandler={() => setIsOpen(false)} content='CANCEL' className='py-[11.05px] px-[22.1px] w-1/2' isUpper />
            </div>
          </div>
        )}
      </div>
    </CommonHollowModal>
  )
}

export default DepositModal

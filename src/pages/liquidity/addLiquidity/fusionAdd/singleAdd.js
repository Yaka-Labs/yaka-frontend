import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import StyledButton from 'components/Buttons/styledButton'
import PoolSelect from 'components/PoolSelect'
import DoubleCurrencyLogo from 'components/DoubleCurrencyLogo'
import { useVaultAdd } from 'hooks/v3/useIchi'
import { useWalletModal } from 'state/settings/hooks'
import { customNotify } from 'utils/notify'
import { formatNumber, isInvalidAmount } from 'utils/formatNumber'
import { FusionRangeType } from 'config/constants'
import { useAssets } from 'state/assets/hooks'
import LiquidityInfo from '../../yourLiquidity/components/liquidityInfo'

const percentArray = ['25', '50', '75', '100']

const SingleAdd = ({ activeVault, vaults, slippage }) => {
  const [amount, setAmount] = useState('')
  const { onVaultAddAndStake, pending } = useVaultAdd()
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const navigate = useNavigate()
  const assets = useAssets()
  const bnbBalance = assets.find((ele) => ele.address === 'BNB').balance

  const { allowed: depositToken } = activeVault

  const isDouble = useMemo(() => {
    return depositToken.symbol === 'WBNB'
  }, [depositToken])

  const balance = useMemo(() => {
    if (isDouble) {
      return depositToken.balance.plus(bnbBalance)
    } else {
      return depositToken.balance
    }
  }, [depositToken, isDouble, assets])

  const amountToWrap = useMemo(() => {
    let final
    if (depositToken.balance.lt(amount)) {
      final = new BigNumber(amount).minus(depositToken.balance)
    }
    return final
  }, [amount, depositToken])

  const errorMsg = useMemo(() => {
    if (isInvalidAmount(amount)) {
      return 'Enter an amount'
    }
    if (balance.lt(amount)) {
      return 'Insufficient balance'
    }
    return null
  }, [balance, amount])

  const onAddLiquidityAndStake = useCallback(() => {
    if (errorMsg) {
      customNotify(errorMsg, 'warn')
    } else {
      onVaultAddAndStake(activeVault, amount, amountToWrap, slippage)
    }
  }, [activeVault, amount, amountToWrap, slippage])

  return (
    <div className='mt-4 md:mt-5'>
      <div className='w-full'>
        <p className='text-secondary texts-[13px] md:text-base'>Select Pair</p>
        <PoolSelect
          pool={activeVault}
          setPool={(ele) => {
            navigate(`/add?type=${FusionRangeType.ICHI_RANGE}&address=${ele.address}`)
          }}
          pools={vaults}
        />
      </div>
      <p className='my-2 text-sm md:text-[15px] text-[#B8B6CB] mt-2 leading-5 md:leading-6 font-light'>
        ICHI vaults enable users to contribute a single token to a Liquidity Pool (LP). The primary goal of this strategy is to grow your initial deposit,
        maintaining its share within the range of [65% - 95%] to minimize exposure to the other token in the LP. Profit is achieved by strategically selling
        during upward market movements to augment the original deposit. Upon withdrawal, users may receive a portion of their funds as the other token in the
        LP.&nbsp;
        <a href='https://docs.ichi.org/home/yield-iq/algorithm-design' target='_blank' rel='noreferrer' className='text-green'>
          Learn More
        </a>
        .
      </p>
      <LiquidityInfo pool={activeVault} />
      <p className='text-[13px] md:text-base leading-5 text-[#B8B6CB]'>Deposit Amount</p>
      <div className='mt-3 w-full'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center text-sm lg:text-base space-x-3 justify-between w-full'>
            <div className='flex items-center space-x-2.5'>
              {percentArray.map((percent) => {
                return (
                  <span
                    className='flex items-center justify-center bg-white bg-opacity-[0.08] round-[3px] text-white text-[13px] md:text-base w-[40px] md:w-[56px] h-[22px] md:h-[28px] cursor-pointer'
                    onClick={() => {
                      setAmount(balance.times(percent).div(100).toString(10) || 0)
                    }}
                    key={percent}
                  >
                    {percent}%
                  </span>
                )
              })}
            </div>
            <p className='text-white'>Balance: {formatNumber(balance)}</p>
          </div>
        </div>
        <div className='gradient-bg mt-1.5 lg:mt-2.5  p-px w-full rounded-[3px]'>
          <div className='bg-body px-3  rounded-[3px] flex items-center justify-between'>
            <input
              className='bg-transparent w-[65%] py-[8px] lg:py-[15px] text-xl lg:text-2xl leading-10 placeholder-[#757384] text-white focus:outline-none'
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value) < 0 ? '' : e.target.value)
              }}
              placeholder='0.00'
              type='number'
              min={0}
              lang='en'
            />
            <div className='flex items-center justify-between space-x-2'>
              {isDouble ? (
                <DoubleCurrencyLogo logo1='https://cdn.thena.fi/assets/BSC.png' logo2='https://cdn.thena.fi/assets/BNB.png' isSmall />
              ) : (
                <img alt='' width={28} height={28} src={depositToken?.logoURI} />
              )}
              <p className='font-medium text-sm lg:text-[1.2rem] leading-6 text-white'>{isDouble ? 'BNB + WBNB' : depositToken.symbol}</p>
            </div>
          </div>
        </div>
      </div>
      {account ? (
        <div className='mt-3'>
          <StyledButton disabled={pending} onClickHandler={onAddLiquidityAndStake} content='ADD LIQUIDITY AND STAKE' className='py-[13px] px-[19px] w-full' />
          {/* <StyledButton onClickHandler={onAddLiquidity} disabled={pending} content='ADD LIQUIDITY' className='py-[13px] px-[19px] w-full mt-3' /> */}
        </div>
      ) : (
        <StyledButton onClickHandler={openWalletModal} content='CONNECT WALLET' className='mt-3 py-[13px] px-[19px] w-full' />
      )}
    </div>
  )
}

export default SingleAdd

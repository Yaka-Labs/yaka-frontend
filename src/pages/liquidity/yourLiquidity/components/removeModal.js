import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { formatNumber, fromWei, isInvalidAmount } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'
import CommonHollowModal from 'components/CommonHollowModal'
import BalanceInput from 'components/Input/BalanceInput'
import { useRemoveLiquidity } from 'hooks/useLiquidity'
import { useSettings } from 'state/settings/hooks'
import { FusionRangeType, POOL_TYPES } from 'config/constants'
import { useGammaRemove } from 'hooks/v3/useGamma'
import { useVaultRemove } from 'hooks/v3/useIchi'
import { useDefiedgeRemove } from 'hooks/v3/useDefiedge'
import { getPairContract } from '../../../../utils/contractHelpers'
import useWeb3 from '../../../../hooks/useWeb3'
import { parseEther } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'

const RemoveModal = ({ isOpen, setIsOpen, pool }) => {
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const [removeAmount, setWithdrawAmount] = useState('')
  const [metadata, setMetadata] = useState(undefined)
  const { onRemove, pending } = useRemoveLiquidity()
  const { pending: gammaPending, onGammaRemove } = useGammaRemove()
  const { pending: vaultPending, onVaultRemove } = useVaultRemove()
  const { pending: defiedgePending, onDefiedgeRemove } = useDefiedgeRemove()
  const { slippage, deadline } = useSettings()

  const pairContract = useMemo(() => {
    return getPairContract(web3, pool.address)
  }, [pool])

  useEffect(() => {
    async function fetchData() {
      const tempdata = await pairContract.methods['metadata']().call()
      console.log('metadata', tempdata)
      setMetadata(tempdata)
    }

    fetchData()

    // Result(7) [
    //     1000000n,
    //         1000000000000000000n,
    //         10883898176n,
    //         33218801730517858927153n,
    //         false,
    //         '0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1',
    //         '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7'
    //     ]
  }, [pairContract, account])

  const firstAmount = useMemo(() => {
    if (metadata) {
      debugger
      const temptoken0Decimal = metadata[0]
      const temptoken1Decimal = metadata[1]
      const temptoken0Reserve = metadata[2]
      const temptoken1Reserve = metadata[3]
      const temptoken0 = metadata[5]
      const temptoken1 = metadata[6]
      if (temptoken0 === pool.token0.address) {
        pool.token0.reserve = new BigNumber(temptoken0Reserve).div(new BigNumber(temptoken0Decimal))
      }
      if (temptoken1 === pool.token0.address) {
        pool.token0.reserve = new BigNumber(temptoken1Reserve).div(new BigNumber(temptoken1Decimal))
      }
    }
    return pool.type === FusionRangeType.DEFIEDGE_RANGE
      ? pool.account.total0.times(removeAmount || 0).div(pool.account.totalLp)
      : pool.token0.reserve && pool.token0.reserve.times(removeAmount || 0).div(pool.totalSupply)
  }, [pool, removeAmount, metadata])
  const secondAmount = useMemo(() => {
    if (metadata) {
      const temptoken0Decimal = metadata[0]
      const temptoken1Decimal = metadata[1]
      const temptoken0Reserve = metadata[2]
      const temptoken1Reserve = metadata[3]
      const temptoken0 = metadata[5]
      const temptoken1 = metadata[6]
      if (temptoken0 === pool.token1.address) {
        pool.token1.reserve = new BigNumber(temptoken0Reserve).div(new BigNumber(temptoken0Decimal))
      }
      if (temptoken1 === pool.token1.address) {
        pool.token1.reserve = new BigNumber(temptoken1Reserve).div(new BigNumber(temptoken1Decimal))
      }
    }
    return pool.type === FusionRangeType.DEFIEDGE_RANGE
      ? pool.account.total1.times(removeAmount || 0).div(pool.account.totalLp)
      : pool.token1.reserve.times(removeAmount || 0).div(pool.totalSupply)
  }, [pool, removeAmount, metadata])

  const errorMsg = useMemo(() => {
    if (pool) {
      if (isInvalidAmount(removeAmount)) {
        return 'Invalid Amount'
      }
      if (pool.account.walletBalance && pool.account.walletBalance.lt(removeAmount)) {
        return 'Insufficient ' + pool.symbol + ' Balance'
      }
    }
    return null
  }, [removeAmount, pool])

  const onRemoveLiquidity = useCallback(() => {
    if (errorMsg) {
      customNotify(errorMsg, 'warn')
      return
    }
    if (pool.type === POOL_TYPES.V1) {
      onRemove(pool, removeAmount, slippage, deadline, firstAmount, secondAmount)
    } else if (pool.title === 'Ichi') {
      onVaultRemove(pool, removeAmount)
    } else if (pool.title === 'Defiedge') {
      onDefiedgeRemove(pool, removeAmount)
    } else if (pool.type === POOL_TYPES.FUSION) {
      onGammaRemove(pool, removeAmount)
    }
  }, [pool, removeAmount, slippage, deadline, firstAmount, secondAmount, errorMsg])
  console.log('pool', pool)

  return (
    <CommonHollowModal popup={isOpen} width={499.8} setPopup={setIsOpen} title={`Remove ${pool.symbol} (${pool.title}) LP`}>
      <div className='flex flex-col w-full items-center justify-center mt-[13.6px] lg:mt-[23.8px]'>
        <BalanceInput
          title='Amount'
          inputAmount={removeAmount}
          setInputAmount={setWithdrawAmount}
          symbol={pool.symbol}
          balance={pool.account.walletBalance}
          logoURIs={[pool.token0.logoURI, pool.token1.logoURI]}
        />
        <div className='w-full mt-[13.6px]'>
          <div className='text-secondary text-sm md:[13.6px] pb-[3.4px] border-b border-[#757384]'>Your Will Receive</div>
          <div className='flex flex-col space-y-[6.8px] mt-[13.6px] w-full'>
            <div className='w-full flex justify-between'>
              <div className='flex items-center space-x-[4.25px]'>
                <img alt='' src={pool.token0.logoURI} className='w-6 md:w-[23.8px]' />
                <span className='text-[15px] md:text-[16.3px] leading-[18px] md:leading-[18.7px] text-white font-figtree font-medium'>
                  {pool.token0.symbol.replace(/WSEI/g, 'SEI')}
                </span>
              </div>
              <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>{formatNumber(firstAmount)}</p>
            </div>
            <div className='w-full flex justify-between'>
              <div className='flex items-center space-x-[4.25px]'>
                <img alt='' src={pool.token1.logoURI} className='w-6 md:w-[23.8px]' />
                <span className='text-[15px] md:text-[16.3px] leading-[18px] md:leading-[18.7px] text-white font-figtree font-medium'>
                  {pool.token1.symbol.replace(/WSEI/g, 'SEI')}
                </span>
              </div>
              <p className='text-white text-sm md:[13.6px] leading-[17px]'>{formatNumber(secondAmount)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center mt-[22.1px] w-full space-x-[17px]'>
        <StyledButton
          pending={pending || gammaPending || vaultPending || defiedgePending}
          disabled={pending || gammaPending || vaultPending || defiedgePending}
          onClickHandler={() => {
            onRemoveLiquidity()
          }}
          content='REMOVE'
          className='py-[11.05px] w-1/2 px-[19.55px]'
        />
        <TransparentButton onClickHandler={() => setIsOpen(false)} content='CANCEL' className='py-[11.059px] px-[22.1px] w-1/2' isUpper />
      </div>
    </CommonHollowModal>
  )
}

export default RemoveModal

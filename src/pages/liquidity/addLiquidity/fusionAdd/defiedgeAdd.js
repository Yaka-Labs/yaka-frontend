import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useCurrency } from 'hooks/v3/Tokens'
import { FusionRangeType } from 'config/constants'
import StyledButton from 'components/Buttons/styledButton'
import PoolSelect from 'components/PoolSelect'
import { useWalletModal } from 'state/settings/hooks'
import { Bound, updateSelectedPreset } from 'state/mintV3/actions'
import { useV3DerivedMintInfo, useV3MintActionHandlers } from 'state/mintV3/hooks'
import { EnterAmounts } from './containers/EnterAmounts'
import { AddLiquidityButton } from './containers/AddLiquidityButton'
import LiquidityChartRangeInput from './components/LiquidityChartRangeInput'

const feeAmount = 3000

const DefiedgeAdd = ({ activeDefiedge, defiedgeStrategies, slippage, deadline, priceFormat }) => {
  const baseCurrency = useCurrency(activeDefiedge.token0.address)
  const quoteCurrency = useCurrency(activeDefiedge.token1.address)
  const mintInfo = useV3DerivedMintInfo(baseCurrency, quoteCurrency, feeAmount, baseCurrency, undefined)
  const { onChangePresetRange, onLeftRangeInput, onRightRangeInput } = useV3MintActionHandlers(mintInfo.noLiquidity)
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = useMemo(() => {
    return mintInfo.pricesAtTicks
  }, [mintInfo])

  const price = useMemo(() => {
    if (!mintInfo.price) return

    return mintInfo.invertPrice ? mintInfo.price.invert().toSignificant(5) : mintInfo.price.toSignificant(5)
  }, [mintInfo])

  useEffect(() => {
    const lowerValue = 1.0001 ** (activeDefiedge.lower - activeDefiedge.current)
    const upperValue = 1.0001 ** (activeDefiedge.upper - activeDefiedge.current)
    const preset = {
      type: activeDefiedge.type,
      title: activeDefiedge.title,
      address: activeDefiedge.address,
      min: lowerValue,
      max: upperValue,
    }

    if (!price) return

    dispatch(updateSelectedPreset({ preset: preset ? preset.type : null }))

    onLeftRangeInput(preset ? String(+price * preset.min) : '')
    onRightRangeInput(preset ? String(+price * preset.max) : '')
    onChangePresetRange(preset)
  }, [activeDefiedge, price])

  return (
    <div className='mt-4 md:mt-5'>
      <div className='w-full'>
        <p className='text-secondary texts-[13px] md:text-base'>Select Pair</p>
        <PoolSelect
          pool={activeDefiedge}
          setPool={(ele) => {
            navigate(`/add?type=${FusionRangeType.DEFIEDGE_RANGE}&address=${ele.address}`)
          }}
          pools={defiedgeStrategies}
        />
      </div>
      <p className='my-2 text-sm md:text-[15px] text-[#B8B6CB] mt-2 leading-5 md:leading-6 font-light'>
        Liquidity ranges are automatically rebalanced when certain rebalance triggers are met. In determining the width of the ranges, the goal is to optimize
        fee revenue and volumes while taking into account a years’ worth of volatility to control for impermanent loss.&nbsp;
        <a href='https://yaka.gitbook.io/yaka-finance' target='_blank' rel='noreferrer' className='text-green'>
          Learn More
        </a>
        .
      </p>
      <div className='bg-[#080331] rounded-[5px] flex justify-center items-center mt-5'>
        <LiquidityChartRangeInput
          currencyA={baseCurrency}
          currencyB={quoteCurrency}
          feeAmount={mintInfo.dynamicFee}
          ticksAtLimit={mintInfo.ticksAtLimit}
          price={price ? parseFloat(price) : undefined}
          priceLower={priceLower}
          priceUpper={priceUpper}
          interactive={false}
          priceFormat={priceFormat}
        />
      </div>
      <EnterAmounts currencyA={baseCurrency ?? undefined} currencyB={quoteCurrency} mintInfo={mintInfo} />
      {account ? (
        <AddLiquidityButton
          baseCurrency={baseCurrency ?? undefined}
          quoteCurrency={quoteCurrency ?? undefined}
          mintInfo={mintInfo}
          slippage={slippage}
          deadline={deadline}
          activeDefiedge={activeDefiedge}
        />
      ) : (
        <StyledButton onClickHandler={openWalletModal} content='CONNECT WALLET' className='mt-3 py-[13px] px-[19px] w-full' />
      )}
    </div>
  )
}

export default DefiedgeAdd

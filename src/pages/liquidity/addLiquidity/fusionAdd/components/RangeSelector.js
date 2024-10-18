import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useBestV3TradeExactIn } from 'hooks/v3/useBestV3Trade'
import useUSDTPrice from 'hooks/v3/useUSDTPrice'
import { useInitialTokenPrice, useInitialUSDPrices } from 'state/mintV3/hooks'
import { Bound, updateSelectedPreset } from 'state/mintV3/actions'
import { tryParseAmount } from 'v3lib/utils'
import { USDT } from 'config/constants/v3/routing'
import NumericalInput from 'components/Input/NumericalInput'
import { useNetwork } from 'state/settings/hooks'

export const RangeSelector = ({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  currencyA,
  currencyB,
  disabled,
  mintInfo,
}) => {
  const tokenA = (currencyA ?? undefined)?.wrapped
  const tokenB = (currencyB ?? undefined)?.wrapped
  const isSorted = useMemo(() => {
    return tokenA && tokenB && tokenA.sortsBefore(tokenB)
  }, [tokenA, tokenB])

  const leftPrice = useMemo(() => {
    return isSorted ? priceLower : priceUpper?.invert()
  }, [isSorted, priceLower, priceUpper])

  const rightPrice = useMemo(() => {
    return isSorted ? priceUpper : priceLower?.invert()
  }, [isSorted, priceUpper, priceLower])

  return (
    <div className='flex w-full space-x-1 md:space-x-6 md:mt-[5px] mt-3'>
      <RangePart
        value={mintInfo.ticksAtLimit[Bound.LOWER] ? '0' : leftPrice?.toSignificant(5) ?? ''}
        onUserInput={onLeftRangeInput}
        decrement={isSorted ? getDecrementLower : getIncrementUpper}
        increment={isSorted ? getIncrementLower : getDecrementUpper}
        decrementDisabled={mintInfo.ticksAtLimit[Bound.LOWER]}
        incrementDisabled={mintInfo.ticksAtLimit[Bound.LOWER]}
        label={leftPrice ? `${currencyB?.symbol}` : '-'}
        tokenA={currencyA ?? undefined}
        tokenB={currencyB ?? undefined}
        disabled={disabled}
        title='Min Price'
      />
      <RangePart
        value={mintInfo.ticksAtLimit[Bound.UPPER] ? '∞' : rightPrice?.toSignificant(5) ?? ''}
        onUserInput={onRightRangeInput}
        decrement={isSorted ? getDecrementUpper : getIncrementLower}
        increment={isSorted ? getIncrementUpper : getDecrementLower}
        incrementDisabled={mintInfo.ticksAtLimit[Bound.UPPER]}
        decrementDisabled={mintInfo.ticksAtLimit[Bound.UPPER]}
        label={rightPrice ? `${currencyB?.symbol}` : '-'}
        tokenA={currencyA ?? undefined}
        tokenB={currencyB ?? undefined}
        initialPrice={mintInfo.price}
        disabled={disabled}
        title='Max Price'
      />
    </div>
  )
}

const RangePart = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  tokenA,
  tokenB,
  incrementDisabled = false,
  locked,
  onUserInput,
  disabled,
  title,
}) => {
  const [localUSDValue, setLocalUSDValue] = useState('')
  const [localTokenValue, setLocalTokenValue] = useState('')
  const { networkId } = useNetwork()

  const dispatch = useDispatch()

  const tokenValue = useBestV3TradeExactIn(tryParseAmount('1', USDT[networkId]), tokenB)
  const usdPriceA = useUSDTPrice(tokenA ?? undefined)
  const usdPriceB = useUSDTPrice(tokenB ?? undefined)

  const initialUSDPrices = useInitialUSDPrices()
  const initialTokenPrice = useInitialTokenPrice()

  const handleOnBlur = useCallback(() => {
    if (usdPriceB) {
      setLocalUSDValue(String(+localTokenValue * +usdPriceB.toSignificant(5)))
    } else if (initialUSDPrices.CURRENCY_B) {
      setLocalUSDValue(String(+localTokenValue * +initialUSDPrices.CURRENCY_B))
    }
    onUserInput(localTokenValue)
  }, [usdPriceB, initialUSDPrices.CURRENCY_B, initialTokenPrice, usdPriceA, tokenB?.wrapped.address, onUserInput, localUSDValue, tokenValue, localTokenValue])

  // for button clicks
  const handleDecrement = useCallback(() => {
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (value) {
      setLocalTokenValue(value)
      if (value === '∞') {
        setLocalUSDValue(value)
        return
      }
      if (usdPriceB) {
        setLocalUSDValue(String(+value * +usdPriceB.toSignificant(5)))
      } else if (initialUSDPrices.CURRENCY_B) {
        setLocalUSDValue(String(+value * +initialUSDPrices.CURRENCY_B))
      } else if (initialTokenPrice && usdPriceA) {
        setLocalUSDValue(String(+value * +initialTokenPrice * +usdPriceA.toSignificant(5)))
      }
    } else if (value === '') {
      setLocalTokenValue('')
      setLocalUSDValue('')
    }
  }, [usdPriceB, initialTokenPrice, initialUSDPrices, value, usdPriceA])

  return (
    <div className='bg-[#080331] px-1.5 md:px-3.5 py-2 md:py-[11px] w-1/2 flex flex-col items-center justify-center rounded-xl'>
      <p className='text-[#B8B6CB] text-xs md:text-[15px]'>{title}</p>
      <div className='flex items-center justify-between mt-[9px] w-full'>
        <button
          onClick={handleDecrement}
          disabled={decrementDisabled || disabled}
          className='md:w-[34px] w-5 h-5 md:h-[34px] flex flex-col items-center justify-center rounded-full bg-white bg-opacity-[0.09]'
        >
          <img alt='' className='w-3/5 md:w-auto' src='/images/svgs/minus.svg' />
        </button>
        <div className='text-base md:text-2xl leading-5 md:leading-[29px] text-white font-medium'>
          <NumericalInput
            value={localTokenValue}
            id={title}
            onBlur={handleOnBlur}
            disabled={disabled || locked}
            onUserInput={(val) => {
              setLocalTokenValue(val.trim())
              dispatch(updateSelectedPreset({ preset: null }))
            }}
            placeholder='0.00'
          />
        </div>
        <button
          onClick={handleIncrement}
          disabled={incrementDisabled || disabled}
          className='md:w-[34px] w-5 h-5 md:h-[34px] flex flex-col items-center justify-center rounded-full bg-white bg-opacity-[0.09]'
        >
          <img alt='' src='/images/svgs/plus.svg' />
        </button>
      </div>
      {tokenA && tokenB && (
        <p className='text-[#B8B6CB] text-xs md:text-[15px] mt-3 md:mt-2.5'>
          {tokenB?.symbol} per {tokenA?.symbol}
        </p>
      )}
    </div>
  )
}

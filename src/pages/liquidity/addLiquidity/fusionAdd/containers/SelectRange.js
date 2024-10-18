import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useInitialUSDPrices, useV3MintActionHandlers, useV3MintState, useActivePreset, useRangeHopCallbacks } from 'state/mintV3/hooks'
import Notification from 'components/Notification'
import { useStableAssets } from 'hooks/v3/useStableAssets'
import { Bound, updateSelectedPreset } from 'state/mintV3/actions'
import { useUSDTValue } from 'hooks/v3/useUSDTPrice'
import { tryParseAmount } from 'v3lib/utils'
import { Presets } from 'state/mintV3/reducer'
import { PresetRanges } from '../components/PresetRanges'
import { RangeSelector } from '../components/RangeSelector'
import LiquidityChartRangeInput from '../components/LiquidityChartRangeInput'
import { PriceFormats } from '..'

const SelectRange = ({ currencyA, currencyB, mintInfo, priceFormat, gammaPairs }) => {
  const [fullRangeWarningShown, setFullRangeWarningShown] = useState(true)
  const { startPriceTypedValue } = useV3MintState()
  const stableAssets = useStableAssets()

  const dispatch = useDispatch()
  const activePreset = useActivePreset()

  // TODO - create one main isUSD
  const isUSD = useMemo(() => {
    return priceFormat === PriceFormats.USD
  }, [priceFormat])

  const isStablecoinPair = useMemo(() => {
    if (!currencyA || !currencyB) return false

    const stablecoins = stableAssets.map((token) => token.address)

    return stablecoins.includes(currencyA.wrapped.address) && stablecoins.includes(currencyB.wrapped.address)
  }, [currencyA, currencyB, stableAssets])

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = useMemo(() => {
    return mintInfo.ticks
  }, [mintInfo])

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = useMemo(() => {
    return mintInfo.pricesAtTicks
  }, [mintInfo])

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } = useRangeHopCallbacks(
    currencyA ?? undefined,
    currencyB ?? undefined,
    mintInfo.dynamicFee,
    tickLower,
    tickUpper,
    mintInfo.pool,
  )

  const { onLeftRangeInput, onRightRangeInput } = useV3MintActionHandlers(mintInfo.noLiquidity)

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

  const price = useMemo(() => {
    if (!mintInfo.price) return

    return mintInfo.invertPrice ? mintInfo.price.invert().toSignificant(5) : mintInfo.price.toSignificant(5)
  }, [mintInfo])

  const currentPriceInUSD = useUSDTValue(tryParseAmount(Number(price).toFixed(5), currencyB ?? undefined), true)

  const handlePresetRangeSelection = useCallback(
    (preset) => {
      if (!price) return

      dispatch(updateSelectedPreset({ preset: preset ? preset.type : null }))

      if (preset && preset.type === Presets.FULL) {
        setFullRangeWarningShown(true)
        getSetFullRange()
      } else {
        setFullRangeWarningShown(false)
        onLeftRangeInput(preset ? String(+price * preset.min) : '')
        onRightRangeInput(preset ? String(+price * preset.max) : '')
      }
    },
    [dispatch, getSetFullRange, onLeftRangeInput, onRightRangeInput, price],
  )

  const initialUSDPrices = useInitialUSDPrices()

  const currentPriceInUSDA = useUSDTValue(
    tryParseAmount(
      mintInfo.price
        ? mintInfo.invertPrice
          ? Number(mintInfo.price.invert().toSignificant(5)).toFixed(5)
          : Number(mintInfo.price.toSignificant(5)).toFixed(5)
        : undefined,
      currencyB ?? undefined,
    ),
    true,
  )

  const currentPriceInUSDB = useUSDTValue(
    tryParseAmount(
      mintInfo.price
        ? mintInfo.invertPrice
          ? Number(mintInfo.price.invert().toSignificant(5)).toFixed(5)
          : Number(mintInfo.price.toSignificant(5)).toFixed(5)
        : undefined,
      currencyA ?? undefined,
    ),
    true,
  )

  const currentPrice = useMemo(() => {
    if (!mintInfo.price) return

    const isInitialInUSD = Boolean(initialUSDPrices.CURRENCY_A && initialUSDPrices.CURRENCY_B)

    let _price

    if (!isUSD) {
      _price =
        isUSD && currentPriceInUSDA
          ? parseFloat(currentPriceInUSDA?.toSignificant(5))
          : mintInfo.invertPrice
          ? parseFloat(mintInfo.price.invert().toSignificant(5))
          : parseFloat(mintInfo.price.toSignificant(5))
    } else if (isInitialInUSD) {
      _price = parseFloat(initialUSDPrices.CURRENCY_A)
    } else if (currentPriceInUSDA) {
      _price = parseFloat(currentPriceInUSDA.toSignificant(5))
    } else if (currentPriceInUSDB) {
      _price = parseFloat(currentPriceInUSDB.toSignificant(5))
    }

    if (Number(_price) <= 0.0001) {
      return `< ${isUSD && (currentPriceInUSDA || isInitialInUSD) ? '$ ' : ''}0.0001`
    } else {
      return `${isUSD && (currentPriceInUSDA || isInitialInUSD) ? '$ ' : ''}${_price}`
    }
  }, [mintInfo.price, mintInfo.invertPrice, initialUSDPrices.CURRENCY_A, initialUSDPrices.CURRENCY_B, isUSD, currentPriceInUSDA, currentPriceInUSDB])

  return (
    <div className='mt-4 md:mt-5'>
      <p className='text-[13px] md:text-base leading-5 text-[#B8B6CB]'>Select Strategy</p>
      <PresetRanges
        mintInfo={mintInfo}
        baseCurrency={currencyA}
        quoteCurrency={currencyB}
        isStablecoinPair={isStablecoinPair}
        activePreset={activePreset}
        handlePresetRangeSelection={handlePresetRangeSelection}
        priceLower={leftPrice?.toSignificant(5)}
        priceUpper={rightPrice?.toSignificant(5)}
        price={price}
      />
      {mintInfo.price && (
        <div className='flex justify-center w-full md:space-x-6 mt-[10px]'>
          <div className='text-sm md:text-base mt-[7px] md:mt-0 leading-4 md:leading-5 text-[#fff] font-figtree'>
            {!mintInfo.noLiquidity ? 'Current Price: ' : 'Initial Price: '}
            {currentPrice ?? ''} <span className='text-secondary'>{currentPrice ? `${currencyB?.symbol} per ${currencyA?.symbol}` : 'Loading...'}</span>
          </div>
        </div>
      )}
      <div className='mt-3'>
        <RangeSelector
          priceLower={priceLower}
          priceUpper={priceUpper}
          getDecrementLower={getDecrementLower}
          getIncrementLower={getIncrementLower}
          getDecrementUpper={getDecrementUpper}
          getIncrementUpper={getIncrementUpper}
          onLeftRangeInput={onLeftRangeInput}
          onRightRangeInput={onRightRangeInput}
          currencyA={currencyA}
          currencyB={currencyB}
          mintInfo={mintInfo}
          disabled={!startPriceTypedValue && !mintInfo.price}
        />
      </div>
      {activePreset === Presets.FULL && fullRangeWarningShown && (
        <Notification isClose onClose={() => setFullRangeWarningShown(false)}>
          Full range positions may earn less fees than concentrated positions.
        </Notification>
      )}
      {mintInfo.outOfRange && (
        <Notification>
          The price range for this liquidity position is not eligible for farming rewards. To become eligible for rewards, please increase your range
        </Notification>
      )}
      {mintInfo.invalidRange && <Notification>Invalid Range</Notification>}
      <div className='bg-[#080331] rounded-[5px] flex justify-center items-center mt-5'>
        <LiquidityChartRangeInput
          currencyA={currencyA ?? undefined}
          currencyB={currencyB ?? undefined}
          feeAmount={mintInfo.dynamicFee}
          ticksAtLimit={mintInfo.ticksAtLimit}
          price={
            priceFormat === PriceFormats.USD
              ? currentPriceInUSD
                ? parseFloat(currentPriceInUSD.toSignificant(5))
                : undefined
              : price
              ? parseFloat(price)
              : undefined
          }
          priceLower={priceLower}
          priceUpper={priceUpper}
          onLeftRangeInput={onLeftRangeInput}
          onRightRangeInput={onRightRangeInput}
          interactive={false}
          priceFormat={priceFormat}
        />
      </div>
    </div>
  )
}

export default SelectRange

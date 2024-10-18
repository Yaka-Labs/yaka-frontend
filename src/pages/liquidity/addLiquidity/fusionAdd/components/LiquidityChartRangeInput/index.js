import React, { useCallback, useMemo } from 'react'
import { format } from 'd3'
import { Bound } from 'state/mintV3/actions'
import { tryParseAmount } from 'v3lib/utils'
import { useInitialTokenPrice, useInitialUSDPrices } from 'state/mintV3/hooks'
import useUSDTPrice, { useUSDTValue } from 'hooks/v3/useUSDTPrice'
import Spinner from 'components/Spinner'
import { PriceFormats } from '../..'
import { Chart } from './Chart'
import { useDensityChartData } from './hooks'

const ZOOM_LEVEL = {
  initialMin: 0.2,
  initialMax: 4,
  min: 0.01,
  max: 20,
}

const LiquidityChartRangeInput = ({ currencyA, currencyB, feeAmount, ticksAtLimit, price, priceLower, priceUpper, interactive, priceFormat }) => {
  const { isLoading, isUninitialized, isError, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount,
    priceFormat,
  })

  const initialPrice = useInitialTokenPrice()
  const initialUSDPrices = useInitialUSDPrices()
  const currencyBUSD = useUSDTPrice(currencyB)

  const mockData = useMemo(() => {
    if (formattedData && formattedData.length > 0) return []

    if (!initialPrice && !price) return []

    if (priceFormat === PriceFormats.TOKEN) {
      return [
        {
          activeLiquidity: 0,
          price0: (price ?? +initialPrice) * ZOOM_LEVEL.initialMin,
        },
        {
          activeLiquidity: 0,
          price0: (price ?? +initialPrice) * ZOOM_LEVEL.initialMax,
        },
      ]
    } else {
      if (currencyBUSD || (initialUSDPrices.CURRENCY_B && initialPrice)) {
        const price = currencyBUSD?.toSignificant(8) || initialUSDPrices.CURRENCY_B
        return [
          {
            activeLiquidity: 0,
            price0: +price * +initialPrice * ZOOM_LEVEL.initialMin,
          },
          {
            activeLiquidity: 0,
            price0: +price * +initialPrice * ZOOM_LEVEL.initialMax,
          },
        ]
      }
      return []
    }
  }, [formattedData, initialPrice, price, priceFormat, currencyBUSD, initialUSDPrices.CURRENCY_B])

  const mockPrice = useMemo(() => {
    if (formattedData && formattedData.length > 0) return 0

    if (!initialPrice && !price) return 0

    if (priceFormat === PriceFormats.TOKEN) {
      return price ?? +initialPrice
    } else {
      if (currencyBUSD) return +currencyBUSD.toSignificant(5) * +initialPrice
      if (initialUSDPrices.CURRENCY_B) return +initialUSDPrices.CURRENCY_B * +initialPrice
    }

    return 0
  }, [initialPrice, initialUSDPrices, currencyBUSD, priceFormat, formattedData, price])

  const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped)

  const onBrushDomainChangeEnded = useCallback((domain, mode) => {
    let leftRangeValue = Number(domain[0])

    if (leftRangeValue <= 0) {
      leftRangeValue = 1 / 10 ** 6
    }
  }, [])

  interactive = interactive && Boolean(formattedData?.length)

  const leftPrice = useMemo(() => {
    return isSorted ? priceLower : priceUpper?.invert()
  }, [isSorted, priceLower, priceUpper])

  // TODO
  const leftPriceUSD = useUSDTValue(
    tryParseAmount(leftPrice ? (+leftPrice.toSignificant(5) < 0.00000001 ? undefined : Number(leftPrice.toSignificant(5)).toFixed(5)) : undefined, currencyB),
    true,
  )

  const rightPrice = useMemo(() => {
    return isSorted ? priceUpper : priceLower?.invert()
  }, [isSorted, priceLower, priceUpper])

  const rightPriceUSD = useUSDTValue(
    tryParseAmount(
      rightPrice
        ? rightPrice.toSignificant(5) === '3384900000000000000000000000000000000000000000000'
          ? undefined
          : Number(rightPrice.toSignificant(5)).toFixed(5)
        : undefined,
      currencyB,
    ),
    true,
  )

  const brushDomain = useMemo(() => {
    if (!leftPrice || !rightPrice) return

    if (priceFormat === PriceFormats.USD && leftPriceUSD && rightPriceUSD) {
      return [parseFloat(leftPriceUSD.toSignificant(5)), parseFloat(rightPriceUSD.toSignificant(5))]
    }

    if (priceFormat === PriceFormats.USD && initialUSDPrices.CURRENCY_B) {
      return [
        parseFloat(String(+leftPrice.toSignificant(5) * +initialUSDPrices.CURRENCY_B)),
        parseFloat(String(+rightPrice.toSignificant(5) * +initialUSDPrices.CURRENCY_B)),
      ]
    }

    return [parseFloat(leftPrice.toSignificant(5)), parseFloat(rightPrice.toSignificant(5))]
  }, [leftPrice, rightPrice, priceFormat, leftPriceUSD, rightPriceUSD, initialUSDPrices.CURRENCY_B])

  const brushLabelValue = useCallback(
    (d, x) => {
      const _price = price || mockPrice

      if (!_price) return ''

      if (d === 'w' && ticksAtLimit[Bound.LOWER]) return '0'
      if (d === 'e' && ticksAtLimit[Bound.UPPER]) return '∞'

      const percent = (x < _price ? -1 : 1) * ((Math.max(x, _price) - Math.min(x, _price)) / _price) * 100

      return _price ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%` : ''
    },
    [price, ticksAtLimit, mockPrice],
  )

  return (
    <div className='w-full min-h-[260px] flex justify-center items-center text-[#E0DEF0]'>
      {isUninitialized ? (
        <p>Your position will appear here.</p>
      ) : isLoading ? (
        <Spinner />
      ) : isError ? (
        <p>Liquidity data not available.</p>
      ) : !formattedData || formattedData.length === 0 || !price ? (
        <Chart
          data={{ series: mockData, current: mockPrice }}
          dimensions={{ width: 400, height: 230 }}
          margins={{ top: 20, right: 0, bottom: 30, left: 0 }}
          styles={{
            area: {
              selection: '#008FFF',
            },
          }}
          interactive={interactive}
          brushLabels={brushLabelValue}
          brushDomain={brushDomain}
          onBrushDomainChange={onBrushDomainChangeEnded}
          zoomLevels={ZOOM_LEVEL}
        />
      ) : (
        <Chart
          data={{ series: formattedData, current: price }}
          dimensions={{ width: 400, height: 230 }}
          margins={{ top: 20, right: 0, bottom: 30, left: 0 }}
          styles={{
            area: {
              selection: '#008FFF',
            },
          }}
          interactive={interactive}
          brushLabels={brushLabelValue}
          brushDomain={brushDomain}
          onBrushDomainChange={onBrushDomainChangeEnded}
          zoomLevels={ZOOM_LEVEL}
        />
      )}
    </div>
  )
}

export default LiquidityChartRangeInput

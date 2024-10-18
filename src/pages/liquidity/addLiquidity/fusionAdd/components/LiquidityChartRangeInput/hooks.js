import { useCallback, useMemo } from 'react'
import { usePoolActiveLiquidity } from 'hooks/v3/usePoolTickData'
import useUSDTPrice from 'hooks/v3/useUSDTPrice'
import { PriceFormats } from '../..'

export const useDensityChartData = ({ currencyA, currencyB, feeAmount, priceFormat }) => {
  const { isLoading, isUninitialized, isError, error, data } = usePoolActiveLiquidity(currencyA, currencyB, feeAmount)

  const currencyBUSD = useUSDTPrice(currencyB)

  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined
    }

    if (priceFormat === PriceFormats.USD && !currencyBUSD) return

    const newData = []

    for (let i = 0; i < data.length; i++) {
      const t = data[i]

      const formattedPrice = priceFormat === PriceFormats.USD && currencyBUSD ? parseFloat(t.price0) * +currencyBUSD.toSignificant(5) : parseFloat(t.price0)

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: formattedPrice,
      }

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry)
      }
    }

    return newData
  }, [data, currencyBUSD, priceFormat])

  return useMemo(() => {
    return {
      isLoading,
      isUninitialized,
      isError,
      error,
      formattedData: !isLoading && !isUninitialized ? formatData() : undefined,
    }
  }, [isLoading, isUninitialized, isError, error, formatData])
}

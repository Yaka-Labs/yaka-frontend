import { useMemo } from 'react'
import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { PoolState, useFusions } from './useFusions'

/**
 * Returns all the existing pools that should be considered for swapping between an input currency and an output currency
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */
export const useV3SwapPools = (currencyIn, currencyOut) => {
  const allCurrencyCombinations = useAllCurrencyCombinations(currencyIn, currencyOut)

  const pools = useFusions(allCurrencyCombinations)

  return useMemo(() => {
    return {
      pools: pools
        .filter((tuple) => {
          return tuple[0] === PoolState.EXISTS && tuple[1] !== null
        })
        .map(([, pool]) => pool),
      loading: pools.some(([state]) => state === PoolState.LOADING),
    }
  }, [pools])
}

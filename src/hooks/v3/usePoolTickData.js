import JSBI from 'jsbi'
import { useMemo } from 'react'
import { skipToken } from '@reduxjs/toolkit/query/react'
import { Pool, tickToPrice } from 'thena-fusion-sdk'
import computeSurroundingTicks from 'v3lib/utils/computeSurroundingTicks'
import { useAllV3TicksQuery } from 'state/data/enhanced'
import { PoolState, useFusion } from './useFusions'

const PRICE_FIXED_DIGITS = 8

const getActiveTick = (tickCurrent, feeAmount) => (tickCurrent && feeAmount ? Math.floor(tickCurrent / 60) * 60 : undefined)

// Fetches all ticks for a given pool
export function useAllV3Ticks(currencyA, currencyB, feeAmount) {
  const poolAddress = currencyA && currencyB && feeAmount ? Pool.getAddress(currencyA?.wrapped, currencyB?.wrapped, feeAmount) : undefined

  // TODO(judo): determine if pagination is necessary for this query
  const { isLoading, isError, error, isUninitialized, data } = useAllV3TicksQuery(
    poolAddress ? { poolAddress: poolAddress?.toLowerCase(), skip: 0 } : skipToken,
    {
      pollingInterval: 120000,
    },
  )

  return {
    isLoading,
    isUninitialized,
    isError,
    error,
    ticks: data?.ticks,
  }
}

export function usePoolActiveLiquidity(currencyA, currencyB, feeAmount) {
  const pool = useFusion(currencyA, currencyB)

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(() => getActiveTick(pool[1]?.tickCurrent, feeAmount), [pool, feeAmount])

  const { isLoading, isUninitialized, isError, error, ticks } = useAllV3Ticks(currencyA, currencyB, feeAmount)

  return useMemo(() => {
    if (!currencyA || !currencyB || activeTick === undefined || pool[0] !== PoolState.EXISTS || !ticks || ticks.length === 0 || isLoading || isUninitialized) {
      return {
        isLoading: isLoading || pool[0] === PoolState.LOADING,
        isUninitialized,
        isError,
        error,
        activeTick,
        data: undefined,
      }
    }

    const token0 = currencyA?.wrapped
    const token1 = currencyB?.wrapped

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = ticks.findIndex(({ tickIdx }) => tickIdx > activeTick) - 1

    if (pivot < 0) {
      // consider setting a local error
      console.error('TickData pivot not found')
      return {
        isLoading,
        isUninitialized,
        isError,
        error,
        activeTick,
        data: undefined,
      }
    }

    const activeTickProcessed = {
      liquidityActive: JSBI.BigInt(pool[1]?.liquidity ?? 0),
      tickIdx: activeTick,
      liquidityNet: Number(ticks[pivot].tickIdx) === activeTick ? JSBI.BigInt(ticks[pivot].liquidityNet) : JSBI.BigInt(0),
      price0: tickToPrice(token0, token1, activeTick).toFixed(PRICE_FIXED_DIGITS),
    }

    const subsequentTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, true)

    const previousTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, false)

    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks)

    return {
      isLoading,
      isUninitialized,
      isError,
      error,
      activeTick,
      data: ticksProcessed,
    }
  }, [currencyA, currencyB, activeTick, pool, ticks, isLoading, isUninitialized, isError, error])
}

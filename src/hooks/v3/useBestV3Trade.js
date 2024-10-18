import { useMemo } from 'react'
import { CurrencyAmount, TradeType } from 'thena-sdk-core'
import { Trade, encodeRouteToPath } from 'thena-fusion-sdk'
import { useSingleContractMultipleData } from 'state/multicall/v3/hooks'
import { useAllV3Routes } from './useAllV3Routes'
import { useV3Quoter } from '../useContractV3'

export const V3TradeState = {
  LOADING: 'LOADING',
  INVALID: 'INVALID',
  NO_ROUTE_FOUND: 'NO_ROUTE_FOUND',
  VALID: 'VALID',
  SYNCING: 'SYNCING',
}

/**
 * Returns the best v3 trade for a desired exact input swap
 * @param amountIn the amount to swap in
 * @param currencyOut the desired output currency
 */
export const useBestV3TradeExactIn = (amountIn, currencyOut) => {
  const quoter = useV3Quoter()

  const { routes, loading: routesLoading } = useAllV3Routes(amountIn?.currency, currencyOut)

  const quoteExactInInputs = useMemo(() => {
    return routes.map((route) => [encodeRouteToPath(route, false), amountIn ? `0x${amountIn.quotient.toString(16)}` : undefined])
  }, [amountIn, routes])

  const quotesResults = useSingleContractMultipleData(quoter, 'quoteExactInput', quoteExactInInputs, {
    // gasRequired: chainId ? DEFAULT_GAS_QUOTE : undefined
  })

  const trade = useMemo(() => {
    if (!amountIn || !currencyOut) {
      return {
        state: V3TradeState.INVALID,
        trade: null,
      }
    }

    if (routesLoading || quotesResults.some(({ loading }) => loading)) {
      return {
        state: V3TradeState.LOADING,
        trade: null,
      }
    }

    const { bestRoute, amountOut } = quotesResults.reduce(
      (currentBest, { result }, i) => {
        if (!result) return currentBest

        if (currentBest.amountOut === null) {
          return {
            bestRoute: routes[i],
            amountOut: result.amountOut,
          }
        } else if (currentBest.amountOut.lt(result.amountOut)) {
          return {
            bestRoute: routes[i],
            amountOut: result.amountOut,
          }
        }

        return currentBest
      },
      {
        bestRoute: null,
        amountOut: null,
      },
    )

    if (!bestRoute || !amountOut) {
      return {
        state: V3TradeState.NO_ROUTE_FOUND,
        trade: null,
      }
    }

    const isSyncing = quotesResults.some(({ syncing }) => syncing)

    return {
      state: isSyncing ? V3TradeState.SYNCING : V3TradeState.VALID,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType: TradeType.EXACT_INPUT,
        inputAmount: amountIn,
        outputAmount: CurrencyAmount.fromRawAmount(currencyOut, amountOut.toString()),
      }),
    }
  }, [amountIn, currencyOut, quotesResults, routes, routesLoading])

  return useMemo(() => {
    return trade
  }, [trade])
}

/**
 * Returns the best v3 trade for a desired exact output swap
 * @param currencyIn the desired input currency
 * @param amountOut the amount to swap out
 */
export const useBestV3TradeExactOut = (currencyIn, amountOut) => {
  const quoter = useV3Quoter()

  const { routes, loading: routesLoading } = useAllV3Routes(currencyIn, amountOut?.currency)

  const quoteExactOutInputs = useMemo(() => {
    return routes.map((route) => [encodeRouteToPath(route, true), amountOut ? `0x${amountOut.quotient.toString(16)}` : undefined])
  }, [amountOut, routes])

  const quotesResults = useSingleContractMultipleData(quoter, 'quoteExactOutput', quoteExactOutInputs, {
    // gasRequired: chainId ? DEFAULT_GAS_QUOTE : undefined
  })

  return useMemo(() => {
    if (!amountOut || !currencyIn || quotesResults.some(({ valid }) => !valid)) {
      return {
        state: V3TradeState.INVALID,
        trade: null,
      }
    }

    if (routesLoading || quotesResults.some(({ loading }) => loading)) {
      return {
        state: V3TradeState.LOADING,
        trade: null,
      }
    }

    const { bestRoute, amountIn } = quotesResults.reduce(
      (currentBest, { result }, i) => {
        if (!result) return currentBest

        if (currentBest.amountIn === null) {
          return {
            bestRoute: routes[i],
            amountIn: result.amountIn,
          }
        } else if (currentBest.amountIn.gt(result.amountIn)) {
          return {
            bestRoute: routes[i],
            amountIn: result.amountIn,
          }
        }

        return currentBest
      },
      {
        bestRoute: null,
        amountIn: null,
      },
    )

    if (!bestRoute || !amountIn) {
      return {
        state: V3TradeState.NO_ROUTE_FOUND,
        trade: null,
      }
    }

    const isSyncing = quotesResults.some(({ syncing }) => syncing)

    return {
      state: isSyncing ? V3TradeState.SYNCING : V3TradeState.VALID,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType: TradeType.EXACT_OUTPUT,
        inputAmount: CurrencyAmount.fromRawAmount(currencyIn, amountIn.toString()),
        outputAmount: amountOut,
      }),
    }
  }, [amountOut, currencyIn, quotesResults, routes, routesLoading])
}

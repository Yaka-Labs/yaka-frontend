import { CurrencyAmount, Percent } from 'thena-sdk-core'
import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Position } from 'thena-fusion-sdk'
import { unwrappedToken } from 'v3lib/utils'
import { useFusion } from './useFusions'
import { useToken } from './Tokens'
import { useV3PositionFees } from './useV3PositionFees'

export function useDerivedV3BurnInfo(position, percent, asWETH = false) {
  const { account } = useWeb3React()
  const token0 = useToken(position?.token0)
  const token1 = useToken(position?.token1)

  const [, pool] = useFusion(token0 ?? undefined, token1 ?? undefined)

  const positionSDK = useMemo(
    () =>
      pool && position?.liquidity && typeof position?.tickLower === 'number' && typeof position?.tickUpper === 'number'
        ? new Position({
            pool,
            liquidity: position.liquidity.toString(),
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
          })
        : undefined,
    [pool, position],
  )

  const liquidityPercentage = new Percent(percent, 100)

  const discountedAmount0 = positionSDK ? liquidityPercentage.multiply(positionSDK.amount0.quotient).quotient : undefined
  const discountedAmount1 = positionSDK ? liquidityPercentage.multiply(positionSDK.amount1.quotient).quotient : undefined

  const liquidityValue0 = token0 && discountedAmount0 ? CurrencyAmount.fromRawAmount(asWETH ? token0 : unwrappedToken(token0), discountedAmount0) : undefined
  const liquidityValue1 = token1 && discountedAmount1 ? CurrencyAmount.fromRawAmount(asWETH ? token1 : unwrappedToken(token1), discountedAmount1) : undefined

  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, position?.tokenId, asWETH)

  const outOfRange = pool && position ? pool.tickCurrent < position.tickLower || pool.tickCurrent > position.tickUpper : false

  let error
  if (!account) {
    error = 'Connect Wallet'
  }
  if (percent === 0) {
    error = error ?? 'Enter a percent'
  }
  return {
    positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  }
}

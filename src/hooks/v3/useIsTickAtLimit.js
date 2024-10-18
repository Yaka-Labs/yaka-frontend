import { useMemo } from 'react'
import { Bound } from 'state/mintV3/actions'
import { TICK_SPACING, TickMath, nearestUsableTick } from 'thena-fusion-sdk'

export default function useIsTickAtLimit(tickLower, tickUpper) {
  return useMemo(
    () => ({
      [Bound.LOWER]: tickLower ? tickLower === nearestUsableTick(TickMath.MIN_TICK, TICK_SPACING) : undefined,
      [Bound.UPPER]: tickUpper ? tickUpper === nearestUsableTick(TickMath.MAX_TICK, TICK_SPACING) : undefined,
    }),
    [tickLower, tickUpper],
  )
}

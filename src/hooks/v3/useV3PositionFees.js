import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyAmount } from 'thena-sdk-core'
import { useBlockNumber } from 'state/application/hooks'
import { unwrappedToken } from 'v3lib/utils'
import { useSingleCallResult } from 'state/multicall/v3/hooks'
import { useV3Algebra } from '../useContractV3'

const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

// compute current + counterfactual fees for a v3 position
export function useV3PositionFees(pool, tokenId, asWETH = false) {
  const positionManager = useV3Algebra()
  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]

  const tokenIdHexString = tokenId?.toHexString()
  const latestBlockNumber = useBlockNumber()

  // TODO find a way to get this into multicall
  // latestBlockNumber is included to ensure data stays up-to-date every block
  const [amounts, setAmounts] = useState()
  useEffect(() => {
    let stale = false

    if (positionManager && tokenIdHexString && owner && typeof latestBlockNumber === 'number') {
      positionManager.callStatic
        .collect(
          {
            tokenId: tokenIdHexString,
            recipient: owner, // some tokens might fail if transferred to address(0)
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
          },
          { from: owner }, // need to simulate the call as the owner
        )
        .then((results) => {
          if (!stale) setAmounts([results.amount0, results.amount1])
        })
    }

    return () => {
      stale = true
    }
  }, [positionManager, tokenIdHexString, owner, latestBlockNumber])

  if (pool && amounts) {
    return [
      CurrencyAmount.fromRawAmount(!asWETH ? unwrappedToken(pool.token0) : pool.token0, amounts[0].toString()),
      CurrencyAmount.fromRawAmount(!asWETH ? unwrappedToken(pool.token1) : pool.token1, amounts[1].toString()),
    ]
  } else {
    return [undefined, undefined]
  }
}

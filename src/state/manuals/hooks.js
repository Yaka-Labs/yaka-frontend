import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useManuals = () => {
  const { data } = useSelector((state) => state.manuals)

  return useMemo(() => {
    return data.map((pos) => {
      return {
        ...pos,
        tokenId: BigNumber.from(pos.tokenId),
        liquidity: BigNumber.from(pos.liquidity),
        tickLower: pos.tickLower,
        tickUpper: pos.tickUpper,
        token0: pos.token0,
        token1: pos.token1,
      }
    })
  }, [data])
}

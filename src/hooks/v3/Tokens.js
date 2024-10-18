import { useMemo } from 'react'
import { BNB, Token } from 'thena-sdk-core'
import { useAssets } from 'state/assets/hooks'
import { useNetwork } from 'state/settings/hooks'

// undefined if invalid or does not exist
// otherwise returns the token
export function useToken(tokenAddress) {
  const assets = useAssets()

  return useMemo(() => {
    if (!tokenAddress) return undefined
    const asset = assets.find((item) => item.address.toLowerCase() === tokenAddress.toLowerCase())
    if (!asset) return undefined
    return new Token(asset.chainId, asset.address, asset.decimals, asset.symbol, asset.name)
  }, [assets, tokenAddress])
}

export const useCurrency = (currencyId) => {
  const { networkId } = useNetwork()
  let isBNB = currencyId?.toUpperCase() === 'BNB'
  const token = useToken(isBNB ? undefined : currencyId)
  return isBNB ? BNB.onChain(networkId) : token
}

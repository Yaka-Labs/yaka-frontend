import { useMemo } from 'react'
import { Token } from 'thena-sdk-core'
import { STABLE_TOKENS } from 'config/constants'
import { useAssets } from 'state/assets/hooks'

export const useStableAssets = () => {
  const assets = useAssets()
  return useMemo(() => {
    return assets.length > 0
      ? assets
          .filter((item) => Object.values(STABLE_TOKENS[item.chainId]).find((asset) => asset.toLowerCase() === item.address.toLowerCase()))
          .map((stable) => new Token(stable.chainId, stable.address, stable.decimals, stable.symbol, stable.name))
      : []
  }, [assets])
}

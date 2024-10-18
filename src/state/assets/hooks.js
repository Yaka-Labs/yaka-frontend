import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { useNetwork } from 'state/settings/hooks'

export const useAssets = () => {
  const { data } = useSelector((state) => state.assets)
  const { networkId } = useNetwork()

  return useMemo(() => {
    return data[networkId].map((ele) => {
      return {
        ...ele,
        balance: new BigNumber(ele.balance),
      }
    })
  }, [data, networkId])
}

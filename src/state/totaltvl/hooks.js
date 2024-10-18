import { useSelector } from 'react-redux'
import { useNetwork } from '../settings/hooks'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { ZERO_VALUE } from '../../utils/formatNumber'

export const useTotalTvl = () => {
  const { data } = useSelector((state) => state.totaltvl)
  const { networkId } = useNetwork()

  return useMemo(() => {
    return data[networkId]?.totaltvl || 0
  }, [data, networkId])
}

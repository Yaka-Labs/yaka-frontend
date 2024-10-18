import { useDispatch } from 'react-redux'
import useRefresh from '../../hooks/useRefresh'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { useNetwork } from '../settings/hooks'
import { useCallback, useEffect } from 'react'
import { fetchTotalTvl } from '../../utils/defillamaApi'
import { updateTotalTvl } from './actions'

const Updater = () => {
  const dispatch = useDispatch()
  const { tvlRefresh } = useRefresh()
  const windowVisible = useIsWindowVisible()
  const { networkId } = useNetwork()

  const fetchTotalTvlInfo = useCallback(async () => {
    let totaltvl = 0
    try {
      totaltvl = await fetchTotalTvl(networkId)
    } catch (e) {
      console.error('totaltvl fetched had error', e)
    }
    dispatch(
      updateTotalTvl({
        totaltvl: Math.floor((totaltvl / 100) * 100),
        networkId,
      }),
    )
  }, [dispatch, networkId])

  useEffect(() => {
    if (!windowVisible) return
    fetchTotalTvlInfo()
  }, [windowVisible, tvlRefresh, fetchTotalTvlInfo])

  return null
}

export default Updater

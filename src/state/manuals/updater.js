import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import useRefresh from 'hooks/useRefresh'
import { multicall } from 'utils/multicall'
import { useAlgebra } from 'hooks/useContract'
import { getAlgebraAddress } from 'utils/addressHelpers'
import { algebraAbi } from 'config/abi/v3'
import { useNetwork } from 'state/settings/hooks'
import { updateManuals } from './actions'

const Updater = () => {
  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()
  const windowVisible = useIsWindowVisible()
  const positionManager = useAlgebra()
  const { pathname } = useLocation()
  const { networkId } = useNetwork()

  const fetchInfo = useCallback(async () => {
    let result = []
    try {
      if (account) {
        const accountBalance = await positionManager.methods.balanceOf(account).call()
        if (Number(accountBalance) > 0) {
          const tokenRequests = []
          for (let i = 0; i < accountBalance; i++) {
            tokenRequests.push(i)
          }
          const tokenIdCalls = tokenRequests.map((item) => {
            return {
              address: getAlgebraAddress(networkId),
              name: 'tokenOfOwnerByIndex',
              params: [account, item],
            }
          })
          const tokenIds = await multicall(algebraAbi, tokenIdCalls, networkId)
          const inputs = tokenIds.map((tokenId) => Number(tokenId[0]))
          const positionCalls = inputs.map((input) => {
            return {
              address: getAlgebraAddress(networkId),
              name: 'positions',
              params: [input],
            }
          })
          const positionRes = await multicall(algebraAbi, positionCalls, networkId)
          result = positionRes.map((pos, index) => {
            return {
              tokenId: inputs[index],
              liquidity: pos.liquidity.toString(),
              tickLower: pos.tickLower,
              tickUpper: pos.tickUpper,
              token0: pos.token0,
              token1: pos.token1,
            }
          })
        }
      }
    } catch (error) {
      console.log('manuals fetch error :>> ', error)
    }
    dispatch(updateManuals(result))
  }, [dispatch, account, networkId])

  useEffect(() => {
    if (!windowVisible || !pathname.includes('/liquidity')) return
    fetchInfo()
  }, [windowVisible, fastRefresh, fetchInfo, pathname])

  return null
}

export default Updater

import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import useDebounce from 'hooks/useDebounce'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import useWeb3 from 'hooks/useWeb3'
import useRefresh from 'hooks/useRefresh'
import { updateBlockNumber } from './actions'

const Updater = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const { fastestRefresh } = useRefresh()

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState({
    chainId,
    blockNumber: null,
  })

  const blockNumberCallback = useCallback(
    (blockNumber) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return {
            chainId,
            blockNumber,
          }
        }
        return state
      })
    },
    [chainId, setState],
  )

  // attach/detach listeners
  useEffect(() => {
    if (!web3 || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })

    web3.eth
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))
  }, [web3, blockNumberCallback, windowVisible, fastestRefresh])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(
      updateBlockNumber({
        chainId: debouncedState.chainId,
        blockNumber: debouncedState.blockNumber,
      }),
    )
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}

export default Updater

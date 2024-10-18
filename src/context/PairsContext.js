import React, { useState, useEffect, createContext, useContext, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useNetwork } from 'state/settings/hooks'
import { fusionClient } from 'apollo/client'
import { FUSION_POOLS } from 'apollo/queries'
import { poolAbi } from 'config/abi/v3'
import { multicall } from 'utils/multicall'
import { ChainId } from 'thena-sdk-core'
import { DEFAULT_CHAIN_ID } from '../config/constants'

const fetchFusionPools = async (chainId) => {
  try {
    let data = []
    let allFound = false
    let skip = 0
    while (!allFound) {
      const result = await fusionClient[chainId].query({
        query: FUSION_POOLS,
        variables: {
          skip,
        },
        fetchPolicy: 'network-only',
      })
      if (result.data.pools.length < 100) {
        allFound = true
      }
      skip += 100
      data = data.concat(result.data.pools)
    }
    const calls = data.map((pool) => {
      return {
        address: pool.id,
        name: 'globalState',
      }
    })
    const globalStates = await multicall(poolAbi, calls, chainId)
    return data.map((ele, index) => {
      return {
        address: ele.id,
        liquidity: ele.liquidity,
        globalState: globalStates[index],
      }
    })
  } catch (error) {
    console.log('fusion pool fetch error :>> ', error)
    return []
  }
}

const initialState = {
  [ChainId.BSC]: [],
  [ChainId.OPBNB]: [],
  1328: [],
  1329: [],
}

const PairsContext = createContext({
  [ChainId.BSC]: [],
  [ChainId.OPBNB]: [],
  1328: [],
  1329: [],
})

const PairsContextProvider = ({ children }) => {
  const [pairs, setPairs] = useState(initialState)
  const route = useLocation()
  const { pathname } = route
  const { networkId } = useNetwork()

  useEffect(() => {
    const getPoolData = async () => {
      try {
        const data = await fetchFusionPools(networkId)
        setPairs({
          ...pairs,
          [networkId]: data,
        })
      } catch (e) {
        console.error('fusion pools fetched had error', e)
      }
    }
    if (pairs[networkId]?.length === 0 && networkId !== DEFAULT_CHAIN_ID) {
      // getPoolData()
    }
  }, [pathname, pairs, networkId])

  return <PairsContext.Provider value={pairs}>{children}</PairsContext.Provider>
}

export const usePairs = () => {
  const { networkId } = useNetwork()
  const pairs = useContext(PairsContext)
  return useMemo(() => {
    return pairs[networkId]
  }, [pairs, networkId])
}

export { PairsContext, PairsContextProvider }

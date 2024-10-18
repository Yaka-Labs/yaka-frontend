import { fusionClient } from 'apollo/client'
import { FUSION_POOLS } from 'apollo/queries'
import { poolAbi } from 'config/abi/v3'
import { multicall } from './multicall'

export const fetchFusionPools = async (chainId) => {
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

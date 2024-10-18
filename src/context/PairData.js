import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { isAddress } from 'ethers/lib/utils'
import { getPairChartDataV1 } from 'utils/analyticsHelper'
import { ANALYTIC_VERSIONS } from 'config/constants'
import { getPairChartDataFusion, getPairTransactionsFusion, getPairTransactionsV1, getTopPairsTotal } from 'utils/fusionGraph'
import { useAssets } from 'state/assets/hooks'
import { useNetwork } from 'state/settings/hooks'

const UPDATE = 'UPDATE'
const UPDATE_PAIR_TXNS = 'UPDATE_PAIR_TXNS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_TOP_PAIRS = 'UPDATE_TOP_PAIRS'
const UPDATE_HOURLY_DATA = 'UPDATE_HOURLY_DATA'

dayjs.extend(utc)

export function safeAccess(object, path) {
  return object ? path.reduce((accumulator, currentValue) => (accumulator && accumulator[currentValue] ? accumulator[currentValue] : null), object) : null
}

const PairDataContext = createContext()

function usePairDataContext() {
  return useContext(PairDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { pairAddress, data } = payload
      return {
        ...state,
        [pairAddress]: {
          ...state?.[pairAddress],
          ...data,
        },
      }
    }

    case UPDATE_TOP_PAIRS: {
      const { topPairs } = payload
      let added = {}
      topPairs.map((pair) => {
        return (added[pair.id] = pair)
      })
      return {
        ...state,
        ...added,
      }
    }

    case UPDATE_PAIR_TXNS: {
      const { address, transactions } = payload
      return {
        ...state,
        [address]: {
          ...(safeAccess(state, [address]) || {}),
          txns: transactions,
        },
      }
    }
    case UPDATE_CHART_DATA: {
      const { address, chartData } = payload
      return {
        ...state,
        [address]: {
          ...(safeAccess(state, [address]) || {}),
          chartData,
        },
      }
    }

    case UPDATE_HOURLY_DATA: {
      const { address, hourlyData, timeWindow } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          hourlyData: {
            ...state?.[address]?.hourlyData,
            [timeWindow]: hourlyData,
          },
        },
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {})

  // update pair specific data
  const update = useCallback((pairAddress, data) => {
    dispatch({
      type: UPDATE,
      payload: {
        pairAddress,
        data,
      },
    })
  }, [])

  const updateTopPairs = useCallback((topPairs) => {
    dispatch({
      type: UPDATE_TOP_PAIRS,
      payload: {
        topPairs,
      },
    })
  }, [])

  const updatePairTxns = useCallback((address, transactions) => {
    dispatch({
      type: UPDATE_PAIR_TXNS,
      payload: { address, transactions },
    })
  }, [])

  const updateChartData = useCallback((address, chartData) => {
    dispatch({
      type: UPDATE_CHART_DATA,
      payload: { address, chartData },
    })
  }, [])

  const updateHourlyData = useCallback((address, hourlyData, timeWindow) => {
    dispatch({
      type: UPDATE_HOURLY_DATA,
      payload: { address, hourlyData, timeWindow },
    })
  }, [])

  return (
    <PairDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updatePairTxns,
            updateChartData,
            updateTopPairs,
            updateHourlyData,
          },
        ],
        [state, update, updatePairTxns, updateChartData, updateTopPairs, updateHourlyData],
      )}
    >
      {children}
    </PairDataContext.Provider>
  )
}

/**
 * Get all the current and 24hr changes for a pair
 */
export function usePairData(pairAddress) {
  const [state, { updateTopPairs }] = usePairDataContext()
  const pairData = state?.[pairAddress]
  const { networkId } = useNetwork()

  useEffect(() => {
    async function fetchData() {
      const topPairs = await getTopPairsTotal(500, networkId)
      if (topPairs) {
        updateTopPairs(topPairs)
      }
    }
    if (!pairData && isAddress(pairAddress)) {
      fetchData()
    }
  }, [updateTopPairs, pairData, networkId])

  return pairData || {}
}

/**
 * Get most recent txns for a pair
 */
export function usePairTransactions(pairAddress, pairData) {
  const [state, { updatePairTxns }] = usePairDataContext()
  const pairTxns = state?.[pairAddress]?.txns
  const { networkId } = useNetwork()
  useEffect(() => {
    async function checkForTxns() {
      if (!pairTxns) {
        let transactions
        if (pairData.isFusion) {
          transactions = await getPairTransactionsFusion(pairAddress, networkId)
        } else {
          transactions = await getPairTransactionsV1(pairAddress, networkId)
        }
        updatePairTxns(pairAddress, transactions)
      }
    }
    if (Object.keys(pairData).length > 0) {
      checkForTxns()
    }
  }, [pairTxns, pairAddress, pairData, updatePairTxns, networkId])
  return pairTxns || []
}

export function usePairChartData(pairAddress, pairData) {
  const [state, { updateChartData }] = usePairDataContext()
  const chartData = state?.[pairAddress]?.chartData
  const { networkId } = useNetwork()

  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        let data
        if (pairData.isFusion) {
          data = await getPairChartDataFusion(pairAddress, networkId)
        } else {
          data = await getPairChartDataV1(pairAddress, pairData.isStable, networkId)
        }
        updateChartData(pairAddress, data)
      }
    }
    if (Object.keys(pairData).length > 0) {
      checkForChartData()
    }
  }, [chartData, pairAddress, pairData, updateChartData, networkId])
  return chartData
}

export function useAllPairData(version) {
  const [state, { updateTopPairs }] = usePairDataContext()
  const assets = useAssets()
  const { networkId } = useNetwork()
  const [isLoaded, setIsLoaded] = useState(false)

  const data = useMemo(() => {
    let pairs = []
    switch (version) {
      case ANALYTIC_VERSIONS.v1:
        pairs = Object.values(state).filter((pair) => !pair.isFusion)
        break
      case ANALYTIC_VERSIONS.fusion:
        pairs = Object.values(state).filter((pair) => pair.isFusion)
        break
      case ANALYTIC_VERSIONS.total:
        pairs = Object.values(state)
        break

      default:
        break
    }

    if (pairs && pairs.length > 0) {
      return pairs.map((pair) => {
        const found0 = assets.find((ele) => ele.address.toLowerCase() === pair.token0.id)
        const found1 = assets.find((ele) => ele.address.toLowerCase() === pair.token1.id)
        return {
          ...pair,
          token0: {
            ...pair.token0,
            name: found0 ? found0.name : pair.token0.name,
            symbol: found0 ? found0.symbol : pair.token0.symbol,
            logoURI: found0 ? found0.logoURI : 'https://cdn.thena.fi/assets/UKNOWN.png',
          },
          token1: {
            ...pair.token1,
            name: found1 ? found1.name : pair.token1.name,
            symbol: found1 ? found1.symbol : pair.token1.symbol,
            logoURI: found1 ? found1.logoURI : 'https://cdn.thena.fi/assets/UKNOWN.png',
          },
        }
      })
    }
    return []
  }, [state, version])

  // const combinedVolume = useTokenDataCombined(offsetVolumes)

  useEffect(() => {
    async function fetchData() {
      const topPairs = await getTopPairsTotal(500, networkId)
      setIsLoaded(true)
      if (topPairs) {
        updateTopPairs(topPairs)
      }
    }
    if (!isLoaded) {
      fetchData()
    }
  }, [updateTopPairs, data, networkId])

  return data || []
}

export function useBulkPairData(pairList) {
  const [state, { updateTopPairs }] = usePairDataContext()
  const { networkId } = useNetwork()

  const data = useMemo(() => {
    const pairs = Object.values(state).filter((pair) => pairList.includes(pair.id))
    let result = {}
    pairs.map((pair) => {
      return (result[pair.id] = pair)
    })
    return result
  }, [state, pairList])

  // const combinedVolume = useTokenDataCombined(offsetVolumes)

  useEffect(() => {
    async function fetchData() {
      const topPairs = await getTopPairsTotal(500, networkId)
      if (topPairs) {
        updateTopPairs(topPairs)
      }
    }
    if (!data || Object.keys(data).length === 0) {
      fetchData()
    }
  }, [updateTopPairs, data, networkId])

  return data || {}
}

export default Provider

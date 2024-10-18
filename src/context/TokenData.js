import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getTokenChartDataTotal, getTopPairsTotalByToken, getTopTokensTotal } from 'utils/fusionGraph'
import { isAddress } from 'ethers/lib/utils'
import { useAssets } from 'state/assets/hooks'
import { useNetwork } from 'state/settings/hooks'
import { useBnbPrice } from './GlobalData'

const UPDATE = 'UPDATE'
const UPDATE_TOKEN_TXNS = 'UPDATE_TOKEN_TXNS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_PRICE_DATA = 'UPDATE_PRICE_DATA'
const UPDATE_TOP_TOKENS = ' UPDATE_TOP_TOKENS'
const UPDATE_ALL_PAIRS = 'UPDATE_ALL_PAIRS'

const TOKEN_PAIRS_KEY = 'TOKEN_PAIRS_KEY'

dayjs.extend(utc)

const TokenDataContext = createContext()

export function useTokenDataContext() {
  return useContext(TokenDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { tokenAddress, data } = payload
      return {
        ...state,
        [tokenAddress]: {
          ...state?.[tokenAddress],
          ...data,
        },
      }
    }
    case UPDATE_TOP_TOKENS: {
      const { topTokens } = payload
      return {
        ...state,
        ...topTokens,
      }
    }

    case UPDATE_TOKEN_TXNS: {
      const { address, transactions } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          txns: transactions,
        },
      }
    }
    case UPDATE_CHART_DATA: {
      const { address, chartData } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          chartData,
        },
      }
    }

    case UPDATE_PRICE_DATA: {
      const { address, data, timeWindow, interval } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          [timeWindow]: {
            ...state?.[address]?.[timeWindow],
            [interval]: data,
          },
        },
      }
    }

    case UPDATE_ALL_PAIRS: {
      const { address, allPairs } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          [TOKEN_PAIRS_KEY]: allPairs,
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
  const update = useCallback((tokenAddress, data) => {
    dispatch({
      type: UPDATE,
      payload: {
        tokenAddress,
        data,
      },
    })
  }, [])

  const updateTopTokens = useCallback((topTokens) => {
    dispatch({
      type: UPDATE_TOP_TOKENS,
      payload: {
        topTokens,
      },
    })
  }, [])

  const updateTokenTxns = useCallback((address, transactions) => {
    dispatch({
      type: UPDATE_TOKEN_TXNS,
      payload: { address, transactions },
    })
  }, [])

  const updateChartData = useCallback((address, chartData) => {
    dispatch({
      type: UPDATE_CHART_DATA,
      payload: { address, chartData },
    })
  }, [])

  const updateAllPairs = useCallback((address, allPairs) => {
    dispatch({
      type: UPDATE_ALL_PAIRS,
      payload: { address, allPairs },
    })
  }, [])

  const updatePriceData = useCallback((address, data, timeWindow, interval) => {
    dispatch({
      type: UPDATE_PRICE_DATA,
      payload: { address, data, timeWindow, interval },
    })
  }, [])

  return (
    <TokenDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateTokenTxns,
            updateChartData,
            updateTopTokens,
            updateAllPairs,
            updatePriceData,
          },
        ],
        [state, update, updateTokenTxns, updateChartData, updateTopTokens, updateAllPairs, updatePriceData],
      )}
    >
      {children}
    </TokenDataContext.Provider>
  )
}

export function useAllTokenData(version) {
  const [state, { updateTopTokens }] = useTokenDataContext()
  const [bnbPrice, oldBnbPrice] = useBnbPrice()
  const assets = useAssets()
  const { networkId } = useNetwork()
  const [isLoaded, setIsLoaded] = useState(false)

  const data = useMemo(() => {
    const tokens = state && state[version]
    if (tokens && Object.keys(tokens).length > 0) {
      return Object.values(tokens).map((token) => {
        const found = assets.find((ele) => ele.address.toLowerCase() === token.id)
        return {
          ...token,
          name: found ? found.name : token.name,
          symbol: found ? found.symbol : token.symbol,
          logoURI: found ? found.logoURI : 'https://cdn.thena.fi/assets/UKNOWN.png',
        }
      })
    }
    return []
  }, [state, version, assets])

  useEffect(() => {
    async function fetchData() {
      let topTokens = await getTopTokensTotal(bnbPrice, oldBnbPrice, networkId)
      setIsLoaded(true)
      if (topTokens) {
        updateTopTokens(topTokens)
      }
    }
    if (!isLoaded && bnbPrice && oldBnbPrice) {
      fetchData()
    }
  }, [bnbPrice, oldBnbPrice, updateTopTokens, data, networkId])

  return data
}

export function useTokenData(tokenAddress, version) {
  const [state, { updateTopTokens }] = useTokenDataContext()
  const [bnbPrice, bnbPriceOld] = useBnbPrice()
  const { networkId } = useNetwork()

  const tokenData = useMemo(() => {
    return state && state[version]?.[tokenAddress]
  }, [state, version])

  useEffect(() => {
    async function fetchData() {
      let topTokens = await getTopTokensTotal(bnbPrice, bnbPriceOld, networkId)
      if (topTokens) {
        updateTopTokens(topTokens)
      }
    }
    if (!tokenData && bnbPrice && bnbPriceOld && isAddress(tokenAddress)) {
      fetchData()
    }
  }, [bnbPrice, bnbPriceOld, tokenAddress, tokenData, updateTopTokens, networkId])

  return tokenData || {}
}

export function useTokenPairs(tokenAddress, version) {
  const [state, { updateAllPairs }] = useTokenDataContext()
  const tokenPairs = state?.[tokenAddress]?.[TOKEN_PAIRS_KEY]?.[version]
  const { networkId } = useNetwork()

  useEffect(() => {
    async function fetchData() {
      let allPairs = await getTopPairsTotalByToken(tokenAddress, networkId)
      updateAllPairs(tokenAddress, allPairs)
    }
    if (!tokenPairs && isAddress(tokenAddress)) {
      fetchData()
    }
  }, [tokenAddress, tokenPairs, updateAllPairs, networkId])

  return tokenPairs || []
}

export function useTokenChartData(tokenAddress, version) {
  const [state, { updateChartData }] = useTokenDataContext()
  const chartData = state?.[tokenAddress]?.chartData?.[version]
  const { networkId } = useNetwork()

  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        let data = await getTokenChartDataTotal(tokenAddress, networkId)
        updateChartData(tokenAddress, data)
      }
    }
    checkForChartData()
  }, [chartData, tokenAddress, updateChartData, networkId])
  return chartData
}

export default Provider

import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { fusionClient } from 'apollo/client'
import { getPercentChange, getBlockFromTimestamp } from 'utils/analyticsHelper'
import { getChartDataTotal, getGlobalDataTotal } from 'utils/fusionGraph'
import { useNetwork } from 'state/settings/hooks'
import { BNB_PRICE_V3 } from 'apollo/fusionQueries'

const UPDATE_GLOBAL = 'UPDATE'
const UPDATE_CHART = 'UPDATE_CHART'
const UPDATE_ETH_PRICE = 'UPDATE_ETH_PRICE'
const ETH_PRICE_KEY = 'ETH_PRICE_KEY'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

const GlobalDataContext = createContext()

function useGlobalDataContext() {
  return useContext(GlobalDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_GLOBAL: {
      const { data, networkId } = payload
      return {
        ...state,
        globalData: {
          [networkId]: data,
        },
      }
    }

    case UPDATE_CHART: {
      const { data } = payload
      return {
        ...state,
        chartData: data,
      }
    }
    case UPDATE_ETH_PRICE: {
      const { ethPrice, oneDayPrice, ethPriceChange } = payload
      return {
        [ETH_PRICE_KEY]: ethPrice,
        oneDayPrice,
        ethPriceChange,
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {})
  const update = useCallback((data, networkId) => {
    dispatch({
      type: UPDATE_GLOBAL,
      payload: {
        data,
        networkId,
      },
    })
  }, [])

  const updateChart = useCallback((data) => {
    dispatch({
      type: UPDATE_CHART,
      payload: {
        data,
      },
    })
  }, [])

  const updateEthPrice = useCallback((ethPrice, oneDayPrice, ethPriceChange) => {
    dispatch({
      type: UPDATE_ETH_PRICE,
      payload: {
        ethPrice,
        oneDayPrice,
        ethPriceChange,
      },
    })
  }, [])
  return (
    <GlobalDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateChart,
            updateEthPrice,
          },
        ],
        [state, update, updateChart, updateEthPrice],
      )}
    >
      {children}
    </GlobalDataContext.Provider>
  )
}

/**
 * Gets the current price  of ETH, 24 hour price, and % change between them
 */
const getBnbPrice = async (chainId) => {
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()

  let ethPrice = 0
  let ethPriceOneDay = 0
  let priceChangeETH = 0

  try {
    let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack, chainId)
    let result = await fusionClient[chainId].query({
      query: BNB_PRICE_V3(),
      fetchPolicy: 'cache-first',
    })
    let resultOneDay = await fusionClient[chainId].query({
      query: BNB_PRICE_V3(oneDayBlock),
      fetchPolicy: 'cache-first',
    })
    const currentPrice = result?.data?.bundles[0]?.bnbPriceUSD
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.bnbPriceUSD
    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice)
    ethPrice = currentPrice
    ethPriceOneDay = oneDayBackPrice
  } catch (e) {
    console.log('bnb price error => ', e)
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH]
}

/**
 * Hook that fetches overview data, plus all tokens and pairs for search
 */
export function useGlobalData(version) {
  const [state, { update }] = useGlobalDataContext()
  const { networkId } = useNetwork()

  const data = useMemo(() => {
    return state?.globalData && state?.globalData[networkId] && state?.globalData[networkId][version]
  }, [state, version, networkId])

  // const combinedVolume = useTokenDataCombined(offsetVolumes)

  useEffect(() => {
    async function fetchData() {
      let globalData = await getGlobalDataTotal(networkId)
      if (globalData) {
        update(globalData, networkId)
      }
    }
    if (!data) {
      fetchData()
    }
  }, [update, data, networkId])

  return data || {}
}

export function useGlobalChartData(version) {
  const [state, { updateChart }] = useGlobalDataContext()
  const { networkId } = useNetwork()

  const data = state?.chartData?.[version]

  /**
   * Fetch data if none fetched or older data is needed
   */
  useEffect(() => {
    async function fetchData() {
      // historical stuff for chart
      const data = await getChartDataTotal(networkId)
      updateChart(data)
    }
    if (!data) {
      fetchData()
    }
  }, [data, updateChart, networkId])

  return data
}

export function useBnbPrice() {
  const [state, { updateEthPrice }] = useGlobalDataContext()
  const bnbPrice = state?.[ETH_PRICE_KEY]
  const bnbPriceOld = state?.oneDayPrice
  const { networkId } = useNetwork()

  useEffect(() => {
    async function checkForEthPrice() {
      if (!bnbPrice) {
        let [newPrice, oneDayPrice, priceChange] = await getBnbPrice(networkId)
        updateEthPrice(newPrice, oneDayPrice, priceChange)
      }
    }
    checkForEthPrice()
  }, [bnbPrice, updateEthPrice, networkId])

  return [bnbPrice, bnbPriceOld]
}

export default Provider

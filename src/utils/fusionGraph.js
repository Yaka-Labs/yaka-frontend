import dayjs from 'dayjs'
import { ChainId } from 'thena-sdk-core'
import {
  GLOBAL_CHART_V3,
  GLOBAL_DATA_V3,
  PAIRS_FROM_ADDRESSES_V3,
  PAIR_CHART_V3,
  PAIR_TRANSACTIONS_v3,
  TOKENS_FROM_ADDRESSES_V3,
  TOKEN_CHART_V3,
  TOP_POOLS_V3,
  TOP_TOKENS_V3,
} from 'apollo/fusionQueries'
import { FILTERED_TRANSACTIONS, PAIRS_BULK1, PAIRS_CURRENT_QUICK, PAIRS_HISTORICAL_BULK, TOKENS_FROM_ADDRESSES_V2, TOKEN_TOP_DAY_DATAS } from 'apollo/queries'
import v1Client, { fusionClient } from 'apollo/client'
import { ANALYTIC_VERSIONS, STABLE_FEE, TVL_INCREASE, TXN_TYPE, VOLATILE_FEE } from 'config/constants'
import {
  getBlocksFromTimestamps,
  getChartDataV1,
  getGlobalDataV1,
  getPercentChange,
  getSecondsOneDay,
  getTokenChartDataV1,
  getTokenPairsFusion,
  getTokenPairsV1,
  updateNameData,
} from './analyticsHelper'

// Global

export async function getGlobalDataTotal(chainId) {
  const [fusionData, v1Data] = await Promise.all([getGlobalDataFusion(chainId), getGlobalDataV1(chainId)])

  const totalLiquidityUSD = fusionData.totalLiquidityUSD + v1Data.totalLiquidityUSD
  const prevTotalLiquidityUSD = fusionData.prevTotalLiquidityUSD + v1Data.prevTotalLiquidityUSD
  const liquidityChangeUSD = getPercentChange(totalLiquidityUSD, prevTotalLiquidityUSD)

  const volumeUSD = fusionData.volumeUSD + v1Data.volumeUSD
  const prevVolumeUSD = fusionData.prevVolumeUSD + v1Data.prevVolumeUSD
  const volumeChange = getPercentChange(volumeUSD, prevVolumeUSD)

  const feesUSD = fusionData.feesUSD + v1Data.feesUSD
  const prevFeesUSD = fusionData.prevFeesUSD + v1Data.prevFeesUSD
  const feesChange = getPercentChange(feesUSD, prevFeesUSD)

  return {
    [ANALYTIC_VERSIONS.v1]: v1Data,
    [ANALYTIC_VERSIONS.fusion]: fusionData,
    [ANALYTIC_VERSIONS.total]: {
      totalLiquidityUSD,
      prevTotalLiquidityUSD,
      liquidityChangeUSD,
      volumeUSD,
      prevVolumeUSD,
      volumeChange,
      feesUSD,
      prevFeesUSD,
      feesChange,
    },
  }
}

export async function getGlobalDataFusion(chainId) {
  let data = {}

  try {
    const utcCurrentTime = dayjs()

    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').unix()

    // get the blocks needed for time travel queries
    const [oneDayBlock, twoDayBlock] = await getBlocksFromTimestamps([utcOneDayBack, utcTwoDaysBack], chainId)

    const [dataCurrent, dataOneDay, dataTwoDay] = await Promise.all([
      fusionClient[chainId].query({
        query: GLOBAL_DATA_V3(),
        fetchPolicy: 'network-only',
      }),
      fusionClient[chainId].query({
        query: GLOBAL_DATA_V3(oneDayBlock?.number),
        fetchPolicy: 'network-only',
      }),
      fusionClient[chainId].query({
        query: GLOBAL_DATA_V3(twoDayBlock?.number),
        fetchPolicy: 'network-only',
      }),
    ])

    const [statsCurrent, statsOneDay, statsTwoDay] = [
      dataCurrent && dataCurrent.data && dataCurrent.data.factories && dataCurrent.data.factories.length > 0 ? dataCurrent.data.factories[0] : undefined,
      dataOneDay && dataOneDay.data && dataOneDay.data.factories && dataOneDay.data.factories.length > 0 ? dataOneDay.data.factories[0] : undefined,
      dataTwoDay && dataTwoDay.data && dataTwoDay.data.factories && dataTwoDay.data.factories.length > 0 ? dataTwoDay.data.factories[0] : undefined,
    ]

    const liquidityChangeUSD = getPercentChange(statsCurrent ? statsCurrent.totalValueLockedUSD : 0, statsOneDay ? statsOneDay.totalValueLockedUSD : 0)

    const volumeUSD = Number(statsCurrent.totalVolumeUSD) - Number(statsOneDay.totalVolumeUSD)
    const prevVolumeUSD = Number(statsOneDay.totalVolumeUSD) - Number(statsTwoDay.totalVolumeUSD)
    const volumeChange = getPercentChange(volumeUSD, prevVolumeUSD)

    const feesUSD = Number(statsCurrent.totalFeesUSD) - Number(statsOneDay.totalFeesUSD)
    const prevFeesUSD = Number(statsOneDay.totalFeesUSD) - Number(statsTwoDay.totalFeesUSD)
    const feesChange = getPercentChange(feesUSD, prevFeesUSD)

    data = {
      totalLiquidityUSD: Number(statsCurrent.totalValueLockedUSD) + (chainId === ChainId.BSC ? TVL_INCREASE : 0),
      prevTotalLiquidityUSD: Number(statsOneDay.totalValueLockedUSD) + (chainId === ChainId.BSC ? TVL_INCREASE : 0),
      liquidityChangeUSD,
      volumeUSD,
      prevVolumeUSD,
      volumeChange,
      feesUSD,
      prevFeesUSD,
      feesChange,
    }
  } catch (e) {
    console.log(e)

    data = {
      totalLiquidityUSD: 0,
      prevTotalLiquidityUSD: 0,
      liquidityChangeUSD: 0,
      volumeUSD: 0,
      prevVolumeUSD: 0,
      volumeChange: 0,
      feesUSD: 0,
      prevFeesUSD: 0,
      feesChange: 0,
    }
  }

  return data
}

export const getChartDataFusion = async (oldestDateToFetch, chainId) => {
  let data = []
  const weeklyData = []
  const utcEndTime = dayjs.utc()
  let skip = 0
  let allFound = false

  try {
    while (!allFound) {
      const result = await fusionClient[chainId].query({
        query: GLOBAL_CHART_V3,
        variables: {
          startTime: oldestDateToFetch,
          skip,
        },
        fetchPolicy: 'network-only',
      })
      skip += 1000
      data = data.concat(
        result.data.fusionDayDatas.map((item) => {
          return { ...item, dailyVolumeUSD: Number(item.volumeUSD) }
        }),
      )
      if (result.data.fusionDayDatas.length < 1000) {
        allFound = true
      }
    }

    if (data) {
      const dayIndexSet = new Set()
      const dayIndexArray = []
      const oneDay = 24 * 60 * 60

      // for each day, parse the daily volume and format for chart array
      data.forEach((dayData, i) => {
        // add the day index to the set of days
        dayIndexSet.add((data[i].date / oneDay).toFixed(0))
        dayIndexArray.push(data[i])
        dayData.totalLiquidityUSD = Number(dayData.tvlUSD)
      })

      // fill in empty days ( there will be no day datas if no trades made that day )
      let timestamp = data[0].date ? data[0].date : oldestDateToFetch
      let latestLiquidityUSD = data[0].tvlUSD
      let latestDayDats = data[0].mostLiquidTokens
      let index = 1
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        const currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dailyVolumeUSD: 0,
            totalLiquidityUSD: latestLiquidityUSD,
            mostLiquidTokens: latestDayDats,
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].tvlUSD
          latestDayDats = dayIndexArray[index].mostLiquidTokens
          index += 1
        }
        timestamp = nextDay
      }
    }

    // format weekly data for weekly sized chunks
    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
    data.pop()
    let startIndexWeekly = -1
    let currentWeek = -1
    data.forEach((entry, i) => {
      const week = dayjs.utc(dayjs.unix(data[i].date)).week()
      if (week !== currentWeek) {
        currentWeek = week
        startIndexWeekly++
      }
      weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {}
      weeklyData[startIndexWeekly].date = data[i].date
      weeklyData[startIndexWeekly].weeklyVolumeUSD = (weeklyData[startIndexWeekly].weeklyVolumeUSD ?? 0) + Number(data[i].dailyVolumeUSD)
    })
  } catch (e) {
    console.log(e)
  }
  return {
    daily: data,
    weekly: weeklyData,
  }
}

export const getChartDataTotal = async (chainId) => {
  const utcEndTime = dayjs.utc()
  const utcStartTime = utcEndTime.subtract(1, 'month')
  const startTime = utcStartTime.startOf('minute').unix() - 1
  const [fusionData, v1Data] = await Promise.all([getChartDataFusion(startTime, chainId), getChartDataV1(startTime, chainId)])
  const dailyData = fusionData.daily.map((item) => {
    const v1Item = v1Data.daily.find((v2Item) => v2Item.date === item.date)
    return {
      ...item,
      dailyVolumeUSD: (item && item.dailyVolumeUSD ? Number(item.dailyVolumeUSD) : 0) + (v1Item && v1Item.dailyVolumeUSD ? Number(v1Item.dailyVolumeUSD) : 0),
      totalLiquidityUSD:
        (item && item.totalLiquidityUSD ? Number(item.totalLiquidityUSD) : 0) + (v1Item && v1Item.totalLiquidityUSD ? Number(v1Item.totalLiquidityUSD) : 0),
    }
  })
  const weeklydata = fusionData.weekly.map((item) => {
    const v2Item = v1Data.weekly.find((v2Item) => v2Item.date === item.date)
    return {
      ...item,
      weeklyVolumeUSD:
        (item && item.weeklyVolumeUSD ? Number(item.weeklyVolumeUSD) : 0) + (v2Item && v2Item.weeklyVolumeUSD ? Number(v2Item.weeklyVolumeUSD) : 0),
    }
  })

  return {
    [ANALYTIC_VERSIONS.v1]: v1Data,
    [ANALYTIC_VERSIONS.fusion]: fusionData,
    [ANALYTIC_VERSIONS.total]: {
      daily: dailyData,
      weekly: weeklydata,
    },
  }
}

// Tokens

export async function getTopTokensTotal(bnbPrice, bnbPrice24H, chainId) {
  try {
    const utcCurrentTime = dayjs()
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    const utcTwoDayBack = utcCurrentTime.subtract(2, 'day').unix()
    const [oneDayBlock, twoDayBlock] = await getBlocksFromTimestamps([utcOneDayBack, utcTwoDayBack], chainId)
    const [fusionFormatted, v1Formatted] = await Promise.all([
      getTopTokensFusion(chainId, bnbPrice, bnbPrice24H, oneDayBlock, twoDayBlock),
      getTopTokensV1(chainId, bnbPrice, bnbPrice24H, oneDayBlock, twoDayBlock),
    ])
    const fusionTokenIds = Object.keys(fusionFormatted)
    const v1TokenIds = Object.keys(v1Formatted)
    const totalIds = fusionTokenIds.concat(v1TokenIds.filter((id) => !fusionTokenIds.includes(id)))
    const totalFormatted = totalIds
      .map((address) => {
        const fusionData = fusionFormatted[address]
        const v1Data = v1Formatted[address]
        const tvlUSD = (fusionData ? fusionData.totalLiquidityUSD : 0) + (v1Data ? v1Data.totalLiquidityUSD : 0)
        const tvlUSDOneDay = (fusionData ? fusionData.tvlUSDOneDay : 0) + (v1Data ? v1Data.tvlUSDOneDay : 0)
        const tvlUSDChange = getPercentChange(tvlUSD, tvlUSDOneDay)
        const oneDayVolumeUSD = (fusionData ? fusionData.oneDayVolumeUSD : 0) + (v1Data ? v1Data.oneDayVolumeUSD : 0)
        const twoDayVolumeUSD = (fusionData ? fusionData.twoDayVolumeUSD : 0) + (v1Data ? v1Data.twoDayVolumeUSD : 0)
        const volumeChangeUSD = getPercentChange(oneDayVolumeUSD, twoDayVolumeUSD)
        const oneDayTxns = (fusionData ? fusionData.oneDayTxns : 0) + (v1Data ? v1Data.oneDayTxns : 0)
        const twoDayTxns = (fusionData ? fusionData.twoDayTxns : 0) + (v1Data ? v1Data.twoDayTxns : 0)
        const txnChange = getPercentChange(oneDayTxns, twoDayTxns)
        return {
          id: address,
          name: formatTokenName(address, fusionData ? fusionData.name : v1Data.name),
          symbol: formatTokenSymbol(address, fusionData ? fusionData.symbol : v1Data.symbol),
          decimals: fusionData ? fusionData.decimals : v1Data.decimals,
          oneDayVolumeUSD: (fusionData ? fusionData.oneDayVolumeUSD : 0) + (v1Data ? v1Data.oneDayVolumeUSD : 0),
          volumeChangeUSD,
          oneDayTxns,
          txnChange,
          totalLiquidityUSD: tvlUSD,
          liquidityChangeUSD: tvlUSDChange,
          priceUSD: fusionData && fusionData.priceUSD > 0 ? fusionData.priceUSD : v1Data ? v1Data.priceUSD : 0,
          priceChangeUSD: fusionData && fusionData.priceChangeUSD !== 0 ? fusionData.priceChangeUSD : v1Data ? v1Data.priceChangeUSD : 0,
        }
      })
      .sort((a, b) => {
        return b.totalLiquidityUSD - a.totalLiquidityUSD
      })
      .reduce((acc, token) => {
        return { ...acc, [token.id]: token }
      }, {})

    return {
      [ANALYTIC_VERSIONS.v1]: v1Formatted,
      [ANALYTIC_VERSIONS.fusion]: fusionFormatted,
      [ANALYTIC_VERSIONS.total]: totalFormatted,
    }
  } catch (err) {
    console.error(err)
  }
}

async function getTopTokensV1(chainId, bnbPrice, bnbPrice24H, oneDayBlock, twoDayBlock) {
  try {
    const currentDate = parseInt(Date.now() / 86400 / 1000) * 86400 - 86400 * 20
    const v1TopTokensIds = await v1Client[chainId].query({
      query: TOKEN_TOP_DAY_DATAS,
      fetchPolicy: 'network-only',
      variables: { date: currentDate },
    })
    const v1TokenAddresses = v1TopTokensIds?.data?.tokenDayDatas?.reduce((accum, entry) => {
      accum.push(entry.id.slice(0, 42))
      return accum
    }, [])
    const [v1TokensCurrent, v1Tokens24, v1Tokens48] = await Promise.all([
      fetchTokensByTimeV1(undefined, v1TokenAddresses, chainId),
      fetchTokensByTimeV1(oneDayBlock.number, v1TokenAddresses, chainId),
      fetchTokensByTimeV1(twoDayBlock.number, v1TokenAddresses, chainId),
    ])
    if (!v1Tokens24) return {}
    const parsedTokensV1 = parseTokensData(v1TokensCurrent)
    const parsedTokens24V1 = parseTokensData(v1Tokens24)
    const parsedTokens48V1 = parseTokensData(v1Tokens48)
    const v1Formatted = v1TokenAddresses.map((address) => {
      const v1Current = parsedTokensV1[address]
      const v1OneDay = parsedTokens24V1[address]
      const v1TwoDay = parsedTokens48V1[address]

      let oneDayVolumeUSD =
        Number(v1Current && v1Current.tradeVolumeUSD ? v1Current.tradeVolumeUSD : 0) - Number(v1OneDay && v1OneDay.tradeVolumeUSD ? v1OneDay.tradeVolumeUSD : 0)
      let twoDayVolumeUSD =
        Number(v1OneDay && v1OneDay.tradeVolumeUSD ? v1OneDay.tradeVolumeUSD : 0) - Number(v1TwoDay && v1TwoDay.tradeVolumeUSD ? v1TwoDay.tradeVolumeUSD : 0)
      const volumeChangeUSD = getPercentChange(oneDayVolumeUSD, twoDayVolumeUSD)

      let oneDayTxns = Number(v1Current && v1Current.txCount ? v1Current.txCount : 0) - Number(v1OneDay && v1OneDay.txCount ? v1OneDay.txCount : 0)
      let twoDayTxns = Number(v1OneDay && v1OneDay.txCount ? v1OneDay.txCount : 0) - Number(v1TwoDay && v1TwoDay.txCount ? v1TwoDay.txCount : 0)
      const txnChange = getPercentChange(oneDayTxns, twoDayTxns)

      const tvlUSD = v1Current ? (v1Current.totalLiquidity ?? 0) * bnbPrice * (v1Current.derivedETH ?? 0) : 0
      const tvlUSDOneDay = v1OneDay ? (v1OneDay.totalLiquidity ?? 0) * bnbPrice24H * (v1OneDay.derivedETH ?? 0) : 0
      const tvlUSDChange = getPercentChange(tvlUSD, tvlUSDOneDay)
      let priceUSD = v1Current && v1Current.derivedETH ? v1Current.derivedETH * bnbPrice : 0
      const priceUSDOneDay = v1OneDay && v1OneDay.derivedETH ? v1OneDay.derivedETH * bnbPrice24H : 0

      const priceChangeUSD = priceUSD > 0 && priceUSDOneDay > 0 ? getPercentChange(Number(priceUSD.toString()), Number(priceUSDOneDay.toString())) : 0
      if (oneDayVolumeUSD < 0.0001) {
        oneDayVolumeUSD = 0
      }
      if (priceUSD < 0.000001) {
        priceUSD = 0
      }
      return {
        id: address,
        name: formatTokenName(address, v1Current && v1Current.name ? v1Current.name : ''),
        symbol: formatTokenSymbol(address, v1Current && v1Current.symbol ? v1Current.symbol : ''),
        decimals: v1Current && v1Current.decimals ? v1Current.decimals : 18,
        oneDayVolumeUSD,
        twoDayVolumeUSD,
        volumeChangeUSD,
        oneDayTxns,
        twoDayTxns,
        txnChange,
        totalLiquidityUSD: tvlUSD,
        tvlUSDOneDay,
        liquidityChangeUSD: tvlUSDChange,
        priceUSD,
        priceChangeUSD,
      }
    })

    return v1Formatted
      .sort((a, b) => {
        return b.totalLiquidityUSD - a.totalLiquidityUSD
      })
      .reduce((acc, token) => {
        return { ...acc, [token.id]: token }
      }, {})
  } catch (err) {
    console.log('get v1 top tokens :>> ', err)
  }
}

export async function getTopTokensFusion(chainId, bnbPrice, bnbPrice24H, oneDayBlock, twoDayBlock, count = 500) {
  try {
    const fusionTopTokensIds = await fusionClient[chainId].query({
      query: TOP_TOKENS_V3(count),
      fetchPolicy: 'network-only',
    })
    const fusionTokenAddresses = fusionTopTokensIds.data.tokens.map((el) => el.id)
    const [tokensCurrent, tokens24, tokens48] = await Promise.all([
      fetchTokensByTimeFusion(undefined, fusionTokenAddresses, chainId),
      fetchTokensByTimeFusion(oneDayBlock.number, fusionTokenAddresses, chainId),
      fetchTokensByTimeFusion(twoDayBlock.number, fusionTokenAddresses, chainId),
    ])
    const parsedTokens = parseTokensData(tokensCurrent)
    const parsedTokens24 = parseTokensData(tokens24)
    const parsedTokens48 = parseTokensData(tokens48)

    const fusionFormatted = fusionTokenAddresses.map((address) => {
      const current = parsedTokens[address]
      const oneDay = parsedTokens24[address]
      const twoDay = parsedTokens48[address]

      const manageUntrackedVolume = current ? (+current.volumeUSD <= 1 ? 'untrackedVolumeUSD' : 'volumeUSD') : ''
      const manageUntrackedTVL = current ? (+current.totalValueLockedUSD <= 1 ? 'totalValueLockedUSDUntracked' : 'totalValueLockedUSD') : ''

      let oneDayVolumeUSD =
        Number(current && current[manageUntrackedVolume] ? current[manageUntrackedVolume] : 0) -
        Number(oneDay && oneDay[manageUntrackedVolume] ? oneDay[manageUntrackedVolume] : 0)
      let twoDayVolumeUSD =
        Number(oneDay && oneDay[manageUntrackedVolume] ? oneDay[manageUntrackedVolume] : 0) -
        Number(twoDay && twoDay[manageUntrackedVolume] ? twoDay[manageUntrackedVolume] : 0)
      const volumeChangeUSD = getPercentChange(oneDayVolumeUSD, twoDayVolumeUSD)

      let oneDayTxns = Number(current && current.txCount ? current.txCount : 0) - Number(oneDay && oneDay.txCount ? oneDay.txCount : 0)
      let twoDayTxns = Number(oneDay && oneDay.txCount ? oneDay.txCount : 0) - Number(twoDay && twoDay.txCount ? twoDay.txCount : 0)
      const txnChange = getPercentChange(oneDayTxns, twoDayTxns)

      const tvlUSD = current ? parseFloat(current[manageUntrackedTVL]) : 0
      const tvlUSDOneDay = oneDay ? parseFloat(oneDay[manageUntrackedTVL]) : 0
      const tvlUSDChange = getPercentChange(tvlUSD, tvlUSDOneDay)
      let priceUSD = current ? parseFloat(current.derivedBnb) * bnbPrice : 0
      const priceUSDOneDay = oneDay ? parseFloat(oneDay.derivedBnb) * bnbPrice24H : 0

      const priceChangeUSD = priceUSD > 0 && priceUSDOneDay > 0 ? getPercentChange(Number(priceUSD.toString()), Number(priceUSDOneDay.toString())) : 0
      if (oneDayVolumeUSD < 0.0001) {
        oneDayVolumeUSD = 0
      }
      if (priceUSD < 0.000001) {
        priceUSD = 0
      }
      return {
        id: address,
        name: formatTokenName(address, current && current.name ? current.name : ''),
        symbol: formatTokenSymbol(address, current && current.symbol ? current.symbol : ''),
        decimals: current && current.decimals ? current.decimals : 18,
        oneDayVolumeUSD,
        twoDayVolumeUSD,
        volumeChangeUSD,
        oneDayTxns,
        twoDayTxns,
        txnChange,
        totalLiquidityUSD: tvlUSD,
        tvlUSDOneDay,
        liquidityChangeUSD: tvlUSDChange,
        priceUSD,
        priceChangeUSD,
      }
    })

    return fusionFormatted
      .sort((a, b) => {
        return b.totalLiquidityUSD - a.totalLiquidityUSD
      })
      .reduce((acc, token) => {
        return { ...acc, [token.id]: token }
      }, {})
  } catch (err) {
    console.log('get fusion top tokens :>> ', err)
  }
}

const getTokenChartDataFusion = async (tokenAddress, startTime, chainId) => {
  let data = []
  const utcEndTime = dayjs.utc()
  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      const result = await fusionClient[chainId].query({
        query: TOKEN_CHART_V3,
        variables: {
          startTime,
          tokenAddr: tokenAddress.toLowerCase(),
          skip,
        },
        fetchPolicy: 'network-only',
      })
      if (result.data.tokenDayDatas.length < 100) {
        allFound = true
      }
      skip += 100
      data = data.concat(result.data.tokenDayDatas)
    }

    const dayIndexSet = new Set()
    const dayIndexArray = []
    const oneDay = getSecondsOneDay()

    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolumeUSD = Number(dayData.volumeUSD)
      dayData.totalLiquidityUSD = Number(dayData.totalValueLockedUSD)
    })

    // fill in empty days
    let timestamp = data[0] && data[0].date ? data[0].date : startTime
    let latestLiquidityUSD = data[0] && data[0].totalValueLockedUSD
    let latestPriceUSD = data[0] && data[0].priceUSD
    let index = 1
    while (timestamp < utcEndTime.startOf('minute').unix() - oneDay) {
      const nextDay = timestamp + oneDay
      const currentDayIndex = (nextDay / oneDay).toFixed(0)
      if (!dayIndexSet.has(currentDayIndex)) {
        data.push({
          date: nextDay,
          dayString: nextDay,
          dailyVolumeUSD: 0,
          priceUSD: latestPriceUSD,
          totalLiquidityUSD: latestLiquidityUSD,
        })
      } else {
        latestLiquidityUSD = dayIndexArray[index].totalValueLockedUSD
        latestPriceUSD = dayIndexArray[index].priceUSD
        index += 1
      }
      timestamp = nextDay
    }
    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  } catch (e) {
    console.log(e)
  }
  return data
}

export const getTokenChartDataTotal = async (tokenAddress, chainId) => {
  const utcEndTime = dayjs.utc()
  const utcStartTime = utcEndTime.subtract(1, 'month')
  const startTime = utcStartTime.startOf('minute').unix() - 1
  const [v1Data, fusionData] = await Promise.all([
    getTokenChartDataV1(tokenAddress, startTime, chainId),
    getTokenChartDataFusion(tokenAddress, startTime, chainId),
  ])
  const totalData = fusionData.map((item) => {
    const v1Item = v1Data.find((v2Item) => v2Item.date === item.date)
    return {
      ...item,
      dailyVolumeUSD: (item && item.dailyVolumeUSD ? Number(item.dailyVolumeUSD) : 0) + (v1Item && v1Item.dailyVolumeUSD ? Number(v1Item.dailyVolumeUSD) : 0),
      priceUSD: item && item.priceUSD ? Number(item.priceUSD) : v1Item && v1Item.priceUSD ? Number(v1Item.priceUSD) : 0,
      totalLiquidityUSD:
        (item && item.totalLiquidityUSD ? Number(item.totalLiquidityUSD) : 0) + (v1Item && v1Item.totalLiquidityUSD ? Number(v1Item.totalLiquidityUSD) : 0),
    }
  })
  return {
    [ANALYTIC_VERSIONS.v1]: v1Data,
    [ANALYTIC_VERSIONS.fusion]: fusionData,
    [ANALYTIC_VERSIONS.total]: totalData,
  }
}

export async function getTopPairsTotal(count, chainId) {
  try {
    const [v1Pairs, fusionPairs] = await Promise.all([getTopPairsV1(count, chainId), getTopPairsFusion(count, chainId)])

    return v1Pairs
      .concat(fusionPairs)
      .filter((item) => !!item)
      .sort((a, b) => {
        return b.totalValueLockedUSD - a.totalValueLockedUSD
      })
  } catch (err) {
    console.log(err)
  }
}

async function getTopPairsFusion(count, chainId) {
  try {
    const utcCurrentTime = dayjs()

    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    const utcOneWeekBack = utcCurrentTime.subtract(1, 'week').unix()

    const [oneDayBlock, oneWeekBlock] = await getBlocksFromTimestamps([utcOneDayBack, utcOneWeekBack], chainId)

    const fusionPairsIds = await fusionClient[chainId].query({
      query: TOP_POOLS_V3(count),
      fetchPolicy: 'network-only',
    })

    const fusionPairsAddresses = fusionPairsIds.data.pools.map((el) => el.id)
    const [pairsCurrent, pairs24, pairsWeek] = await Promise.all([
      fetchPairsByTime(undefined, fusionPairsAddresses, chainId),
      fetchPairsByTime(oneDayBlock.number, fusionPairsAddresses, chainId),
      fetchPairsByTime(oneWeekBlock.number, fusionPairsAddresses, chainId),
    ])

    const parsedPairs = parsePairsData(pairsCurrent)
    const parsedPairs24 = parsePairsData(pairs24)
    const parsedPairsWeek = parsePairsData(pairsWeek)

    const formattedV3 = fusionPairsAddresses.map((address) => {
      const current = parsedPairs[address]
      const oneDay = parsedPairs24[address]
      const week = parsedPairsWeek[address]

      const manageUntrackedVolume = current && current.volumeUSD && Number(current.volumeUSD) <= 1 ? 'untrackedVolumeUSD' : 'volumeUSD'

      const manageUntrackedTVL =
        current && current.totalValueLockedUSD && Number(current.totalValueLockedUSD) <= 1 ? 'totalValueLockedUSDUntracked' : 'totalValueLockedUSD'

      const v3CurrentVolumeUSD = current && current[manageUntrackedVolume] ? Number(current[manageUntrackedVolume]) : 0

      const v3OneDayVolumeUSD = oneDay && oneDay[manageUntrackedVolume] ? Number(oneDay[manageUntrackedVolume]) : 0

      const v3WeekVolumeUSD = week && week[manageUntrackedVolume] ? Number(week[manageUntrackedVolume]) : 0

      const oneDayVolumeUSD = v3CurrentVolumeUSD - v3OneDayVolumeUSD

      const oneWeekVolumeUSD = v3CurrentVolumeUSD - v3WeekVolumeUSD

      const currentFees = current && current.feesUSD ? Number(current.feesUSD) : 0

      const oneDayFees = oneDay && oneDay.feesUSD ? Number(oneDay.feesUSD) : 0

      const oneWeekFees = week && week.feesUSD ? Number(week.feesUSD) : 0

      const oneDayFeesUSD = currentFees - oneDayFees

      const oneWeekFeesUSD = currentFees - oneWeekFees

      const v3CurrentTVL = current && current[manageUntrackedTVL] ? Number(current[manageUntrackedTVL]) : 0

      const v3OneDayTVL = oneDay && oneDay[manageUntrackedTVL] ? Number(oneDay[manageUntrackedTVL]) : 0

      const tvlUSD = v3CurrentTVL
      const tvlUSDChange = getPercentChange(tvlUSD, v3OneDayTVL)

      return current
        ? {
            isFusion: true,
            token0: current.token0,
            token1: current.token1,
            reserve0: current.totalValueLockedToken0,
            reserve1: current.totalValueLockedToken1,
            fee: current.fee,
            id: address,
            oneDayVolumeUSD,
            oneWeekVolumeUSD,
            oneDayFeesUSD,
            oneWeekFeesUSD,
            trackedReserveUSD: tvlUSD,
            tvlUSDChange,
            totalValueLockedUSD: tvlUSD,
          }
        : undefined
    })

    return formattedV3
  } catch (err) {
    console.log(err)
  }
}

export async function getTopPairsV1(count, chainId) {
  let data = []
  try {
    const utcCurrentTime = dayjs()

    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    const utcTwoDayBack = utcCurrentTime.subtract(2, 'day').unix()
    const utcOneWeekBack = utcCurrentTime.subtract(1, 'week').unix()

    const [oneDayBlock, twoDayBlock, oneWeekBlock] = await getBlocksFromTimestamps([utcOneDayBack, utcTwoDayBack, utcOneWeekBack], chainId)

    const v1PairIds = await v1Client[chainId].query({
      query: PAIRS_CURRENT_QUICK(count),
      fetchPolicy: 'network-only',
    })

    const v1PairsAddresses = v1PairIds.data.pairs.map((el) => el.id)

    const [v1PairsResult, v1OneDayResult, v1TwoDayResult, v1OneWeekResult] = await Promise.all([
      v1Client[chainId].query({
        query: PAIRS_BULK1,
        variables: {
          allPairs: v1PairsAddresses,
        },
        fetchPolicy: 'network-only',
      }),
      v1Client[chainId].query({
        query: PAIRS_HISTORICAL_BULK(oneDayBlock?.number, v1PairsAddresses),
        fetchPolicy: 'network-only',
      }),
      v1Client[chainId].query({
        query: PAIRS_HISTORICAL_BULK(twoDayBlock?.number, v1PairsAddresses),
        fetchPolicy: 'network-only',
      }),
      v1Client[chainId].query({
        query: PAIRS_HISTORICAL_BULK(oneWeekBlock?.number, v1PairsAddresses),
        fetchPolicy: 'network-only',
      }),
    ])
    const v1PairsCurrent =
      v1PairsResult && v1PairsResult.data && v1PairsResult.data.pairs && v1PairsResult.data.pairs.length > 0 ? v1PairsResult.data.pairs : []
    const v1PairsOneDay =
      v1OneDayResult && v1OneDayResult.data && v1OneDayResult.data.pairs && v1OneDayResult.data.pairs.length > 0 ? v1OneDayResult.data.pairs : []
    const v1PairsTwoDay =
      v1TwoDayResult && v1TwoDayResult.data && v1TwoDayResult.data.pairs && v1TwoDayResult.data.pairs.length > 0 ? v1TwoDayResult.data.pairs : []
    const v1PairsOneWeek =
      v1OneWeekResult && v1OneWeekResult.data && v1OneWeekResult.data.pairs && v1OneWeekResult.data.pairs.length > 0 ? v1OneWeekResult.data.pairs : []

    const parsedPairsV2 = parsePairsData(v1PairsCurrent)
    const parsedPairs24V2 = parsePairsData(v1PairsOneDay)
    const parsedPairs48V2 = parsePairsData(v1PairsTwoDay)
    const parsedPairsWeekV2 = parsePairsData(v1PairsOneWeek)

    data = v1PairsAddresses.map((address) => {
      const v2Current = parsedPairsV2[address]
      const v2OneDay = parsedPairs24V2[address]
      const v2TwoDay = parsedPairs48V2[address]
      const v2OneWeek = parsedPairsWeekV2[address]

      const v2CurrentVolumeUSD = v2Current ? v2Current.volumeUSD : 0
      const v2OneDayVolumeUSD = v2OneDay ? v2OneDay.volumeUSD : 0
      const v2TwoDayVolumeUSD = v2TwoDay ? v2TwoDay.volumeUSD : 0
      const v2WeekVolumeUSD = v2OneWeek ? v2OneWeek.volumeUSD : 0
      const oneDayVolumeUSD = v2CurrentVolumeUSD - v2OneDayVolumeUSD
      const prevVolumeUSD = v2OneDayVolumeUSD - v2TwoDayVolumeUSD

      const oneWeekVolumeUSD = v2CurrentVolumeUSD - v2WeekVolumeUSD

      const v2CurrentTVL = v2Current
        ? v2Current.trackedReserveUSD
          ? Number(v2Current.trackedReserveUSD)
          : v2Current.reserveUSD
          ? Number(v2Current.reserveUSD)
          : 0
        : 0

      const v2OneDayTVL = v2OneDay
        ? v2OneDay.trackedReserveUSD
          ? Number(v2OneDay.trackedReserveUSD)
          : v2OneDay.reserveUSD
          ? Number(v2OneDay.reserveUSD)
          : 0
        : 0

      const tvlUSD = v2CurrentTVL
      const tvlUSDChange = getPercentChange(tvlUSD, v2OneDayTVL)

      return v2Current
        ? {
            isFusion: false,
            token0: v2Current.token0,
            token1: v2Current.token1,
            reserve0: v2Current.reserve0,
            reserve1: v2Current.reserve1,
            oneDayFeesUSD: oneDayVolumeUSD * (v2Current.isStable ? STABLE_FEE : VOLATILE_FEE),
            oneWeekFeesUSD: oneWeekVolumeUSD * (v2Current.isStable ? STABLE_FEE : VOLATILE_FEE),
            prevFeesUSD: prevVolumeUSD * (v2Current.isStable ? STABLE_FEE : VOLATILE_FEE),
            isStable: v2Current.isStable,
            id: address,
            oneDayVolumeUSD,
            oneWeekVolumeUSD,
            trackedReserveUSD: tvlUSD,
            tvlUSDChange,
            totalValueLockedUSD: tvlUSD,
          }
        : undefined
    })
  } catch (err) {
    console.log('top pairs v1 :>> ', err)
  }
  return data
}

export async function getTopPairsTotalByToken(tokenAddress, chainId) {
  try {
    const [fusionPairsAddresses, v1PairsAddresses] = await Promise.all([getTokenPairsFusion(tokenAddress, chainId), getTokenPairsV1(tokenAddress, chainId)])
    return {
      [ANALYTIC_VERSIONS.v1]: v1PairsAddresses,
      [ANALYTIC_VERSIONS.fusion]: fusionPairsAddresses,
      [ANALYTIC_VERSIONS.total]: v1PairsAddresses.concat(fusionPairsAddresses),
    }
  } catch (err) {
    console.error(err)
  }
}

export const getPairChartDataFusion = async (pairAddress, chainId) => {
  let data = []
  const utcEndTime = dayjs.utc()
  const utcStartTime = utcEndTime.subtract(1, 'month').startOf('minute')
  const startTime = utcStartTime.unix() - 1
  let allFound = false
  let skip = 0
  try {
    while (!allFound) {
      const result = await fusionClient[chainId].query({
        query: PAIR_CHART_V3,
        variables: {
          startTime,
          pairAddress,
          skip,
        },
        fetchPolicy: 'cache-first',
      })
      skip += 1000
      data = data.concat(result.data.poolDayDatas)
      if (result.data.poolDayDatas.length < 1000) {
        allFound = true
      }
    }

    const dayIndexSet = new Set()
    const dayIndexArray = []
    const oneDay = 24 * 60 * 60
    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolumeUSD = Number(dayData.volumeUSD)
      dayData.reserveUSD = Number(dayData.tvlUSD)
      dayData.feesUSD = Number(dayData.feesUSD)
      // dayData.token0Price = dayData.token0Price;
      // dayData.token1Price = dayData.token1Price;
    })

    if (data[0]) {
      // fill in empty days
      let timestamp = data[0].date ? data[0].date : startTime
      let latestLiquidityUSD = data[0].tvlUSD
      let latestFeesUSD = data[0].feesUSD
      let latestToken0Price = data[0].token0Price
      let latestToken1Price = data[0].token1Price
      let index = 1
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        const currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dayString: nextDay,
            dailyVolumeUSD: 0,
            reserveUSD: latestLiquidityUSD,
            feesUSD: latestFeesUSD,
            token0Price: latestToken0Price,
            token1Price: latestToken1Price,
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].tvlUSD
          latestFeesUSD = dayIndexArray[index].feesUSD
          latestToken0Price = dayIndexArray[index].token0Price
          latestToken1Price = dayIndexArray[index].token1Price
          index += 1
        }
        timestamp = nextDay
      }
    }

    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  } catch (e) {
    console.log(e)
  }
  return data
}

export const getPairTransactionsV1 = async (pairAddress, chainId) => {
  const transactions = {}
  let newTxns = []

  try {
    let result = await v1Client[chainId].query({
      query: FILTERED_TRANSACTIONS,
      variables: {
        allPairs: [pairAddress],
      },
      fetchPolicy: 'no-cache',
    })
    transactions.mints = result.data.mints
    transactions.burns = result.data.burns
    transactions.swaps = result.data.swaps
    if (transactions.mints.length > 0) {
      transactions.mints.map((mint) => {
        let newTxn = {}
        newTxn.hash = mint.transaction.id
        newTxn.timestamp = mint.transaction.timestamp
        newTxn.type = TXN_TYPE.ADD
        newTxn.token0Amount = mint.amount0
        newTxn.token1Amount = mint.amount1
        newTxn.account = mint.to
        newTxn.token0Symbol = updateNameData(mint.pair).token0.symbol
        newTxn.token1Symbol = updateNameData(mint.pair).token1.symbol
        newTxn.amountUSD = mint.amountUSD
        return newTxns.push(newTxn)
      })
    }
    if (transactions.burns.length > 0) {
      transactions.burns.map((burn) => {
        let newTxn = {}
        newTxn.hash = burn.transaction.id
        newTxn.timestamp = burn.transaction.timestamp
        newTxn.type = TXN_TYPE.REMOVE
        newTxn.token0Amount = burn.amount0
        newTxn.token1Amount = burn.amount1
        newTxn.account = burn.sender
        newTxn.token0Symbol = updateNameData(burn.pair).token0.symbol
        newTxn.token1Symbol = updateNameData(burn.pair).token1.symbol
        newTxn.amountUSD = burn.amountUSD
        return newTxns.push(newTxn)
      })
    }
    if (transactions.swaps.length > 0) {
      transactions.swaps.map((swap) => {
        const netToken0 = swap.amount0In - swap.amount0Out
        const netToken1 = swap.amount1In - swap.amount1Out

        let newTxn = {}

        if (netToken0 < 0) {
          newTxn.token0Symbol = updateNameData(swap.pair).token0.symbol
          newTxn.token1Symbol = updateNameData(swap.pair).token1.symbol
          newTxn.token0Amount = Math.abs(netToken0)
          newTxn.token1Amount = Math.abs(netToken1)
        } else if (netToken1 < 0) {
          newTxn.token0Symbol = updateNameData(swap.pair).token1.symbol
          newTxn.token1Symbol = updateNameData(swap.pair).token0.symbol
          newTxn.token0Amount = Math.abs(netToken1)
          newTxn.token1Amount = Math.abs(netToken0)
        }

        newTxn.hash = swap.transaction.id
        newTxn.timestamp = swap.transaction.timestamp
        newTxn.type = TXN_TYPE.SWAP
        newTxn.amountUSD = swap.amountUSD
        newTxn.account = swap.to
        return newTxns.push(newTxn)
      })
    }
  } catch (e) {
    console.log(e)
  }

  return newTxns
}

export async function getPairTransactionsFusion(address, chainId) {
  let newTxns = []
  const data = await fusionClient[chainId].query({
    query: PAIR_TRANSACTIONS_v3,
    variables: {
      address,
    },
    fetchPolicy: 'cache-first',
  })

  data.data.mints.forEach((mint) => {
    let newTxn = {}
    newTxn.hash = mint.transaction.id
    newTxn.timestamp = mint.timestamp
    newTxn.type = TXN_TYPE.ADD
    newTxn.token0Amount = mint.amount0
    newTxn.token1Amount = mint.amount1
    newTxn.account = mint.origin
    newTxn.token0Symbol = formatTokenSymbol(mint.pool.token0.id, mint.pool.token0.symbol)
    newTxn.token1Symbol = formatTokenSymbol(mint.pool.token1.id, mint.pool.token1.symbol)
    newTxn.amountUSD = mint.amountUSD
    newTxns.push(newTxn)
  })
  data.data.burns.forEach((burn) => {
    let newTxn = {}
    newTxn.hash = burn.transaction.id
    newTxn.timestamp = burn.timestamp
    newTxn.type = TXN_TYPE.REMOVE
    newTxn.token0Amount = burn.amount0
    newTxn.token1Amount = burn.amount1
    newTxn.account = burn.owner
    newTxn.token0Symbol = formatTokenSymbol(burn.pool.token0.id, burn.pool.token0.symbol)
    newTxn.token1Symbol = formatTokenSymbol(burn.pool.token1.id, burn.pool.token1.symbol)
    newTxn.amountUSD = burn.amountUSD
    newTxns.push(newTxn)
  })

  data.data.swaps.forEach((swap) => {
    let newTxn = {}
    newTxn.hash = swap.transaction.id
    newTxn.timestamp = swap.timestamp
    newTxn.type = TXN_TYPE.SWAP
    newTxn.account = swap.origin

    if (parseFloat(swap.amount0) < 0) {
      newTxn.token0Amount = swap.amount0
      newTxn.token1Amount = swap.amount1
      newTxn.token0Symbol = formatTokenSymbol(swap.pool.token0.id, swap.pool.token0.symbol)
      newTxn.token1Symbol = formatTokenSymbol(swap.pool.token1.id, swap.pool.token1.symbol)
    } else {
      newTxn.token1Amount = swap.amount0
      newTxn.token0Amount = swap.amount1
      newTxn.token1Symbol = formatTokenSymbol(swap.pool.token0.id, swap.pool.token0.symbol)
      newTxn.token0Symbol = formatTokenSymbol(swap.pool.token1.id, swap.pool.token1.symbol)
    }
    newTxn.amountUSD = swap.amountUSD
    newTxns.push(newTxn)
  })

  return newTxns
}

// Token Helpers

async function fetchTokensByTimeFusion(blockNumber, tokenAddresses, chainId) {
  try {
    const tokens = await fusionClient[chainId].query({
      query: TOKENS_FROM_ADDRESSES_V3(blockNumber, tokenAddresses),
      fetchPolicy: 'network-only',
    })

    return tokens.data.tokens
  } catch (err) {
    console.error('Tokens fetching by time in v3 ' + err)
  }
}

async function fetchTokensByTimeV1(blockNumber, tokenAddresses, chainId) {
  let data
  try {
    const tokens = await v1Client[chainId].query({
      query: TOKENS_FROM_ADDRESSES_V2(blockNumber, tokenAddresses),
      fetchPolicy: 'network-only',
    })

    data = tokens.data.tokens
  } catch (err) {
    console.error('Tokens fetching by time in v2 ' + err)
  }
  return data
}

function parseTokensData(tokenData) {
  return tokenData
    ? tokenData.reduce((acc, tokenData) => {
        acc[tokenData.id] = tokenData
        return acc
      }, {})
    : {}
}

const WETH_ADDRESSES = ['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c']

function formatTokenSymbol(address, symbol) {
  if (WETH_ADDRESSES.includes(address)) {
    return 'BNB'
  } else if (symbol.toLowerCase() === 'mimatic') {
    return 'MAI'
  } else if (symbol.toLowerCase() === 'amaticc') {
    return 'ankrMATIC'
  }
  return symbol
}

export function formatTokenName(address, name) {
  if (WETH_ADDRESSES.includes(address)) {
    return 'Bnb'
  }
  return name
}

// Pair helpers

async function fetchPairsByTime(blockNumber, tokenAddresses, chainId) {
  try {
    const pairs = await fusionClient[chainId].query({
      query: PAIRS_FROM_ADDRESSES_V3(blockNumber, tokenAddresses),
      fetchPolicy: 'network-only',
    })

    return pairs.data.pools
  } catch (err) {
    console.error('Pairs by time fetching ' + err)
  }
}

function parsePairsData(pairData) {
  return pairData
    ? pairData.reduce((accum, poolData) => {
        accum[poolData.id] = poolData
        return accum
      }, {})
    : {}
}

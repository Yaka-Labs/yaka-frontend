import { isAddress } from '@ethersproject/address'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { Percent, JSBI } from 'thena-sdk-core'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from 'ethers/lib/utils'
import v1Client, { blockClient, fusionClient } from 'apollo/client'
import { GET_BLOCK, GLOBAL_DATA, GLOBAL_CHART, GET_BLOCKS, TOKEN_CHART, TOKEN_DATA2, PAIR_CHART } from 'apollo/queries'
import { TOP_POOLS_FUSION_TOKEN } from 'apollo/fusionQueries'
import { ANALYTIC_CHART, STABLE_FEE, VOLATILE_FEE, TIMEFRAME_OPTIONS } from 'config/constants'

dayjs.extend(utc)
dayjs.extend(weekOfYear)

const TOKEN_OVERRIDES = {}

export function getTimeframe(timeWindow) {
  const utcEndTime = dayjs.utc()
  // based on window, get starttime
  let utcStartTime
  switch (timeWindow) {
    case TIMEFRAME_OPTIONS.WEEK:
      utcStartTime = utcEndTime.subtract(1, 'week').endOf('day').unix() - 1
      break
    case TIMEFRAME_OPTIONS.MONTH:
      utcStartTime = utcEndTime.subtract(1, 'month').endOf('day').unix() - 1
      break
    case TIMEFRAME_OPTIONS.ALL_TIME:
      utcStartTime = utcEndTime.subtract(1, 'year').endOf('day').unix() - 1
      break
    default:
      utcStartTime = utcEndTime.subtract(1, 'year').startOf('year').unix() - 1
      break
  }
  return utcStartTime
}

export async function getBlockFromTimestamp(timestamp, chainId) {
  const result = await blockClient[chainId].query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600,
    },
    fetchPolicy: 'network-only',
  })
  return result?.data?.blocks?.[0]?.number
}

export function formatCompact(unformatted, decimals = 18, maximumFractionDigits = 3, maxPrecision = 4) {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits,
  })

  if (!unformatted) return '0'

  if (unformatted === Infinity) return '∞'

  let formatted = Number(unformatted)

  if (unformatted instanceof BigNumber) {
    formatted = Number(formatUnits(unformatted.toString(), decimals))
  }

  return formatter.format(Number(formatted.toPrecision(maxPrecision)))
}

export const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange = ((valueNow - value24HoursAgo) / value24HoursAgo) * 100
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0
  }
  return adjustedPercentChange
}

export async function splitQuery(query, localClient, vars, list, skipCount = 100) {
  let fetchedData = {}
  let allFound = false
  let skip = 0

  while (!allFound) {
    let end = list.length
    if (skip + skipCount < list.length) {
      end = skip + skipCount
    }
    const sliced = list.slice(skip, end)
    const queryStr = query(...vars, sliced)
    const result = await localClient.query({
      query: queryStr,
      fetchPolicy: 'network-only',
    })
    fetchedData = {
      ...fetchedData,
      ...result.data,
    }
    if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
      allFound = true
    } else {
      skip += skipCount
    }
  }

  return fetchedData
}

export async function getBlocksFromTimestamps(timestamps, chainId, skipCount = 500) {
  if (timestamps?.length === 0) {
    return []
  }

  if (!blockClient[chainId]) {
    console.log('chainId :>> ', chainId)
    console.log('--------------------- client nothing ----------------------')
  }
  const fetchedData = await splitQuery(GET_BLOCKS, blockClient[chainId], [], timestamps, skipCount)

  const blocks = []
  if (fetchedData) {
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: Number(fetchedData[t][0].number),
        })
      }
    }
  }

  return blocks
}

export const get2DayPercentChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
  // get volume info for both 24 hour periods
  const currentChange = valueNow - value24HoursAgo
  const previousChange = value24HoursAgo - value48HoursAgo

  const adjustedPercentChange = ((currentChange - previousChange) / previousChange) * 100

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0]
  }
  return [currentChange, adjustedPercentChange]
}

export const getTokenPairsV1 = async (tokenAddress, chainId) => {
  try {
    // fetch all current and historical data
    const result = await v1Client[chainId].query({
      query: TOKEN_DATA2(tokenAddress),
      fetchPolicy: 'network-only',
    })
    return result.data?.pairs.map((pair) => pair.id)
  } catch (e) {
    console.log(e)
  }
}

export const getTokenPairsFusion = async (tokenAddress, chainId) => {
  try {
    // fetch all current and historical data
    const result = await fusionClient[chainId].query({
      query: TOP_POOLS_FUSION_TOKEN(tokenAddress),
      fetchPolicy: 'network-only',
    })
    return result.data?.pools.map((pair) => pair.id)
  } catch (e) {
    console.log(e)
  }
}

export function getSecondsOneDay() {
  return 60 * 60 * 24
}

export const getTokenChartDataV1 = async (tokenAddress, startTime, chainId) => {
  let data = []
  const utcEndTime = dayjs.utc()
  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      const result = await v1Client[chainId].query({
        query: TOKEN_CHART,
        variables: {
          startTime,
          tokenAddr: tokenAddress,
          skip,
        },
        fetchPolicy: 'network-only',
      })
      if (result.data.tokenDayDatas.length < 1000) {
        allFound = true
      }
      skip += 1000
      data = data.concat(result.data.tokenDayDatas)
    }

    const dayIndexSet = new Set()
    const dayIndexArray = []
    const oneDay = getSecondsOneDay()
    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolumeUSD = Number(dayData.dailyVolumeUSD)
    })

    // fill in empty days
    let timestamp = data[0] && data[0].date ? data[0].date : startTime
    let latestLiquidityUSD = data[0] && data[0].totalLiquidityUSD
    let latestPriceUSD = data[0] && data[0].priceUSD
    // let latestPairDatas = data[0] && data[0].mostLiquidPairs
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
          // mostLiquidPairs: latestPairDatas,
        })
      } else {
        latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD
        latestPriceUSD = dayIndexArray[index].priceUSD
        // latestPairDatas = dayIndexArray[index].mostLiquidPairs
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

export const getPairChartDataV1 = async (pairAddress, isStable, chainId) => {
  let data = []
  const utcEndTime = dayjs.utc()
  const utcStartTime = utcEndTime.subtract(1, 'month').startOf('minute')
  const startTime = utcStartTime.unix() - 1
  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      const result = await v1Client[chainId].query({
        query: PAIR_CHART,
        variables: {
          startTime,
          pairAddress,
          skip,
        },
        fetchPolicy: 'cache-first',
      })
      skip += 1000
      data = data.concat(result.data.pairDayDatas)
      if (result.data.pairDayDatas.length < 1000) {
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
      dayData.dailyVolumeUSD = Number(dayData.dailyVolumeUSD)
      dayData.reserveUSD = Number(dayData.reserveUSD)
      dayData.feesUSD = Number(dayData.dailyVolumeUSD) * (isStable ? STABLE_FEE : VOLATILE_FEE)
    })

    if (data[0]) {
      // fill in empty days
      let timestamp = data[0].date ? data[0].date : startTime
      let latestLiquidityUSD = data[0].reserveUSD
      let index = 1
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        const currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dayString: nextDay,
            dailyVolumeUSD: 0,
            feesUSD: 0,
            reserveUSD: latestLiquidityUSD,
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].reserveUSD
          index += 1
        }
        timestamp = nextDay
      }
    }

    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  } catch (e) {
    console.log('chart data error :>> ', e)
  }

  return data
}

export function updateNameData(data) {
  if (data?.token0?.id && Object.keys(TOKEN_OVERRIDES).includes(data.token0.id)) {
    data.token0.name = TOKEN_OVERRIDES[data.token0.id].name
    data.token0.symbol = TOKEN_OVERRIDES[data.token0.id].symbol
  }

  if (data?.token1?.id && Object.keys(TOKEN_OVERRIDES).includes(data.token1.id)) {
    data.token1.name = TOKEN_OVERRIDES[data.token1.id].name
    data.token1.symbol = TOKEN_OVERRIDES[data.token1.id].symbol
  }

  return data
}

export async function getGlobalDataV1(chainId) {
  // data for each day , historic data used for % changes
  let current = {}
  let oneDayData = {}
  let twoDayData = {}
  let data = {}

  try {
    // get timestamps for the days
    const utcCurrentTime = dayjs()
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').unix()

    // get the blocks needed for time travel queries
    let [oneDayBlock, twoDayBlock] = await getBlocksFromTimestamps([utcOneDayBack, utcTwoDaysBack], chainId)

    // fetch the global data
    const [result, oneDayResult, twoDayResult] = await Promise.all([
      v1Client[chainId].query({
        query: GLOBAL_DATA(),
        fetchPolicy: 'network-only',
      }),
      v1Client[chainId].query({
        query: GLOBAL_DATA(oneDayBlock?.number),
        fetchPolicy: 'network-only',
      }),
      v1Client[chainId].query({
        query: GLOBAL_DATA(twoDayBlock?.number),
        fetchPolicy: 'network-only',
      }),
    ])
    current = result.data.factories[0]
    oneDayData = oneDayResult.data.factories[0]
    twoDayData = twoDayResult.data.factories[0]
    const liquidityChangeUSD = getPercentChange(current.totalLiquidityUSD, oneDayData.totalLiquidityUSD)
    const volumeUSD = Number(current.totalVolumeUSD) - Number(oneDayData.totalVolumeUSD)
    const prevVolumeUSD = Number(oneDayData.totalVolumeUSD) - Number(twoDayData.totalVolumeUSD)
    const volumeChange = getPercentChange(volumeUSD, prevVolumeUSD)

    data = {
      totalLiquidityUSD: Number(current.totalLiquidityUSD),
      prevTotalLiquidityUSD: Number(oneDayData.totalLiquidityUSD),
      liquidityChangeUSD,
      volumeUSD,
      prevVolumeUSD,
      volumeChange,
      feesUSD: 0,
      prevFeesUSD: 0,
      feesChange: 0,
    }
  } catch (e) {
    console.log('glabl data :>> ', e)

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

export const getChartDataV1 = async (oldestDateToFetch, chainId) => {
  let data = []
  const weeklyData = []
  const utcEndTime = dayjs.utc()
  let skip = 0
  let allFound = false

  try {
    while (!allFound) {
      const result = await v1Client[chainId].query({
        query: GLOBAL_CHART,
        variables: {
          startTime: oldestDateToFetch,
          skip,
        },
        fetchPolicy: 'network-only',
      })
      skip += 1000
      data = data.concat(
        result.data.dayDatas.map((item) => {
          return { ...item, dailyVolumeUSD: Number(item.dailyVolumeUSD) }
        }),
      )
      if (result.data.dayDatas.length < 1000) {
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
      })

      // fill in empty days ( there will be no day datas if no trades made that day )
      let timestamp = data[0].date ? data[0].date : oldestDateToFetch
      let latestLiquidityUSD = data[0].totalLiquidityUSD
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
          latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD
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
    data.forEach((entry) => {
      const week = dayjs.utc(dayjs.unix(entry.date)).week()
      if (week !== currentWeek) {
        currentWeek = week
        startIndexWeekly++
      }
      weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {}
      weeklyData[startIndexWeekly].date = entry.date
      weeklyData[startIndexWeekly].weeklyVolumeUSD = (weeklyData[startIndexWeekly].weeklyVolumeUSD ?? 0) + entry.dailyVolumeUSD
    })
  } catch (e) {
    console.log(e)
  }
  return {
    daily: data,
    weekly: weeklyData,
  }
}

export function calculateSlippageAmount(value, slippage) {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

export const ExplorerDataType = {
  TRANSACTION: 'transaction',
  TOKEN: 'token',
  ADDRESS: 'address',
  BLOCK: 'block',
}

export function basisPointsToPercent(num) {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export const shortenTx = (tx) => {
  if (tx.length) {
    const txLength = tx.length
    const first = tx.slice(0, 6)
    const last = tx.slice(txLength - 4, txLength)
    return `${first}...${last}`
  }
  return ''
}

export function formatDateFromTimeStamp(timestamp, format, addedDay = 0) {
  return dayjs.unix(timestamp).add(addedDay, 'day').utc().format(format)
}

export function getFormattedPrice(price) {
  if (price < 0.001 && price > 0) {
    return '<0.001'
  } else if (price > -0.001 && price < 0) {
    return '>-0.001'
  } else {
    const beforeSign = price > 0 ? '+' : ''
    return beforeSign + price.toLocaleString('us')
  }
}

export function getFormattedPercent(percent) {
  if (percent < 0.001 && percent > 0) {
    return '<+0.001%'
  } else if (percent > -0.001 && percent < 0) {
    return '>-0.001%'
  } else if (percent > 10000) {
    return '>+10000%'
  } else if (percent < -10000) {
    return '<-10000%'
  } else {
    const beforeSign = percent > 0 ? '+' : ''
    return beforeSign + percent.toLocaleString('us') + '%'
  }
}

// set different bg and text colors for price percent badge according to price.
export function getPriceClass(price, transparent = false) {
  if (price > 0) {
    return transparent ? 'text-success' : 'bg-successLight text-success'
  } else if (price === 0) {
    return transparent ? 'text-hint' : 'bg-gray1 text-hint'
  } else {
    return transparent ? 'text-error' : 'bg-errorLight text-error'
  }
}

export function getDaysCurrentYear() {
  const year = Number(dayjs().format('YYYY'))
  return (year % 4 === 0 && year % 100 > 0) || year % 400 === 0 ? 366 : 365
}

export function getChartDates(chartData /* , durationIndex */) {
  if (chartData) {
    const dates = []
    chartData.forEach((value, ind) => {
      const month = formatDateFromTimeStamp(Number(value.date), 'MMM')
      const monthLastDate = ind > 0 ? formatDateFromTimeStamp(Number(chartData[ind - 1].date), 'MMM') : ''
      if (monthLastDate !== month) {
        dates.push(month)
      }
      const durationIndex = ANALYTIC_CHART.ONE_MONTH_CHART
      if (durationIndex === ANALYTIC_CHART.ONE_MONTH_CHART || durationIndex === ANALYTIC_CHART.THREE_MONTH_CHART) {
        const dateStr = formatDateFromTimeStamp(Number(value.date), 'D')
        if (Number(dateStr) % (durationIndex === ANALYTIC_CHART.ONE_MONTH_CHART ? 3 : 7) === 0) {
          // Select dates(one date per 3 days for 1 month chart and 7 days for 3 month chart) for x axis values of volume chart on week mode
          dates.push(dateStr)
        }
      }
    })
    return dates
  } else {
    return []
  }
}

export function getChartStartTime(durationIndex) {
  const utcEndTime = dayjs.utc()
  const months = durationIndex === ANALYTIC_CHART.SIX_MONTH_CHART ? 6 : durationIndex === ANALYTIC_CHART.THREE_MONTH_CHART ? 3 : 1
  const startTime =
    utcEndTime
      .subtract(months, durationIndex === ANALYTIC_CHART.ONE_YEAR_CHART ? 'year' : 'month')
      .endOf('day')
      .unix() - 1
  return startTime
}

export function getLimitedData(data, count) {
  const dataCount = data.length
  const newArray = []
  data.forEach((value, index) => {
    if (dataCount <= count) {
      newArray.push(value)
    } else if (index === dataCount - Math.floor((dataCount / count) * (count - newArray.length))) {
      newArray.push(value)
    }
  })
  return newArray
}

export function getYAXISValuesAnalytics(chartData) {
  if (!chartData) return
  // multiply 0.99 to the min value of chart values and 1.01 to the max value in order to show all data in graph. Without this, the scale of the graph is set strictly and some values may be hidden.
  const minValue = Math.min(...chartData) * 0.99
  const maxValue = Math.max(...chartData) * 1.01
  const step = (maxValue - minValue) / 8
  const values = []
  for (let i = 0; i < 9; i++) {
    values.push(maxValue - i * step)
  }
  return values
}

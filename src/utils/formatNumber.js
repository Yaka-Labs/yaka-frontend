import BigNumber from 'bignumber.js'
import { POOL_FILTERS } from 'config/constants'
import { getWBNBAddress } from './addressHelpers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
})

export const fromWei = (number, decimals = 18) => new BigNumber(number).div(new BigNumber(10).pow(decimals))
export const toWei = (number, decimals = 18) => new BigNumber(number).times(new BigNumber(10).pow(decimals))
export const sendValueToWei = (number, decimals = 18) => new BigNumber(number).times(new BigNumber(10).pow(decimals)).dp(0).toString(10)

export const formatNumber = (amount = null, shorted = false, fixed = 3) => {
  if (!amount || new BigNumber(amount).isZero()) return '0'
  const bigAmount = new BigNumber(amount)
  if (bigAmount.lt(new BigNumber(1).div(new BigNumber(10).pow(fixed)))) return `< ${new BigNumber(1).div(new BigNumber(10).pow(fixed)).toString(10)}`

  if (bigAmount.gt(1) && bigAmount.lt(1000)) {
    return bigAmount.dp(2).toFormat()
  }

  if (shorted) {
    if (bigAmount.gte(1e9)) {
      return bigAmount.div(1e9).dp(2).toFormat() + 'B'
    }

    if (bigAmount.gte(1e6)) {
      return bigAmount.div(1e6).dp(2).toFormat() + 'M'
    }

    if (bigAmount.gte(1e3)) {
      return bigAmount.div(1e3).dp(2).toFormat() + 'K'
    }
  }

  if (bigAmount.gte(1e3)) {
    return bigAmount.dp(0).toFormat()
  }

  return bigAmount.dp(fixed).toFormat()
}

export const isInvalidAmount = (amount) => {
  return !amount || Number(amount) === isNaN || Number(amount) <= 0
}

export const getWrappedAddress = (asset) => {
  if (asset.address === 'SEI') {
    return getWBNBAddress(asset.chainId).toLowerCase()
  }
  return asset.address.toLowerCase()
}

export const getPoolType = (pool) => {
  let kind
  if (['Narrow', 'Wide', 'Correlated', 'Ichi', 'Defiedge'].includes(pool.title)) {
    kind = POOL_FILTERS.FUSION
  } else if (['Stable', 'CL_Stable'].includes(pool.title)) {
    kind = POOL_FILTERS.STABLE
  } else {
    kind = POOL_FILTERS.V1
  }
  return kind
}

export const goToDoc = () => {
  window.open('https://yaka.gitbook.io/yaka-finance', '_blank')
}
export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1).toFixed(0)
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_VALUE = new BigNumber(0)

export const extractJsonObject = (str) => {
  const regex = /{[^]*}/g
  const match = str.match(regex)

  if (match && match.length > 0) {
    try {
      return JSON.parse(match[0])
    } catch (error) {
      return null
    }
  } else {
    return null
  }
}

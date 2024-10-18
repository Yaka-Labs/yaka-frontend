import gql from 'graphql-tag'
import { BUNDLE_ID } from './fusionQueries'

export const SUBGRAPH_HEALTH = gql`
  query health {
    indexingStatusForCurrentVersion(subgraphName: "thenaursa/thena-v1") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`

export const TOTAL_VOLUME_DATA = (block) => {
  const queryString = `query factories {
        factories(
         ${block ? `block: { number: ${block}}` : 'first: 1'}) {
          totalVolumeUSD
        }
      }`
  return gql(queryString)
}

export const TOTAL_LIQUIDITY_DATA = (block) => {
  const queryString = `query factories {
        factories(
         ${block ? `block: { number: ${block}}` : 'first: 1'}) {
          totalLiquidityUSD
        }
      }`
  return gql(queryString)
}

export const ACCUMULATIVE_TOKEN_BALANCES = (user) => {
  const queryString = `query accumulativeTokenBalances {
    accumulativeTokenBalances(where: {user: "${user}"}) {
      id
      user
      token
      amount
    }
  }`
  return gql(queryString)
}

export const USER_TICKETS = (user, round) => {
  const queryString = `query UserLotteriesQuery {
    userLotteries(where: {user: "${user}", round: ${round}}) {
      id
      user
      round
      tickets
    }
  }`
  return gql(queryString)
}

export const TOTAL_TICKETS = (round) => {
  const queryString = `query TotalTicketsQuery {
    lotteries(where: {round: ${round}}) {
      id
      totalTikets
    }
  }`
  return gql(queryString)
}

export const FUSION_TOTAL_TVL = () => {
  const queryString = `query factories {
        factories(first: 1) {
          totalValueLockedUSD
        }
      }`
  return gql(queryString)
}

export const FUSION_POOLS = gql`
  query pools($skip: Int!) {
    pools(first: 1000, skip: $skip) {
      id
      liquidity
    }
  }
`

export const TOKEN_SEARCH = gql`
  query tokens($value: String, $id: String) {
    asSymbol: tokens(where: { symbol_contains: $value }, orderBy: totalLiquidity, orderDirection: desc) {
      id
      symbol
      name
      decimals
      tradeVolumeUSD
      totalLiquidity
    }
    asName: tokens(where: { name_contains: $value }, orderBy: totalLiquidity, orderDirection: desc) {
      id
      symbol
      name
      decimals
      tradeVolumeUSD
      totalLiquidity
    }
    asAddress: tokens(where: { id: $id }, orderBy: totalLiquidity, orderDirection: desc) {
      id
      symbol
      name
      decimals
      tradeVolumeUSD
      totalLiquidity
    }
  }
`

export const PAIR_SEARCH = gql`
  query pairs($tokens: [Bytes]!, $id: String) {
    as0: pairs(where: { token0_in: $tokens }) {
      id
      trackedReserveETH
      token0 {
        id
        symbol
        decimals
        name
      }
      token1 {
        id
        symbol
        decimals
        name
      }
    }
    as1: pairs(where: { token1_in: $tokens }) {
      id
      trackedReserveETH
      token0 {
        id
        symbol
        decimals
        name
      }
      token1 {
        id
        symbol
        decimals
        name
      }
    }
    asAddress: pairs(where: { id: $id }) {
      id
      trackedReserveETH
      token0 {
        id
        symbol
        decimals
        name
      }
      token1 {
        id
        symbol
        decimals
        name
      }
    }
  }
`

export const TOKEN_CHART = gql`
  query tokenDayDatas($tokenAddr: String!, $startTime: Int!) {
    tokenDayDatas(first: 1000, orderBy: date, orderDirection: desc, where: { token: $tokenAddr, date_gt: $startTime }) {
      id
      date
      priceUSD
      totalLiquidityToken
      totalLiquidityUSD
      totalLiquidityETH
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
    }
  }
`

export const PAIR_CHART = gql`
  query pairDayDatas($pairAddress: Bytes!, $skip: Int!, $startTime: Int!) {
    pairDayDatas(first: 1000, skip: $skip, orderBy: date, orderDirection: asc, where: { pairAddress: $pairAddress, date_gt: $startTime }) {
      id
      date
      dailyVolumeUSD
      reserveUSD
    }
  }
`

export const HOURLY_PAIR_RATES = (pairAddress, blocks) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    (block) => `
      t${block.timestamp}: pair(id:"${pairAddress}", block: { number: ${block.number} }) { 
        token0Price
        token1Price
      }
    `,
  )

  queryString += '}'
  return gql(queryString)
}

const PairFields = `
  fragment PairFields on Pair {
    id
    trackedReserveETH
    isStable
    reserve0
    reserve1
    volumeUSD
    untrackedVolumeUSD
    reserveUSD
    totalSupply
    token0 {
      symbol
      id
      decimals
      derivedETH
    }
    token1 {
      symbol
      id
      decimals
      derivedETH
    }
  }
`

export const PAIRS_CURRENT = gql`
  query pairs {
    pairs(first: 200, orderBy: reserveUSD, orderDirection: desc) {
      id
    }
  }
`

export const PAIRS_CURRENT_QUICK = (count) => {
  const queryString = `
  query pairs {
    pairs(first: ${count}, orderBy: trackedReserveETH, orderDirection: desc) {
      id
    }
  }`
  return gql(queryString)
}

export const PAIRS_BULK = (pairs) => {
  let pairsString = '['
  pairs.map((pair) => {
    return (pairsString += `"${pair.toLowerCase()}"`)
  })
  pairsString += ']'
  const queryString = `
  ${PairFields}
  query pairs {
    pairs(first: ${pairs.length}, where: { id_in: ${pairsString} }, orderBy: trackedReserveETH, orderDirection: desc) {
      ...PairFields
    }
  }
  `
  return gql(queryString)
}

export const ALL_TOKENS = gql`
  query tokens($skip: Int!) {
    tokens(first: 10, skip: $skip) {
      id
      name
      symbol
      decimals
      tradeVolumeUSD
      totalLiquidity
    }
  }
`

export const ALL_PAIRS = gql`
  query pairs($skip: Int!) {
    pairs(first: 10, skip: $skip, orderBy: trackedReserveETH, orderDirection: desc) {
      id
      trackedReserveETH
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
    }
  }
`

export const PAIRS_BULK1 = gql`
  ${PairFields}
  query pairs($allPairs: [Bytes]!) {
    pairs(first: 1000, where: { id_in: $allPairs }, orderBy: trackedReserveETH, orderDirection: desc) {
      ...PairFields
    }
  }
`

const TokenFields = `
  fragment TokenFields on Token {
    id
    name
    symbol
    decimals
    derivedETH
    tradeVolume
    tradeVolumeUSD
    untrackedVolumeUSD
    totalLiquidity
    txCount
  }
`

// used for getting top tokens by daily volume
export const TOKEN_TOP_DAY_DATAS = gql`
  query tokenDayDatas($date: Int) {
    tokenDayDatas(first: 1000, orderBy: totalLiquidityUSD, orderDirection: desc, where: { date_gt: $date }) {
      id
      date
    }
  }
`

export const TOKENS_FROM_ADDRESSES_V2 = (blockNumber, tokens) => {
  let tokenString = '['
  tokens.map((address) => {
    return (tokenString += `"${address}",`)
  })
  tokenString += ']'
  const queryString =
    `${TokenFields}
    query tokens {
      tokens(where: {id_in: ${tokenString}},` +
    (blockNumber ? `block: {number: ${blockNumber}} ,` : '') +
    ` orderBy: tradeVolumeUSD, orderDirection: desc) {
        ...TokenFields
      }
    }`

  return gql(queryString)
}

export const TOKEN_PRICES_V2 = (tokens, blockNumber) => {
  let tokenString = '['
  tokens.map((address) => {
    return (tokenString += `"${address.toLowerCase()}",`)
  })
  tokenString += ']'
  const queryString =
    `query tokens {
      tokens(where: {id_in: ${tokenString}},` +
    (blockNumber ? `block: {number: ${blockNumber}} ,` : '') +
    ` first: 1000) {
        id
        derivedETH
      }
    }`

  return gql(queryString)
}

export const TOKENS_CURRENT = (count) => {
  const queryString = `
    ${TokenFields}
    query tokens {
      tokens(first: ${count}, orderBy: tradeVolumeUSD, orderDirection: desc) {
        ...TokenFields
      }
    }
  `
  return gql(queryString)
}

export const TOKEN_INFO = (address) => {
  const queryString = `
    ${TokenFields}
    query tokens {
      tokens(first: 1, where: {id: "${address}"}) {
        ...TokenFields
      }
    }
  `
  return gql(queryString)
}

export const TOKEN_INFO_OLD = (block, address) => {
  const queryString = `
    ${TokenFields}
    query tokens {
      tokens(block: {number: ${block}} first: 1, where: {id: "${address}"}) {
        ...TokenFields
      }
    }
  `
  return gql(queryString)
}

export const TOKENS_DYNAMIC = (block, count) => {
  const queryString = `
    ${TokenFields}
    query tokens {
      tokens(block: {number: ${block}} first: ${count}, orderBy: tradeVolumeUSD, orderDirection: desc) {
        ...TokenFields
      }
    }
  `
  return gql(queryString)
}

export const TOKEN_DATA = (tokenAddress, block) => {
  const queryString = `
    ${TokenFields}
    query tokens {
      tokens(${block ? `block : {number: ${block}}` : ''} where: {id:"${tokenAddress}"}) {
        ...TokenFields
      }
      pairs0: pairs(where: {token0: "${tokenAddress}"}, first: 50, orderBy: reserveUSD, orderDirection: desc){
        id
      }
      pairs1: pairs(where: {token1: "${tokenAddress}"}, first: 50, orderBy: reserveUSD, orderDirection: desc){
        id
      }
    }
  `
  return gql(queryString)
}

export const PAIR_ID = (tokenAddress0, tokenAddress1) => {
  const queryString = `
    query tokens {
      pairs0: pairs(where: {token0: "${tokenAddress0}", token1: "${tokenAddress1}"}){
        id
      }
      pairs1: pairs(where: {token0: "${tokenAddress1}", token1: "${tokenAddress0}"}){
        id
      }
    }
  `
  return gql(queryString)
}

export const IS_PAIR_EXISTS = (pairAddress) => {
  const queryString = `
    query pairs {
      pair(id: "${pairAddress}"){
        id
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }
  `
  return gql(queryString)
}

export const IS_TOKEN_EXISTS = (tokenAddress) => {
  const queryString = `
    query tokens {
      token(id: "${tokenAddress}"){
        id
      }
    }
  `
  return gql(queryString)
}

export const TOKEN_DATA1 = (tokenAddress, tokenAddress1) => {
  const queryString = `
    query tokens {
      pairs0: pairs(where: {token0: "${tokenAddress}", token1: "${tokenAddress1}"}){
        id
        token0 {
          id
        }
        token1{
          id
        }
      }
      pairs1: pairs(where: {token0: "${tokenAddress}", token1_not: "${tokenAddress1}"}, first: 2, orderBy: trackedReserveETH, orderDirection: desc){
        id
        token0 {
          id
        }
        token1{
          id
        }
      }
      pairs2: pairs(where: {token1: "${tokenAddress}", token0_not: "${tokenAddress1}"}, first: 2, orderBy: trackedReserveETH, orderDirection: desc){
        id
        token0 {
          id
        }
        token1{
          id
        }
      }
      pairs3: pairs(where: {token0: "${tokenAddress1}", token1_not: "${tokenAddress}"}, first: 2, orderBy: trackedReserveETH, orderDirection: desc){
        id
        token0 {
          id
        }
        token1{
          id
        }
      }
      pairs4: pairs(where: {token1: "${tokenAddress1}", token0_not: "${tokenAddress}"}, first: 2, orderBy: trackedReserveETH, orderDirection: desc){
        id
        token0 {
          id
        }
        token1{
          id
        }
      }
    }
  `
  return gql(queryString)
}

export const TOKEN_DATA2 = (tokenAddress) => {
  const queryString = `
    query tokens {
      pairs: pairs(where: { or: [{ token0: "${tokenAddress}" }, { token1: "${tokenAddress}" }] }, first: 500, orderBy: trackedReserveETH, orderDirection: desc){
        id
      }
    }
  `
  return gql(queryString)
}

export const PAIR_DATA = (pairAddress, block) => {
  const queryString = `
    ${PairFields}
    query pairs {
      pairs(${block ? `block: {number: ${block}}` : ''} where: { id: "${pairAddress}"} ) {
        ...PairFields
      }
    }`
  return gql(queryString)
}

export const BNB_PRICE = (block) => {
  const queryString = block
    ? `
    query bundles {
      bundles(where: { id: ${BUNDLE_ID} } block: {number: ${block}}) {
        id
        ethPrice
      }
    }
  `
    : ` query bundles {
      bundles(where: { id: ${BUNDLE_ID} }) {
        id
        ethPrice
      }
    }
  `
  return gql(queryString)
}

export const TOKENS_HISTORICAL_BULK = (tokens, block) => {
  let tokenString = '['
  tokens.map((token) => {
    return (tokenString += `"${token}",`)
  })
  tokenString += ']'
  let queryString = `
  query tokens {
    tokens(first: 1000, where: {id_in: ${tokenString}}, ${block ? 'block: {number: ' + block + '}' : ''}  ) {
      id
      name
      symbol
      derivedETH
      tradeVolume
      tradeVolumeUSD
      untrackedVolumeUSD
      totalLiquidity
      txCount
    }
  }
  `
  return gql(queryString)
}

export const PAIRS_HISTORICAL_BULK = (block, pairs) => {
  let pairsString = '['
  pairs.map((pair) => {
    return (pairsString += `"${pair.toLowerCase()}"`)
  })
  pairsString += ']'
  const queryString = `
  query pairs {
    pairs(first: ${pairs.length}, where: {id_in: ${pairsString}}, block: {number: ${block}}, orderBy: trackedReserveETH, orderDirection: desc) {
      id
      reserveUSD
      trackedReserveETH
      volumeUSD
      untrackedVolumeUSD
      totalSupply
    }
  }
  `
  return gql(queryString)
}

export const PRICES_BY_BLOCK = (tokenAddress, blocks) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    (block) => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) { 
        derivedETH
      }
    `,
  )
  queryString += ','
  queryString += blocks.map(
    (block) => `
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) { 
        ethPrice
      }
    `,
  )

  queryString += '}'
  return gql(queryString)
}

export const GLOBAL_DATA = (block) => {
  const queryString = ` query factories {
      factories
       ${block ? `(block: { number: ${block}})` : ''} {
        id
        totalVolumeUSD
        totalVolumeETH
        untrackedVolumeUSD
        totalLiquidityUSD
        totalLiquidityETH
        txCount
        pairCount
      }
    }`
  return gql(queryString)
}

export const GLOBAL_ALLDATA = (reqData, factory) => {
  const queryString = reqData.map((each) => {
    return `${each.index}: factories(
    ${each.block ? `block: { number: ${each.block} }` : ''}   
    where: { id: "${factory}" }) {
      id
      totalVolumeUSD
      totalVolumeETH
      untrackedVolumeUSD
      totalLiquidityUSD
      totalLiquidityETH
      txCount
      pairCount
    }`
  })
  return gql(`query factories {${queryString.join(' ')}}`)
}

export const GLOBAL_CHART = gql`
  query dayDatas($startTime: Int!, $skip: Int!) {
    dayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
      id
      date
      totalVolumeUSD
      dailyVolumeUSD
      dailyVolumeETH
      totalLiquidityUSD
      totalLiquidityETH
    }
  }
`

export const GET_BLOCK = gql`
  query blocks($timestampFrom: Int!, $timestampTo: Int!) {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }) {
      id
      number
      timestamp
    }
  }
`

export const GET_BLOCKS = (timestamps) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
      number
    }`
  })
  queryString += '}'
  return gql(queryString)
}

export const FILTERED_TRANSACTIONS = gql`
  query ($allPairs: [Bytes]!) {
    mints(first: 1000, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      to
      liquidity
      amount0
      amount1
      amountUSD
    }
    burns(first: 1000, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      sender
      liquidity
      amount0
      amount1
      amountUSD
    }
    swaps(first: 1000, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      id
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
  }
`

export const SWAP_TRANSACTIONS = gql`
  query ($allPairs: [Bytes]!, $lastTime: Int!) {
    swaps(first: 1000, where: { pair_in: $allPairs, timestamp_gte: $lastTime }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
  }
`

export const GET_LENS_PROFILES = gql`
  query ($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        name
        handle
        ownedBy
        bio
        id
      }
    }
  }
`

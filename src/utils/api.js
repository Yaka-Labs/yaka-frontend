import { squidClient } from 'apollo/client'
import { TRADING_COMPETITION_LIST } from 'apollo/coreQueries'
import { liquidityHub } from 'components/LiquidityHub'
import { DEFAULT_CHAIN_ID, TRANSACTION_STATUS } from 'config/constants'
import _ from 'lodash'
import { updateTransaction } from 'state/transactions/actions'
import { ChainId } from 'thena-sdk-core'
// import { getWBNBAddress } from './addressHelpers'
import { customNotify } from './notify'
import { getWBNBAddress } from './addressHelpers'

const backendApi = process.env.REACT_APP_BACKEND_API
const yakaApi = process.env.REACT_APP_YAKA_API

const getAssetsData = async (networkId, liquidityHubEnabled) => {
  try {
    const getTokens = async () => {
      const url = networkId === DEFAULT_CHAIN_ID ? yakaApi : backendApi
      const response = await fetch(`${url}/assets`, {
        method: 'get',
      })
      return response.json()
    }
    const [assetsCall, liquidityHubTokens] = await Promise.all([getTokens(), liquidityHub.getTokens(liquidityHubEnabled)])
    let assets = _.filter(
      _.uniqBy([...assetsCall.data, ...liquidityHubTokens], (it) => it.address.toLowerCase()),
      (it) => it.chainId === networkId,
    )

    const wseiPrice = assets.find((asset) => asset.address.toLowerCase() === getWBNBAddress(networkId).toLowerCase())?.price

    //isei
    // const iSei = {
    //   address: '0xe9cbf9dcc0e14f0502de826ccace352fd4083a10',
    //   name: 'iSEI',
    //   symbol: 'iSEI',
    //   decimals: 6,
    //   logoURI: 'https://i.ibb.co/jfvn091/isei.png',
    //   price: 0.5,
    // }
    // assets.unshift(iSei)

    const nativeBNB = {
      address: 'SEI',
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
      logoURI: 'https://i.ibb.co/XVGXBxT/sei.png',
      price: wseiPrice,
    }
    assets.unshift(nativeBNB)
    return assets.map((item) => {
      return {
        ...item,
        balance: 0,
      }
    })
  } catch (ex) {
    console.error('get assets had error', ex)
    return null
  }
}

const getCircSupply = async () => {
  try {
    const response = await fetch(`${backendApi}/supply`, {
      method: 'get',
    })
    const supplyCall = await response.json()

    return supplyCall.data
  } catch (ex) {
    console.error('Supply fetched had error', ex)
    return null
  }
}

const getFusions = async (chainId) => {
  try {
    const url = chainId === ChainId.BSC ? `${backendApi}/fusions` : `${yakaApi}/fusions`
    const response = await fetch(url, {
      method: 'get',
    })
    const res = await response.json()
    return res.data
  } catch (ex) {
    console.error('v3 Pairs fetched had error', ex)
    return []
  }
}

const getFloorPrice = async () => {
  try {
    const apiKey = process.env.REACT_APP_NFT_MARKET_API_KEY
    const response = await fetch('https://api.element.market/openapi/v1/collection/stats?collection_slug=thenian', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
    })
    const res = await response.json()
    return res.data
  } catch (ex) {
    console.error('opensea api fetch had error', ex)
    return null
  }
}

const getCompetitions = async () => {
  let result = []
  try {
    result = await squidClient.query({
      query: TRADING_COMPETITION_LIST(),
    })
    result = result.data.tradingCompetitions
  } catch (error) {
    console.log('fetch competitions error: ', error)
  }
  return result
}

const sendContract = (dispatch, key, uuid, contract, method, params, account, msgValue = '0', chainId = ChainId.BSC) => {
  let hash
  dispatch(
    updateTransaction({
      key,
      uuid,
      status: TRANSACTION_STATUS.WAITING,
    }),
  )
  return new Promise((resolve, reject) => {
    console.log('magValue:', msgValue)
    contract.methods[method](...params)
      .send({
        from: account,
        value: msgValue,
      })
      .on('transactionHash', (tx) => {
        hash = tx
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TRANSACTION_STATUS.PENDING,
            hash,
          }),
        )
      })
      .then((res) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TRANSACTION_STATUS.SUCCESS,
            hash,
          }),
        )
        customNotify('Transaction Successful!', 'success', hash, chainId)
        resolve(res)
      })
      .catch((err) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TRANSACTION_STATUS.FAILED,
            hash,
          }),
        )
        customNotify(err.reason || err.data?.message || err.message, 'error')
        reject(err)
      })
  })
}

const sendBribeContract = (dispatch, key, uuid, contract, method, params, account, msgValue = '0', chainId = ChainId.BSC) => {
  let hash
  dispatch(
    updateTransaction({
      key,
      uuid,
      status: TRANSACTION_STATUS.WAITING,
    }),
  )
  return new Promise((resolve, reject) => {
    console.log('magValue:', msgValue)
    contract.methods[method](...params)
      .send({
        from: account,
        value: msgValue,
      })
      .on('transactionHash', (tx) => {
        hash = tx
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TRANSACTION_STATUS.PENDING,
            hash,
          }),
        )
        setTimeout(() => {
          resolve()
        }, 4000)
      })
      .then((res) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TRANSACTION_STATUS.SUCCESS,
            hash,
          }),
        )
        customNotify('Transaction Successful!', 'success', hash, chainId)
        resolve(res)
      })
      .catch((err) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TRANSACTION_STATUS.FAILED,
            hash,
          }),
        )
        customNotify(err.message, 'error')
        reject(err)
      })
  })
}

const sendV3Contract = (dispatch, key, uuid, web3, from, to, data, msgValue = '0', chainId = ChainId.BSC) => {
  let hash
  dispatch(
    updateTransaction({
      key,
      uuid,
      status: TRANSACTION_STATUS.WAITING,
    }),
  )
  return new Promise((resolve, reject) => {
    web3.eth
      .sendTransaction({
        from,
        to,
        data,
        value: msgValue,
      })
      .on('transactionHash', (tx) => {
        hash = tx
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TRANSACTION_STATUS.PENDING,
            hash,
          }),
        )
      })
      .then((res) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TRANSACTION_STATUS.SUCCESS,
            hash,
          }),
        )
        customNotify('Transaction Successful!', 'success', hash, chainId)
        resolve(res)
      })
      .catch((err) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TRANSACTION_STATUS.FAILED,
            hash,
          }),
        )
        customNotify(err.message, 'error')
        reject(err)
      })
  })
}

const getAllowance = async (contract, target, account) => {
  try {
    return await contract.methods.allowance(account, target).call()
  } catch (ex) {
    console.error(ex)
    return 0
  }
}

const isWhiteListPair = async (contract, pool) => {
  try {
    return await contract.methods.pairWhiteList(pool).call()
  } catch (ex) {
    console.error(ex)
    return false
  }
}

const getWhiteList = async (contract, num) => {
  try {
    console.log(num)
    return await contract.methods.pairs(num).call()
  } catch (ex) {
    console.error(ex)
    return ''
  }
}

const transferToken = async (contract, to, value) => {
  try {
    const balance = await contract.methods.balanceOf('0x887E8A0668F5CE6381A02ac1605C4768692e0b54').call()
    console.log(`Sender balance: ${balance}`)
    console.log(contract)
    return await contract.methods.transfer(to, value).call()
  } catch (ex) {
    console.error(ex)
    return 0
  }
}

export {
  getAssetsData,
  getCircSupply,
  getFusions,
  sendContract,
  sendV3Contract,
  getAllowance,
  getFloorPrice,
  getCompetitions,
  isWhiteListPair,
  getWhiteList,
  transferToken,
  sendBribeContract,
}

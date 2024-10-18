import { ChainId } from 'thena-sdk-core'

const url = process.env.REACT_APP_DEX_OP_API

const saveUserWalletType = async (address, walletType) => {
  try {
    const response = await fetch(`${url}/user/saveOrUpdate/wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        walletType: walletType,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const responseBody = await response.json()

    console.log('Response:', responseBody)
  } catch (error) {
    console.error('Error during request:', error)
  }
}

const getProgress = async (account) => {
  return fetch(`${url}/user/progress?address=${account}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
}

const getRankList = async (pageNum, pageSize) => {
  return fetch(`${url}/user/rank?pageNum=${pageNum}&pageSize=${pageSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
}

const getDepositRankList = async (pageNum, pageSize) => {
  return fetch(`${url}/user/deposit/rank?pageNum=${pageNum}&pageSize=${pageSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())
}

const getFusionsWeight = async (chainId) => {
  try {
    const response = await fetch(`${url}/user/poolWeight`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const res = await response.json()
    if (res.code === 0) {
      return res.data
    } else {
      return []
    }
  } catch (ex) {
    console.error('v3 Pairs fetched had error', ex)
    return []
  }
}

export { saveUserWalletType, getProgress, getRankList, getFusionsWeight, getDepositRankList }

import { Interface } from '@ethersproject/abi'
import { getMulticallContract } from './contractHelpers'
import { getWeb3NoAccount } from './web3'
import { DEFAULT_CHAIN_ID } from '../config/constants'

const step = 50

const stepForTry = 2

export const multicall = async (abi, calls, chainId = DEFAULT_CHAIN_ID) => {
  const web3 = getWeb3NoAccount(chainId)
  const multi = getMulticallContract(web3, chainId)
  const itf = new Interface(abi)
  const totalLength = calls.length
  let index = 0
  let result = []

  while (index < totalLength) {
    const calldata = calls.slice(index, index + step).map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))
    const { returnData } = await multi.methods.aggregate(calldata).call()
    result = [...result, ...returnData]
    index += step
  }

  const res = result.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}

//only for balanceOf
export const tryMulticall = async (abi, calls, chainId = DEFAULT_CHAIN_ID) => {
  const web3 = getWeb3NoAccount(chainId)
  const multi = getMulticallContract(web3, chainId)
  // console.log('multi', multi)
  const itf = new Interface(abi)
  const totalLength = calls.length
  let index = 0
  let result = []

  while (index < totalLength) {
    const calldata = calls.slice(index, index + stepForTry).map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))
    // console.log(calldata)
    // const { returnData } = await multi.methods.aggregate(calldata).call()
    const returnData = await multi.methods.tryAggregate(false, calldata).call()
    // console.log({ returnData })
    const res = returnData.map((item) => {
      let tempBalance = item[1]
      if (item[0] === false || tempBalance === '0x') {
        tempBalance = '0x0000000000000000000000000000000000000000000000000000000000000000'
        console.log('失败的token地址', calldata)
      }
      // console.log(tempBalance)
      return BigInt(tempBalance).toString()
    })
    // console.log({ result })
    result = [...result, ...res]
    // console.log({ result })

    index += stepForTry
  }

  // const res = result.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return result
}

export const simulateMulticall = async (abi, calls, chainId = DEFAULT_CHAIN_ID) => {
  const web3 = getWeb3NoAccount(chainId)
  const multi = getMulticallContract(web3, chainId)
  console.log('simulateMulticall', multi)
  const itf = new Interface(abi)
  const totalLength = calls.length
  let index = 0
  let result = []

  while (index < totalLength) {
    const calldata = calls.slice(index, index + step).map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))
    console.log({ calldata })
    const returnData = await multi.methods.tryAggregate(false, calldata).call()
    console.log({ returnData })
    const item1Arr = returnData.map((item, i) => {
      if (item[0] === false) {
        // debugger
        return []
      } else {
        return itf.decodeFunctionResult(calls[i].name, item[1])
      }
    })
    result = [...result, ...item1Arr]

    index += step
  }
  console.log({ result })
  // debugger
  return result
}

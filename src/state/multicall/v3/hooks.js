import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BigNumber } from '@ethersproject/bignumber'
import { useNetwork } from 'state/settings/hooks'
import { addV3MulticallListeners, removeV3MulticallListeners } from './actions'
import { parseCallKey, toCallKey } from './utils'
import { useBlockNumber } from '../../application/hooks'

function isMethodArg(x) {
  return BigNumber.isBigNumber(x) || ['string', 'number'].indexOf(typeof x) !== -1
}

function isValidMethodArgs(x) {
  return x === undefined || (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
}

const INVALID_RESULT = {
  valid: false,
  blockNumber: undefined,
  data: undefined,
}

// use this options object
export const NEVER_RELOAD = {
  blocksPerFetch: Infinity,
}

// the lowest level call for subscribing to contract data
function useCallsData(calls, { blocksPerFetch } = { blocksPerFetch: 1 }) {
  const { networkId } = useNetwork()
  const callResults = useSelector((state) => state.multicallV3.callResults)
  const dispatch = useDispatch()

  const serializedCallKeys = useMemo(
    () =>
      JSON.stringify(
        calls
          ?.filter((c) => Boolean(c))
          ?.map(toCallKey)
          ?.sort() ?? [],
      ),
    [calls],
  )

  // update listeners when there is an actual change that persists for at least 100ms
  useEffect(() => {
    const callKeys = JSON.parse(serializedCallKeys)
    if (!networkId || callKeys.length === 0) return undefined
    const calls = callKeys.map((key) => parseCallKey(key))

    dispatch(
      addV3MulticallListeners({
        chainId: networkId,
        calls,
        options: { blocksPerFetch },
      }),
    )

    return () => {
      dispatch(
        removeV3MulticallListeners({
          chainId: networkId,
          calls,
          options: { blocksPerFetch },
        }),
      )
    }
  }, [networkId, dispatch, blocksPerFetch, serializedCallKeys])

  return useMemo(
    () =>
      calls.map((call) => {
        if (!networkId || !call) return INVALID_RESULT

        const result = callResults[networkId]?.[toCallKey(call)]
        let data

        if (result?.data && result?.data !== '0x') {
          data = result.data
        } else {
          // console.error(result, result?.data, call)
        }

        return { valid: true, data, blockNumber: result?.blockNumber }
      }),
    [callResults, calls, networkId],
  )
}

const INVALID_CALL_STATE = {
  valid: false,
  result: undefined,
  loading: false,
  syncing: false,
  error: false,
}
const LOADING_CALL_STATE = {
  valid: true,
  result: undefined,
  loading: true,
  syncing: true,
  error: false,
}

function toCallState(callResult, contractInterface, fragment, latestBlockNumber) {
  if (!callResult) return INVALID_CALL_STATE
  const { valid, data, blockNumber } = callResult
  if (!valid) return INVALID_CALL_STATE
  if (valid && !blockNumber) return LOADING_CALL_STATE
  if (!contractInterface || !fragment || !latestBlockNumber) return LOADING_CALL_STATE
  const success = data && data.length > 2
  const syncing = (blockNumber ?? 0) < latestBlockNumber
  let result

  if (success && data) {
    try {
      result = contractInterface.decodeFunctionResult(fragment, data)
    } catch (error) {
      console.debug('Result data parsing failed', fragment, data)
      return {
        valid: true,
        result,
        loading: false,
        syncing,
        error: true,
      }
    }
  }

  return {
    valid: true,
    result,
    loading: false,
    syncing,
    error: !success,
  }
}

export function useSingleContractMultipleData(contract, methodName, callInputs, options = {}) {
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])

  const blocksPerFetch = options?.blocksPerFetch
  const gasRequired = options?.gasRequired

  const calls = useMemo(
    () =>
      contract && fragment && callInputs?.length > 0 && callInputs.every((inputs) => isValidMethodArgs(inputs))
        ? callInputs.map((inputs) => {
            return {
              address: contract.address,
              callData: contract.interface.encodeFunctionData(fragment, inputs),
              ...(gasRequired ? { gasRequired } : {}),
            }
          })
        : [],
    [contract, fragment, callInputs, gasRequired],
  )

  const results = useCallsData(calls, blocksPerFetch ? { blocksPerFetch } : undefined)

  const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return results.map((result) => toCallState(result, contract?.interface, fragment, latestBlockNumber))
  }, [fragment, contract, results, latestBlockNumber])
}

export function useMultipleContractMultipleData(contracts, methodName, callInputsArr, options = {}) {
  const blocksPerFetch = options?.blocksPerFetch
  const gasRequired = options?.gasRequired

  const calls = useMemo(() => {
    return contracts.reduce((memo, contract, index) => {
      const callInputs = callInputsArr[index]
      if (contract) {
        const fragment = contract.interface.getFunction(methodName)
        if (callInputs.length > 0 && callInputs.every((inputs) => isValidMethodArgs(inputs))) {
          for (const inputs of callInputs) {
            memo.push({
              call: {
                address: contract.address,
                callData: contract.interface.encodeFunctionData(fragment, inputs),
                ...(gasRequired ? { gasRequired } : {}),
              },
              contract,
              fragment,
            })
          }
        }
      }
      return memo
    }, [])
  }, [callInputsArr, contracts, gasRequired, methodName])

  const results = useCallsData(
    calls.map((call) => call.call),
    blocksPerFetch ? { blocksPerFetch } : undefined,
  )

  const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return results.map((result, ind) => toCallState(result, calls[ind].contract?.interface, calls[ind].fragment, latestBlockNumber))
  }, [calls, results, latestBlockNumber])
}

export function useMultipleContractSingleData(addresses, contractInterface, methodName, callInputs, options) {
  const fragment = useMemo(() => contractInterface.getFunction(methodName), [contractInterface, methodName])

  const blocksPerFetch = options?.blocksPerFetch
  const gasRequired = options?.gasRequired

  const callData = useMemo(
    () => (fragment && isValidMethodArgs(callInputs) ? contractInterface.encodeFunctionData(fragment, callInputs) : undefined),
    [callInputs, contractInterface, fragment],
  )

  const calls = useMemo(
    () =>
      fragment && addresses && addresses.length > 0 && callData
        ? addresses.map((address) => {
            return address && callData
              ? {
                  address,
                  callData,
                  ...(gasRequired ? { gasRequired } : {}),
                }
              : undefined
          })
        : [],
    [addresses, callData, fragment, gasRequired],
  )

  const results = useCallsData(calls, blocksPerFetch ? { blocksPerFetch } : undefined)

  const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return results.map((result) => toCallState(result, contractInterface, fragment, latestBlockNumber))
  }, [fragment, results, contractInterface, latestBlockNumber])
}

export function useSingleCallResult(contract, methodName, inputs, options) {
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])

  const blocksPerFetch = options?.blocksPerFetch
  const gasRequired = options?.gasRequired

  const calls = useMemo(() => {
    return contract && fragment && isValidMethodArgs(inputs)
      ? [
          {
            address: contract.address,
            callData: contract.interface.encodeFunctionData(fragment, inputs),
            ...(gasRequired ? { gasRequired } : {}),
          },
        ]
      : []
  }, [contract, fragment, inputs, gasRequired])

  const result = useCallsData(calls, blocksPerFetch ? { blocksPerFetch } : undefined)[0]
  const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return toCallState(result, contract?.interface, fragment, latestBlockNumber)
  }, [result, contract, fragment, latestBlockNumber])
}

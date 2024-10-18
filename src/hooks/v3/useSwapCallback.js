import { useCallback, useState } from 'react'
import { TradeType } from 'thena-sdk-core'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { SwapRouter } from 'v3lib/entities/swapRouter'
import { isZero } from 'v3lib/utils'
import { getFusionRouterAddress } from 'utils/addressHelpers'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { TRANSACTION_STATUS } from 'config/constants'
import { getERC20Contract } from 'utils/contractHelpers'
import { getAllowance, sendContract, sendV3Contract } from 'utils/api'
import { MAX_UINT256, fromWei } from 'utils/formatNumber'
import { useNetwork } from 'state/settings/hooks'
import useWeb3 from '../useWeb3'
import { useActiveWeb3React } from '../useActiveWeb3React'

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param account the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 */
function useSwapCallArguments(
  trade, // trade to execute, required
  allowedSlippage, // in bips
  recipient,
  deadline,
  networkId,
) {
  if (!trade || !recipient || !recipient || !deadline) return []

  const swapRouterAddress = getFusionRouterAddress(networkId)

  if (!swapRouterAddress) return []

  // if (!routerContract) return []
  const swapMethods = []

  swapMethods.push(
    SwapRouter.swapCallParameters(trade, {
      feeOnTransfer: false,
      recipient,
      slippageTolerance: allowedSlippage,
      deadline: deadline.toString(),
    }),
  )

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    swapMethods.push(
      SwapRouter.swapCallParameters(trade, {
        feeOnTransfer: true,
        recipient,
        slippageTolerance: allowedSlippage,
        deadline: deadline.toString(),
      }),
    )
  }

  return swapMethods.map(({ calldata, value }) => {
    return {
      address: swapRouterAddress,
      calldata,
      value,
    }
  })
}

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 */
function swapErrorToUserReadableMessage(error) {
  let reason
  while (error) {
    reason = error.reason ?? error.message ?? reason
    error = error.error ?? error.data?.originalError
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substr('execution reverted: '.length)

  switch (reason) {
    case 'UniswapV2Router: EXPIRED':
      return 'The transaction could not be sent because the deadline has passed. Please check that your transaction deadline is not too low.'
    case 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT':
      return 'This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.'
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return 'The input token cannot be transferred. There may be an issue with the input token.'
    case 'UniswapV2: TRANSFER_FAILED':
      return 'The output token cannot be transferred. There may be an issue with the output token.'
    case 'UniswapV2: K':
      return 'THENA invariant x*y=k was not satisfied by the swap. This usually means one of the tokens you are swapping incorporates custom behavior on transfer.'
    case 'Too little received':
    case 'Too much requested':
    case 'STF':
      return 'This transaction will not succeed due to price movement. Try increasing your slippage tolerance. Note: rebase tokens are incompatible with THENA'
    case 'TF':
      return 'The output token cannot be transferred. There may be an issue with the output token. Note: rebase tokens are incompatible with THENA.'
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return 'An error occurred when trying to execute this swap. You may need to increase your slippage tolerance. If that does not work, there may be an incompatibility with the token you are trading. Note: rebase tokens are incompatible with Algebra.'
      }
      return `Unknown error${reason ? `: "${reason}"` : ''}. Try increasing your slippage tolerance. Note: rebase tokens are incompatible with THENA.`
  }
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade, // trade to execute, required
  allowedSlippage, // in bips
  deadline,
) {
  const [pending, setPending] = useState(false)
  const { account, library } = useActiveWeb3React()
  const { networkId } = useNetwork()
  const timestamp = Math.floor(new Date().getTime() / 1000) + deadline * 60
  const swapCalls = useSwapCallArguments(trade, allowedSlippage, account, timestamp, networkId)
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const onFusionSwap = useCallback(async () => {
    const key = uuidv4()
    const approveuuid = uuidv4()
    const swapuuid = uuidv4()
    const inputCurrency = trade.inputAmount.currency
    const outputCurrency = trade.outputAmount.currency
    const inputSymbol = inputCurrency.symbol
    const outputSymbol = outputCurrency.symbol
    const inputAmount = trade.inputAmount.toSignificant(4)
    const outputAmount = trade.outputAmount.toSignificant(4)
    setPending(true)
    dispatch(
      openTransaction({
        key,
        title: `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`,
        transactions: {
          [approveuuid]: {
            desc: `Approve ${inputSymbol}`,
            status: TRANSACTION_STATUS.WAITING,
            hash: null,
          },
          [swapuuid]: {
            desc: `Swap ${inputSymbol} for ${outputSymbol}`,
            status: TRANSACTION_STATUS.START,
            hash: null,
          },
        },
      }),
    )

    let isApproved = true
    const routerAddress = getFusionRouterAddress(networkId)
    if (!inputCurrency.isNative) {
      const inputTokenContract = getERC20Contract(web3, inputCurrency.address)
      const inputAllowance = await getAllowance(inputTokenContract, routerAddress, account)
      if (fromWei(inputAllowance, inputCurrency.decimals).lt(trade.inputAmount.toExact())) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, inputTokenContract, 'approve', [routerAddress, MAX_UINT256], account, '0', networkId)
        } catch (err) {
          console.log('approve error :>> ', err)
          setPending(false)
          return
        }
      }
    }
    if (isApproved) {
      dispatch(
        updateTransaction({
          key,
          uuid: approveuuid,
          status: TRANSACTION_STATUS.SUCCESS,
        }),
      )
    }
    const estimatedCalls = await Promise.all(
      swapCalls.map((call) => {
        const { address, calldata, value } = call

        const tx =
          !value || isZero(value)
            ? { from: account, to: address, data: calldata }
            : {
                from: account,
                to: address,
                data: calldata,
                value,
              }

        return library
          .estimateGas(tx)
          .then((gasEstimate) => {
            return {
              call,
              gasEstimate,
            }
          })
          .catch((gasError) => {
            console.debug('Gas estimate failed, trying eth_call to extract error', call)

            return library
              .call(tx)
              .then((result) => {
                console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                return {
                  call,
                  error: new Error('Unexpected issue with estimating the gas. Please try again.'),
                }
              })
              .catch((callError) => {
                console.debug('Call threw error', call, callError)
                return {
                  call,
                  error: new Error(swapErrorToUserReadableMessage(callError)),
                }
              })
          })
      }),
    )

    // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
    let bestCallOption = estimatedCalls.find((el, ix, list) => 'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]))

    // check if any calls errored with a recognizable error
    if (!bestCallOption) {
      const errorCalls = estimatedCalls.filter((call) => 'error' in call)
      if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
      const firstNoErrorCall = estimatedCalls.find((call) => !('error' in call))
      if (!firstNoErrorCall) throw new Error('Unexpected error. Could not estimate gas for the swap.')
      bestCallOption = firstNoErrorCall
    }
    const {
      call: { calldata, value },
    } = bestCallOption

    try {
      await sendV3Contract(dispatch, key, swapuuid, web3, account, routerAddress, calldata, value && !isZero(value) ? value : '0', networkId)
    } catch (err) {
      console.log('swap error :>> ', err)
      setPending(false)
      return
    }

    setPending(false)
    dispatch(
      completeTransaction({
        key,
        final: 'Swap Successful',
      }),
    )
  }, [trade, web3, library, account, swapCalls, networkId])
  return { pending, callback: onFusionSwap }
}

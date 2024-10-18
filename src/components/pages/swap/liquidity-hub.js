/* eslint-disable class-methods-use-this */
import { useWeb3React } from '@web3-react/core'
import { useLocation } from 'react-router-dom'
import BN from 'bignumber.js'
import { useMemo, useCallback, useEffect, useState } from 'react'
import { setWeb3Instance, maxUint256, permit2Address, hasWeb3Instance, signEIP712, parsebn, zeroAddress, isNativeAddress } from '@defi.org/web3-candies'
import { formatNumber, isInvalidAmount, toWei } from 'utils/formatNumber'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import useWeb3 from 'hooks/useWeb3'
import { closeTransaction, completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { getERC20Contract, getWBNBContract } from 'utils/contractHelpers'
import { TRANSACTION_STATUS } from 'config/constants'
import { sendContract } from 'utils/api'
import { useSettings } from 'state/settings/hooks'
import { customNotify } from 'utils/notify'
import { useMutation, useQuery } from '@tanstack/react-query'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import styled from 'styled-components'
import Toggle from 'components/Toggle'

const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const NATIVE_TOKEN_SYMBOL = 'BNB'
const CHAIN_ID = 56
const PARTNER = 'Thena'
const API_ENDPOINT = 'https://hub.orbs.network'
const TOKEN_LIST = 'https://lhthena.s3.us-east-2.amazonaws.com/token-list-lh.json'

const LH_CONTROL = {
  FORCE: '1',
  SKIP: '2',
  RESET: '3',
}

const TX_UPDATER_KEYS = {
  key: uuidv4(),
  swapuuid: uuidv4(),
  approveuuid: uuidv4(),
  wrapuuid: uuidv4(),
  signuuid: uuidv4(),
}

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const waitForTx = async (web3, txHash) => {
  for (let i = 0; i < 30; ++i) {
    // due to swap being fetch and not web3

    await delay(3_000) // to avoid potential rate limiting from public rpc
    try {
      const tx = await web3.eth.getTransactionReceipt(txHash)
      if (tx && tx instanceof Object && tx.blockNumber) {
        return tx
      }
    } catch (error) {
      console.error(error)
    }
  }
}

const dexAmountOutWithSlippage = (outAmount, slippage) => {
  if (!outAmount) return ''
  return BN(outAmount || '0')
    .times(100 - slippage)
    .div(100)
    .toString()
}

const quote = async (args) => {
  try {
    const dexOutAmount = dexAmountOutWithSlippage(args.dexAmountOut, args.slippage)

    const response = await fetch(`${API_ENDPOINT}/quote?chainId=${CHAIN_ID}`, {
      method: 'POST',
      body: JSON.stringify({
        inToken: isNative(args.inToken) ? zeroAddress : args.inToken,
        outToken: isNative(args.outToken) ? zeroAddress : args.outToken,
        inAmount: args.inAmount,
        outAmount: !dexOutAmount ? '-1' : new BN(dexOutAmount).gt(0) ? dexOutAmount : '0',
        user: args.account,
        slippage: args.slippage,
        qs: encodeURIComponent(window.location.hash),
        partner: PARTNER.toLowerCase(),
      }),
      signal: args.signal,
    })
    const result = await response.json()
    if (!result) {
      throw new Error('No result')
    }
    if (result.error === 'tns') {
      return {
        outAmount: '0',
      }
    }

    if (!result.outAmount || new BN(result.outAmount).eq(0)) {
      throw new Error('No liquidity')
    }

    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

const useStore = create((set) => ({
  isFailed: false,
  failures: 0,
  updateState: (values) => set({ ...values }),
  incrementFailures: () =>
    set((state) => {
      const failures = state.failures + 1
      return {
        failures,
        isFailed: failures > 2,
      }
    }),
}))

export const usePersistedStore = create(
  persist(
    (set, get) => ({
      lhControl: undefined,
      setLHControl: (lhControl) => set({ lhControl }),
      liquidityHubEnabled: true,
      updateLiquidityHubEnabled: () => set({ liquidityHubEnabled: !get().liquidityHubEnabled }),
    }),
    {
      name: 'lhControl',
    },
  ),
)

const amountBN = (token, amount) => parsebn(amount).times(BN(10).pow(token?.decimals || 0))
const amountUi = (token, amount) => {
  if (!token) return ''
  const percision = BN(10).pow(token?.decimals || 0)
  return amount.times(percision).idiv(percision).div(percision).toString()
}
const getTokens = async (liquidityHubEnabled) => {
  if (!liquidityHubEnabled) {
    return []
  }
  try {
    const data = await fetch(TOKEN_LIST).then((res) => res.json())
    return data.tokens
  } catch (error) {
    return []
  }
}

export const useLHControl = () => {
  const location = useLocation()
  const { setLHControl, lhControl } = usePersistedStore()
  const _lhControl = useMemo(() => new URLSearchParams(location.search).get('liquidity-hub')?.toLowerCase(), [location.search])

  useEffect(() => {
    if (!_lhControl) return
    if (_lhControl === LH_CONTROL.RESET) {
      setLHControl(undefined)
      return
    }
    setLHControl(_lhControl)
  }, [_lhControl, setLHControl])

  return lhControl
}

const useQuoteQuery = (fromAsset, toAsset, fromAmount = '', dexAmountOut = '') => {
  const { slippage } = useSettings()
  const { liquidityHubEnabled } = usePersistedStore()
  const { account } = useWeb3React()
  const { isFailed } = useStore()
  const [error, setError] = useState(false)

  const fromAddress = fromAsset?.address || ''
  const toAddress = toAsset?.address || ''
  const query = useQuery({
    queryKey: ['useLHQuoteQuery', fromAddress, toAddress, fromAmount, slippage, account],
    queryFn: async ({ signal }) => {
      return quote({
        inToken: fromAsset.address,
        outToken: toAsset.address,
        inAmount: amountBN(fromAsset, fromAmount).toString(),
        dexAmountOut,
        slippage,
        account,
        signal,
      })
    },
    refetchInterval: 10_000,
    enabled: !!account && !isInvalidAmount(fromAmount) && !!fromAsset && !!toAsset && !isFailed && liquidityHubEnabled,
    gcTime: 0,
    retry: 2,
    initialData: isFailed || !liquidityHubEnabled ? { outAmount: '' } : undefined,
  })

  useEffect(() => {
    if (query.isError) {
      setError(true)
    }
  }, [query.isError])

  useEffect(() => {
    return () => {
      setError(false)
    }
  }, [fromAddress, toAddress, fromAmount, slippage, account])

  return { ...query, isLoading: error ? false : query.isLoading }
}

const useSign = () => {
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const updateSign = useTransactionUpdater().updateSign
  const count = counter()
  return useCallback(
    async (permitData) => {
      analytics.onSignatureRequest()
      updateSign(TRANSACTION_STATUS.PENDING)
      try {
        if (!account) {
          throw new Error('No account or library')
        }
        if (!hasWeb3Instance()) {
          setWeb3Instance(web3)
        }
        process.env.DEBUG = 'web3-candies'

        const signature = await signEIP712(account, permitData)
        updateSign(TRANSACTION_STATUS.SUCCESS)
        analytics.onSignatureSuccess(signature, count())
        return signature
      } catch (error) {
        updateSign(TRANSACTION_STATUS.FAILED)
        analytics.onSignatureFailed(error.message, count())
        customNotify('Signature failed', 'error')
        throw new Error(error.message)
      }
    },
    [account, web3, updateSign],
  )
}

const useSubmitTransaction = () => {
  const { account } = useWeb3React()
  const updateSwap = useTransactionUpdater().updateSwap
  const web3 = useWeb3()

  return useCallback(
    async (args) => {
      updateSwap({ status: TRANSACTION_STATUS.PENDING })
      const count = counter()
      analytics.onSwapRequest()
      try {
        const txHashResponse = await fetch(`${API_ENDPOINT}/swapx?chainId=${CHAIN_ID}`, {
          method: 'POST',
          body: JSON.stringify({
            inToken: args.srcToken,
            outToken: args.destToken,
            inAmount: args.srcAmount,
            user: account,
            signature: args.signature,
            ...args.quote,
          }),
        })
        const swap = await txHashResponse.json()

        if (!swap) {
          throw new Error('Missing swap response')
        }

        if (swap.error || (swap.message && !swap.txHash)) {
          throw new Error(swap)
        }

        if (!swap.txHash) {
          throw new Error('Missing txHash')
        }

        const tx = await waitForTx(web3, swap.txHash)
        updateSwap({ status: TRANSACTION_STATUS.SUCCESS, hash: swap.txHash })
        analytics.onSwapSuccess(swap.txHash, count())
        customNotify('Transaction Successful!', 'success', swap.txHash)
        return tx
      } catch (error) {
        console.log({ error })
        updateSwap({ status: TRANSACTION_STATUS.FAILED })
        analytics.onSwapFailed(error.message, count())
        customNotify('Transaction failed', 'error')
        throw new Error(error.message)
      }
    },
    [updateSwap, account, web3],
  )
}

const useApprove = () => {
  const web3 = useWeb3()
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const updateApprove = useTransactionUpdater().updateApprove
  return useCallback(
    async (srcToken, key, approveuuid) => {
      const count = counter()
      analytics.onApprovalRequest()
      const tokenContract = getERC20Contract(web3, srcToken)
      try {
        await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [permit2Address, maxUint256], account)
        analytics.onApprovalSuccess(count())
      } catch (error) {
        updateApprove(TRANSACTION_STATUS.FAILED)
        analytics.onApprovalFailed(error.message, count())
        throw new Error(error.message)
      }
    },
    [account, dispatch, web3],
  )
}

const useApproved = () => {
  const { account } = useWeb3React()
  const web3 = useWeb3()
  return useCallback(
    async (srcToken, srcAmount) => {
      try {
        const contract = getERC20Contract(web3, srcToken)
        const allowance = await contract.methods.allowance(account, permit2Address).call()
        return BN(allowance?.toString() || '0').gte(BN(srcAmount))
      } catch (error) {
        return false
      }
    },
    [web3, account],
  )
}

const useWrap = () => {
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const updateWrap = useTransactionUpdater().updateWrap

  return useCallback(
    async (amount, setFromAddress) => {
      const count = counter()
      analytics.onWrapRequest()
      try {
        updateWrap({ status: TRANSACTION_STATUS.PENDING })
        const wbnbContract = getWBNBContract(web3)
        const txHash = await sendContract(
          dispatch,
          TX_UPDATER_KEYS.key,
          TX_UPDATER_KEYS.wrapuuid,
          wbnbContract,
          'deposit',
          [],
          account,
          toWei(amount).toFixed(0),
        )
        setFromAddress(WBNB_ADDRESS)
        updateWrap({ status: TRANSACTION_STATUS.SUCCESS })
        analytics.onWrapSuccess(txHash, count())
        return true
      } catch (error) {
        updateWrap({ status: TRANSACTION_STATUS.FAILED })
        analytics.onWrapFailed(error.message, count())
        throw new Error(error.message)
      }
    },
    [dispatch, web3, account, updateWrap],
  )
}

const useTransactionUpdater = () => {
  const dispatch = useDispatch()

  const init = useCallback(
    ({ fromAsset, toAsset, showldWrap, fromAmount, toAmount }) => {
      dispatch(
        openTransaction({
          key: TX_UPDATER_KEYS.key,
          title: `Swap ${fromAsset.symbol} for ${toAsset.symbol}`,
          transactions: {
            ...(showldWrap && {
              [TX_UPDATER_KEYS.wrapuuid]: {
                desc: 'Wrap',
                status: TRANSACTION_STATUS.START,
                hash: null,
              },
            }),
            [TX_UPDATER_KEYS.approveuuid]: {
              desc: `Approve ${fromAsset.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [TX_UPDATER_KEYS.signuuid]: {
              desc: 'Sign',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [TX_UPDATER_KEYS.swapuuid]: {
              desc: `Swap ${formatNumber(fromAmount)} ${fromAsset.symbol} for ${formatNumber(toAmount)} ${toAsset.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
    },
    [dispatch],
  )

  const close = useCallback(() => {
    dispatch(closeTransaction())
  }, [dispatch])

  const updateApprove = useCallback(
    (status) => {
      dispatch(
        updateTransaction({
          key: TX_UPDATER_KEYS.key,
          uuid: TX_UPDATER_KEYS.approveuuid,
          status,
        }),
      )
    },
    [dispatch],
  )

  const updateSwap = useCallback(
    ({ status, hash, desc }) => {
      dispatch(
        updateTransaction({
          key: TX_UPDATER_KEYS.key,
          uuid: TX_UPDATER_KEYS.swapuuid,
          status,
          hash,
        }),
      )
    },
    [dispatch],
  )

  const updateWrap = useCallback(
    (status) => {
      dispatch(
        updateTransaction({
          key: TX_UPDATER_KEYS.key,
          uuid: TX_UPDATER_KEYS.wrapuuid,
          status,
        }),
      )
    },
    [dispatch],
  )

  const updateSign = useCallback(
    (status) => {
      dispatch(
        updateTransaction({
          key: TX_UPDATER_KEYS.key,
          uuid: TX_UPDATER_KEYS.signuuid,
          status,
        }),
      )
    },
    [dispatch],
  )

  const complete = useCallback(() => {
    dispatch(
      completeTransaction({
        key: TX_UPDATER_KEYS.key,
        final: 'Swap successful',
      }),
    )
  }, [dispatch])

  return {
    updateApprove,
    updateSwap,
    updateWrap,
    updateSign,
    init,
    complete,
    close,
  }
}

const isNative = (address) => {
  return address === NATIVE_TOKEN_SYMBOL || isNativeAddress(address)
}

const useSwap = () => {
  const txUpdater = useTransactionUpdater()
  const wrap = useWrap()
  const isApproved = useApproved()
  const approve = useApprove()
  const sign = useSign()
  const submitTx = useSubmitTransaction()
  const { incrementFailures } = useStore()

  return useMutation({
    mutationFn: async ({ fromAsset, toAsset, fromAmount, setFromAddress, quote }) => {
      if (!quote) {
        return
      }
      const isNativeIn = isNative(fromAsset.address)
      const isNativeOut = isNative(toAsset.address)

      let inTokenAddress = isNativeIn ? zeroAddress : fromAsset.address
      const outTokenAddress = isNativeOut ? zeroAddress : toAsset.address

      txUpdater.init({
        fromAsset,
        toAsset,
        fromAmount,
        showldWrap: isNativeIn,
        toAmount: amountUi(toAsset, new BN(quote?.outAmount)),
      })
      const inAmountBN = amountBN(fromAsset, fromAmount).toString()

      if (isNativeIn) {
        await wrap(fromAmount, TX_UPDATER_KEYS.key, TX_UPDATER_KEYS.wrapuuid, setFromAddress)
        inTokenAddress = WBNB_ADDRESS
      }
      txUpdater.updateApprove(TRANSACTION_STATUS.PENDING)
      const approved = await isApproved(inTokenAddress, inAmountBN)
      analytics.onApprovedBeforeTheTrade(approved)
      if (!approved) {
        await approve(inTokenAddress, TX_UPDATER_KEYS.key, TX_UPDATER_KEYS.approveuuid)
      } else {
        txUpdater.updateApprove(TRANSACTION_STATUS.SUCCESS)
      }

      const signature = await sign(quote.permitData)
      const tx = await submitTx({
        srcToken: inTokenAddress,
        destToken: outTokenAddress,
        srcAmount: inAmountBN,
        signature,
        quote,
      })
      txUpdater.complete()
      return tx
    },
    onError: () => {
      incrementFailures()
      analytics.onClobFailure()
    },
  })
}

const useIsDexTrade = (dexOutAmount, lhOutAmount) => {
  const lhControl = useLHControl()
  const { isFailed } = useStore()
  const { slippage } = useSettings()
  const { liquidityHubEnabled } = usePersistedStore()
  return useMemo(() => {
    if (!dexOutAmount || !lhOutAmount) return
    const _dexAmountOut = dexAmountOutWithSlippage(dexOutAmount, slippage) || ''
    const isDexTrade = new BN(_dexAmountOut).gt(new BN(lhOutAmount || '0'))
    if (lhControl === LH_CONTROL.SKIP || !liquidityHubEnabled) {
      return true
    }
    if (lhControl === LH_CONTROL.FORCE) {
      console.log('LH force mode on')
      return false
    }
    if (isFailed) {
      return true
    }

    return isDexTrade
  }, [dexOutAmount, lhOutAmount, lhControl, isFailed, liquidityHubEnabled, slippage])
}

// analytics
const ANALYTICS_VERSION = 0.1

const counter = () => {
  const now = Date.now()

  return () => {
    return Date.now() - now
  }
}

const initialAnalyticsData = {
  // _id: crypto.randomUUID(),
  _id: uuidv4(),
  partner: PARTNER,
  chainId: CHAIN_ID,
  isClobTrade: false,
  isNotClobTradeReason: 'null',
  firstFailureSessionId: 'null',
  clobDexPriceDiffPercent: 'null',
  approvalState: 'null',
  signatureState: 'null',
  swapState: 'null',
  wrapState: 'null',
  onChainClobSwapState: 'null',
  userWasApprovedBeforeTheTrade: 'null',
  isDexTrade: false,
  version: ANALYTICS_VERSION,
}

class Analytics {
  firstFailureSessionId = null
  abortController = new AbortController()

  updateAndSend(values = {}) {
    try {
      this.abortController.abort()
      this.abortController = new AbortController()
      this.data = { ...this.data, ...values }
      fetch(`https://bi.orbs.network/putes/liquidity-hub-ui-${ANALYTICS_VERSION}`, {
        method: 'POST',
        signal: this.abortController.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.data),
      }).catch((e) => {
        console.log('Analytics error', e)
      })
    } catch (error) {
      return undefined
    }
  }
  onNotClobTrade(message) {
    this.updateAndSend({ isNotClobTradeReason: message })
  }

  onApprovedBeforeTheTrade(userWasApprovedBeforeTheTrade) {
    this.updateAndSend({ userWasApprovedBeforeTheTrade })
  }

  onDexSwapRequest() {
    this.updateAndSend({ dexSwapState: 'pending', isDexTrade: true })
  }

  onDexSwapSuccess(response) {
    this.updateAndSend({
      dexSwapState: 'success',
      dexSwapTxHash: response.hash,
    })
  }
  onDexSwapFailed(dexSwapError) {
    this.updateAndSend({ dexSwapState: 'failed', dexSwapError })
  }

  onApprovalRequest() {
    this.updateAndSend({ approvalState: 'pending' })
  }

  onApprovalSuccess(time) {
    this.updateAndSend({ approvalMillis: time, approvalState: 'success' })
  }

  onApprovalFailed(error, time) {
    this.updateAndSend({
      approvalError: error,
      approvalState: 'failed',
      approvalMillis: time,
      isNotClobTradeReason: 'approval failed',
    })
  }

  onWrapRequest() {
    this.updateAndSend({ wrapState: 'pending' })
  }

  onWrapSuccess(txHash, time) {
    this.updateAndSend({
      wrapTxHash: txHash,
      wrapMillis: time,
      wrapState: 'success',
    })
  }

  onWrapFailed(error, time) {
    this.updateAndSend({
      wrapError: error,
      wrapState: 'failed',
      wrapMillis: time,
      isNotClobTradeReason: 'wrap failed',
    })
  }

  onSignatureRequest() {
    this.updateAndSend({
      signatureState: 'pending',
    })
  }

  onSignatureSuccess(signature, time) {
    this.updateAndSend({
      signature,
      signatureMillis: time,
      signatureState: 'success',
    })
  }

  onSignatureFailed(error, time) {
    this.updateAndSend({
      signatureError: error,
      signatureState: 'failed',
      signatureMillis: time,
      isNotClobTradeReason: 'signature failed',
    })
  }

  onSwapRequest() {
    this.updateAndSend({ swapState: 'pending' })
  }

  onSwapSuccess(txHash, time) {
    this.updateAndSend({
      txHash,
      swapMillis: time,
      swapState: 'success',
      isClobTrade: true,
      onChainClobSwapState: 'pending',
    })
  }

  onSwapFailed(error, time) {
    this.updateAndSend({
      swapError: error,
      swapState: 'failed',
      swapMillis: time,
      isNotClobTradeReason: 'swap failed',
    })
  }

  setSessionId(id) {
    this.data.sessionId = id
  }

  initSwap({ fromAmount, fromAsset, toAsset, dexOutAmount, toAmount, lhQuote, slippage, isDexTrade }) {
    const dstTokenUsdValue = new BN(toAmount).multipliedBy(toAsset?.price || 0).toNumber()
    this.data = {
      ...initialAnalyticsData,
      // _id: crypto.randomUUID(),
      _id: uuidv4(),
      firstFailureSessionId: this.firstFailureSessionId,
    }

    const dexAmountOut = dexAmountOutWithSlippage(dexOutAmount, slippage)
    const clobAmountOut = lhQuote?.outAmount || '0'

    const clobDexPriceDiffPercent = () => {
      if (dexAmountOut === '0') {
        return 100
      }
      if (clobAmountOut === '0') {
        return -100
      }
      // eslint-disable-next-line newline-per-chained-call
      return new BN(clobAmountOut).dividedBy(new BN(dexAmountOut)).minus(1).multipliedBy(100).toFixed(2)
    }
    this.updateAndSend({
      dexAmountOut,
      dstTokenUsdValue,
      srcTokenAddress: isNative(fromAsset?.address) ? zeroAddress : fromAsset?.address,
      srcTokenSymbol: fromAsset?.symbol,
      dstTokenAddress: isNative(toAsset?.address) ? zeroAddress : toAsset?.address,
      dstTokenSymbol: toAsset?.symbol,
      srcAmount: fromAmount,
      slippage,
      isDexTrade,
      clobDexPriceDiffPercent: clobDexPriceDiffPercent(),
    })
  }

  onClobFailure() {
    this.firstFailureSessionId = this.firstFailureSessionId || this.data.sessionId || ''
  }
}

export const analytics = new Analytics()

const useLiquidtyHubSettings = () => {
  const { liquidityHubEnabled } = usePersistedStore()

  return {
    liquidityHubEnabled,
  }
}
export const liquidityHub = {
  getTokens,
  useQuoteQuery,
  useSwap,
  useIsDexTrade,
  analytics,
  useLiquidtyHubSettings,
}

export const LiquidityHubRouting = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
      <p style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
        Via LiquidityHub powered by{' '}
        <a style={{ display: 'flex', alignItems: 'center', gap: 5 }} href='https://www.orbs.com/' target='_blank' rel='noreferrer'>
          Orbs <OrbsLogo />
        </a>
      </p>
    </div>
  )
}

export const LiquidityHubPoweredByOrbs = () => {
  return (
    <div className='mt-5' style={{ display: 'flex', justifyContent: 'center' }}>
      <a style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14 }} href='https://www.orbs.com/' target='_blank' rel='noreferrer'>
        <span className='text-[#9690b9] text-[13px] lg:text-[17px]'>Powered by</span> <span style={{ fontSize: 16 }}>Orbs</span> <OrbsLogo />
      </a>
    </div>
  )
}

const OrbsLogo = ({ width = 20, height = 20 }) => {
  return <StyledOrbsLogo style={{ width, height }} alt='Orbs logo' src='https://www.orbs.com/assets/img/common/logo.svg' />
}

export const LiquidityHubSettings = () => {
  const { liquidityHubEnabled, updateLiquidityHubEnabled } = usePersistedStore()

  return (
    <div className='w-full mt-6 md:mt-5'>
      <div
        className='flex items-center space-x-1.5'
        style={{
          justifyContent: 'space-between',
        }}
      >
        <p className='text-lightGray text-base md:text-[19px] leading-5 !font-normal'>Liquidity Hub</p>
        <Toggle onChange={updateLiquidityHubEnabled} checked={liquidityHubEnabled} rounded />
      </div>
      <div className='flex items-center space-x-[9px] mt-[9px]'>
        <SettingsDescription>
          <OrbsLogo />{' '}
          <a href='https://www.orbs.com/liquidity-hub/' target='_blank' rel='noreferrer'>
            Liquidity Hub
          </a>
          , powered by{' '}
          <a href='https://www.orbs.com' target='_blank' rel='noreferrer'>
            Orbs
          </a>
          , may provide better price by aggregating liquidity from multiple sources.{' '}
          <span>
            <a href='https://www.orbs.com/liquidity-hub/' target='_blank' rel='noreferrer'>
              For more info.
            </a>
          </span>
        </SettingsDescription>
      </div>
    </div>
  )
}

const StyledOrbsLogo = styled('img')`
  objectfit: contain;
  display: inline;
`

const SettingsDescription = styled.p`
  display: inline;
  font-size: 14px;

  a {
    opacity: 0.7;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`

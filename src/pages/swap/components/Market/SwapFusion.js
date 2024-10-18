import React, { Fragment, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Percent, TradeType } from 'thena-sdk-core'
import JSBI from 'jsbi'
import { useSettings, useWalletModal } from 'state/settings/hooks'
import { useProceedSwap } from 'hooks/useSwap'
import { getWBNBAddress } from 'utils/addressHelpers'
import { useCurrency } from 'hooks/v3/Tokens'
import { Field } from 'state/mintV3/actions'
import { tryParseAmount, unwrappedToken } from 'v3lib/utils'
import { useBestV3TradeExactIn, useBestV3TradeExactOut } from 'hooks/v3/useBestV3Trade'
import { computeRealizedLPFeePercent } from 'v3lib/utils/computeRealizedLPFeePercent'
import { formatNumber } from 'utils/formatNumber'
import { useSwapCallback } from 'hooks/v3/useSwapCallback'
import Settings from 'components/Settings'
import StyledButton from 'components/Buttons/styledButton'
import TokenInput from 'components/Input/TokenInput'
import Tab from 'components/Tab'
import WarningModal from './WarningModal'

const SwapFusion = ({ marketType, setMarketType, marketTypes, fromAsset, toAsset, setFromAddress, setToAddress }) => {
  const [isWarning, setIsWarning] = useState(false)
  const [reverseTransiction, setReverseTransiction] = useState(false)
  const [independentField, setIndependentField] = useState(Field.CURRENCY_A)
  const [typedValue, setTypedValue] = useState('')
  const { slippage, deadline } = useSettings()
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const { onWrap, onUnwrap, swapPending: wrapPending } = useProceedSwap()
  const inCurrency = useCurrency(fromAsset ? fromAsset.address : undefined)
  const outCurrency = useCurrency(toAsset ? toAsset.address : undefined)

  const isWrap = useMemo(() => {
    if (fromAsset && toAsset && fromAsset.address === 'BNB' && toAsset.address.toLowerCase() === getWBNBAddress(fromAsset.chainId).toLowerCase()) {
      return true
    }
    return false
  }, [fromAsset, toAsset])

  const isUnwrap = useMemo(() => {
    if (fromAsset && toAsset && toAsset.address === 'BNB' && fromAsset.address.toLowerCase() === getWBNBAddress(fromAsset.chainId).toLowerCase()) {
      return true
    }
    return false
  }, [fromAsset, toAsset])

  const showWrap = useMemo(() => {
    return isWrap || isUnwrap
  }, [isWrap, isUnwrap])

  const isExactIn = independentField === Field.CURRENCY_A
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inCurrency : outCurrency) ?? undefined)
  const bestV3TradeExactIn = useBestV3TradeExactIn(isExactIn ? parsedAmount : undefined, outCurrency ?? undefined)
  const bestV3TradeExactOut = useBestV3TradeExactOut(inCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)
  const v3Trade = (isExactIn ? bestV3TradeExactIn : bestV3TradeExactOut) ?? undefined
  const bestTrade = v3Trade.trade ?? undefined

  const allowedSlippage = new Percent(JSBI.BigInt(slippage * 100), JSBI.BigInt(10000))
  const { callback: swapCallback, pending: swapPending } = useSwapCallback(bestTrade, allowedSlippage, deadline)

  const dynamicFee = useMemo(() => {
    if (!bestTrade) return
    return bestTrade.swaps[0]?.route?.pools[0].fee
  }, [bestTrade])

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!bestTrade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(bestTrade)
    const realizedLPFee = bestTrade.inputAmount.multiply(realizedLpFeePercent)
    const priceImpact = bestTrade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [bestTrade])

  const priceImpactInNumber = useMemo(() => {
    return priceImpact ? Number(priceImpact.toSignificant()) : 0
  }, [priceImpact])

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.CURRENCY_A]: parsedAmount,
            [Field.CURRENCY_B]: parsedAmount,
          }
        : {
            [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? parsedAmount : bestTrade?.inputAmount,
            [Field.CURRENCY_B]: independentField === Field.CURRENCY_B ? parsedAmount : bestTrade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, bestTrade],
  )

  const formattedAmounts = useMemo(() => {
    const dependentField = isExactIn ? Field.CURRENCY_B : Field.CURRENCY_A
    return {
      [independentField]: typedValue,
      [dependentField]: showWrap ? parsedAmounts[independentField]?.toExact() ?? '' : parsedAmounts[dependentField]?.toExact() ?? '',
    }
  }, [isExactIn, showWrap, parsedAmounts, independentField, typedValue])

  const btnMsg = useMemo(() => {
    if (!account) {
      return {
        isError: true,
        label: 'Connect wallet',
      }
    }

    if (!fromAsset || !toAsset) {
      return {
        isError: true,
        label: 'Select a token',
      }
    }

    if (!parsedAmount) {
      return {
        isError: true,
        label: 'Enter an amount',
      }
    }

    if (fromAsset.balance && fromAsset.balance.lt(parsedAmounts[Field.CURRENCY_A]?.toExact())) {
      return {
        isError: true,
        label: 'Insufficient ' + fromAsset.symbol + ' balance',
      }
    }

    if (isWrap) {
      return {
        isError: false,
        label: 'Wrap',
      }
    }

    if (isUnwrap) {
      return {
        isError: false,
        label: 'Unwrap',
      }
    }

    if (!bestTrade) {
      return {
        isError: true,
        label: 'Insufficient liquidity for this trade',
      }
    }

    return {
      isError: false,
      label: 'Swap',
    }
  }, [account, fromAsset, toAsset, parsedAmount, parsedAmounts, isWrap, isUnwrap])

  const onInputFieldChange = (val) => {
    setIndependentField(Field.CURRENCY_A)
    setTypedValue(val)
  }

  const onOutputFieldChange = (val) => {
    setIndependentField(Field.CURRENCY_B)
    setTypedValue(val)
  }

  return (
    <div className='w-full max-w-[588px] mx-auto relative mt-[25px] pb-28 xl:pb-0 2xl:pb-[150px]'>
      <div className='gradient-bg shadow-[0_0_50px_#48003d] p-px relative z-[10] rounded-[5px]'>
        <div className='solid-bg rounded-[5px] px-3 md:px-6 py-3 md:py-4'>
          <div className='flex items-center justify-between'>
            <p className='font-figtree text-[23px] md:text-[27px] leading-10 text-white font-semibold'>Swap</p>
            <div className='flex items-center space-x-2'>
              {dynamicFee && !showWrap && <p className='text-secondary text-sm md:text-base leading-10'>Fee is {dynamicFee / 10000}%</p>}
              <Settings />
            </div>
          </div>
          <Tab className='mt-4 md:mt-[29px]' activeTab={marketType} setActiveTab={setMarketType} tabData={marketTypes} />
          <div className='mt-3 md:mt-[26px]'>
            <div className='flex flex-col w-full items-center justify-center'>
              <TokenInput
                title='From'
                asset={fromAsset}
                setAsset={(asset) => {
                  setFromAddress(asset.address)
                }}
                otherAsset={toAsset}
                setOtherAsset={(asset) => {
                  setToAddress(asset.address)
                }}
                amount={formattedAmounts[Field.CURRENCY_A]}
                onInputChange={(val) => {
                  onInputFieldChange(val)
                }}
              />
              <button
                onClick={() => {
                  setFromAddress(toAsset.address)
                  setToAddress(fromAsset.address)
                }}
                className='focus:outline-none my-5 z-[8]'
              >
                <img src='/images/swap/reverse-icon.svg' alt='' />
              </button>
              <TokenInput
                title='To'
                asset={toAsset}
                setAsset={(asset) => {
                  setToAddress(asset.address)
                }}
                otherAsset={fromAsset}
                setOtherAsset={(asset) => {
                  setFromAddress(asset.address)
                }}
                amount={formattedAmounts[Field.CURRENCY_B]}
                onInputChange={(val) => {
                  onOutputFieldChange(val)
                }}
              />
            </div>
          </div>

          <div className='mt-5'>
            <div className='flex items-center justify-between'>
              <p className='text-white text-sm md:text-base leading-5'>Slippage Tolerance</p>
              <p className='text-white text-sm md:text-base leading-5'>{slippage}%</p>
            </div>
          </div>

          {priceImpactInNumber > 5 && (
            <div className='mt-3'>
              <div className='flex items-center justify-center p-5 bg-[#0D1238] border border-error rounded-[3px]'>
                <p className='text-white text-sm md:text-base font-semibold'>
                  Price Impact Too High: <span className='text-error'>{formatNumber(priceImpactInNumber)}%</span>
                </p>
              </div>
            </div>
          )}

          {account ? (
            <StyledButton
              disabled={btnMsg.isError || wrapPending || swapPending}
              pending={wrapPending || swapPending}
              onClickHandler={() => {
                if (isWrap) {
                  onWrap(parsedAmount?.toExact())
                } else if (isUnwrap) {
                  onUnwrap(parsedAmount?.toExact())
                } else if (priceImpactInNumber > 5) {
                  setIsWarning(true)
                } else {
                  swapCallback()
                }
              }}
              content={btnMsg.label}
              className='py-[13px] mt-2 md:mt-3 w-full'
            />
          ) : (
            <StyledButton onClickHandler={() => openWalletModal()} content='CONNECT WALLET' className='py-[13px] mt-2 md:mt-3 w-full' />
          )}
          {bestTrade && !showWrap && (
            <>
              <div className='flex items-center justify-between mt-3'>
                <p className='text-white text-sm md:text-base leading-5'>Price:</p>
                <div className='flex items-center space-x-1.5'>
                  <p className='text-white text-sm md:text-base leading-5'>
                    {reverseTransiction
                      ? `${bestTrade.executionPrice.toSignificant(4)} ${toAsset.symbol} per ${fromAsset.symbol}`
                      : `${Number(bestTrade.executionPrice.toSignificant()) === 0 ? 0 : bestTrade.executionPrice.invert().toSignificant(4)} ${
                          fromAsset.symbol
                        } per ${toAsset.symbol}`}
                  </p>
                  <button onClick={() => setReverseTransiction(!reverseTransiction)}>
                    <img alt='' src='/images/swap/reverse-small-icon.png' />
                  </button>
                </div>
              </div>
              <div className='mt-[0.3rem]'>
                <div className='flex items-center justify-between'>
                  <p className='text-white text-sm md:text-base leading-5'>Liquidity Provider Fee</p>
                  <p className='text-white text-sm md:text-base leading-5'>
                    {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${realizedLPFee.currency.symbol}` : '-'}
                  </p>
                </div>
              </div>
              {priceImpactInNumber > 0 && (
                <div className='mt-[0.3rem]'>
                  <div className='flex items-center justify-between'>
                    <p className='text-white text-sm md:text-base leading-5'>Price Impact</p>
                    <p
                      className={`text-white text-sm md:text-base leading-5 ${
                        priceImpactInNumber < 1 ? 'text-success' : priceImpactInNumber < 2 ? 'text-white' : priceImpactInNumber < 5 ? 'text-warn' : 'text-error'
                      }`}
                    >
                      {formatNumber(priceImpactInNumber)}%
                    </p>
                  </div>
                </div>
              )}
              <div className='mt-[0.3rem]'>
                <div className='flex items-center justify-between'>
                  <p className='text-white text-sm md:text-base leading-5'>
                    {bestTrade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum Sold'}
                  </p>
                  <p className='text-white text-sm md:text-base leading-5'>
                    {bestTrade.tradeType === TradeType.EXACT_INPUT
                      ? `${bestTrade.minimumAmountOut(allowedSlippage).toSignificant(6)} ${bestTrade.outputAmount.currency.symbol}`
                      : `${bestTrade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${bestTrade.inputAmount.currency.symbol}`}
                  </p>
                </div>
              </div>
              <div className='mt-[0.3rem]'>
                <div className='flex items-center justify-between'>
                  <p className='text-white text-sm md:text-base leading-5'>Route</p>
                  <p className='text-white text-sm md:text-base leading-5 flex items-center'>
                    {bestTrade.route.tokenPath.map((token, i, path) => {
                      const isLastItem = path.length - 1 === i
                      const currency = unwrappedToken(token)
                      return (
                        <Fragment key={i}>
                          <span>{currency.symbol}</span>
                          {!isLastItem && <span className='mx-1'>{'>'}</span>}
                        </Fragment>
                      )
                    })}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        {isWarning && <WarningModal isOpen={isWarning} setIsOpen={setIsWarning} onClickHandler={swapCallback} priceImpact={priceImpactInNumber} />}
      </div>
    </div>
  )
}

export default SwapFusion

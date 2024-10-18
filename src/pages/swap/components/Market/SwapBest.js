import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ZERO_VALUE, formatNumber, fromWei, isInvalidAmount } from 'utils/formatNumber'
import { useBestQuoteSwap, useBestSwap, useProceedSwap } from 'hooks/useSwap'
import { getWBNBAddress } from 'utils/addressHelpers'
import StyledButton from 'components/Buttons/styledButton'
import TokenInput from 'components/Input/TokenInput'
import Settings from 'components/Settings'
import Tab from 'components/Tab'
import { useSettings, useWalletModal } from 'state/settings/hooks'
import { liquidityHub, LiquidityHubPoweredByOrbs, LiquidityHubRouting } from 'components/LiquidityHub'
import WarningModal from './WarningModal'

const SwapBest = ({ marketType, setMarketType, marketTypes, fromAsset, toAsset, setFromAddress, setToAddress, assets }) => {
  const [isWarning, setIsWarning] = useState(false)
  const [fromAmount, setFromAmount] = useState('')
  const { slippage } = useSettings()
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const { onBestSwap, swapPending } = useBestSwap()
  const { mutate: onLHSwap, isLoading: LHSwapPending } = liquidityHub.useSwap()
  const { data: bestTrade, isLoading: bestTradePending } = useBestQuoteSwap(fromAsset, toAsset, fromAmount, slippage)
  const { data: lhQuote, isLoading: lhQuotePending } = liquidityHub.useQuoteQuery(fromAsset, toAsset, fromAmount, bestTrade?.outAmount)
  const { onWrap, onUnwrap, swapPending: wrapPending } = useProceedSwap()
  const [reverseTransiction, setReverseTransiction] = useState(false)

  const isDexTrade = liquidityHub.useIsDexTrade(bestTrade?.outAmount, lhQuote?.outAmount)
  const quotePending = bestTradePending || lhQuotePending
  const outAmount = quotePending ? '' : isDexTrade ? bestTrade?.outAmount : lhQuote?.outAmount || '0'
  const toAmount = useMemo(() => {
    if (outAmount && toAsset) {
      return fromWei(outAmount, toAsset.decimals).toString(10)
    }
    return ''
  }, [outAmount, toAsset])

  const minimumReceived = useMemo(() => {
    if (!toAsset || !outAmount) return ''
    if (isDexTrade) {
      return `${formatNumber(
        fromWei(outAmount, toAsset.decimals)
          .times(100 - slippage)
          .div(100),
      )} ${toAsset.symbol}`
    }
    return `${formatNumber(fromWei(outAmount, toAsset.decimals))} ${toAsset.symbol}`
  }, [outAmount, toAsset, slippage, isDexTrade])

  const handleSwap = useCallback(() => {
    const dexOutAmount = bestTrade?.outAmount
    liquidityHub.analytics.initSwap({ fromAsset, toAsset, fromAmount, toAmount, slippage, lhQuote, dexOutAmount, isDexTrade })
    if (isDexTrade) {
      onBestSwap(fromAsset, toAsset, fromAmount, toAmount, slippage)
    } else {
      onLHSwap({ fromAsset, toAsset, fromAmount, setFromAddress, quote: lhQuote, dexOutAmount })
    }
  }, [fromAsset, toAsset, fromAmount, toAmount, slippage, setFromAddress, lhQuote, isDexTrade, onLHSwap, onBestSwap, bestTrade?.outAmount])

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

  const btnMsg = useMemo(() => {
    if (!account) {
      return {
        isError: true,
        label: 'CONNECT WALLET',
      }
    }

    if (!fromAsset || !toAsset) {
      return {
        isError: true,
        label: 'Select a token',
      }
    }

    if (isInvalidAmount(fromAmount)) {
      return {
        isError: true,
        label: 'Enter an amount',
      }
    }

    if (fromAsset.balance && fromAsset.balance.lt(fromAmount)) {
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

    if (outAmount === '0') {
      return {
        isError: true,
        label: 'Insufficient liquidity for this trade',
      }
    }

    return {
      isError: false,
      label: 'Swap',
    }
  }, [account, fromAsset, toAsset, fromAmount, outAmount, isWrap, isUnwrap])

  const priceImpact = useMemo(() => {
    if (fromAsset && toAsset && fromAmount && toAmount) {
      const fromInUsd = new BigNumber(fromAmount).times(fromAsset.price)
      const toInUsd = new BigNumber(toAmount).times(toAsset.price)
      return new BigNumber(((fromInUsd - toInUsd) / fromInUsd) * 100)
    }
    return ZERO_VALUE
  }, [fromAsset, toAsset, fromAmount, toAmount])

  const getTokenFromAddress = useCallback(
    (address) => {
      if (['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'].includes(address.toLowerCase())) {
        return assets.find((asset) => asset.address === 'BNB')
      }
      const found = assets.find((asset) => asset.address.toLowerCase() === address.toLowerCase())
      return found
    },
    [assets],
  )

  return (
    <div className='w-full max-w-[1104px] mx-auto flex flex-col lg:flex-row items-center lg:items-start lg:space-x-6 pb-28 xl:pb-0 2xl:pb-[150px] mt-[25px]'>
      <div className='w-full max-w-[550px]'>
        <div className='gradient-bg shadow-[0_0_50px_#48003d] p-px relative z-[10] rounded-[5px]'>
          <div className='solid-bg rounded-[5px] px-3 md:px-6 py-3 md:py-4'>
            <div className='flex items-center justify-between'>
              <p className='font-figtree text-[23px] md:text-[27px] leading-10 text-white font-semibold'>Swap</p>
              <Settings />
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
                  amount={fromAmount}
                  onInputChange={(val) => {
                    setFromAmount(val)
                  }}
                />
                <button
                  onClick={() => {
                    if (new BigNumber(toAmount).gt(0)) {
                      setFromAmount(toAmount)
                    }
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
                  amount={toAmount}
                  otherAsset={fromAsset}
                  setOtherAsset={(asset) => {
                    setFromAddress(asset.address)
                  }}
                  disabled
                />
              </div>
            </div>
            <div className='mt-5'>
              <div className='flex items-center justify-between'>
                <p className='text-white text-sm md:text-base leading-5'>Slippage Tolerance</p>
                <p className='text-white text-sm md:text-base leading-5'>{slippage}%</p>
              </div>
            </div>
            {!quotePending && priceImpact.gt(5) && (
              <div className='mt-3'>
                <div className='flex items-center justify-center p-5 bg-[#0D1238] border border-error rounded-[3px]'>
                  <p className='text-white text-sm md:text-base font-semibold'>
                    Price Impact Too High: <span className='text-error'>{formatNumber(priceImpact)}%</span>
                  </p>
                </div>
              </div>
            )}
            {account ? (
              <StyledButton
                disabled={btnMsg.isError || swapPending || LHSwapPending || wrapPending}
                pending={swapPending || LHSwapPending || wrapPending || quotePending}
                onClickHandler={() => {
                  if (isWrap) {
                    onWrap(fromAmount)
                  } else if (isUnwrap) {
                    onUnwrap(fromAmount)
                  } else if (priceImpact.gt(5)) {
                    setIsWarning(true)
                  } else {
                    handleSwap()
                  }
                }}
                content={btnMsg.label}
                className='py-[13px] mt-2 md:mt-3 w-full'
              />
            ) : (
              <StyledButton onClickHandler={() => openWalletModal()} content='CONNECT WALLET' className='py-[13px] text-white mt-2 md:mt-3 w-full' />
            )}
            {bestTrade && bestTrade.outAmount !== '0' && !quotePending && (
              <>
                <div className='flex items-center justify-between mt-3'>
                  <p className='text-white text-sm md:text-base leading-5'>Price:</p>
                  <div className='flex items-center space-x-1.5'>
                    <p className='text-white text-sm md:text-base leading-5'>
                      {reverseTransiction
                        ? `${formatNumber(new BigNumber(toAmount).div(fromAmount))} ${toAsset.symbol} per ${fromAsset.symbol}`
                        : `${formatNumber(new BigNumber(fromAmount).div(toAmount))} ${fromAsset.symbol} per ${toAsset.symbol}`}
                    </p>
                    <button onClick={() => setReverseTransiction(!reverseTransiction)}>
                      <img alt='' src='/images/swap/reverse-small-icon.png' />
                    </button>
                  </div>
                </div>
                <div className='mt-[0.3rem]'>
                  <div className='flex items-center justify-between'>
                    <p className='text-white text-sm md:text-base leading-5'>Minimum received</p>
                    <p className='text-white text-sm md:text-base leading-5'>{minimumReceived}</p>
                  </div>
                </div>
              </>
            )}
            {isDexTrade === undefined || isDexTrade ? (
              <div className='flex items-center justify-center space-x-1 mt-5'>
                <div className='text-[#9690b9] text-[13px] lg:text-[17px] mt-[2px]'>Powered by</div>
                <img src='/images/logos/openocean.svg' alt='' className='h-6 md:h-8' />
              </div>
            ) : (
              <LiquidityHubPoweredByOrbs />
            )}
          </div>
          {isWarning && <WarningModal isOpen={isWarning} setIsOpen={setIsWarning} onClickHandler={handleSwap} priceImpact={priceImpact} />}
        </div>
      </div>
      <div className='w-full max-w-[550px] mt-5 lg:mt-0'>
        <div className='gradient-bg shadow-[0_0_50px_#48003d] p-px rounded-[5px]'>
          <div className='solid-bg rounded-[5px] px-3 md:px-6 py-3 md:py-4'>
            <div className='text-white font-semibold text-[22px] font-figtree'>Routing</div>
            <div className='flex items-center justify-between mt-4'>
              <div className='flex items-center bg-[#090333] rounded-[19px] py-[7px] px-[12px] space-x-[6px]'>
                <img src={fromAsset?.logoURI} alt='' className='w-[22px] h-[22px]' />
                <span className='text-[13px] md:text-base text-white'>
                  {formatNumber(fromAmount)} {fromAsset?.symbol}
                </span>
              </div>
              <div className='flex items-center bg-[#090333] rounded-[19px] py-[7px] px-[12px] space-x-[6px]'>
                <span className='text-[13px] md:text-base text-white'>
                  {formatNumber(toAmount)} {toAsset?.symbol}
                </span>
                <img src={toAsset?.logoURI} alt='' className='w-[22px] h-[22px]' />
              </div>
            </div>

            <div className='px-[22px]'>
              {!lhQuote || !bestTrade || isDexTrade === undefined ? null : !isDexTrade ? (
                <LiquidityHubRouting />
              ) : (
                bestTrade.path.routes.map((route, index) => {
                  return (
                    <div
                      className={`relative flex py-4 px-4 after:w-[60px] before:absolute before:left-0
                      before:top-0 before:w-full before:h-[48px] before:rounded-b-[24px] before:border-dashed before:border-lightGray before:border-b ${
                        index === bestTrade.path.routes.length - 1 ? 'before:border-x' : 'border-x border-dashed border-lightGray'
                      }`}
                      key={`route-${index}`}
                    >
                      <div className='py-2 px-3 rounded-[19px] bg-[#090333] relative text-white text-base w-fit h-fit mt-[10px]'>{route.percentage}%</div>
                      <div className='relative flex grow px-3'>
                        <div className='w-full flex justify-between overflow-hidden space-x-4 before:content-[""] after:content-[""]'>
                          {route.subRoutes.map((subRoute, idx) => {
                            const token = getTokenFromAddress(subRoute.to)
                            return (
                              <div className='rounded-2 px-3 py-2 bg-[#090333] rounded-[19px] w-fit space-y-1' key={`subroute-${idx}`}>
                                <div className='flex items-center py-[7px] space-x-[6px]'>
                                  <img src={token?.logoURI} alt='' className='w-[22px] h-[22px]' />
                                  <span className='text-base md:text-[18px] text-white'>{token?.symbol}</span>
                                </div>
                                {subRoute.dexes.map((dex, index) => {
                                  return (
                                    <div className='text-[12px] md:text-[14px] text-white pl-1 space-x-1' key={`dex-${dex.dex}-${index}`}>
                                      <span>{dex.dex === 'Thena' ? 'V1' : 'FUSION'}</span>
                                      <span>{dex.percentage}%</span>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapBest

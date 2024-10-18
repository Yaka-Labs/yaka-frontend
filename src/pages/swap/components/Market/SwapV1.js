import React, { useCallback, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useSettings, useWalletModal, useNetwork } from 'state/settings/hooks'
import { ZERO_VALUE, formatNumber, getWrappedAddress, isInvalidAmount, ZERO_ADDRESS } from 'utils/formatNumber'
import { useProceedSwap, useQuoteSwap } from 'hooks/useSwap'
import { getWBNBAddress } from 'utils/addressHelpers'
import useDebounce from 'hooks/useDebounce'
import Spinner from 'components/Spinner'
import StyledButton from 'components/Buttons/styledButton'
import TokenInput from 'components/Input/TokenInput'
import Settings from 'components/Settings'
import Tab from 'components/Tab'
import WarningModal from './WarningModal'
import useCheckInviter from '../../../../hooks/useCheckInviter'
import { toast } from 'react-toastify'
import { CURRENCY_LIST } from '../../../../config/constants'

const SwapV1 = ({ marketType, setMarketType, marketTypes, fromAsset, toAsset, setFromAddress, setToAddress, inviter }) => {
  const [isWarning, setIsWarning] = useState(false)
  const [fromAmount, setFromAmount] = useState('')
  const [reverseTransiction, setReverseTransiction] = useState(false)
  const { slippage, deadline } = useSettings()
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const debouncedFromAmount = useDebounce(fromAmount)
  const { bestTrade, quotePending } = useQuoteSwap(fromAsset, toAsset, debouncedFromAmount)
  const { onSwap, onWrap, onUnwrap, swapPending } = useProceedSwap(inviter)
  const { networkId } = useNetwork()
  const toAmount = useMemo(() => {
    if (bestTrade) {
      return bestTrade.finalValue.toString(10)
    }
    if (fromAsset && toAsset && getWrappedAddress(fromAsset) === getWrappedAddress(toAsset)) {
      return fromAmount
    }
    return ''
  }, [bestTrade, fromAsset, toAsset, fromAmount])

  const priceImpact = useMemo(() => {
    if (fromAsset && toAsset && fromAmount && toAmount) {
      const fromInUsd = new BigNumber(fromAmount).times(fromAsset.price)
      const toInUsd = new BigNumber(toAmount).times(toAsset.price)
      return new BigNumber(((fromInUsd - toInUsd) / fromInUsd) * 100).abs()
    }
    return ZERO_VALUE
  }, [fromAsset, toAsset, fromAmount, toAmount])

  const isWrap = useMemo(() => {
    if (
      fromAsset &&
      toAsset &&
      fromAsset.address.toLowerCase() === CURRENCY_LIST[fromAsset.chainId].toLowerCase() &&
      toAsset.address.toLowerCase() === getWBNBAddress(fromAsset.chainId).toLowerCase()
    ) {
      return true
    }
    return false
  }, [fromAsset, toAsset])

  const isUnwrap = useMemo(() => {
    if (
      fromAsset &&
      toAsset &&
      toAsset.address.toLowerCase() === CURRENCY_LIST[fromAsset.chainId].toLowerCase() &&
      fromAsset.address.toLowerCase() === getWBNBAddress(fromAsset.chainId).toLowerCase()
    ) {
      return true
    }
    return false
  }, [fromAsset, toAsset])

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
  }, [account, fromAsset, toAsset, fromAmount, bestTrade, isWrap, isUnwrap])

  const isInviter = useCheckInviter(inviter)

  const handleSwap = useCallback(() => {
    // console.log(inviter, isInviter)
    // if (localStorage.getItem('inviter') && !isInviter && localStorage.getItem('inviter') !== ZERO_ADDRESS) {
    //   localStorage.setItem('inviter', ZERO_ADDRESS)
    //   toast.error(`Invalid inviter`, {
    //     icon: false,
    //     style: { width: '300px' },
    //   })
    //   return
    // }
    onSwap(fromAsset, toAsset, fromAmount, bestTrade, slippage, deadline, inviter)
  }, [fromAsset, toAsset, fromAmount, bestTrade, slippage, deadline, inviter])

  return (
    <div className='w-full max-w-[499.8px] mx-auto relative mt-[21.25px] pb-[95.2px] xl:pb-0 2xl:pb-[127.5px]'>
      <div className='gradient-bg shadow-[0_0_50px_#48003d] p-px relative z-[10] rounded-[4.25px]'>
        <div className='solid-bg rounded-[4.25px] px-3 md:px-[20.4px] py-3 md:py-13.6px'>
          <div className='flex items-center justify-between'>
            <p className='font-figtree text-[23px] md:text-[22.95px] leading-[34px] text-white font-semibold'>Swap</p>
            <Settings />
          </div>
          {/*{networkId === 1329 ? (*/}
          {/*  <Tab className='mt-4 md:mt-[29px]' activeTab={marketType} setActiveTab={setMarketType} tabData={['V1']} />*/}
          {/*) : (*/}
          {/*  <Tab className='mt-4 md:mt-[29px]' activeTab={marketType} setActiveTab={setMarketType} tabData={marketTypes} />*/}
          {/*)}*/}
          <div className='mt-3 md:mt-[22.1px]'>
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
                className='focus:outline-none my-[17px] z-[8]'
              >
                <img src='/images/swap/reverse-icon.svg' alt='' />
              </button>
              <TokenInput
                title='To'
                asset={toAsset}
                setAsset={(asset) => {
                  setToAddress(asset.address)
                }}
                setOtherAsset={(asset) => {
                  setFromAddress(asset.address)
                }}
                amount={toAmount}
                otherAsset={fromAsset}
                disabled
              />
            </div>
          </div>

          <div className='mt-[17px]'>
            <div className='flex items-center justify-between'>
              <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>Slippage Tolerance</p>
              <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>{slippage}%</p>
            </div>
          </div>

          {priceImpact.gt(5) && (
            <div className='mt-[10.2px]'>
              <div className='flex items-center justify-center p-[17px] border border-error rounded-[6.8px]'>
                <p className='text-white text-sm md:text-[13.6px] font-semibold'>
                  Price Impact Too High: <span className='text-error'>{formatNumber(priceImpact)}%</span>
                </p>
              </div>
            </div>
          )}

          {account ? (
            <StyledButton
              disabled={btnMsg.isError}
              pending={swapPending}
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
              className='py-[11.05px] mt-2 md:mt-[10.2px] w-full'
            />
          ) : (
            <StyledButton onClickHandler={() => openWalletModal()} content='CONNECT WALLET' className='py-[11.05px] text-white mt-2 md:mt-[10.2px] w-full' />
          )}

          {bestTrade && (
            <>
              <div className='flex items-center justify-between mt-[10.2px]'>
                <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>Price:</p>
                {quotePending ? (
                  <Spinner />
                ) : (
                  <div className='flex items-center space-x-[5.1px]'>
                    <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>
                      {reverseTransiction
                        ? `${formatNumber(new BigNumber(toAmount).div(fromAmount))} ${toAsset.symbol} per ${fromAsset.symbol}`
                        : `${formatNumber(new BigNumber(fromAmount).div(toAmount))} ${fromAsset.symbol} per ${toAsset.symbol}`}
                    </p>
                    <button onClick={() => setReverseTransiction(!reverseTransiction)}>
                      <img alt='' src='/images/swap/reverse-small-icon.png' />
                    </button>
                  </div>
                )}
              </div>
              <div className='mt-[0.255rem]'>
                <div className='flex items-center justify-between'>
                  <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>Minimum received</p>
                  <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>
                    {formatNumber(bestTrade.finalValue.times(100 - slippage).div(100))} {toAsset.symbol}
                  </p>
                </div>
              </div>
              {priceImpact.gt(0) && (
                <div className='mt-[0.255rem]'>
                  <div className='flex items-center justify-between'>
                    <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>Price Impact</p>
                    <p
                      className={`text-white text-sm md:text-[13.6px] leading-[17px] ${
                        priceImpact.lt(1) ? 'text-success' : priceImpact.lt(2) ? 'text-white' : priceImpact.lt(5) ? 'text-warn' : 'text-error'
                      }`}
                    >
                      {formatNumber(priceImpact)}%
                    </p>
                  </div>
                </div>
              )}
              <div className='flex items-center justify-between mt-[0.255rem]'>
                <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>Route:</p>
              </div>
              <div className='flex relative items-center mt-[23.8px] justify-between'>
                <img className='z-1 w-7 sm:w-[32.3px] -ml-0.5 sm:-ml-1' alt='' src={fromAsset.logoURI} />
                <div className='relative flex flex-col items-center'>
                  <p className='text-[13px] md:text-sm text-white absolute -top-7'>{bestTrade.routes[0].stable ? 'Stable' : 'Volatile'}</p>
                  <img className='z-1 w-[18px] sm:w-[20.4px]' alt='' src='/images/swap/route-arrow.svg' />
                </div>
                {bestTrade.base && bestTrade.base.length === 1 && (
                  <>
                    <img className='z-1 w-7 sm:w-[32.3px]' alt='' src={bestTrade.base[0].logoURI} />
                    <div className='relative flex flex-col items-center'>
                      <p className='text-[13px] md:text-sm text-white absolute -top-7'>{bestTrade.routes[1].stable ? 'Stable' : 'Volatile'}</p>
                      <img className='z-1 w-[18px] sm:w-[20.4px]' alt='' src='/images/swap/route-arrow.svg' />
                    </div>
                  </>
                )}
                {bestTrade.base && bestTrade.base.length === 2 && (
                  <>
                    <img className='z-1 w-7 sm:w-[32.3px]' alt='' src={bestTrade.base[0].logoURI} />
                    <div className='relative flex flex-col items-center'>
                      <p className='text-[13px] md:text-sm text-white absolute -top-7'>{bestTrade.routes[1].stable ? 'Stable' : 'Volatile'}</p>
                      <img className='z-1 w-[18px] sm:w-[20.4px]' alt='' src='/images/swap/route-arrow.svg' />
                    </div>
                    <img className='z-1 w-7 sm:w-[32.3px]' alt='' src={bestTrade.base[1].logoURI} />
                    <div className='relative flex flex-col items-center'>
                      <p className='text-[13px] md:text-sm text-white absolute -top-7'>{bestTrade.routes[2].stable ? 'Stable' : 'Volatile'}</p>
                      <img className='z-1 w-[18px] sm:w-[20.4px]' alt='' src='/images/swap/route-arrow.svg' />
                    </div>
                  </>
                )}
                <img className='z-1 w-7 sm:w-[32.3px] -mr-0.5 sm:-mr-1' alt='' src={toAsset.logoURI} />
                <div className='border-custom w-full h-0.5  absolute' />
              </div>
            </>
          )}
        </div>
        {isWarning && <WarningModal isOpen={isWarning} setIsOpen={setIsWarning} onClickHandler={handleSwap} priceImpact={priceImpact} />}
      </div>
    </div>
  )
}

export default SwapV1

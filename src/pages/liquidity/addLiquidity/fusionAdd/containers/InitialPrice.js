import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useInitialTokenPrice, useInitialUSDPrices, useV3MintActionHandlers } from 'state/mintV3/hooks'
import useUSDTPrice from 'hooks/v3/useUSDTPrice'
import { Field, setInitialTokenPrice, setInitialUSDPrices } from 'state/mintV3/actions'
import StyledButton from 'components/Buttons/styledButton'

const TokenPrice = ({ baseCurrency, quoteCurrency, basePrice, quotePrice, isLocked, userQuoteCurrencyToken, changeQuotePriceHandler }) => {
  const [tokenQuotePrice, setTokenQuotePrice] = useState(userQuoteCurrencyToken || '')
  const baseSymbol = useMemo(() => (baseCurrency ? baseCurrency.symbol : '-'), [baseCurrency])
  const quoteSymbol = useMemo(() => (quoteCurrency ? quoteCurrency.symbol : '-'), [quoteCurrency])

  const tokenRatio = useMemo(() => {
    if (!basePrice || !quotePrice) return 'Loading...'

    return String((+basePrice.toSignificant(5) / +quotePrice.toSignificant(5)).toFixed(5))
  }, [basePrice, quotePrice])

  return (
    <div className='flex items-center space-x-2 mt-2.5 md:mt-3'>
      <div className='py-[11px] md:py-[15px] px-2.5 md:px-[18px] text-[13px] md:text-base text-white leading-4 md:leading-5 font-medium bg-[#0D092D] rounded-[3px] flex-shrink-0'>
        1 {baseSymbol}
      </div>
      <span className='text-white leading-4  md:leading-5 font-medium text-[13px] md:text-lg'>=</span>
      <div className='pl-[18px] bg-[#0D092D] rounded-[3px] flex items-center max-h-[38px] md:max-h-[50px] w-full'>
        <div className='text-white text-[13px] md:text-base leading-4 md:leading-5 font-medium'>{quoteSymbol}</div>
        <div className='ml-[5px] h-[38px] md:h-[50px] md:ml-[18px] border border-[#ED00C9] rounded-r-[3px] py-2 pl-2.5 md:pl-3.5 pr-2 flex items-center justify-between w-full'>
          {isLocked ? (
            <span className='text-[13px] md:text-base text-white'>{tokenRatio}</span>
          ) : (
            <>
              <input
                placeholder={`${baseCurrency?.symbol} in ${quoteCurrency?.symbol}`}
                value={tokenQuotePrice}
                onChange={(e) => {
                  setTokenQuotePrice(e.target.value)
                }}
                type='number'
                lang='en'
                className='bg-transparent placeholder-[#B8B6CB] text-[13px] md:text-base w-[60%] text-white focus:outline-none'
              />
              <StyledButton
                onClickHandler={() => changeQuotePriceHandler(tokenQuotePrice)}
                disabled={!tokenQuotePrice}
                content='Confirm'
                className='py-[5px] px-1 md:px-3'
                isCap
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const InitialPrice = ({ currencyA, currencyB, mintInfo }) => {
  const { onStartPriceInput: startPriceHandler } = useV3MintActionHandlers(mintInfo.noLiquidity)
  const dispatch = useDispatch()
  const initialUSDPrices = useInitialUSDPrices()
  const initialTokenPrice = useInitialTokenPrice()
  const basePriceUSD = useUSDTPrice(currencyA ?? undefined)
  const quotePriceUSD = useUSDTPrice(currencyB ?? undefined)
  const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped)

  const [userQuoteCurrencyToken, setUserQuoteCurrencyToken] = useState(
    mintInfo && isSorted ? mintInfo.price?.toSignificant(5) : mintInfo.price?.invert().toSignificant(5) || undefined,
  )

  const isLocked = useMemo(() => Boolean(basePriceUSD && quotePriceUSD), [basePriceUSD, quotePriceUSD])

  useEffect(() => {
    if (!initialUSDPrices.CURRENCY_A && basePriceUSD) {
      dispatch(
        setInitialUSDPrices({
          field: Field.CURRENCY_A,
          typedValue: basePriceUSD.toSignificant(8),
        }),
      )
    }
    if (!initialUSDPrices.CURRENCY_B && quotePriceUSD) {
      dispatch(
        setInitialUSDPrices({
          field: Field.CURRENCY_B,
          typedValue: quotePriceUSD.toSignificant(8),
        }),
      )
    }
    if (!initialTokenPrice && basePriceUSD && quotePriceUSD) {
      dispatch(
        setInitialTokenPrice({
          typedValue: String((+basePriceUSD.toSignificant(8) / +quotePriceUSD.toSignificant(8)).toFixed(5)),
        }),
      )
    }
  }, [basePriceUSD, initialTokenPrice, initialUSDPrices.CURRENCY_A, initialUSDPrices.CURRENCY_B, quotePriceUSD])

  const handleTokenChange = useCallback(
    (_typedValue) => {
      if (!_typedValue) {
        dispatch(setInitialTokenPrice({ typedValue: '' }))
        dispatch(setInitialUSDPrices({ field: Field.CURRENCY_A, typedValue: '' }))
        dispatch(setInitialUSDPrices({ field: Field.CURRENCY_B, typedValue: '' }))
        startPriceHandler('')
        setUserQuoteCurrencyToken('')
        return
      }

      setUserQuoteCurrencyToken(_typedValue)

      const typedValue = String(parseFloat(_typedValue))

      dispatch(setInitialTokenPrice({ typedValue }))

      startPriceHandler(typedValue)

      const usdA = basePriceUSD?.toSignificant(5) || initialUSDPrices.CURRENCY_A
      const usdB = quotePriceUSD?.toSignificant(5) || initialUSDPrices.CURRENCY_B

      if (usdA && usdA !== '0') {
        if (!basePriceUSD) {
          const newUSDA = (+usdA * +typedValue) / (+initialTokenPrice || 1)
          const fixedA = newUSDA ? parseFloat(newUSDA.toFixed(8)) : '0'
          dispatch(
            setInitialUSDPrices({
              field: Field.CURRENCY_A,
              typedValue: String(fixedA),
            }),
          )
          startPriceHandler(String(fixedA))
        }
      } else if (usdB) {
        dispatch(
          setInitialUSDPrices({
            field: Field.CURRENCY_A,
            typedValue: String(parseFloat(String((+usdB * +typedValue) / (+initialTokenPrice || 1)))),
          }),
        )
      }

      if (usdB && usdB !== '0') {
        if (!quotePriceUSD) {
          const newUSDB = (+usdB * +typedValue) / (+initialTokenPrice || 1)
          const fixedB = newUSDB ? parseFloat(newUSDB.toFixed(8)) : '0'
          dispatch(
            setInitialUSDPrices({
              field: Field.CURRENCY_B,
              typedValue: String(fixedB),
            }),
          )
          startPriceHandler(String(fixedB))
        }
      } else if (usdA) {
        dispatch(
          setInitialUSDPrices({
            field: Field.CURRENCY_B,
            typedValue: String(parseFloat(String((+usdA * +typedValue) / (+initialTokenPrice || 1)))),
          }),
        )
      }
    },
    [dispatch, startPriceHandler, basePriceUSD, initialUSDPrices.CURRENCY_A, initialUSDPrices.CURRENCY_B, quotePriceUSD, initialTokenPrice],
  )

  useEffect(() => {
    if (initialTokenPrice) {
      startPriceHandler(initialTokenPrice)
      setUserQuoteCurrencyToken(initialTokenPrice)
    }
  }, [initialTokenPrice])

  const autoFetchText = useMemo(() => {
    if (isLocked) {
      return 'Prices were auto-fetched'
    }
    if (!basePriceUSD && !quotePriceUSD) {
      return "Can't auto-fetch prices"
    }
    if (!basePriceUSD) {
      return `Can't auto-fetch ${currencyA?.symbol} price`
    }
    return `Can't auto-fetch ${currencyB?.symbol} price`
  }, [isLocked, basePriceUSD, quotePriceUSD, currencyA, currencyB])

  return (
    <div className='w-full mt-4 md:mt-5'>
      <p className='text-[13px] md:text-base leading-5 text-[#B8B6CB]'>Set Initial Price</p>
      {(isLocked || !basePriceUSD || !quotePriceUSD) && (
        <div className='pl-3 md:pl-3.5 pr-4 py-2.5 flex items-center space-x-[10px] md:space-x-[11.5px] max-w-fit border bg-[#0D1238] border-[#EDB831] rounded-[5px] mt-2'>
          <img alt='' src='/images/mark/warn-mark.svg' />
          <div className='w-px h-6 bg-[#EDB831]' />
          <p className='font-figtree text-white font-medium md:text-base text-sm'>{autoFetchText}</p>
        </div>
      )}
      <TokenPrice
        baseCurrency={currencyA}
        quoteCurrency={currencyB}
        basePrice={basePriceUSD}
        quotePrice={quotePriceUSD}
        isLocked={isLocked}
        userQuoteCurrencyToken={userQuoteCurrencyToken}
        changeQuotePriceHandler={(v) => handleTokenChange(v)}
      />
    </div>
  )
}

export default InitialPrice

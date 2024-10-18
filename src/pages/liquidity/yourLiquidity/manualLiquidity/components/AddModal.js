import React, { useCallback, useMemo, useState } from 'react'
import { CurrencyAmount } from 'thena-sdk-core'
import { useToken } from 'hooks/v3/Tokens'
import { maxAmountSpend, tryParseAmount, unwrappedToken } from 'v3lib/utils'
import { useCurrencyLogo } from 'hooks/v3/useCurrencyLogo'
import { formatCurrencyAmount } from 'v3lib/utils/formatTickPrice'
import { useAlgebraIncrease } from 'hooks/v3/useAlgebra'
import { Field } from 'state/mintV3/actions'
import { customNotify } from 'utils/notify'
import { useCurrencyBalances } from 'hooks/v3/useCurrencyBalances'
import { Position } from 'thena-fusion-sdk'
import StyledButton from 'components/Buttons/styledButton'
import Modal from 'components/Modal'
import { TokenAmountCard } from 'pages/liquidity/addLiquidity/fusionAdd/components/TokenAmountCard'
import SelectedRange from './SelectedRange'

const slippage = 0.5
const deadline = 1200

const AddModal = ({ isOpen, setIsOpen, position, positionDetails, pool }) => {
  const [typedValue, setTypedValue] = useState('')
  const [independentField, setIndependentField] = useState(Field.CURRENCY_A)
  const { token0: _token0Address, token1: _token1Address, fee, tickLower, tickUpper } = positionDetails

  const tokenA = useToken(_token0Address)
  const tokenB = useToken(_token1Address)

  const currencyA = tokenA ? unwrappedToken(tokenA) : undefined
  const currencyB = tokenB ? unwrappedToken(tokenB) : undefined
  const logoURIA = useCurrencyLogo(currencyA)
  const logoURIB = useCurrencyLogo(currencyB)
  const currencies = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA,
      [Field.CURRENCY_B]: currencyB,
    }),
    [currencyA, currencyB],
  )
  const balances = useCurrencyBalances([currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]])

  const currencyBalances = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  }

  const independentCurrency = useMemo(() => {
    return currencies[independentField]
  }, [currencies, independentField])

  const independentAmount = useMemo(() => {
    return tryParseAmount(typedValue, independentCurrency)
  }, [typedValue, independentCurrency])

  const dependentAmount = useMemo(() => {
    // we wrap the currencies just to get the price in terms of the other token
    const wrappedIndependentAmount = independentAmount?.wrapped
    const dependentCurrency = independentField === Field.CURRENCY_A ? currencyB : currencyA
    if (independentAmount && wrappedIndependentAmount && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      const pos = wrappedIndependentAmount.currency.equals(pool.token0)
        ? Position.fromAmount0({
            pool,
            tickLower,
            tickUpper,
            amount0: independentAmount.quotient,
            useFullPrecision: true, // we want full precision for the theoretical position
          })
        : Position.fromAmount1({
            pool,
            tickLower,
            tickUpper,
            amount1: independentAmount.quotient,
          })

      const dependentTokenAmount = wrappedIndependentAmount.currency.equals(pool.token0) ? pos.amount1 : pos.amount0
      return dependentCurrency && CurrencyAmount.fromRawAmount(dependentCurrency, dependentTokenAmount.quotient)
    }

    return undefined
  }, [independentAmount, currencyB, currencyA, tickLower, tickUpper, independentField])

  const parsedAmounts = useMemo(() => {
    return {
      [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
      [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount,
    }
  }, [dependentAmount, independentAmount, independentField])

  const pos = useMemo(() => {
    if (!pool || !tokenA || !tokenB || typeof tickLower !== 'number' || typeof tickUpper !== 'number') {
      return undefined
    }

    // mark as 0 if disabled because out of range
    const amount0 = parsedAmounts?.[tokenA.equals(pool.token0) ? Field.CURRENCY_A : Field.CURRENCY_B]?.quotient
    const amount1 = parsedAmounts?.[tokenA.equals(pool.token0) ? Field.CURRENCY_B : Field.CURRENCY_A]?.quotient

    if (amount0 !== undefined && amount1 !== undefined) {
      return Position.fromAmounts({
        pool,
        tickLower,
        tickUpper,
        amount0,
        amount1,
        useFullPrecision: true, // we want full precision for the theoretical position
      })
    } else {
      return undefined
    }
  }, [parsedAmounts, pool, tokenA, tokenB, tickLower, tickUpper])

  const { onAlgebraIncrease, pending: algebraPending } = useAlgebraIncrease()

  // get formatted amounts
  const formattedAmounts = useMemo(() => {
    const dependentField = Field.CURRENCY_A === independentField ? Field.CURRENCY_B : Field.CURRENCY_A
    return {
      [independentField]: typedValue,
      [dependentField]: parsedAmounts[dependentField]?.toExact() ?? '',
    }
  }, [typedValue, independentField, parsedAmounts])

  const maxAmounts = [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    }
  }, {})

  const onFieldAInput = useCallback(
    (val) => {
      setIndependentField(Field.CURRENCY_A)
      setTypedValue(val)
    },
    [setTypedValue, setIndependentField],
  )

  const onFieldBInput = useCallback(
    (val) => {
      setIndependentField(Field.CURRENCY_B)
      setTypedValue(val)
    },
    [setTypedValue, setIndependentField],
  )

  const errorMessage = useMemo(() => {
    if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
      return 'Enter an amount'
    }

    const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

    if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
      return `Insufficient ${currencies[Field.CURRENCY_A]?.symbol} balance`
    }

    if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
      return `Insufficient ${currencies[Field.CURRENCY_B]?.symbol} balance`
    }
    return null
  }, [parsedAmounts, currencyBalances])

  const onAddLiquidity = useCallback(() => {
    if (errorMessage) {
      customNotify(errorMessage, 'warn')
      return
    }
    const amountA = parsedAmounts[Field.CURRENCY_A]
    const amountB = parsedAmounts[Field.CURRENCY_B]
    const tokenId = positionDetails.tokenId
    onAlgebraIncrease(amountA, amountB, pos, slippage, deadline, tokenId)
  }, [errorMessage, parsedAmounts, pos, slippage, deadline, positionDetails])

  return (
    <Modal popup={isOpen} setPopup={setIsOpen} title='Add Liquidity' width={499.8}>
      <div className='px-[13.6px] pt-[17px] pb-[10.2px] rounded-[4.25px] bg-[#0D1238] border border-[#0000AF] mt-[11.05px]'>
        <div className='flex items-start md:items-center justify-between cursor-pointer'>
          <div className='flex items-center space-x-[10.2px] '>
            <div className='flex items-center'>
              <img alt='' className='w-6 lg:w-[25.5px] relative shadow' src={logoURIA} />
              <img alt='' className='w-6 lg:w-[25.5px] -ml-3' src={logoURIB} />
            </div>
            <p className='text-[13px] lg:text-[16.15px] font-figtree font-semibold text-white'>
              {currencyA?.symbol}/{currencyB?.symbol}
            </p>
          </div>
          <div className='bg-white bg-opacity-[0.09] py-[3.4px] pl-[10.2px] md:mt-[6.8px] rounded-[11.05px] max-w-[82.45px] w-full flex items-center space-x-[4.25px] pr-[13.6px] flex-shrink-0'>
            <div className='w-[6.8px] h-[6.8px] bg-[#55A361] rounded-full' />
            <span className='text-[12.75px] fonts-medium text-white whitespace-nowrap'>In range</span>
          </div>
        </div>
        <div className='mt-[13.6px]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-[4.25px]'>
              <img alt='' src={logoURIA} className='w-[22px] md:w-[20.4px]' />
              <span className='text-[15px] md:text-[15.3px] leading-[18px] md:leading-[18.7px] text-white font-figtree font-semibold'>{currencyA?.symbol}</span>
            </div>
            <div className='flex items-center space-x-[6.8px]'>
              <span className='text-lightGray leading-[17px]'>{formatCurrencyAmount(position.amount0, 4)}</span>
            </div>
          </div>
          <div className='flex items-center justify-between mt-[6.8px]'>
            <div className='flex items-center space-x-[4.25px]'>
              <img alt='' src={logoURIB} className='w-[22px] md:w-[20.4px]' />
              <span className='text-[15px] md:text-[15.3px] leading-[18px] md:leading-[18.7px] text-white font-figtree font-semibold'>{currencyB?.symbol}</span>
            </div>
            <div className='flex items-center space-x-[6.8px]'>
              <span className='text-lightGray leading-[17px]'>{formatCurrencyAmount(position.amount1, 4)}</span>
            </div>
          </div>
          <div className='my-[13.6px] flex items-center justify-between pb-[13.6px] border-b border-[#5E6282]'>
            <p className='text-lightGray leading-4 md:leading-[17px] text-[12.75px]'>Fee</p>
            <span className='leading-[17px] text-white text-sm md:text-[13.6px]'>{fee || '0.01'}%</span>
          </div>
          <SelectedRange pool={pool} currency0={currencyA} currency1={currencyB} positionDetails={positionDetails} />
          <div className='mt-4 md:mt-[17px]'>
            <p className='text-[13px] md:text-[13.6px] leading-[17px] text-[#B8B6CB]'>Add More Liquidity</p>
            <div className='mt-[10.2px]'>
              <TokenAmountCard
                currency={currencyA}
                value={formattedAmounts[Field.CURRENCY_A]}
                handleInput={onFieldAInput}
                maxAmount={maxAmounts[Field.CURRENCY_A]}
                locked={false}
              />
            </div>
            <div className='mt-[17px]'>
              <TokenAmountCard
                currency={currencyB}
                value={formattedAmounts[Field.CURRENCY_B]}
                handleInput={onFieldBInput}
                maxAmount={maxAmounts[Field.CURRENCY_B]}
                locked={false}
              />
            </div>
          </div>
          <StyledButton disabled={algebraPending} onClickHandler={onAddLiquidity} content='ADD LIQUIDITY' className='py-[11.05px] mt-[10.2px] px-[16.15px] w-full' />
        </div>
      </div>
    </Modal>
  )
}

export default AddModal

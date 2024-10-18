import React from 'react'
import { Field } from 'state/mintV3/actions'
import { maxAmountSpend } from 'v3lib/utils'
import { useV3MintActionHandlers, useV3MintState } from 'state/mintV3/hooks'
import { TokenAmountCard } from '../components/TokenAmountCard'

export const EnterAmounts = ({ currencyA, currencyB, mintInfo }) => {
  const { independentField, typedValue, liquidityRangeType } = useV3MintState()
  const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers(mintInfo.noLiquidity)

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [mintInfo.dependentField]: mintInfo.parsedAmounts[mintInfo.dependentField]?.toExact() ?? '',
  }

  // get the max amounts user can add
  const maxAmounts = [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(mintInfo.currencyBalances[field]),
    }
  }, {})

  // const currencyAError = useMemo(() => {
  //   if (
  //     (mintInfo.errorCode !== 4 && mintInfo.errorCode !== 5) ||
  //     !mintInfo.errorMessage ||
  //     !currencyA
  //   )
  //     return;

  //   const erroredToken = mintInfo.errorMessage.split(' ')[1];

  //   if (currencyA.wrapped.symbol === erroredToken) return mintInfo.errorMessage;

  //   return;
  // }, [mintInfo, currencyA]);

  // const currencyBError = useMemo(() => {
  //   if (
  //     (mintInfo.errorCode !== 5 && mintInfo.errorCode !== 4) ||
  //     !mintInfo.errorMessage ||
  //     !currencyB
  //   )
  //     return;

  //   const erroredToken = mintInfo.errorMessage.split(' ')[1];

  //   if (currencyB.wrapped.symbol === erroredToken) return mintInfo.errorMessage;

  //   return;
  // }, [mintInfo, currencyB]);

  return (
    <div className='mt-4 md:mt-5'>
      <p className='text-[13px] md:text-base leading-5 text-[#B8B6CB]'>Deposit Amounts</p>
      <div className='mt-3'>
        <TokenAmountCard
          currency={currencyA}
          value={formattedAmounts[Field.CURRENCY_A]}
          handleInput={onFieldAInput}
          maxAmount={maxAmounts[Field.CURRENCY_A]}
          locked={mintInfo.depositADisabled}
          liquidityRangeType={liquidityRangeType}
        />
      </div>
      <div className='mt-5'>
        <TokenAmountCard
          currency={currencyB}
          value={formattedAmounts[Field.CURRENCY_B]}
          handleInput={onFieldBInput}
          maxAmount={maxAmounts[Field.CURRENCY_B]}
          locked={mintInfo.depositBDisabled}
          liquidityRangeType={liquidityRangeType}
        />
      </div>
    </div>
  )
}

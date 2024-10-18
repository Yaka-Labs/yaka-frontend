import React, { useCallback, useMemo } from 'react'
import JSBI from 'jsbi'
import { WBNB } from 'thena-sdk-core'
import { Field } from 'state/mintV3/actions'
import { useProceedSwap } from 'hooks/useSwap'
import { useCurrencyBalance } from 'hooks/v3/useCurrencyBalances'
import { customNotify } from 'utils/notify'
import { useGammaAdd } from 'hooks/v3/useGamma'
import { useAlgebraAdd } from 'hooks/v3/useAlgebra'
import { ZERO_ADDRESS } from 'utils/formatNumber'
import StyledButton from 'components/Buttons/styledButton'
import { FusionRangeType } from 'config/constants'
import { useDefiedgeAdd } from 'hooks/v3/useDefiedge'
import { useNetwork } from 'state/settings/hooks'

export const AddLiquidityButton = ({ baseCurrency, quoteCurrency, mintInfo, slippage, deadline, activeGamma, activeDefiedge }) => {
  const { liquidityRangeType, errorMessage } = mintInfo
  const { onWrap, swapPending: wrappingETH } = useProceedSwap()
  const { onGammaAdd, onGammaAddAndStake, pending: gammaPending } = useGammaAdd()
  const { onAlgebraAdd, pending: algebraPending } = useAlgebraAdd()
  const { onDefiedgeAdd, onDefiedgeAddAndStake, pending: defiedgePending } = useDefiedgeAdd()
  const { networkId } = useNetwork()
  const amountA = mintInfo.parsedAmounts[Field.CURRENCY_A]
  const amountB = mintInfo.parsedAmounts[Field.CURRENCY_B]
  const wbnbBalance = useCurrencyBalance(WBNB[networkId])

  const amountToWrap = useMemo(() => {
    if (!baseCurrency || !quoteCurrency || !amountA || !amountB || liquidityRangeType === FusionRangeType.MANUAL_RANGE) return
    if (baseCurrency.isNative || baseCurrency.wrapped.address.toLowerCase() === WBNB[networkId].address.toLowerCase()) {
      if (wbnbBalance && JSBI.greaterThan(amountA.numerator, wbnbBalance.numerator)) {
        return JSBI.subtract(amountA.numerator, wbnbBalance.numerator)
      }
    } else if (quoteCurrency.isNative || quoteCurrency.wrapped.address.toLowerCase() === WBNB[networkId].address.toLowerCase()) {
      if (wbnbBalance && JSBI.greaterThan(amountB.numerator, wbnbBalance.numerator)) {
        return JSBI.subtract(amountB.numerator, wbnbBalance.numerator)
      }
    }
  }, [amountA, amountB, baseCurrency, quoteCurrency, liquidityRangeType, wbnbBalance])

  const onAddLiquidity = useCallback(() => {
    if (errorMessage) {
      customNotify(errorMessage, 'warn')
      return
    }
    if (liquidityRangeType === FusionRangeType.GAMMA_RANGE) {
      onGammaAdd(amountA, amountB, amountToWrap, activeGamma)
    } else if (liquidityRangeType === FusionRangeType.DEFIEDGE_RANGE) {
      onDefiedgeAdd(amountA, amountB, amountToWrap, activeDefiedge)
    } else {
      onAlgebraAdd(amountA, amountB, baseCurrency, quoteCurrency, mintInfo, slippage, deadline)
    }
  }, [
    errorMessage,
    activeGamma,
    activeDefiedge,
    amountToWrap,
    onWrap,
    onGammaAdd,
    baseCurrency,
    quoteCurrency,
    liquidityRangeType,
    amountA,
    amountB,
    mintInfo,
    slippage,
    deadline,
  ])

  const onAddLiquidityAndStake = useCallback(() => {
    if (errorMessage) {
      customNotify(errorMessage, 'warn')
      return
    }
    if (activeGamma) {
      onGammaAddAndStake(amountA, amountB, amountToWrap, activeGamma)
    } else {
      onDefiedgeAddAndStake(amountA, amountB, amountToWrap, activeDefiedge)
    }
  }, [errorMessage, amountToWrap, onGammaAddAndStake, amountA, amountB, activeGamma, activeDefiedge])

  return (
    <div>
      {((activeGamma && activeGamma.gauge.address !== ZERO_ADDRESS) || (activeDefiedge && activeDefiedge.gauge.address !== ZERO_ADDRESS)) && (
        <StyledButton
          disabled={wrappingETH || gammaPending || algebraPending || defiedgePending}
          onClickHandler={onAddLiquidityAndStake}
          content='ADD LIQUIDITY AND STAKE'
          className='py-[13px] px-[19px] w-full mt-3'
        />
      )}
      <StyledButton
        disabled={wrappingETH || gammaPending || algebraPending || defiedgePending}
        onClickHandler={onAddLiquidity}
        content='ADD LIQUIDITY'
        className='py-[13px] px-[19px] w-full mt-3'
      />
    </div>
  )
}

import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useCurrency } from 'hooks/v3/Tokens'
import { useV3DerivedMintInfo, useV3MintActionHandlers } from 'state/mintV3/hooks'
import { Field, setInitialTokenPrice, setInitialUSDPrices, updateSelectedPreset } from 'state/mintV3/actions'
import StyledButton from 'components/Buttons/styledButton'
import PairsDropDown from 'components/PairsDropDown'
import { useWeb3React } from '@web3-react/core'
import { useNetwork, useWalletModal } from 'state/settings/hooks'
import { useAssets } from 'state/assets/hooks'
import SelectRange from './containers/SelectRange'
import { EnterAmounts } from './containers/EnterAmounts'
import { AddLiquidityButton } from './containers/AddLiquidityButton'
import InitialPrice from './containers/InitialPrice'
import { DEFAULT_CHAIN_ID } from '../../../../config/constants'

const feeAmount = 3000

const ManualAdd = ({ slippage, deadline, priceFormat }) => {
  const [firstAsset, setFirstAsset] = useState()
  const [secondAsset, setSecondAsset] = useState()
  const baseCurrency = useCurrency(firstAsset ? firstAsset.address : undefined)
  const currencyB = useCurrency(secondAsset ? secondAsset.address : undefined)
  const quoteCurrency = baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB
  const mintInfo = useV3DerivedMintInfo(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, baseCurrency ?? undefined, undefined)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [init, setInit] = useState(false)
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const assets = useAssets()
  const { networkId } = useNetwork()

  useEffect(() => {
    const inputCurrency = searchParams.get('currency0')
    const outputCurrency = searchParams.get('currency1')
    const from = inputCurrency ? assets.find((asset) => asset.address.toLowerCase() === inputCurrency.toLowerCase()) : null
    const to = outputCurrency ? assets.find((asset) => asset.address.toLowerCase() === outputCurrency.toLowerCase()) : null
    if (!from) {
      if (!firstAsset) {
        if (networkId === DEFAULT_CHAIN_ID) {
          setFirstAsset(assets.find((asset) => asset.symbol === 'YAKA'))
        } else {
          setFirstAsset(assets.find((asset) => asset.symbol === 'BNB'))
        }
      }
    } else if (!init) {
      setFirstAsset(from)
      setInit(true)
    }
    if (!to) {
      if (!secondAsset) {
        if (networkId === DEFAULT_CHAIN_ID) {
          setSecondAsset(assets.find((asset) => asset.symbol === 'SAI'))
        } else {
          setSecondAsset(assets.find((asset) => asset.symbol === 'YAKA'))
        }
      }
    } else if (!init) {
      setSecondAsset(to)
      setInit(true)
    }
  }, [assets, searchParams])

  const { onStartPriceInput, onLeftRangeInput, onRightRangeInput } = useV3MintActionHandlers(mintInfo.noLiquidity)

  const resetState = useCallback(() => {
    dispatch(updateSelectedPreset({ preset: null }))
    dispatch(setInitialTokenPrice({ typedValue: '' }))
    dispatch(setInitialUSDPrices({ field: Field.CURRENCY_A, typedValue: '' }))
    dispatch(setInitialUSDPrices({ field: Field.CURRENCY_B, typedValue: '' }))
    onStartPriceInput('')
    onLeftRangeInput('')
    onRightRangeInput('')
  }, [dispatch, onStartPriceInput])

  const handleCurrencyASelect = useCallback(() => {
    resetState()
  }, [resetState])

  const handleCurrencyBSelect = useCallback(() => {
    resetState()
  }, [resetState])

  useEffect(() => {
    resetState()
  }, [])

  return (
    <div className='mt-4 md:mt-5'>
      <p className='text-[13px] md:text-base leading-5 text-[#B8B6CB]'>Select Pair</p>
      <div className='flex items-center mt-[6px] md:mt-2 w-full space-x-[7px] md:space-x-4'>
        <PairsDropDown
          asset={firstAsset}
          setAsset={setFirstAsset}
          otherAsset={secondAsset}
          setOtherAsset={setSecondAsset}
          onAssetSelect={handleCurrencyASelect}
        />
        <button
          className='flex-shrink-0 w-[30px] md:w-auto'
          onClick={() => {
            const temp = firstAsset
            setFirstAsset(secondAsset)
            setSecondAsset(temp)
          }}
        >
          <img alt='square-plus icon' src='/images/common/square-plus.svg' />
        </button>
        <PairsDropDown
          asset={secondAsset}
          setAsset={setSecondAsset}
          otherAsset={firstAsset}
          setOtherAsset={setFirstAsset}
          onAssetSelect={handleCurrencyBSelect}
        />
      </div>
      {mintInfo.noLiquidity && baseCurrency && quoteCurrency && (
        <InitialPrice currencyA={baseCurrency ?? undefined} currencyB={quoteCurrency} mintInfo={mintInfo} />
      )}
      <SelectRange currencyA={baseCurrency} currencyB={quoteCurrency} mintInfo={mintInfo} priceFormat={priceFormat} />
      <EnterAmounts currencyA={baseCurrency ?? undefined} currencyB={quoteCurrency} mintInfo={mintInfo} />
      {account ? (
        <AddLiquidityButton
          baseCurrency={baseCurrency ?? undefined}
          quoteCurrency={quoteCurrency ?? undefined}
          mintInfo={mintInfo}
          slippage={slippage}
          deadline={deadline}
        />
      ) : (
        <StyledButton onClickHandler={openWalletModal} content='CONNECT WALLET' className='mt-3 py-[13px] px-[19px] w-full' />
      )}
    </div>
  )
}

export default ManualAdd

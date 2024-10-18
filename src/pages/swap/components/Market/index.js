import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {DEFAULT_CHAIN_ID, MARKET_TYPES} from 'config/constants'
import { getTHEAddress } from 'utils/addressHelpers'
import { ZERO_ADDRESS } from 'utils/formatNumber'
import { useAssets } from 'state/assets/hooks'
import { useNetwork } from 'state/settings/hooks'
import { ChainId } from 'thena-sdk-core'
import SwapBest from './SwapBest'
import SwapV1 from './SwapV1'
import SwapFusion from './SwapFusion'
import {DEFAULT_SWAP_TOKEN_ADDRESS} from "../../constants";

const SwapMarket = () => {
  const [marketType, setMarketType] = useState(null)
  const [fromAsset, setFromAsset] = useState(null)
  const [toAsset, setToAsset] = useState(null)
  const [inviter, setInviter] = useState(ZERO_ADDRESS)
  const [fromAddress, setFromAddress] = useState(null)
  const [toAddress, setToAddress] = useState(null)
  const assets = useAssets()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { networkId } = useNetwork()

  const marketTypes = useMemo(() => {
    return networkId === ChainId.BSC ? MARKET_TYPES : MARKET_TYPES.slice(1)
  }, [networkId])

  useEffect(() => {
    setMarketType(networkId === ChainId.BSC ? marketTypes[0] : marketTypes[1])
  }, [networkId])

  useEffect(() => {
    if (assets.length === 0) return
    const inputCurrency = searchParams.get('inputCurrency')
    const outputCurrency = searchParams.get('outputCurrency')
    const inviterParam = window.localStorage.getItem('inviter')
    const from = inputCurrency ? assets.find((asset) => asset.address.toLowerCase() === inputCurrency.toLowerCase()) : null
    const to = outputCurrency ? assets.find((asset) => asset.address.toLowerCase() === outputCurrency.toLowerCase()) : null
    if (inviterParam) {
      setInviter(inviterParam)
    }
    if (from && to) {
      setFromAsset(from)
      setToAsset(to)
      if (!fromAddress) setFromAddress(from.address)
      if (!toAddress) setToAddress(to.address)
    } else if (!from && to) {
      if (networkId === DEFAULT_CHAIN_ID) {
        setFromAddress(DEFAULT_SWAP_TOKEN_ADDRESS[DEFAULT_CHAIN_ID]['fromAddress'])
      } else {
        setFromAddress('BNB')
      }
    } else if (from && from.address !== 'BNB' && !to) {
      if (networkId === DEFAULT_CHAIN_ID) {
        setFromAddress(DEFAULT_SWAP_TOKEN_ADDRESS[DEFAULT_CHAIN_ID]['fromAddress'])
      } else {
        setFromAddress('BNB')
      }
    } else {
      setFromAddress(networkId === DEFAULT_CHAIN_ID ? 'SEI' : 'BNB')
      setToAddress(networkId === DEFAULT_CHAIN_ID ? DEFAULT_SWAP_TOKEN_ADDRESS[DEFAULT_CHAIN_ID]['toAddress'] : getTHEAddress(networkId) || '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3')
    }
  }, [assets, searchParams])

  useEffect(() => {
    if (!fromAddress || !toAddress) return
    navigate(`/swap?inputCurrency=${fromAddress}&outputCurrency=${toAddress}`)
  }, [fromAddress, toAddress])
  return (
    <>
      {networkId === ChainId.BSC && marketType === MARKET_TYPES[0] && (
        <SwapBest
          marketType={marketType}
          setMarketType={setMarketType}
          fromAsset={fromAsset}
          toAsset={toAsset}
          setFromAddress={setFromAddress}
          setToAddress={setToAddress}
          assets={assets}
          marketTypes={marketTypes}
        />
      )}
      {marketType === MARKET_TYPES[1] && (
        <SwapFusion
          marketType={marketType}
          setMarketType={setMarketType}
          marketTypes={marketTypes}
          fromAsset={fromAsset}
          toAsset={toAsset}
          setFromAddress={setFromAddress}
          setToAddress={setToAddress}
        />
      )}
      {marketType === MARKET_TYPES[2] && (
        <SwapV1
          marketType={marketType}
          setMarketType={setMarketType}
          marketTypes={marketTypes}
          fromAsset={fromAsset}
          toAsset={toAsset}
          setFromAddress={setFromAddress}
          setToAddress={setToAddress}
          inviter={inviter}
        />
      )}
    </>
  )
}

export default SwapMarket

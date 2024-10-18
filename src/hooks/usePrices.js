import { useEffect, useState } from 'react'
import { getETHAddress, getTHEAddress, getWBNBAddress } from 'utils/addressHelpers'
import { useAssets } from 'state/assets/hooks'
import { useSelector } from 'react-redux'
import { ChainId } from 'thena-sdk-core'
import { DEFAULT_CHAIN_ID } from '../config/constants'

const usePrices = () => {
  const [prices, setPrices] = useState({
    THE: 0,
    BNB: 0,
    ETH: 0,
    PSTAKE: 0,
    liveTHE: 0,
  })
  const { data } = useSelector((state) => state.assets)

  useEffect(() => {
    // const assets = data[ChainId.BSC]
    // if (assets.length > 0) {
    //   const theAsset = assets.find((asset) => asset.address.toLowerCase() === getTHEAddress(ChainId.BSC).toLowerCase())
    //   const bnbAsset = assets.find((asset) => asset.address.toLowerCase() === getWBNBAddress(ChainId.BSC).toLowerCase())
    //   const ethAsset = assets.find((asset) => asset.address.toLowerCase() === getETHAddress(ChainId.BSC).toLowerCase())
    //   const pstakeAsset = assets.find((asset) => asset.address.toLowerCase() === '0x4c882ec256823ee773b25b414d36f92ef58a7c0c')
    //   const liveTHEAsset = assets.find((asset) => asset.address.toLowerCase() === '0xcdc3a010a3473c0c4b2cb03d8489d6ba387b83cd')
    //   setPrices({
    //     THE: theAsset?.price || 0,
    //     BNB: bnbAsset?.price || 0,
    //     ETH: ethAsset?.price || 0,
    //     PSTAKE: pstakeAsset?.price || 0,
    //     liveTHE: liveTHEAsset?.price || 0,
    //   })
    const assets = data[DEFAULT_CHAIN_ID]
    if (assets.length > 0) {
      const theAsset = assets.find((asset) => asset.address.toLowerCase() === getTHEAddress(DEFAULT_CHAIN_ID).toLowerCase())
      const bnbAsset = assets.find((asset) => asset.address.toLowerCase() === getWBNBAddress(DEFAULT_CHAIN_ID).toLowerCase())
      // const ethAsset = assets.find((asset) => asset.address.toLowerCase() === getETHAddress(DEFAULT_CHAIN_ID).toLowerCase())
      const pstakeAsset = assets.find((asset) => asset.address.toLowerCase() === '0x4c882ec256823ee773b25b414d36f92ef58a7c0c')
      const liveTHEAsset = assets.find((asset) => asset.address.toLowerCase() === '0xcdc3a010a3473c0c4b2cb03d8489d6ba387b83cd')
      setPrices({
        THE: theAsset?.price || 0,
        BNB: bnbAsset?.price || 0,
        ETH: 0, //ethAsset?.price ||
        PSTAKE: pstakeAsset?.price || 0,
        liveTHE: liveTHEAsset?.price || 0,
      })
    }
  }, [data])

  return prices
}

export const useTokenPrice = (address) => {
  const [price, setPrice] = useState(0)
  const assets = useAssets()

  useEffect(() => {
    if (assets.length > 0) {
      const asset = assets.find((asset) => asset.address.toLowerCase() === address.toLowerCase())
      setPrice(asset ? asset.price : 0)
    }
  }, [assets])

  return price
}

export default usePrices

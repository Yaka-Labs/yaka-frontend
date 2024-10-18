import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGammasInfo } from 'hooks/v3/useGamma'
import Spinner from 'components/Spinner'
import Switch from 'components/Switch'
import { FusionRangeType } from 'config/constants'
import { useIchiVaultsInfo } from 'hooks/v3/useIchi'
import { useDefiedgesInfo } from 'hooks/v3/useDefiedge'
import { useV3MintActionHandlers } from 'state/mintV3/hooks'
import { useNetwork, useSettings } from 'state/settings/hooks'
import { ChainId } from 'thena-sdk-core'
import SingleAdd from './singleAdd'
import GammaAdd from './gammaAdd'
import DefiedgeAdd from './defiedgeAdd'
import ManualAdd from './manualAdd'

export const PriceFormats = {
  TOKEN: 'TOKEN',
  USD: 'USD',
}

const priceFormat = PriceFormats.TOKEN

const FusionAdd = () => {
  const [activeRange, setActiveRange] = useState(null)
  const [activeVault, setActiveVault] = useState(null)
  const [activeGamma, setActiveGamma] = useState(null)
  const [activeDefiedge, setActiveDefiedge] = useState(null)
  const { slippage, deadline } = useSettings()
  const navigate = useNavigate()
  const gammaPairs = useGammasInfo()
  const ichiPairs = useIchiVaultsInfo()
  const defiedgePairs = useDefiedgesInfo()
  const { onChangeLiquidityRangeType } = useV3MintActionHandlers()
  const [searchParams] = useSearchParams()
  const { networkId } = useNetwork()

  useEffect(() => {
    const type = searchParams.get('type')
    if (type && Object.values(FusionRangeType).includes(type)) {
      onChangeLiquidityRangeType(type)
      setActiveRange(type)
      const address = searchParams.get('address')

      if (address) {
        switch (type) {
          case FusionRangeType.ICHI_RANGE: {
            if (!ichiPairs[0]) return
            const found = ichiPairs.find((ele) => ele.address === address)
            if (found) {
              setActiveVault(found)
            } else {
              navigate(`/add?type=${type}`, { replace: true })
            }
            break
          }
          case FusionRangeType.GAMMA_RANGE: {
            if (!gammaPairs[0]) return
            const found = gammaPairs.find((ele) => ele.address === address)
            if (found) {
              setActiveGamma(found)
            } else {
              navigate(`/add?type=${type}`, { replace: true })
            }
            break
          }
          case FusionRangeType.DEFIEDGE_RANGE: {
            if (!defiedgePairs[0]) return
            const found = defiedgePairs.find((ele) => ele.address === address)
            if (found) {
              setActiveDefiedge(found)
            } else {
              navigate(`/add?type=${type}`, { replace: true })
            }
            break
          }

          default:
            break
        }
      } else if (type === FusionRangeType.ICHI_RANGE && ichiPairs[0]) {
        navigate(`/add?type=${type}&address=${ichiPairs[0].address}`, { replace: true })
      } else if (type === FusionRangeType.GAMMA_RANGE && gammaPairs[0]) {
        navigate(`/add?type=${type}&address=${gammaPairs[0].address}`, { replace: true })
      } else if (type === FusionRangeType.DEFIEDGE_RANGE && defiedgePairs[0]) {
        navigate(`/add?type=${type}&address=${defiedgePairs[0].address}`, { replace: true })
      }
    } else {
      navigate(`/add?type=${networkId === ChainId.BSC ? FusionRangeType.ICHI_RANGE : FusionRangeType.MANUAL_RANGE}`, { replace: true })
    }
  }, [searchParams, ichiPairs, gammaPairs, defiedgePairs])

  return (
    <div>
      <Switch data={Object.values(FusionRangeType)} active={activeRange} setActive={(val) => navigate(`/add?type=${val}`, { replace: true })} />
      <div className='mt-4 md:mt-5'>
        {activeRange === FusionRangeType.ICHI_RANGE ? (
          activeVault ? (
            <SingleAdd activeVault={activeVault} vaults={ichiPairs} slippage={slippage} />
          ) : (
            <div className='w-full flex justify-center'>
              <Spinner />
            </div>
          )
        ) : activeRange === FusionRangeType.GAMMA_RANGE ? (
          activeGamma && networkId === ChainId.BSC ? (
            <GammaAdd activeGamma={activeGamma} gammaPairs={gammaPairs} slippage={slippage} deadline={deadline} priceFormat={priceFormat} />
          ) : (
            <div className='w-full flex justify-center'>
              <div className='w-full flex justify-center'>{networkId === ChainId.BSC ? <Spinner /> : 'Coming Soon!'}</div>
            </div>
          )
        ) : activeRange === FusionRangeType.DEFIEDGE_RANGE ? (
          activeDefiedge && networkId === ChainId.BSC ? (
            <DefiedgeAdd activeDefiedge={activeDefiedge} defiedgeStrategies={defiedgePairs} slippage={slippage} deadline={deadline} priceFormat={priceFormat} />
          ) : (
            <div className='w-full flex justify-center'>
              <div className='w-full flex justify-center'>{networkId === ChainId.BSC ? <Spinner /> : 'Coming Soon!'}</div>
            </div>
          )
        ) : (
          <ManualAdd slippage={slippage} deadline={deadline} priceFormat={priceFormat} />
        )}
      </div>
    </div>
  )
}

export default FusionAdd

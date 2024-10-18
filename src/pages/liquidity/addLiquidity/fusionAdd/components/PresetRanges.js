import React, { useMemo } from 'react'
import { Presets } from 'state/mintV3/reducer'
import { useV3MintActionHandlers } from 'state/mintV3/hooks'
import { PoolState } from 'hooks/v3/useFusions'
import Spinner from 'components/Spinner'
import PoolStats from './PoolStats'

const PresetProfits = {
  VERY_LOW: 'VERY_LOW',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
}

export const PresetRanges = ({
  mintInfo,
  baseCurrency,
  quoteCurrency,
  isStablecoinPair,
  activePreset,
  handlePresetRangeSelection,
  priceLower,
  price,
  priceUpper,
}) => {
  // const [init, setInit] = useState(false)
  const { onChangePresetRange } = useV3MintActionHandlers(mintInfo.noLiquidity)

  const ranges = useMemo(() => {
    if (isStablecoinPair) {
      return [
        {
          type: Presets.STABLE,
          title: 'Stable',
          min: 0.984,
          max: 1.016,
          risk: PresetProfits.VERY_LOW,
          profit: PresetProfits.HIGH,
        },
      ]
    }

    return [
      {
        type: Presets.FULL,
        title: 'Full range',
        min: 0,
        max: Infinity,
        risk: PresetProfits.VERY_LOW,
        profit: PresetProfits.VERY_LOW,
      },
      {
        type: Presets.SAFE,
        title: 'Safe',
        min: 0.8,
        max: 1.4,
        risk: PresetProfits.LOW,
        profit: PresetProfits.LOW,
      },
      {
        type: Presets.NORMAL,
        title: 'Common',
        min: 0.9,
        max: 1.2,
        risk: PresetProfits.MEDIUM,
        profit: PresetProfits.MEDIUM,
      },
      {
        type: Presets.RISK,
        title: 'Expert',
        min: 0.95,
        max: 1.1,
        risk: PresetProfits.HIGH,
        profit: PresetProfits.HIGH,
      },
    ]
  }, [isStablecoinPair])

  const risk = useMemo(() => {
    if (!priceUpper || !priceLower || !price) return

    const upperPercent = 100 - (+price / +priceUpper) * 100
    const lowerPercent = Math.abs(100 - (+price / +priceLower) * 100)

    const rangePercent = +priceLower > +price && +priceUpper > 0 ? upperPercent - lowerPercent : upperPercent + lowerPercent

    if (rangePercent < 7.5) {
      return 5
    } else if (rangePercent < 15) {
      return (15 - rangePercent) / 7.5 + 4
    } else if (rangePercent < 30) {
      return (30 - rangePercent) / 15 + 3
    } else if (rangePercent < 60) {
      return (60 - rangePercent) / 30 + 2
    } else if (rangePercent < 120) {
      return (120 - rangePercent) / 60 + 1
    } else {
      return 1
    }
  }, [price, priceLower, priceUpper])

  const _risk = useMemo(() => {
    const res = []
    const split = risk?.toString().split('.')

    if (!split) return

    for (let i = 0; i < 5; i++) {
      if (i < +split[0]) {
        res.push(100)
      } else if (i === +split[0]) {
        res.push(parseFloat('0.' + split[1]) * 100)
      } else {
        res.push(0)
      }
    }

    return res
  }, [risk])

  const feeString = useMemo(() => {
    if (mintInfo.poolState === PoolState.INVALID || mintInfo.poolState === PoolState.LOADING) return <Spinner />

    if (mintInfo.noLiquidity) return '0.3% fee'

    return `${(mintInfo.dynamicFee / 10000).toFixed(3)}% fee`
  }, [mintInfo])

  return (
    <div className='mt-2'>
      <div className='flex space-x-3'>
        {ranges.map((range, i) => (
          <button
            onClick={() => {
              if (activePreset === range.type) {
                handlePresetRangeSelection(null)
              } else {
                handlePresetRangeSelection(range)
              }
              onChangePresetRange(range)
            }}
            className={`py-2 w-full max-w-[25%] text-center rounded-full bg-[#090333] border text-xs lg:text-sm transition-all ${
              activePreset === range.type ? 'border-[#0000FF] text-white font-semibold' : 'border-[#090333] text-[#B8B6CB]'
            } hover:text-white hover:font-semibold`}
            key={i}
          >
            {range.title}
          </button>
        ))}
      </div>
      <div className='flex justify-between space-x-3 mt-[14px]'>
        {baseCurrency && quoteCurrency && (
          <PoolStats
            fee={feeString}
            loading={mintInfo.poolState === PoolState.LOADING || mintInfo.poolState === PoolState.INVALID}
            noLiquidity={mintInfo.noLiquidity}
          />
        )}
        {_risk && !mintInfo.invalidRange && !isStablecoinPair && (
          <div className='w-1/2 px-2.5 md:px-5 py-2 md:py-3 bg-[#080331] rounded-xl'>
            <div className='flex mt-1 items-center justify-between'>
              <span className='text-[13px] md:text-[15px] text-[#DAD8ED] leading-4 md:leading-[19px]'>Risk:</span>
              <div className='flex items-center'>
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className='w-[13px] h-[13px] ml-[5px] rounded-[100%] overflow-hidden bg-placeholder'>
                    <div key={`risk-${i}`} className='relative h-[13px] bg-error' style={{ left: `calc(-100% + ${_risk[i]}%)` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className='flex mt-1 items-center justify-between'>
              <span className='text-[13px] md:text-[15px] text-[#DAD8ED] leading-4 md:leading-[19px]'>Profit:</span>
              <div className='flex items-center'>
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className='w-[13px] h-[13px] ml-[5px] rounded-[100%] overflow-hidden bg-placeholder'>
                    <div key={`profit-${i}`} className='relative h-[13px] bg-success' style={{ left: `calc(-100% + ${_risk[i]}%)` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

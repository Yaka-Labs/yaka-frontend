import React, { useMemo } from 'react'
import { useEpochTimer, useSupply } from 'hooks/useGeneral'
import usePrices from 'hooks/usePrices'
import { formatNumber } from 'utils/formatNumber'
import './style.scss'
import { useGlobalData } from 'context/GlobalData'
import { ANALYTIC_VERSIONS } from 'config/constants'

const Details = () => {
  const prices = usePrices()
  const { days, hours, mins, epoch } = useEpochTimer()
  const { circSupply, lockedSupply } = useSupply()
  const { totalLiquidityUSD, volumeUSD } = useGlobalData(ANALYTIC_VERSIONS.total)

  const details = useMemo(() => {
    return [
      {
        title: 'TOTAL VALUE LOCKED',
        value: totalLiquidityUSD && totalLiquidityUSD > 0 ? `$${formatNumber(totalLiquidityUSD)}` : '-',
      },
      {
        title: 'CIRCULATING MARKET CAP',
        value: prices ? `$${formatNumber(circSupply * prices.THE)}` : '-',
      },
      {
        title: 'CIRCULATING SUPPLY',
        value: circSupply > 0 ? `${formatNumber(circSupply)}` : '-',
      },
      {
        title: 'THE PRICE',
        value: prices ? `$${formatNumber(prices.THE)}` : '-',
      },
      {
        title: '24H TRADING VOLUME',
        value: volumeUSD ? `$${formatNumber(volumeUSD)}` : '-',
      },
      {
        title: 'TOTAL LOCKED YAKA',
        value: lockedSupply ? `${formatNumber(lockedSupply)}` : '-',
      },
      {
        title: `EPOCH ${epoch} ENDS IN`,
        value: `${days}d ${hours}h ${mins}m`,
      },
    ]
  }, [prices, totalLiquidityUSD, circSupply, lockedSupply, mins, volumeUSD])

  return (
    <div className='details-container'>
      <div className='container-1 mx-auto'>
        <div className='details-body'>
          {details.map((item, index) => {
            return (
              <div className='details-item' key={`details-${index}`}>
                <img alt='' className='absolute z-[0] max-w-[180px] lg:max-w-[240px]' src='/images/home/detail-bg.png' />
                <div className='details-item-title font-figtree relative z-[1] whitespace-nowrap'>{item.title}</div>
                <div className='details-item-vaule relative z-[1]'>{item.value}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Details

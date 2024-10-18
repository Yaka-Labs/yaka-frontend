import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useGlobalChartData, useGlobalData } from 'context/GlobalData'
import { useAnalyticsVersion } from 'hooks/useGeneral'
import { formatNumber } from 'utils/formatNumber'
import { useAllPairData } from 'context/PairData'
import { useAllTokenData } from 'context/TokenData'
import { ANALYTIC_VERSIONS } from 'config/constants'
import { getChartDates, getPercentChange, getYAXISValuesAnalytics } from 'utils/analyticsHelper'
import AreaChart from 'components/AreaChart'
import PercentChip from 'components/ChipLabel/percentChip'
import TokensTable from '../tokensTable'
import PairsTable from '../pairsTable'

const Index = () => {
  const version = useAnalyticsVersion()
  const globalData = useGlobalData(version)
  const globalChartData = useGlobalChartData(version)
  const tokens = useAllTokenData(version)
  const pairs = useAllPairData(version)
  const v1pairs = useAllPairData(ANALYTIC_VERSIONS.v1)
  const navigate = useNavigate()
  const liquidityData = globalChartData ? globalChartData.daily.map((item) => item.totalLiquidityUSD) : null
  const volumeData = globalChartData ? globalChartData.daily.map((item) => item.dailyVolumeUSD) : null

  const details = useMemo(() => {
    if (Object.keys(globalData).length > 0) {
      const { totalLiquidityUSD, liquidityChangeUSD, feesUSD, prevFeesUSD, feesChange, volumeUSD, volumeChange } = globalData
      let totalFeesUSD = feesUSD
      let prevTotalFeesUSD = prevFeesUSD
      let totalFeesChange = feesChange
      if (version !== ANALYTIC_VERSIONS.fusion) {
        totalFeesUSD += v1pairs.reduce((acc, cur) => {
          return acc + cur.oneDayFeesUSD
        }, 0)
        prevTotalFeesUSD += v1pairs.reduce((acc, cur) => {
          return acc + cur.prevFeesUSD
        }, 0)
        totalFeesChange = getPercentChange(totalFeesUSD, prevTotalFeesUSD)
      }
      return [
        {
          key: '24H Volume:',
          value: volumeUSD,
          percentage: volumeChange,
        },
        {
          key: '24H Fees:',
          value: totalFeesUSD,
          percentage: totalFeesChange,
        },
        {
          key: 'TVL:',
          value: totalLiquidityUSD,
          percentage: liquidityChangeUSD,
        },
      ]
    }
    return []
  }, [globalData, version, v1pairs])

  return (
    <>
      <div className='md:flex space-y-5 md:space-y-0 md:space-x-6 mt-6'>
        <div className='gradient-bg p-px rounded-md w-full md:w-1/2'>
          <div className='analytics-box-internal rounded-md px-6 py-[22px] h-full'>
            <div>
              <div className='text-lightGray font-figtree text-sm lg:text-base'>LIQUIDITY</div>
              <div className='mt-1 flex items-center space-x-3'>
                <div className='text-white font-bold text-[20px] lg:text-[27px]'>${formatNumber(globalData?.totalLiquidityUSD)}</div>
                <PercentChip value={globalData?.liquidityChangeUSD} />
              </div>
              <div className='text-[#B8B6CB] text-[10px] lg:text-[15px]'>{dayjs().format('MMM DD, YYYY')}</div>
            </div>
            {liquidityData && (
              <AreaChart
                data={liquidityData}
                yAxisValues={getYAXISValuesAnalytics(liquidityData)}
                dates={globalChartData.daily.map((value) => value.date)}
                height={275}
                categories={getChartDates(globalChartData.daily)}
              />
            )}
          </div>
        </div>
        <div className='gradient-bg p-px rounded-md w-full md:w-1/2'>
          <div className='analytics-box-internal rounded-md px-6 py-[22px] h-full'>
            <div>
              <div className='text-lightGray font-figtree text-sm lg:text-base'>VOLUME</div>
              <div className='mt-1 flex items-center space-x-3'>
                <div className='text-white font-bold text-[20px] lg:text-[27px]'>${formatNumber(globalData?.volumeUSD)}</div>
                <PercentChip value={globalData?.volumeChange} />
              </div>
              <div className='text-[#B8B6CB] text-[10px] lg:text-[15px]'>{dayjs().format('MMM DD, YYYY')}</div>
            </div>
            {volumeData && (
              <AreaChart
                data={volumeData}
                yAxisValues={getYAXISValuesAnalytics(volumeData)}
                dates={globalChartData.daily.map((value) => value.date)}
                height={275}
                categories={getChartDates(globalChartData.daily)}
              />
            )}
          </div>
        </div>
      </div>
      <div className='w-full mt-[30px] md:mt-10'>
        <div className='w-full bg-[#111642] px-4 py-4 lg:px-5 lg:py-[15px] rounded-[5px]'>
          <div className='lg:flex items-center'>
            {details.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`lg:w-1/3 ${idx === 1 ? 'py-3 lg:py-0 my-3 lg:my-0 border-y lg:border-y-0 border-[#757384]' : ''} ${
                    idx === 2 ? 'w-full' : 'lg:border-r border-[#757384] w-full'
                  } ${idx === 0 ? '' : 'lg:pl-5'}`}
                >
                  <p className='text-white leading-[19px] font-figtree'>{item.key}</p>
                  <div className='flex items-end space-x-[5px]'>
                    <p className='text-[#E9E9F2] text-lg lg:text-[22px] leading-5 lg:leading-[26px]'>${formatNumber(item.value)}</p>
                    <PercentChip value={item.percentage} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {/* top tokens */}
        <div className='w-full mt-10'>
          <div className='w-full flex items-center justify-between'>
            <p className='text-[22px]  md:text-[27px] leading-8 text-white font-figtree font-medium'>Top Tokens</p>
            <div
              className='flex items-center  space-x-3.5 cursor-pointer group'
              onClick={() => {
                navigate(`/analytics/${version}/tokens`)
              }}
            >
              <span className='text-lg text-green'>See All</span>
              <img className='group-hover:w-[40px] w-[30px] duration-300 ease-in-out' src='/images/common/spear.svg' alt='' />
            </div>
          </div>
          <TokensTable tokensData={tokens} version={version} isTop />
        </div>
        {/* Top Pairs */}
        <div className='w-full mt-[30px] md:mt-[50px]'>
          <div className='w-full flex items-center justify-between'>
            <p className='text-[22px]  md:text-[27px] leading-8 text-white font-figtree font-medium'>Top Pairs</p>
            <div
              className='flex items-center  space-x-3.5 cursor-pointer group'
              onClick={() => {
                navigate(`/analytics/${version}/pairs`)
              }}
            >
              <span className='text-lg text-green'>See All</span>
              <img className='group-hover:w-[40px] w-[30px] duration-300 ease-in-out' src='/images/common/spear.svg' alt='' />
            </div>
          </div>
          <PairsTable pairsData={pairs} isTop />
        </div>
      </div>
    </>
  )
}

export default Index

import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'
import AnalyticsHeader from 'pages/analytics/components/analyticsHeader'
import { useBulkPairData } from 'context/PairData'
import { useTokenChartData, useTokenData, useTokenPairs } from 'context/TokenData'
import PairsTable from 'pages/analytics/components/pairsTable'
import { useAnalyticsVersion } from 'hooks/useGeneral'
import { formatNumber } from 'utils/formatNumber'
import { ANALYTIC_VERSIONS, SCAN_URLS } from 'config/constants'
import AreaChart from 'components/AreaChart'
import PercentChip from 'components/ChipLabel/percentChip'
import { getYAXISValuesAnalytics, getChartDates } from 'utils/analyticsHelper'
import { useAssets } from 'state/assets/hooks'
import { useNetwork } from 'state/settings/hooks'
import useAutoDocumentTitle from "../../../hooks/useAutoDocumentTitle";

const ChartIndexes = {
  Volume: 'Volume',
  Liquidity: 'Liquidity',
  Price: 'Price',
}

const TokenDetails = () => {
  useAutoDocumentTitle('TokenDetails')
  const [chartIndex, setChartIndex] = useState(ChartIndexes.Volume)
  const { id: tokenAddress } = useParams()
  const navigate = useNavigate()
  const { networkId } = useNetwork()
  const version = useAnalyticsVersion()
  const tokenData = useTokenData(tokenAddress, version)
  const tokenChartData = useTokenChartData(tokenAddress, version)
  const { name, symbol, priceUSD, priceChangeUSD, oneDayVolumeUSD, volumeChangeUSD, totalLiquidityUSD, liquidityChangeUSD, oneDayTxns, txnChange } = tokenData
  const allPairs = useTokenPairs(tokenAddress, version)
  const pairs = useBulkPairData(allPairs)
  const assets = useAssets()
  const pairsWithImg = useMemo(() => {
    if (Object.keys(pairs).length > 0) {
      return Object.values(pairs).map((pair) => {
        const found0 = assets.find((ele) => ele.address.toLowerCase() === pair.token0.id)
        const found1 = assets.find((ele) => ele.address.toLowerCase() === pair.token1.id)
        return {
          ...pair,
          token0: {
            ...pair.token0,
            name: found0 ? found0.name : pair.token0.name,
            symbol: found0 ? found0.symbol : pair.token0.symbol,
            logoURI: found0 ? found0.logoURI : 'https://cdn.thena.fi/assets/UKNOWN.png',
          },
          token1: {
            ...pair.token1,
            name: found1 ? found1.name : pair.token1.name,
            symbol: found1 ? found1.symbol : pair.token1.symbol,
            logoURI: found1 ? found1.logoURI : 'https://cdn.thena.fi/assets/UKNOWN.png',
          },
        }
      })
    }
    return []
  }, [pairs])
  const asset = assets.find((ele) => ele.address.toLowerCase() === tokenAddress)

  const result = useMemo(() => {
    if (!tokenChartData) return
    const res = [...tokenChartData]
    if (chartIndex === ChartIndexes.Volume) {
      res.pop()
    }
    return res
  }, [tokenChartData, chartIndex])

  const chartData = useMemo(() => {
    if (!result) return
    return result.map((item) => {
      switch (chartIndex) {
        case ChartIndexes.Volume:
          return Number(item.dailyVolumeUSD)
        case ChartIndexes.Liquidity:
          return Number(item.totalLiquidityUSD)
        case ChartIndexes.Price:
          return Number(item.priceUSD)
        default:
          return 0
      }
    })
  }, [result, chartIndex])

  const currentVal = useMemo(() => {
    switch (chartIndex) {
      case ChartIndexes.Volume:
        return Number(oneDayVolumeUSD)
      case ChartIndexes.Liquidity:
        return Number(totalLiquidityUSD)
      case ChartIndexes.Price:
        return Number(priceUSD)
      default:
    }
  }, [priceUSD, oneDayVolumeUSD, totalLiquidityUSD, chartIndex])

  const currentValChange = useMemo(() => {
    switch (chartIndex) {
      case ChartIndexes.Volume:
        return Number(volumeChangeUSD)
      case ChartIndexes.Liquidity:
        return Number(liquidityChangeUSD)
      case ChartIndexes.Price:
        return Number(priceChangeUSD)
      default:
    }
  }, [priceChangeUSD, volumeChangeUSD, liquidityChangeUSD, chartIndex])

  return (
    <div className='w-full pt-20 lg:pt-[120px] pb-28 xl:pb-0 2xl:pb-[150px] px-5 xl:px-0 '>
      <div className='max-w-[1104px] mx-auto w-full'>
        <AnalyticsHeader data={tokenData} />
        <div className='lg:flex items-center justify-between mt-7 lg:mt-9'>
          <div className='w-full lg:w-auto'>
            <div className='flex items-center space-x-1.5'>
              <div className='flex items-center space-x-2'>
                <img alt='' src={asset ? asset.logoURI : 'https://cdn.thena.fi/assets/UKNOWN.png'} className='w-[30px] lg:w-9' />
                <div className='text-[23px] lg:text-[27px] leading-8 font-semibold text-lightGray'>{asset ? asset.name : name}</div>
              </div>
              <p className='text-[#B8B6CB] text-lg lg:text-xl leading-6'>({asset ? asset.symbol : symbol})</p>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='icon icon-tabler icon-tabler-star-filled text-[#757384]'
                width={24}
                height={24}
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path
                  d='M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z'
                  strokeWidth={0}
                  fill='currentColor'
                />
              </svg>
            </div>
            <div className='flex items-center space-x-3 mt-[7px] lg:mt-2.5'>
              <p className='text-base lg:text-lg leading-5 font-semibold text-lightGray'>${formatNumber(priceUSD)}</p>
              <PercentChip value={priceChangeUSD} />
            </div>
          </div>
          <div className='lg:flex items-center lg:space-x-5 mt-[18px] lg:mt-0'>
            <div className='flex items-center space-x-3 lg:space-x-5 mt-3 lg:mt-0'>
              <TransparentButton
                content='ADD LIQUIDITY'
                onClickHandler={() => {
                  navigate(`/add/${version === ANALYTIC_VERSIONS.v1 ? 'v1' : ''}`)
                }}
                className='h-[42px] lg:h-[52px] px-7 whitespace-nowrap w-full'
                isUpper
              />
              <StyledButton
                onClickHandler={() => {
                  navigate('/swap')
                }}
                content='SWAP'
                className='px-6 lg:px-9 py-3 lg:py-[15px]'
              />
            </div>
          </div>
        </div>
        <div className='lg:flex lg:space-x-6 space-y-[26px] lg:space-y-0 mt-5 lg:mt-6'>
          <div className='gradient-bg p-px rounded-md w-full lg:w-1/4'>
            <div className='analytics-box-internal rounded-md px-6 py-[22px] h-full'>
              <div>
                <p className='text-lightGray leading-5 text-sm lg:text-base'>Total Liquidity</p>
                <div className='flex items-center text-[#E9E9F2] leading-[26px] text-[22px] space-x-3'>
                  <span>${formatNumber(totalLiquidityUSD)}</span>
                  <PercentChip value={liquidityChangeUSD} />
                </div>
              </div>
              <div className='mt-6 lg:mt-10'>
                <p className='text-lightGray leading-5 text-sm lg:text-base'>Volume (24hrs)</p>
                <div className='flex items-center text-[#E9E9F2] leading-[26px] text-[22px] space-x-3'>
                  <span>${formatNumber(oneDayVolumeUSD)}</span>
                  <PercentChip value={volumeChangeUSD} />
                </div>
              </div>
              <div className='mt-6 lg:mt-10'>
                <p className='text-lightGray leading-5 text-sm lg:text-base'>Transactions (24hrs)</p>
                <div className='flex items-center text-[#E9E9F2] leading-[26px] text-[22px] space-x-3'>
                  <span>{formatNumber(oneDayTxns)}</span>
                  <PercentChip value={txnChange} />
                </div>
              </div>
              <div className='mt-6 lg:mt-10'>
                <p className='text-lightGray leading-5 text-sm lg:text-base'>Contract Address</p>
                <div
                  className='text-[#26FFFE] leading-5 text-lg cursor-pointer'
                  onClick={() => {
                    window.open(`${SCAN_URLS[networkId]}/address/${tokenAddress}`, '_blank')
                  }}
                >
                  {tokenAddress && tokenAddress.slice(0, 6) + '...' + tokenAddress.slice(38, 42)}
                </div>
              </div>
            </div>
          </div>
          <div className='gradient-bg p-px rounded-md w-full lg:w-3/4'>
            <div className='analytics-box-internal rounded-md px-6 py-[22px] h-full'>
              <div className='gradient-bg pb-px'>
                <div className='analytics-box-internal pb-[13px] flex items-center w-full space-x-5'>
                  {Object.values(ChartIndexes).map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`${chartIndex === item ? 'text-white' : 'text-[#757384]'} font-medium cursor-pointer font-figtree text-lg leading-[22px]`}
                        onClick={() => setChartIndex(item)}
                      >
                        {item}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className='mt-3'>
                <div className='text-lightGray font-figtree text-sm lg:text-base'>{chartIndex}</div>
                <div className='mt-1 flex items-center space-x-3'>
                  <div className='text-white font-bold text-[20px] lg:text-[27px]'>${formatNumber(currentVal)}</div>
                  <PercentChip value={currentValChange} />
                </div>
                <div className='text-[#B8B6CB] text-[10px] lg:text-[15px]'>{dayjs().format('MMM DD, YYYY')}</div>
              </div>
              {result && (
                <AreaChart
                  data={chartData}
                  yAxisValues={getYAXISValuesAnalytics(chartData)}
                  dates={result.map((value) => value.date)}
                  height={275}
                  categories={getChartDates(result)}
                />
              )}
            </div>
          </div>
        </div>
        <div className='w-full mt-10'>
          <div className='w-full'>
            <p className='text-[22px]  lg:text-[27px] leading-8 text-white font-figtree font-medium'>{asset ? asset.symbol : symbol} Pools</p>
          </div>
          <PairsTable pairsData={pairsWithImg} />
        </div>
      </div>
    </div>
  )
}

export default TokenDetails

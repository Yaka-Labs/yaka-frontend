import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'
import TransictionTable from 'pages/analytics/components/transictionTable'
import AnalyticsHeader from 'pages/analytics/components/analyticsHeader'
import { usePairChartData, usePairData, usePairTransactions } from 'context/PairData'
import { useLogoFromAddress } from 'hooks/v3/useCurrencyLogo'
import { formatNumber } from 'utils/formatNumber'
import { getChartDates, getYAXISValuesAnalytics } from 'utils/analyticsHelper'
import AreaChart from 'components/AreaChart'
import { SCAN_URLS } from 'config/constants'
import { useNetwork } from 'state/settings/hooks'
import useAutoDocumentTitle from "../../../hooks/useAutoDocumentTitle";

const ChartIndexes = {
  Volume: 'Volume',
  TVL: 'TVL',
  Fees: 'Fees',
}

const PairDetails = () => {
  useAutoDocumentTitle('PairDetails')
  const [chartIndex, setChartIndex] = useState(ChartIndexes.Volume)
  const { id: pairAddress } = useParams()
  const navigate = useNavigate()
  const pairData = usePairData(pairAddress)
  const { token0, token1 } = pairData
  const transactions = usePairTransactions(pairAddress, pairData)
  const pairChartData = usePairChartData(pairAddress, pairData)
  const token0Logo = useLogoFromAddress(token0?.id)
  const token1Logo = useLogoFromAddress(token1?.id)
  const { networkId } = useNetwork()

  const currentVal = useMemo(() => {
    switch (chartIndex) {
      case ChartIndexes.TVL:
        return Number(pairData?.totalValueLockedUSD)
      case ChartIndexes.Volume:
        return Number(pairData?.oneDayVolumeUSD)
      case ChartIndexes.Fees:
        return Number(pairData?.oneDayFeesUSD)
      default:
    }
  }, [pairData, chartIndex])

  const result = useMemo(() => {
    if (!pairChartData) return
    const res = [...pairChartData]
    if (chartIndex !== ChartIndexes.TVL) {
      res.pop()
    }
    return res
  }, [pairChartData, chartIndex])

  const chartData = useMemo(() => {
    if (!result) return
    return result.map((item) => {
      switch (chartIndex) {
        case ChartIndexes.Volume:
          return Number(item.dailyVolumeUSD)
        case ChartIndexes.TVL:
          return Number(item.reserveUSD)
        case ChartIndexes.Fees:
          return Number(item.feesUSD)
        default:
          return 0
      }
    })
  }, [result, chartIndex])

  return (
    <div className='w-full pt-20 lg:pt-[120px] pb-28 xl:pb-0 2xl:pb-[150px] px-5 xl:px-0 '>
      <div className='max-w-[1104px] mx-auto w-full'>
        <AnalyticsHeader data={pairData} />
        {Object.keys(pairData).length > 0 && (
          <>
            <div className='lg:flex items-center justify-between mt-7 lg:mt-9'>
              <div>
                <div className='flex items-center space-x-1.5'>
                  <div className='flex items-center space-x-2'>
                    <div className='flex items-center -space-x-4'>
                      <img alt='THENA First Token Logo' src={token0Logo} className='w-[30px] lg:w-9 z-[1]' />
                      <img alt='THENA Second Token Logo' src={token1Logo} className='w-[30px] lg:w-9' />
                    </div>
                    <div className='text-[23px] lg:text-[27px] leading-8 font-semibold text-lightGray'>
                      <span
                        className='cursor-pointer'
                        onClick={() => {
                          navigate(`/analytics/total/token/${token0.id}`)
                        }}
                      >
                        {token0.symbol}
                      </span>
                      /
                      <span
                        className='cursor-pointer'
                        onClick={() => {
                          navigate(`/analytics/total/token/${token1.id}`)
                        }}
                      >
                        {token1.symbol}
                      </span>
                    </div>
                  </div>
                  {pairData.isFusion && (
                    <div className='px-2 py-1 leading-5 text-[15px] table rounded-md bg-white bg-opacity-[0.07] text-lightGray'>
                      {Number(pairData.fee) / 10000}%
                    </div>
                  )}
                </div>
                <div className='table lg:flex items-center lg:space-x-2 mt-[5px] lg:mt-2'>
                  <div className='px-2 py-1 leading-5 text-sm flex items-center space-x-1  rounded-full bg-white bg-opacity-[0.07] text-lightGray'>
                    <img alt='' src={token0Logo} className='w-5' />
                    <p>
                      1 {token0.symbol} = {formatNumber(Number(token0.derivedBnb || token0.derivedETH) / Number(token1.derivedBnb || token1.derivedETH))}{' '}
                      {token1.symbol}
                    </p>
                  </div>
                  <div className='mt-1.5 lg:mt-0 px-2 py-1 leading-5 text-sm flex items-center space-x-1  rounded-full bg-white bg-opacity-[0.07] text-lightGray'>
                    <img alt='' src={token1Logo} className='w-5' />
                    <p>
                      1 {token1.symbol} = {formatNumber(Number(token1.derivedBnb || token1.derivedETH) / Number(token0.derivedBnb || token0.derivedETH))}{' '}
                      {token0.symbol}
                    </p>
                  </div>
                </div>
              </div>
              <div className='lg:flex items-center lg:space-x-5 mt-[18px] lg:mt-0'>
                <div className='flex items-center space-x-3 lg:space-x-5 mt-3 lg:mt-0'>
                  <TransparentButton
                    content='ADD LIQUIDITY'
                    onClickHandler={() => {
                      if (pairData.isFusion) {
                        navigate('/add')
                      } else {
                        navigate(`/add/v1/${pairData.id}`)
                      }
                    }}
                    className='h-[42px] lg:h-[52px] px-7 whitespace-nowrap w-full'
                    isUpper
                  />
                  <StyledButton
                    content='SWAP'
                    onClickHandler={() => {
                      navigate('/swap')
                    }}
                    className='px-6 lg:px-9 py-3 lg:py-[15px]'
                  />
                </div>
              </div>
            </div>
            <div className='lg:flex lg:space-x-6 space-y-[26px] lg:space-y-0 mt-5 lg:mt-6'>
              <div className='gradient-bg p-px rounded-md w-full lg:w-1/4'>
                <div className='analytics-box-internal rounded-md px-6 py-[22px] h-full'>
                  <p className='text-lightGray font-figtree'>Total Tokens Locked</p>
                  <div className='flex items-center justify-between text-lightGray mt-1.5'>
                    <div className='text-sm flex items-center space-x-1 '>
                      <img alt='' src={token0Logo} className='w-5' />
                      <p>{token0.symbol} :</p>
                    </div>
                    <p className='text-[15px] leading-5'>{formatNumber(pairData.reserve0)}</p>
                  </div>
                  <div className='flex items-center justify-between text-lightGray mt-1.5'>
                    <div className='text-sm flex items-center space-x-1 '>
                      <img alt='' src={token1Logo} className='w-5' />
                      <p>{token1.symbol} :</p>
                    </div>
                    <p className='text-[15px] leading-5'>{formatNumber(pairData.reserve1)}</p>
                  </div>
                  <div className='mt-6'>
                    <p className='text-lightGray leading-5 text-sm lg:text-base'>Total Liquidity</p>
                    <p className='text-white leading-5 text-lg'>${formatNumber(pairData.totalValueLockedUSD)}</p>
                  </div>
                  <div className='mt-6'>
                    <p className='text-lightGray leading-5 text-sm lg:text-base'>24h Trading Vol</p>
                    <p className='text-white leading-5 text-lg'>${formatNumber(pairData.oneDayVolumeUSD)}</p>
                  </div>
                  <div className='mt-6'>
                    <p className='text-lightGray leading-5 text-sm lg:text-base'>24h Fees</p>
                    <p className='text-white leading-5 text-lg'>${formatNumber(pairData.oneDayFeesUSD)}</p>
                  </div>
                  <div className='mt-6'>
                    <p className='text-lightGray leading-5 text-sm lg:text-base'>Contract Address</p>
                    <p
                      className='text-[#26FFFE] leading-5 text-lg cursor-pointer'
                      onClick={() => {
                        window.open(`${SCAN_URLS[networkId]}/address/${pairData.id}`, '_blank')
                      }}
                    >
                      {pairData.id && pairData.id.slice(0, 6) + '...' + pairData.id.slice(38, 42)}
                    </p>
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
                            className={`${
                              chartIndex === item ? 'text-white' : 'text-[#757384]'
                            } font-medium cursor-pointer font-figtree text-lg leading-[22px]`}
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
          </>
        )}
        <p className='text-[27px] leading-8 text-white font-figtree font-medium mt-10'>Transactions</p>
        <TransictionTable data={transactions} />
      </div>
    </div>
  )
}

export default PairDetails

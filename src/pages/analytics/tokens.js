import React, { useMemo, useState } from 'react'
import AnalytcisHeader from 'pages/analytics/components/analyticsHeader'
import { useAllTokenData } from 'context/TokenData'
import TokensTable from 'pages/analytics/components/tokensTable'
import { formatNumber } from 'utils/formatNumber'
import { useAnalyticsVersion } from 'hooks/useGeneral'
import { useBookmarkTokens } from 'state/application/hooks'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const TokenTabs = ['All Cryptos', 'Favourites']

const AnalyticsTokens = () => {
  useAutoDocumentTitle('AnalyticsTokens')
  const [tableType, setTableType] = useState(TokenTabs[0])
  const version = useAnalyticsVersion()
  const tokensWithImg = useAllTokenData(version)
  const { bookmarkTokens } = useBookmarkTokens()

  const topMovers = useMemo(() => {
    return (
      tokensWithImg &&
      tokensWithImg
        .sort((a, b) => {
          return parseFloat(b.oneDayVolumeUSD) - parseFloat(a.oneDayVolumeUSD)
        })
        .slice(0, 5)
    )
  }, [tokensWithImg])

  const favoriteTokens = useMemo(() => {
    return (
      tokensWithImg &&
      tokensWithImg
        .sort((a, b) => {
          return parseFloat(b.oneDayVolumeUSD) - parseFloat(a.oneDayVolumeUSD)
        })
        .filter((ele) => {
          const tokenIndex = bookmarkTokens.indexOf(ele.id)
          return tokenIndex > -1
        })
    )
  }, [tokensWithImg, bookmarkTokens])

  return (
    <div className='w-full pt-20 md:pt-[120px] pb-28 xl:pb-0 2xl:pb-[150px] px-5 xl:px-0 '>
      <div className='max-w-[1104px] mx-auto w-full'>
        <AnalytcisHeader />
        <div className='w-full mt-10'>
          <div className='w-full bg-[#111642] px-5 py-[15px] rounded-[5px]'>
            <div className='lg:flex items-center'>
              {topMovers.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className={`lg:w-1/5  ${idx !== topMovers.length - 1 ? 'lg:border-r border-b lg:border-b-0 border-[#757384]' : ''} ${
                      idx === 0 ? 'pb-[15px] lg:pb-0' : 'lg:px-4 py-[15px] lg:py-0'
                    }`}
                  >
                    <div className='flex items-center lg:items-end space-x-3 md:space-x-1.5'>
                      <div className='flex items-end space-x-2'>
                        <img alt='logo' src={item.logoURI} className='w-[30px] h-[30px] mb-1' />
                        <div>
                          <span className='text-[17px] lg:text-lg text-lightGray leading-5 font-medium'>{item.symbol}</span>
                          <p className='text-[13px] lg:text-[15px] text-[#B8B6CB] leading-5 font-medum'>${formatNumber(item.priceUSD)}</p>
                        </div>
                      </div>
                      <div
                        className={`px-1.5 py-1 leading-5 text-sm rounded-md ${
                          item.priceChangeUSD > 0 ? 'bg-[#51B961] bg-opacity-10 text-[#51B961]' : 'bg-[#CF3A41] bg-opacity-10 text-[#CF3A41]'
                        }`}
                      >
                        {item.priceChangeUSD > 0 ? '+' : '-'}
                        {formatNumber(Math.abs(item.priceChangeUSD))}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* top tokens */}
          <div className='w-full mt-[30px] md:mt-[50px]'>
            <div className='w-full flex items-center space-x-6'>
              {TokenTabs.map((item, idx) => {
                return (
                  <button
                    onClick={() => {
                      setTableType(item)
                    }}
                    key={idx}
                    className={`${item === tableType ? 'text-white' : 'text-[#757384]'} text-lg leading-8  font-figtree font-medium`}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
            <TokensTable tokensData={tableType === TokenTabs[0] ? tokensWithImg : favoriteTokens} version={version} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsTokens

import React from 'react'
import AnalytcisHeader from 'pages/analytics/components/analyticsHeader'
import { useAnalyticsVersion } from 'hooks/useGeneral'
import { useAllPairData } from 'context/PairData'
import PairsTable from 'pages/analytics/components/pairsTable'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const AnalyticsPairs = () => {
  useAutoDocumentTitle('AnalyticsPairs')
  const version = useAnalyticsVersion()
  const pairsWithImg = useAllPairData(version)

  return (
    <div className='w-full pt-20 md:pt-[120px] pb-28 xl:pb-0 2xl:pb-[150px] px-5 xl:px-0 '>
      <div className='max-w-[1104px] mx-auto w-full'>
        <AnalytcisHeader />
        <p className='text-[27px] leading-8 text-white font-figtree font-medium mt-10'>All Pairs</p>
        <PairsTable pairsData={pairsWithImg} />
      </div>
    </div>
  )
}

export default AnalyticsPairs

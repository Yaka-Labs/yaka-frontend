import React from 'react'
import Overview from 'pages/analytics/components/overview'
import AnalyticsHeader from 'pages/analytics/components/analyticsHeader'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const Index = () => {
  useAutoDocumentTitle('Analytics')
  return (
    <div className='w-full pt-20 md:pt-[120px] pb-28 xl:pb-0 2xl:pb-[150px] px-5 xl:px-0 '>
      <div className='max-w-[1104px] mx-auto w-full'>
        <AnalyticsHeader />
        <Overview />
      </div>
    </div>
  )
}

export default Index

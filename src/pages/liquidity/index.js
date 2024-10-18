import React from 'react'
import { Routes, Route } from 'react-router-dom'
import YourLiquidity from './yourLiquidity'
import V1LiquidityDetail from './yourLiquidity/v1LiquidityDetail'
import AutoLiquidityDetail from './yourLiquidity/autoLiquidityDetail'
import ManualDetail from './yourLiquidity/manualLiquidity/manualDetail'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const Liquidity = () => {
  useAutoDocumentTitle('Liquidity')
  return (
    <div className='w-full pt-[85px] pb-[95.2px] xl:pb-0 2xl:pb-[127.5px] px-[17px] xl:px-0'>
      <div className='w-full max-w-[442px] lg:max-w-[505.75px] gradient-bg p-px rounded-[4.25px] mx-auto relative mt-[13.6px]
'>
        <div className='w-full px-3 py-3 rounded-[4.25px] md:px-[20.4px] md:py-[17px]'>
          <Routes>
            <Route index element={<YourLiquidity />} exact />
            <Route path='v1' element={<YourLiquidity />} exact />
            <Route path='v1/:address' element={<V1LiquidityDetail />} exact />
            <Route path='auto/:address' element={<AutoLiquidityDetail />} exact />
            <Route path='manual/:tokenId' element={<ManualDetail />} exact />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Liquidity

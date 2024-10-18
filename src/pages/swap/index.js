import React, { lazy, Suspense, useEffect, useMemo } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SWAP_TYPES } from 'config/constants'
import { useNetwork } from 'state/settings/hooks'
import { ChainId } from 'thena-sdk-core'
import useAutoDocumentTitle from '../../hooks/useAutoDocumentTitle'

const Market = lazy(() => import('./components/Market'))
const Limit = lazy(() => import('./components/Limit'))
const TWAP = lazy(() => import('./components/Twap'))
const Cross = lazy(() => import('./components/Cross'))
const OnRamp = lazy(() => import('./components/OnRamp'))

const Swaps = [
  { type: SWAP_TYPES[0], path: '' },
  { type: SWAP_TYPES[1], path: 'limit' },
  { type: SWAP_TYPES[2], path: 'twap' },
  { type: SWAP_TYPES[3], path: 'cross' },
  { type: SWAP_TYPES[4], path: 'onramp' },
]

const Index = () => {
  useAutoDocumentTitle('Home')
  const navigate = useNavigate()
  const location = useLocation()
  const { networkId } = useNetwork()
  const swaptabs = useMemo(() => {
    return networkId === ChainId.BSC ? Swaps : [Swaps[0]]
  }, [networkId])

  useEffect(() => {
    if (networkId === ChainId.OPBNB && (location.pathname.includes('/swap/limit') || location.pathname.includes('/swap/twap'))) {
      navigate('/swap')
    }
  }, [networkId, location])

  return (
    <div className='max-w-[1020px] pt-[68px] pb-[34px] xl:pb-0  px-[17px] xl:px-0 mx-auto'>
      {/*<div className='max-w-[938.4px] mx-auto w-full mt-[42.5px]'>*/}
      {/*  <div className='flex justify-center'>*/}
      {/*    <div className='flex h-[37.4px] border border-[#C2111F] rounded-[6.8px] padding-[13.6px]'>*/}
      {/*      {swaptabs.map((swap, index) => {*/}
      {/*        const path = index === 0 ? '/swap' : `/swap/${swap.path}`*/}
      {/*        return (*/}
      {/*          <div*/}
      {/*            key={swap.type}*/}
      {/*            onClick={() => navigate(path)}*/}
      {/*            className={`h-full flex justify-center items-center cursor-pointer px-2 md:px-[10.2px] lg:px-[17px] text-sm lg:text-[13.6px] hover:text-white transition-all*/}
      {/*        ${*/}
      {/*          location.pathname !== path*/}
      {/*            ? 'text-[#A2A0B7] -mr-[3px] -ml-px'*/}
      {/*            : 'text-white font-semibold border-[#C2111F]  border-1-5 rounded-[4px] -ml-px bg-[#9E2019]'*/}
      {/*        } `}*/}
      {/*          >*/}
      {/*            {swap.type}*/}
      {/*          </div>*/}
      {/*        )*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <Suspense>
        <Routes>
          <Route index element={<Market />} exact />
          <Route path='limit' element={<Limit />} exact />
          <Route path='twap' element={<TWAP />} exact />
          <Route path='cross' element={<Cross />} exact />
          <Route path='onramp' element={<OnRamp />} exact />
        </Routes>
      </Suspense>
    </div>
  )
}

export default Index

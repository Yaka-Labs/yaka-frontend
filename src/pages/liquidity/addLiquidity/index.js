import React, { useMemo } from 'react'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import Settings from 'components/Settings'
import Tab from 'components/Tab'
import V1Add from './v1Add'
import FusionAdd from './fusionAdd'
import useAutoDocumentTitle from "../../../hooks/useAutoDocumentTitle";

// const Tabs = ['FUSION', 'V1']
const Tabs = ['V1']

const AddLiquidity = () => {
  useAutoDocumentTitle('AddLiquidity')
  const navigate = useNavigate()
  const location = useLocation()

  const activeTab = useMemo(() => {
    return location.pathname.includes('/add/v1') ? Tabs[0] : Tabs[0]
  }, [location.pathname])

  return (
    <div className='w-full pt-[85px] pb-[95.2px] xl:pb-0 2xl:pb-[127.5px] px-[17px] xl:px-0 '>
      <div className='w-full max-w-[442px] lg:max-w-[505.75px] gradient-bg p-px rounded-[4.25px] mx-auto relative mt-[13.6px]'>
        <div className='w-full px-3 py-3 rounded-[4.25px] md:px-[20.4px] md:py-[17px]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <button
                className='mr-[17px]'
                onClick={() => {
                  navigate(-1)
                }}
              >
                <img alt='' src='/images/swap/back-arrow.svg' />
              </button>
              <p className='text-[23px] md:text-[22.95px] font-figtree text-white font-bold'>Add Liquidity</p>
            </div>
            <Settings />
          </div>
          <div className='w-full mt-4 md:mt-[24.65px]'>
            <Tab
              activeTab={activeTab}
              setActiveTab={(tab) => {
                if (tab === Tabs[0]) {
                  navigate('/add', { replace: true })
                } else {
                  navigate('/add/v1', { replace: true })
                }
              }}
              tabData={Tabs}
            />
            <Routes>
              <Route index element={<FusionAdd />} exact />
              <Route path='v1/:address?' element={<V1Add />} exact />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddLiquidity

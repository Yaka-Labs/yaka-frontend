import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Settings from 'components/Settings'
import Tab from 'components/Tab'
import StyledButton from 'components/Buttons/styledButton'
import V1Liquidity from './v1Liquidity'
import FusionLiquidity from './fusionLiquidity'

const TABS = {
  // FUSION: 'FUSION',
  V1: 'V1',
}

const YourLiquidity = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeTab = useMemo(() => {
    return pathname.includes('/liquidity/v1') ? TABS.V1 : TABS.V1
  }, [pathname])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <p className='text-[23px] md:text-[22.95px] font-figtree text-white font-bold'>Your Liquidity</p>
        <Settings />
      </div>
      <div className='w-full mt-4 md:mt-[23.8px]'>
        <Tab
          activeTab={activeTab}
          setActiveTab={(tab) => {
            navigate(tab === TABS.V1 ? '/liquidity/v1' : '/liquidity/v1')
          }}
          tabData={Object.values(TABS)}
        />
        {activeTab === TABS.V1 && <V1Liquidity />}
        {activeTab === TABS.FUSION && <FusionLiquidity />}
      </div>
      <StyledButton
        onClickHandler={() => {
          navigate('/add/v1')
        }}
        content='ADD LIQUIDITY'
        className='py-[11.05px] w-full mt-[22px]'
      />
    </div>
  )
}

export default YourLiquidity

import React, { useEffect, useState } from 'react'

import './style.scss'
import Tab from 'components/Tab'
import Leaderboard from './components/Leaderboard'
import PointsBoard from './components/PointsBoard'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const Tabs = ['PROGRESS']
const Tabs1 = ['Leaderboard']

const Campaign = () => {
  useAutoDocumentTitle('Campaign')
  const [activeTab, setActiveTab] = useState(Tabs[0])
    const [activeTab1, setActiveTab1] = useState(Tabs1[0])
  return (
    <div className='mx-auto flex flex-col items-center justify-center pt-[90px] md:pt-[102px] px-[17px] xl:px-0'>
      <div className='w-full max-w-[952px] h-[255px]  bg-cover bg-center bg-no-repeat head-img px-8'>
        {/* <div className='flex h-full items-center'>
          <div>
            <div className='gradient-text'>Testnet Campaign Stage 2</div>
            <div className='text-white text-[36px]'>Complete Challenges, Earn Rewards</div>
          </div>
        </div> */}
      </div>
      <div className='max-w-[952px] w-full mt-[27.2px]'>
        <div className='w-[85px]'>
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} tabData={Tabs} />
        </div>
        {activeTab === Tabs[0] && <PointsBoard />}
          <div>
              <div className='w-[85px] mt-[27.2px]'>
                  <Tab activeTab={activeTab1} setActiveTab={setActiveTab1} tabData={Tabs1}/>
              </div>
              {activeTab1 === Tabs1[0] && <Leaderboard/>}

          </div>
      </div>
    </div>
  )
}

export default Campaign

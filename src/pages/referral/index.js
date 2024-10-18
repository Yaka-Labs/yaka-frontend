import React, { useState } from 'react'
import { useDibsCode } from 'hooks/useReferral'
import { REFERRAL_TABS } from 'config/constants'
import Code from './components/code'
import Rewards from './components/rewards'
import Leaderboard from './components/leaderboard'
import Lottery from './components/lottery'
import MuonSvg from './components/muon'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const Referral = () => {
  useAutoDocumentTitle('Referral')
  const { codeName, balancesToClaim } = useDibsCode()
  const [activeTab, setActiveTab] = useState(REFERRAL_TABS[0])
  const goToMuon = () => {
    window.open('https://www.muon.net/', '_blank')
  }

  return (
    <div className='max-w-[1104px] px-5 sm:px-16 md:px-28 mdLg:px-40 lg:px-5 xl:px-0 pt-20 md:pt-[120px] mx-auto lg:pb-[75px] lg:flex items-start'>
      <div className='flex flex-col space-y-3 flex-shrink-0 lg:sticky top-24'>
        <div className='lg:bg-[#101645] lg:py-6 lg:px-5 w-full lg:w-[258px] rounded-[5px] flex flex-col items-center lg:items-start justify-center'>
          <div className='flex flex-row lg:flex-col px-[11px] w-full lg:px-0 space-x-7 z-30 border-t border-blue lg:border-t-0 bg-[#111642] lg:bg-transparent pt-[17px] lg:pt-0 pb-4 lg:pb-0 lg:space-x-0 lg:relative fixed bottom-0 justify-between md:justify-center md:space-x-16'>
            <div
              onClick={() => {
                setActiveTab(REFERRAL_TABS[0])
              }}
              className={`text-sm lg:text-[19px] items-center space-y-[3px] lg:space-y-0 justify-center lg:justify-start lg:space-x-3   ${
                activeTab === REFERRAL_TABS[0] ? 'text-green font-medium' : 'text-[#9690b9]'
              } hover:text-green transition-all duration-200 ease-in-out cursor-pointer flex flex-col lg:flex-row`}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24'>
                <g id='code-icon-inactive' transform='translate(-187 -148)'>
                  <rect id='Rectangle_11632' data-name='Rectangle 11632' width={24} height={24} transform='translate(187 148)' fill='none' />
                  <g id='Group_13740' data-name='Group 13740' transform='translate(4747.248 -547.67)'>
                    <path id='Path_26021' data-name='Path 26021' d='M-4548.28,696.67h0Z' fill='currentColor' />
                    <path
                      id='Path_26022'
                      data-name='Path 26022'
                      d='M-4548.277,696.67a11,11,0,0,0-10.971,10.989,11.016,11.016,0,0,0,1.373,5.09,14.564,14.564,0,0,0,4.545,4.551,10.946,10.946,0,0,0,5.079,1.37,11,11,0,0,0,10.985-11.015A11,11,0,0,0-4548.277,696.67Zm2.4,14.51h-6.735a1.163,1.163,0,0,1-1.161-1.161,1.163,1.163,0,0,1,1.161-1.162h6.735a1.163,1.163,0,0,1,1.162,1.162A1.163,1.163,0,0,1-4545.872,711.18Zm2.326-4.72h-9.42a1.163,1.163,0,0,1-1.162-1.161,1.163,1.163,0,0,1,1.162-1.162h9.42a1.163,1.163,0,0,1,1.161,1.162A1.163,1.163,0,0,1-4543.546,706.46Z'
                      fill='currentColor'
                    />
                  </g>
                </g>
              </svg>
              <p>Your Code</p>
            </div>
            <div
              onClick={() => {
                setActiveTab(REFERRAL_TABS[1])
              }}
              className={`lg:mt-[18px] text-sm lg:text-[19px] items-center space-y-[3px] lg:space-y-0 justify-center lg:justify-start lg:space-x-3  ${
                activeTab === REFERRAL_TABS[1] ? 'text-green font-medium' : 'text-[#9690b9]'
              } hover:text-green transition-all duration-200 ease-in-out cursor-pointer flex flex-col lg:flex-row`}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24'>
                <g id='rewards-icon-inactive' transform='translate(-187 -190)'>
                  <rect id='Rectangle_11633' data-name='Rectangle 11633' width={24} height={24} transform='translate(187 190)' fill='none' />
                  <g id='star' transform='translate(188 166.957)'>
                    <path
                      id='Path_26010'
                      data-name='Path 26010'
                      d='M20.842,35.754a2.572,2.572,0,0,0-2.078-.079q.011-.209.011-.42c0-.239-.011-.476-.032-.711l.026,0a2.577,2.577,0,0,0,2.091-2.986l-.336-1.9-1.269.224a2.561,2.561,0,0,0-1.664,1.06c-.021.031-.042.062-.062.093a7.806,7.806,0,0,0-.683-.9l.018-.019a2.577,2.577,0,0,0-.064-3.645l-1.391-1.343-.9.927a2.581,2.581,0,0,0,.064,3.645l.927.9a6.487,6.487,0,1,1-9.013,0l.927-.9a2.58,2.58,0,0,0,.064-3.645l-.9-.927L5.2,26.466a2.577,2.577,0,0,0-.064,3.645l.018.019a7.806,7.806,0,0,0-.683.9c-.02-.031-.04-.063-.062-.093a2.561,2.561,0,0,0-1.664-1.06l-1.269-.224-.336,1.9A2.577,2.577,0,0,0,3.231,34.54l.026,0c-.021.235-.032.472-.032.711q0,.211.011.42a2.571,2.571,0,0,0-2.078.079L0,36.319l.847,1.737a2.574,2.574,0,0,0,3.447,1.187l.026-.013a7.81,7.81,0,0,0,.649.927,2.571,2.571,0,0,0-1.638,1.286l-.605,1.138,1.707.908a2.577,2.577,0,0,0,3.486-1.066l.013-.024a7.715,7.715,0,0,0,1.021.358,2.564,2.564,0,0,0-.53,1.563v.644H9.711V44.32a1.289,1.289,0,1,1,2.577,0v.644h1.289V44.32a2.564,2.564,0,0,0-.53-1.563,7.712,7.712,0,0,0,1.021-.358l.013.024A2.561,2.561,0,0,0,15.6,43.679a2.561,2.561,0,0,0,1.964-.189l1.707-.908-.605-1.138a2.571,2.571,0,0,0-1.638-1.286,7.809,7.809,0,0,0,.649-.927l.026.013a2.577,2.577,0,0,0,3.447-1.187L22,36.319Z'
                      transform='translate(0 0)'
                      fill='currentColor'
                    />
                  </g>
                </g>
              </svg>
              <p>Rewards</p>
            </div>
            <div
              onClick={() => {
                setActiveTab(REFERRAL_TABS[2])
              }}
              className={`lg:mt-[18px] text-sm lg:text-[19px] items-center space-y-[3px] lg:space-y-0 justify-center lg:justify-start lg:space-x-3  ${
                activeTab === REFERRAL_TABS[2] ? 'text-green font-medium' : 'text-[#9690b9]'
              } hover:text-green transition-all duration-200 ease-in-out cursor-pointer flex flex-col lg:flex-row`}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24'>
                <g id='trophy-icon' transform='translate(-191 -235)'>
                  <rect id='Rectangle_11633' data-name='Rectangle 11633' width={24} height={24} transform='translate(191 235)' fill='none' />
                  <path
                    id='trophy_1_'
                    data-name='trophy (1)'
                    d='M6.214,5.526a3.94,3.94,0,0,1,.171-1.664,1.575,1.575,0,0,1,.687-.69A3.887,3.887,0,0,1,8.729,3h7.543a3.887,3.887,0,0,1,1.656.172,1.575,1.575,0,0,1,.687.69,3.94,3.94,0,0,1,.171,1.664v.105h3.038c.1,0,.146,0,.187,0A1.575,1.575,0,0,1,23.5,7.128c0,.041,0,.09,0,.188,0,.391,0,.586-.009.752a6.306,6.306,0,0,1-5.237,5.9A6.3,6.3,0,0,1,13.81,17.6v2.769h2.619a1.316,1.316,0,0,1,0,2.632H8.571a1.316,1.316,0,0,1,0-2.632H11.19V17.6a6.3,6.3,0,0,1-4.445-3.634,6.306,6.306,0,0,1-5.237-5.9C1.5,7.9,1.5,7.707,1.5,7.316c0-.1,0-.147,0-.188A1.575,1.575,0,0,1,2.989,5.634c.041,0,.09,0,.187,0H6.214Zm0,2.737H4.156a3.685,3.685,0,0,0,2.058,2.8Zm12.571,2.8a3.685,3.685,0,0,0,2.058-2.8H18.786Z'
                    transform='translate(190.5 234)'
                    fill='currentColor'
                    fillRule='evenodd'
                  />
                </g>
              </svg>

              <p>Leaderboard</p>
            </div>
            <div
              onClick={() => {
                setActiveTab(REFERRAL_TABS[3])
              }}
              className={`lg:mt-[18px] text-sm lg:text-[19px] items-center space-y-[3px] lg:space-y-0 justify-center lg:justify-start lg:space-x-3  ${
                activeTab === REFERRAL_TABS[3] ? 'text-green font-medium' : 'text-[#9690b9]'
              } hover:text-green transition-all duration-200 ease-in-out cursor-pointer flex flex-col lg:flex-row`}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24'>
                <path
                  id='lottery-icon'
                  d='M5305-19276a11.923,11.923,0,0,1-8.486-3.514A11.922,11.922,0,0,1,5293-19288a11.917,11.917,0,0,1,3.517-8.486A11.914,11.914,0,0,1,5305-19300a11.936,11.936,0,0,1,8.481,3.52A11.931,11.931,0,0,1,5317-19288a11.926,11.926,0,0,1-3.514,8.484A11.917,11.917,0,0,1,5305-19276Zm0-20.16a8.176,8.176,0,0,0-8.162,8.162,8.178,8.178,0,0,0,8.162,8.162,8.142,8.142,0,0,0,5.769-2.393,8.135,8.135,0,0,0,2.393-5.77A8.178,8.178,0,0,0,5305-19296.16Zm0,14.924a6.769,6.769,0,0,1-6.762-6.762,6.776,6.776,0,0,1,6.762-6.762,6.769,6.769,0,0,1,6.762,6.762A6.781,6.781,0,0,1,5305-19281.236Zm-1.981-10.951a.9.9,0,0,0-.9.9.894.894,0,0,0,.9.891h2.281l-.305.514a11.154,11.154,0,0,0-1.55,5.2v.01a.891.891,0,0,0,.891.867.9.9,0,0,0,.9-.877,11.772,11.772,0,0,1,2.437-6.041l0-.01a.853.853,0,0,0,.2-.566.891.891,0,0,0-.266-.625.894.894,0,0,0-.625-.256Z'
                  transform='translate(-5292.999 19300)'
                  fill='currentColor'
                />
              </svg>
              <p>Lottery</p>
            </div>
          </div>
        </div>
        <div
          className='hidden lg:flex items-center justify-center lg:bg-[#101645] px-0 py-5 lg:p-5 w-full lg:w-[258px] rounded-[5px] cursor-pointer text-[#9690b9] hover:text-green transition-all duration-200 ease-in-out'
          onClick={() => {
            goToMuon()
          }}
        >
          <MuonSvg width={40} height={31.53} />
          <span className='font-figtree font-medium text-[18px] ml-[14px]'>Powered by MUON</span>
        </div>
      </div>
      <div className='w-full min-h-[100vh] lg:min-h-0 flex flex-col justify-between'>
        <div className='mb-[100px] lg:mb-0'>
          {activeTab === REFERRAL_TABS[0] && <Code codeName={codeName} />}
          {activeTab === REFERRAL_TABS[1] && <Rewards setActiveTab={setActiveTab} balancesToClaim={balancesToClaim} />}
          {activeTab === REFERRAL_TABS[2] && <Leaderboard />}
          {activeTab === REFERRAL_TABS[3] && <Lottery />}
        </div>
        <div
          className='flex items-center justify-center mt-auto mb-[95px] lg:hidden cursor-pointer text-[#9690b9] hover:text-green transition-all duration-200 ease-in-out'
          onClick={() => {
            goToMuon()
          }}
        >
          <MuonSvg width={47.539} height={37.478} />
          <span className='font-figtree font-medium text-[16px] ml-[11px]'>Powered by MUON</span>
        </div>
      </div>
    </div>
  )
}

export default Referral

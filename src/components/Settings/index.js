import Modal from 'components/Modal'
import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import { useSettings } from 'state/settings/hooks'

const slipageTolerance = ['0.1', '0.5', '1.00']

const Settings = () => {
  const [popup, setPopup] = useState(false)
  const { slippage, deadline, updateSlippage, updateDeadline } = useSettings()
  return (
    <>
      <button
        onClick={() => {
          setPopup(true)
        }}
      >
        <img className='w-3/4 sm:w-auto' alt='' src='/images/swap/bar.svg' />
      </button>
      {popup && (
        <Modal isTransaction width={459} popup={popup} setPopup={setPopup} title='Settings'>
          <div className='flex items-center space-x-[5.1px] mt-[17px] md:mt-[15.3px]'>
            <p className='text-base md:text-[16.15px] !font-normal text-lightGray'>Slippage Tolerance</p>
            <img alt='' data-tip data-for='registerTip' src='/images/swap/question-mark.png' />
            <ReactTooltip
              className='max-w-[271px]  !text-[#E6E6E6] !text-[13.6px] !p-[8.5px] !opacity-100 !bg-[#1E0202]'
              id='registerTip'
              place='right'
              effect='solid'
            >
              Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.
            </ReactTooltip>
          </div>
          <div className='md:flex items-center mt-[11px] w-full'>
            <div className='flex items-center space-x-[9.35px] z-10 w-full'>
              {slipageTolerance.map((item, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      updateSlippage(Number(item))
                    }}
                    className={`${
                      slippage === Number(item) ? 'tool-tip-pink' : 'tool-tip-red'
                    } focus:tool-tip-pink max-w-[68px] flex-shrink-0 hover:tool-tip-pink w-full rounded-full flex flex-col items-center justify-center
              text-base md:text-[15.3px] text-white h-10 md:h-[35.7px] cursor-pointer`}
                  >
                    {item}%
                  </button>
                )
              })}
            </div>
            <div className='flex items-center space-x-[7.65px] w-full mt-[11px] md:mt-0 md:justify-end'>
              <input
                className='placeholder-secondary max-w-[90.5px] bg-body w-full h-[44.2px] rounded-full text-white pl-[17px] pr-[6.8px] text-[15.3px] tool-tip-red   block '
                value={slippage}
                onChange={(e) => updateSlippage(e.target.value || 0)}
                type='number'
                min={0}
                max={50}
                lang='en'
              />
              <span className='text-[15.3px] text-white'>%</span>
            </div>
          </div>
          {(slippage < 0.5 || slippage > 5) && (
            <div className='w-full mt-[6.8px] text-warn'>{slippage > 5 ? 'Your transaction may be frontrun' : 'Your transaction may fail'}</div>
          )}
          <div className='w-full mt-6 md:mt-[17px]'>
            <div className='flex items-center space-x-[5.1px]'>
              <p className='text-lightGray text-base md:text-[16.15px] leading-[17px] !font-normal'>Transaction Deadline</p>
              <img alt='' data-tip data-for='registerTip1' src='/images/swap/question-mark.png' />
              <ReactTooltip
                className='max-w-[271px] !bg-[#1E0202] !text-[#E6E6E6] !text-[13.6px] !p-[8.5px] !opacity-100 '
                id='registerTip1'
                place='right'
                effect='solid'
              >
                Your transaction will revert if it is left confirming for longer than this time.
              </ReactTooltip>
            </div>
            <div className='flex items-center space-x-[7.65px] mt-[7.65px]'>
              <input
                className='placeholder-secondary max-w-[90.5px] h-[44.2px] w-full rounded-full bg-body text-white pl-[17px] pr-[6.8px] text-[15.3px] tool-tip-red block '
                type='number'
                value={deadline}
                onChange={(e) => updateDeadline(e.target.value || 0)}
                min={0}
                lang='en'
              />
              <span className='text-base md:text-[15.3px] text-white'>minutes</span>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default Settings

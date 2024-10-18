import { useState, useEffect } from 'react'
import Modal from 'components/Modal'
import { useWeb3React } from '@web3-react/core'
import { useNavigate } from 'react-router-dom'
import Timer from '../Timer'
import moment from 'moment'
import { getProgress } from 'utils/dexOpApi'
import BigNumber from 'bignumber.js'

const PointsBoard = () => {
  const navigate = useNavigate()
  const [boostPopup, setBoostPopup] = useState(false)
  const openBoostPopup = () => {
    setBoostPopup(true)
  }

  const [progressData, setProgressData] = useState({})

  const { account } = useWeb3React()

  const toThousands = (num = 0) => {
    return num.toString().replace(/\d+/, function (n) {
      return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    })
  }

  useEffect(() => {
    if (account) {
      getProgress(account).then((res) => {
        if (res && res.msg === 'success') {
          setProgressData(res.data)
        }
      })
    }
  }, [account])
  return (
    <div>
      <div className='text-gray-500 text-[18.7px] my-[23.8px] flex items-center justify-between'>
        <div className='flex items-center justify-center flex-wrap'>
          <div className='mr-[25.5px]'>
            Your Points : <span className='text-white'>{toThousands(progressData.totalPoints || 0)}</span>
          </div>
          <div className='w-[198.9px] h-[40.8px] border border-[#B51B27] rounded-lg flex items-center justify-around cursor-pointer' onClick={openBoostPopup}>
            <img width={25.5} src='/images/campaign/Logo.png' />
            <div className='text-white'>
              {toThousands(
                BigNumber(progressData.nftBoost || 0)
                  .multipliedBy(100)
                  .toNumber(),
              )}
              %
            </div>
            <div>NFT Boost</div>
          </div>
        </div>
        <div>
          Next Points Drop:{' '}
          <span className='text-white'>
            <Timer
              targetTime={
                moment().utc().isAfter(moment.utc().hours(12).minutes(0).seconds(0))
                  ? moment.utc().add(1, 'day').hours(12).minutes(0).seconds(0)
                  : moment.utc().hours(12).minutes(0).seconds(0)
              }
            />
          </span>
        </div>
      </div>
      <div className='items-center justify-center flex flex-row flex-wrap'>
        <div className='lg:basis-2/3 basis-full'>
          <div className='gradient-bg p-[10.2px] mb-[13.6px] h-[102px] lg:mr-[13.6px] flex items-center justify-between'>
            <div className='flex items-center justify-center'>
              <img width={81.6} src='/images/campaign/Swap.png' />
              <div className='text-white text-[20.4px] font-medium ml-[20.4px] w-[83.3px]'>Swap</div>
            </div>
            <div className='flex items-center justify-center text-white text-[20.4px] font-medium'>
              <div className='mr-[34px] text-center'>
                <div className='text-white/[.6] text-[13.6px]'>Total Points</div>
                <div>{toThousands(progressData.swapTotalPoints || 0)}</div>
              </div>
              <div className='text-center'>
                <div className='text-white/[.6] text-[13.6px]'>Last Drop</div>
                <div>{toThousands(progressData.swapLastDropPoints || 0)}</div>
              </div>
            </div>
            <div
              className='w-[76.5px] h-[34px] border-[1.5px] border-[#C2111F] bg-[#9E2019] flex items-center justify-center text-[13.6px] font-medium rounded mr-[15.3px] cursor-pointer'
              onClick={() => {
                navigate('/swap')
              }}
            >
              Go
            </div>
          </div>
          <div className='gradient-bg p-[10.2px] h-[102px] lg:mr-[13.6px] flex items-center justify-between mb-[13.6px] lg:mb-0'>
            <div className='flex items-center justify-center'>
              <img width={81.6} src='/images/campaign/Deposit.png' />
              <div className='text-white text-[20.4px] font-medium ml-[20.4px]'>
                Provide
                <br />
                Liquidity
              </div>
            </div>
            <div className='flex items-center justify-center text-white text-[20.4px] font-medium'>
              <div className='mr-[34px] text-center'>
                <div className='text-white/[.6] text-[13.6px]'>Total Points</div>
                <div>{toThousands(progressData.provideTotalPoints || 0)}</div>
              </div>
              <div className='text-center'>
                <div className='text-white/[.6] text-[13.6px]'>Last Drop</div>
                <div>{toThousands(progressData.provideLastDropPoints || 0)}</div>
              </div>
            </div>
            <div
              className='w-[76.5px] h-[34px] border-[1.5px] border-[#C2111F] bg-[#9E2019] flex items-center justify-center text-base font-medium rounded mr-[15.3px] cursor-pointer'
              onClick={() => {
                navigate('/pools')
              }}
            >
              Go
            </div>
          </div>
        </div>
        <div className='gradient-bg p-[20.4px] lg:basis-1/3 h-[217.6px] basis-full'>
          <div className='flex items-center mb-[43.35px]'>
            <img width={96} src='/images/campaign/Invite.png' />
            <div className='text-white text-[20.4px] font-medium ml-[20.4px]'>
              <div>Social</div>
              {/* <div className='flex items-center'>
                <div className='text-white/[.6] text-base mr-6'>Total Points</div>
                <div>{toThousands(progressData.socialTotalPoints || 0)}</div>
              </div> */}
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-[13.6px] text-white/[0.5] font-medium mr-[27.2px]'>Complete extra missions to earn more points!</div>
            <div
              className='w-[76.5px] h-[34px] border-[1.5px] border-[#C2111F] bg-[#9E2019] flex items-center justify-center text-[13.6px] font-medium rounded cursor-pointer flex-shrink-0'
              onClick={() => {
                window.open('https://zealy.io/cw/yakafinance/questboard', '_blank')
              }}
            >
              Go
            </div>
          </div>
        </div>
      </div>
      <Modal className='h-[392.7px] w-[510px]' popup={boostPopup} setPopup={setBoostPopup} title=''>
        <div className='text-center text-white text-[25.5px] font-bold mb-[45.9px] whitespace-nowrap'>
          Boost Your Weights with
          <br />
          Partner NFTs and Yaka Voyagers!
        </div>
        {/* <div className='text-xl mb-6 text-white font-medium'>For every NFT you have you get a 1% Boost, up to a maximum of 20 NFTs (20%).</div> */}
        <div className='text-white/[0.6] font-medium text-[117px] mb-[36.55px] leading-[20.4px]'>
          <div>1 Partner NFT = 10% Boost</div>
          <div>1 Yaka Voyager = 25% Boost</div>
          <div>5 Yaka Voyagers = 50% Boost</div>
          <div className='mt-[20.4px]'>1 Partner NFT + 1 Yaka Voyager = 37.5% Boost</div>
          <div>1 Partner NFT + 5 Yaka Voyager = 65% Boost</div>
        </div>
        <div
          className='connect-wallet-btn flex items-center justify-center text-[18.7px] font-bold text-white cursor-pointer'
          onClick={() => {
            window.open('https://pallet.exchange/collection/yaka-voyager', '_blank')
          }}
        >
          Get Yaka Voyager
        </div>
      </Modal>
    </div>
  )
}

export default PointsBoard

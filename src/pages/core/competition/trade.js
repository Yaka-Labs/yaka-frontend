import React, { useContext, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import { useWeb3React } from '@web3-react/core'
import Timer from 'components/Timer'
import TokenInput from 'components/Input/TokenInput'
import Settings from 'components/Settings'
import StyledButton from 'components/Buttons/styledButton'
import TransparentButton from 'components/Buttons/transparentButton'
import { useWalletModal } from 'state/settings/hooks'
import Modal from 'components/Modal'
import ProfileHoverCard from 'components/ProfileHoverCard'
import Clock from 'components/Clock'
import { CompsContext } from 'context/CompsContext'

const sortOptions = [
  {
    label: 'Rank',
    value: 'rank',
    isDesc: true,
  },
  {
    label: 'Username',
    value: 'username',
    isDesc: true,
  },
  {
    label: 'PnL',
    value: 'pnl',
    isDesc: true,
  },
  {
    label: 'Reward',
    value: 'rewards',
    isDesc: true,
  },
]
const leaderboardData = [
  {
    rank: 45,
    userName: 'Lara Thompson',
    profilePic: '/images/core/p3.png',
    volume: '+$8,456',
    reward: '-',
  },
  {
    rank: 1,
    userName: 'John Doe',
    profilePic: '/images/core/p3.png',
    volume: '+$8,456',
    reward: '$8,456',
  },
  {
    rank: 2,
    userName: 'Xermes',
    profilePic: '/images/core/p3.png',
    volume: '+$8,233',
    reward: '-',
  },
  {
    rank: 3,
    userName: 'Zax',
    profilePic: '/images/core/p3.png',
    volume: '+$1,456',
    reward: '-',
  },
  {
    rank: 4,
    userName: 'Lara Thompson',
    profilePic: '/images/core/p3.png',
    volume: '-',
    reward: '-',
  },
  {
    rank: 5,
    userName: 'John Doe',
    profilePic: '/images/core/p3.png',
    volume: '-',
    reward: '$8,456',
  },
  {
    rank: 6,
    userName: 'Xermes',
    profilePic: '/images/core/p3.png',
    volume: '-',
    reward: '-',
  },
  {
    rank: 7,
    userName: 'Lara Thompson',
    profilePic: '/images/core/p3.png',
    volume: '-',
    reward: '-',
  },
  {
    rank: 8,
    userName: 'John Doe',
    profilePic: '/images/core/p3.png',
    volume: '+$1,212',
    reward: '$8,456',
  },
  {
    rank: 9,
    userName: 'Xermes',
    profilePic: '/images/core/p3.png',
    volume: '-',
    reward: '-',
  },
  {
    rank: 10,
    userName: 'Lara Thompson',
    profilePic: '/images/core/p3.png',
    volume: '-',
    reward: '-',
  },
  {
    rank: 11,
    userName: 'John Doe',
    profilePic: '/images/core/p3.png',
    volume: '+$9,999',
    reward: '$8,456',
  },
  {
    rank: 12,
    userName: 'Xermes',
    profilePic: '/images/core/p3.png',
    volume: '+$8,999',
    reward: '-',
  },
  {
    rank: 12,
    userName: 'Lara Thompson',
    profilePic: '/images/core/p3.png',
    volume: '+$2,219',
    reward: '-',
  },
  {
    rank: 13,
    userName: 'John Doe',
    profilePic: '/images/core/p3.png',
    volume: '+$9,999',
    reward: '$8,456',
  },
  {
    rank: 14,
    userName: 'Xermes',
    profilePic: '/images/core/p3.png',
    volume: '+$8,999',
    reward: '-',
  },
]
const totalInfo = [
  {
    title: 'Your Profit & Loss',
    balance: '-',
  },
  {
    title: 'Your Balance',
    balance: '$',
  },
  {
    title: 'Ends in',
    balance: '2d 18h 28s',
  },
]

const Trade = () => {
  const [setting, setSetting] = useState(false)
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const [depositModel, setDepositModel] = useState(false)
  const [show, setShow] = useState(-1)
  const compList = useContext(CompsContext)
  const param = useParams()

  const detail = useMemo(() => {
    return compList.find((ele) => ele.id === param.id)
  }, [param.id, compList])

  if (!detail) return

  return (
    <>
      <div className='w-full max-w-[1165px] mx-auto'>
        <div className='lg:flex-row flex flex-col items-start space-y-4 lg:space-y-0 lg:space-x-9 w-full'>
          <Link to='/core/comps' className='flex items-center space-x-4 w-full lg:w-1/2'>
            <img alt='' src='/images/swap/back-arrow.svg' />
            <p className='text-[22px] lg:text-[27px] font-semibold leading-7 lg:leading-8 font-figtree text-white'>{detail.name}</p>
          </Link>
          <Timer arr={totalInfo} className='w-full lg:w-1/2' />
        </div>
        <div className='lg:flex space-y-4 lg:space-y-0 lg:space-x-7 mt-5 lg:mt-[30px] w-full'>
          <div className='w-full lg:max-w-[588px]'>
            <OutsideClickHandler
              onOutsideClick={() => {
                setSetting(false)
              }}
            >
              <div className='gradient-bg shadow-[0_0_50px_#48003d] p-px relative z-[10] rounded-[5px] '>
                <div className='solid-bg rounded-[5px] px-3 lg:px-6 py-3 lg:py-4'>
                  <div className='flex items-center justify-between'>
                    <p className='font-figtree text-[23px] lg:text-[27px] leading-10 text-white font-semibold'>Swap</p>
                    <button
                      onClick={() => {
                        setSetting(!setting)
                      }}
                    >
                      <img alt='' src='/images/swap/bar.svg' />
                    </button>
                  </div>
                  <div className='mt-3 lg:mt-[26px]'>
                    <div className='flex flex-col w-full items-center justify-center'>
                      <TokenInput title='From' asset={{}} setAsset={() => {}} otherAsset={{}} setOtherAsset={{}} amount={{}} onInputChange={() => {}} />
                      <button onClick={() => {}} className='focus:outline-none my-5 z-[8]'>
                        <img src='/images/swap/reverse-icon.svg' alt='' />
                      </button>
                      <TokenInput title='To' asset={{}} setAsset={() => {}} amount={{}} otherAsset={{}} setOtherAsset={() => {}} disabled />
                    </div>

                    {account ? (
                      <>
                        <div className='flex justify-end w-full mt-3'>
                          <button className='px-4 py-[7px] bg-blue flex items-center space-x-1 text-white rounded-full leading-5'>
                            <span>Very Low Risk</span>
                            <img alt='' src='/images/swap/question-mark.png' />
                          </button>
                        </div>
                        <div className='mt-5'>
                          <div className='flex items-center justify-between'>
                            <p className='text-white text-sm lg:text-base leading-5'>Slippage Tolerance</p>
                            <p className='text-white text-sm lg:text-base leading-5'>0.5 %</p>
                          </div>
                        </div>
                        <StyledButton
                          onClickHandler={() => {}}
                          disabled
                          content='Enter an amount'
                          className='py-[11px] lg:py-5 px-[54px] w-full mt-3 lg:mt-3.5 lg:leading-[22px] font-bold font-figtree'
                        />
                      </>
                    ) : (
                      <StyledButton
                        onClickHandler={() => openWalletModal()}
                        content='CONNECT WALLET'
                        className='py-[11px] lg:py-5 text-white rounded-[3px] px-[54px] w-full mt-3 lg:mt-3.5 lg:leading-[22px] font-bold font-figtree'
                      />
                    )}

                    <div className='flex items-center justify-center space-x-1 mt-5'>
                      <div className='text-[#9690b9] text-[13px] lg:text-[17px] mt-[2px]'>Powered by</div>
                      <img src='/images/logos/openocean.svg' alt='' className='h-6 lg:h-8' />
                    </div>
                  </div>
                </div>
                {setting && <Settings slippage={{}} setSlippage={{}} deadline={{}} setDeadline={() => {}} />}
              </div>
            </OutsideClickHandler>

            <div className='gradient-bg shadow-[0_0_50px_#48003d] p-px z-[10] rounded-[5px] mt-4 lg:mt-[30px] w-full'>
              <div className='solid-bg rounded-[5px] px-3 lg:px-6 py-3 lg:py-4'>
                <p className='font-figtree text-lg lg:text-[22px] leading-[22px] lg:leading-7 text-white font-semibold'>Routing</p>

                <div className='flex items-center justify-between mt-6'>
                  <div className='flex items-center space-x-1.5'>
                    <img alt='' src='https://cdn.thena.fi/assets/USDT.png' className='lg:w-[22px] w-4 h-4 lg:h-[22px] ' />
                    <span className='text-[13px] lg:text-base leading-4 lg:leading-5 text-white'>0 USDT</span>
                  </div>
                  <div className='flex items-center space-x-1.5'>
                    <span className='text-[13px] lg:text-base leading-4 lg:leading-5 text-white'>0 USDT</span>
                    <img alt='' src='https://i.ibb.co/BwBbzjj/yaka-logo-X-1082x1082.png' className='lg:w-[22px] w-4 h-4 lg:h-[22px] ' />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full'>
            <div className='bg-cardBg p-4 w-full lg:flex items-center justify-between'>
              <p className='text-lg lg:text-[22px] leading-[22px] lg:leading-[27px] text-white font-figtree font-semibold'>Want to Deposit More?</p>
              <StyledButton
                className='py-[11px] lg:py-[15px] text-white rounded-[3px] px-[54px] w-full lg:w-auto text-[15px] lg:text-lg leading-[18px] mt-3 lg:mt-0 lg:leading-[22px] font-bold font-figtree'
                onClickHandler={() => {
                  setDepositModel(true)
                }}
                content='DEPOSIT'
              />
            </div>
            <div className='bg-cardBg w-full mt-[29px] '>
              <div className='flex items-center space-x-4 justify-between w-full p-4'>
                <p className='text-lg lg:text-[22px] leading-[22px] lg:leading-[27px] font-semibold text-white font-figtree'>LEADERBOARD</p>
                <Clock />
              </div>
              <div className='sticky top-0'>
                <div className='lg:flex justify-between hidden z-[100] py-[0.475rem] px-4'>
                  {sortOptions.map((option, index) => (
                    <div
                      className={`${index === 0 && 'w-[20%]'} ${index === 1 && 'w-[45%]'} ${index === 2 && 'w-[30%]'} ${
                        index === 3 && 'w-[25%] flex items-center justify-end'
                      } font-medium  text-white font-figtree`}
                      key={`header-${index}`}
                    >
                      <div className='flex items-center cursor-pointer space-x-1 -ml-1 relative'>
                        <p className='flex items-center'>{option.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='max-h-[400px] overflow-auto'>
                {leaderboardData.map((item, idx) => {
                  return (
                    <div
                      key={idx + 2}
                      className={`px-5 flex flex-wrap lg:flex-nowrap items-start lg:items-center
                      w-full justify-between  transition-all duration-150 ease-in-out text-lightGray py-4 ${idx % 2 !== 0 ? '' : 'bg-[#1A265E]'} `}
                    >
                      <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[20%] items-start justify-center'>
                        <p className='lg:hidden text-sm font-figtree font-semibold'>Rank</p>
                        {item.rank === 1 ? (
                          <img className='w-6 h-6' alt='' src='/images/core/one.png' />
                        ) : item.rank === 2 ? (
                          <img alt='' className='w-6 h-6' src='/images/core/two.png' />
                        ) : item.rank === 3 ? (
                          <img alt='' className='w-6 h-6' src='/images/core/three.png' />
                        ) : (
                          <div className='font-figtree font-bold'>{item.rank}</div>
                        )}
                      </div>
                      <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[45%] items-start relative justify-center '>
                        <p className='lg:hidden text-sm font-figtree font-semibold'>Username</p>
                        <Link
                          onMouseEnter={() => {
                            setShow(idx)
                          }}
                          onMouseLeave={() => {
                            setShow(-1)
                          }}
                          to={`/core/profile/${idx}/activity`}
                          className='flex items-center space-x-2.5 text-white hover:text-green'
                        >
                          <div className='text-base  font-figtree'>{item.userName}</div>
                        </Link>
                        <ProfileHoverCard
                          showCard={() => {
                            setShow(idx)
                          }}
                          removeCard={() => {
                            setShow(-1)
                          }}
                          className='top-8 min-w-[370px] '
                          show={idx === show}
                        />
                      </div>
                      <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[30%] items-start justify-center'>
                        <p className='lg:hidden text-sm font-figtree font-semibold'>Trading Volume</p>
                        <div className='text-[15px]'>{item.volume}</div>
                      </div>
                      <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[25%] lg:items-end justify-center'>
                        <p className='lg:hidden text-sm font-figtree font-semibold'>Potential Reward</p>
                        <div className='text-[15px]'>{item.reward}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal title='Deposit' popup={depositModel} setPopup={setDepositModel}>
        <p className='text-lightGray leading-6 mt-2.5'>
          You will be able to withdraw the rest of your deposit at the end of the competition. You will have to claim it manually.
        </p>
        <div className='mt-4'>
          <div className='flex items-center text-lightGray leading-5 w-full justify-between'>
            <p>Amount</p>
            <p>Balance: 2,000</p>
          </div>
          <div className='border border-blue bg-body mt-2 relative'>
            <input placeholder='0' className=' w-full py-4 pl-4 focus:outline-none bg-transparent text-white' />
            <div className='flex items-center space-x-1 absolute right-4 text-white top-4'>
              <img alt='' src='https://cdn.thena.fi/assets/USDT.png' className='w-6 h-6' />
              <span>USDT</span>
            </div>
          </div>
          <div className='mt-4 flex items-center space-x-5 w-full'>
            <TransparentButton
              onClickHandler={() => {
                setDepositModel(false)
              }}
              content='CANCEL'
              className='w-1/2 py-[15px]'
              isUpper
            />
            <StyledButton content='DEPOSIT' className=' text-[17px] font-figtree text-white w-1/2 py-[15px] rounded-[3px]' />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Trade

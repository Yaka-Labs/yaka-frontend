import React, { useState } from 'react'
import Toggle from 'components/Toggle'
import Modal from 'components/Modal'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'

const Index = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Swaps And Achievements',
      des: 'Auto post whenever you make a swap or complete a new achievement.',
      toggles: {
        swap: {
          value: true,
          des: 'You swap tokens',
        },
        achievement: {
          value: true,
          des: 'Your complete achievement',
        },
      },
    },
    {
      id: 2,
      title: 'Trading Competitions',
      des: 'Auto post when you create or join trading competitions. Also, when you claim a competition rewards.',
      toggles: {
        competition: {
          value: true,
          des: 'You create competition',
        },
        join: {
          value: true,
          des: 'You join competition',
        },
        claim: {
          value: true,
          des: 'You claim competition rewards',
        },
      },
    },
    {
      id: 3,
      title: 'Events',
      des: 'Auto post when you create or attend an event.',
      toggles: {
        competitionStart: {
          value: true,
          des: 'You create event',
        },
        competitionAttend: {
          value: false,
          des: 'You attend event',
        },
      },
    },
    {
      id: 4,
      title: 'theNFT',
      des: 'Auto post when you buy, sell, stake or unstake an theNFT.',
      toggles: {
        buySell: {
          value: true,
          des: 'You buy or sell theNFT',
        },
        stakeUnstake: {
          value: true,
          des: 'You stake or unstake theNFT',
        },
      },
    },
    {
      id: 5,
      title: 'Thena ID',
      des: 'Auto post when you mint or gift THENA ID.',
      toggles: {
        mintId: {
          value: true,
          des: 'You mint Thena ID',
        },
        giftId: {
          value: true,
          des: 'You gift Thena ID',
        },
      },
    },
    {
      id: 6,
      title: 'Liquidity Posts',
      des: 'Auto post when you add or remove liquidity from a liquidity pools.',
      toggles: {
        addLiquidity: {
          value: true,
          des: 'You add liquidity',
        },
        removeLiquidity: {
          value: false,
          des: 'You remove liquidity',
        },
      },
    },
    {
      id: 7,
      title: 'Bribes And Votes',
      des: 'Auto post when you bribe a pool, vote or claim bribes and fees.',
      toggles: {
        makeBribe: {
          value: true,
          des: 'You make a bribe',
        },
        makeVote: {
          value: true,
          des: 'You make a vote',
        },
        claimBribeFees: {
          value: true,
          des: 'You claim bribes and fees',
        },
      },
    },
    {
      id: 8,
      title: 'YAKA Locks',
      des: 'Auto post when you lock your YAKA.',
      toggles: {
        veThe: {
          value: true,
          des: 'You lock YAKA',
        },
      },
    },
    {
      id: 9,
      title: 'Pools And Gauges',
      des: 'Auto post when you create a new pool or a gauge.',
      toggles: {
        pool: {
          value: true,
          des: 'You create new pool',
        },
        guage: {
          value: true,
          des: 'You create new gauge',
        },
      },
    },
  ])
  const [disabelAll, setDisabelAll] = useState(false)
  const [disabelAllModel, setDisabelAllModel] = useState(false)
  const handleNotificationValue = (idx, key) => {
    let dup = [...notifications]
    dup[idx].toggles[key].value = !dup[idx].toggles[key].value
    setNotifications(dup)
  }
  const disabelAllNotifications = () => {
    let dup = [...notifications]
    dup.map((item) => {
      return Object.values(item.toggles).map((value) => {
        return (value.value = !!disabelAll)
      })
    })
    setNotifications(dup)
  }

  return (
    <>
      <div className='w-full mt-5 flex items-center space-x-2.5'>
        <Toggle
          onChange={() => {
            setDisabelAllModel(true)
          }}
          small
          checked={disabelAll}
          toggleId='disableAll'
        />
        <p className='text-lightGray text-[16px] whitespace-nowrap'>{disabelAll ? 'Enable auto posting' : 'Disable auto posting'}</p>
      </div>
      <div className=' bg-cardBg rounded-[3px] px-5 py-6 mt-[18px]'>
        {notifications.map((item, idx) => {
          return (
            <div
              key={idx}
              className={`flex items-start space-x-[60px] ${idx > 0 ? 'mt-[30px]' : ''} ${
                idx !== notifications.length - 1 ? 'pb-[30px] border-b border-[#44476A]' : ''
              }`}
            >
              <div className='w-1/2'>
                <p className='text-xl leading-6 font-figtree font-semibold text-white'>{item.title}</p>
                <p className='text-[15px] leading-5 font-figtree text-secondary mt-[3px]'>{item.des}</p>
              </div>
              <div className='w-1/2'>
                {Object.entries(item.toggles).map(([key, value]) => {
                  return (
                    <div key={key} className='w-full mb-5 flex items-center space-x-2.5'>
                      <Toggle
                        onChange={() => {
                          handleNotificationValue(idx, key)
                        }}
                        small
                        checked={value.value}
                        toggleId={key}
                      />
                      <p className='text-lightGray text-[16px] whitespace-nowrap'>{value.des}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <Modal popup={disabelAllModel} title='Delete Event' setPopup={setDisabelAllModel} width={459}>
        <p className='mt-2 leading-[22px] text-lightGray'>Disable All Notifications</p>
        <div className='flex items-center space-x-5 mt-5'>
          <TransparentButton
            onClickHandler={() => {
              if (!disabelAll) {
                disabelAllNotifications()
              }
              setDisabelAll(true)
              setDisabelAllModel(false)
            }}
            className='px-9 w-full py-[15px]'
            content='DISABLE'
            isUpper
          />
          <StyledButton
            onClickHandler={() => {
              setDisabelAllModel(false)
              setDisabelAll(false)
            }}
            className='px-9 w-full py-[15px]'
            content='CANCEL'
          />
        </div>
      </Modal>
    </>
  )
}

export default Index

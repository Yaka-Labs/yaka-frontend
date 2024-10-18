import React, { useState } from 'react'
import Toggle from 'components/Toggle'
import Modal from 'components/Modal'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'

const Index = () => {
  const [disabelAllModel, setDisabelAllModel] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Social',
      des: 'Notifications when someone like, comment, mention, follows, sends you crypto, invites your to a group or when they completed a new achievement.',
      toggles: {
        like: {
          value: true,
          des: 'Likes on your posts',
        },
        comments: {
          value: true,
          des: 'Comments on your posts',
        },
        mentions: {
          value: true,
          des: 'Someone mentions you',
        },
        follow: {
          value: true,
          des: 'Someone folllows you',
        },
        transiction: {
          value: true,
          des: 'Someone sends you crypto',
        },
        invites: {
          value: true,
          des: 'Someone invites you to a group',
        },
        achievement: {
          value: false,
          des: 'Someone completed achievement',
        },
      },
    },
    {
      id: 2,
      title: 'Groups',
      des: 'Notifications when your group creates a new post.',
      toggles: {
        groupPosts: {
          value: true,
          des: 'Group posts',
        },
      },
    },
    {
      id: 3,
      title: 'Trading Competitions',
      des: 'Notifications when trading competition is starting, started, ending, ended, registrations deadline ends or when you need to claim your competition rewards.',
      toggles: {
        competitionStart: {
          value: true,
          des: 'Competition starting',
        },
        competitionEnding: {
          value: true,
          des: 'Competition ending',
        },
        registrationDeadline: {
          value: true,
          des: 'Registration deadline notifications',
        },
        claimReward: {
          value: true,
          des: 'Claim competition rewards',
        },
      },
    },
    {
      id: 4,
      title: 'Events',
      des: 'Notifications when event is starting or started.',
      toggles: {
        eventStarting: {
          value: true,
          des: 'Event starting',
        },
      },
    },
    {
      id: 5,
      title: 'Achievements and Rewards',
      des: 'Notifications when you complete an achievement, won a lottery or finish in top 8 on a daily leaderboard.',
      toggles: {
        completedAchievement: {
          value: true,
          des: 'You completed achievement',
        },
        wonLottery: {
          value: true,
          des: 'You won a lottery',
        },
        dailyLeaderBoard: {
          value: true,
          des: 'You finished on our Daily Leaderboard',
        },
      },
    },
    {
      id: 6,
      title: 'theNFTs',
      des: 'Notifications when someone has made you an offer on OpenSea.',
      toggles: {
        offer: {
          value: true,
          des: 'Someone made you an offer on OpenSea',
        },
      },
    },
    {
      id: 7,
      title: 'THENA ID',
      des: 'Notifications when some has minted and sent you a new THENA ID.',
      toggles: {
        giftThenaId: {
          value: true,
          des: 'Someone gifts you THENA ID',
        },
      },
    },
    {
      id: 8,
      title: 'Voting',
      des: 'Notifications when you’t didn’t used your veYAKA to vote and a new epoch starts in 2 hours.',
      toggles: {
        veThe: {
          value: true,
          des: 'Use your veYAKA to vote',
        },
      },
    },
  ])
  const [disabelAll, setDisabelAll] = useState(false)
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
        <p className='text-lightGray text-[16px] whitespace-nowrap'>{disabelAll ? 'Enable all' : 'Disable all notifications'}</p>
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

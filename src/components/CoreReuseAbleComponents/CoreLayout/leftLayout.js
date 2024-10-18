import React, { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { CoreSubMenus } from 'config/constants/core'
import TransparentButton from 'components/Buttons/transparentButton'
import Modal from 'components/Modal'

const Index = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // const [loadFollowers, setLoadFollowers] = useState(3)
  // const [loadGroups, setLoadGroups] = useState(3)

  const thenians = [
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
  ]
  const groups = [
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
    {
      img: '/images/core/p3.png',
      name: 'Theseus',
      members: '1.1k',
    },
  ]
  const [following, setFollowing] = useState(false)
  const [switchGroups, setSwitchGroups] = useState(false)

  return (
    <div className='sticky top-24'>
      <div className='lg:bg-[#101645] lg:py-[22px] lg:px-6 w-full rounded-[5px] flex flex-col items-center lg:items-start justify-center '>
        {CoreSubMenus.map((item, idx) => {
          return (
            <button
              onClick={() => {
                if (item.enabled) navigate(item.route)
              }}
              disabled={!item.enabled}
              key={item.name}
              className={`${idx > 0 ? 'mt-[23.63px]' : ''} ${
                location.pathname.includes(item.route) ? 'text-green font-medium hover:text-green transition-all duration-200 ease-in-out' : 'text-[#b8b6cb]'
              } disabled:cursor-not-allowed text-sm lg:text-[17px] items-center space-y-[3px] lg:space-y-0 justify-center lg:justify-start lg:space-x-[18.73px]
              cursor-pointer flex flex-col lg:flex-row`}
            >
              {location.pathname.includes(item.route) ? item.active : item.svg}
              <p>{item.name}</p>
            </button>
          )
        })}
      </div>
      <div className='lg:bg-[#101645] p-4 w-full rounded-[5px] mt-5'>
        <p className='leading-[27px] text-[22px] font-figtree text-white font-semibold'>Mint THENA ID</p>
        <p className='mt-1.5 mb-3 leading-[22px] text-lightGray'>Replace your wallet address with a custom Thena ID.</p>
        <Link to='/core/mint' className='font-medium text-lg w-full leading-5 flex justify-start text-green'>
          Mint Now
        </Link>
      </div>
      {/* <div className='lg:bg-[#101645] lg:py-[22px] lg:px-6 w-full rounded-[5px] mt-5'>
        <span className='text-[22px] font-figtree leading-[27px] text-white font-semibold'>Suggested Thenians</span>
        <div className='mt-6 w-full'>
          {thenians.slice(0, loadFollowers).map((item, idx) => {
            return (
              <div key={idx} className='flex items-center justify-between mb-6  last-of-type:mb-0'>
                <div className='flex items-center space-x-2.5'>
                  <img alt='' className='w-9 h-9 rounded-full' src={item.img} />
                  <div className='flex flex-col space-y-0.5'>
                    <span className='text-white font-medium text-[17px] font-figtree'>{item.name}</span>
                    <span className='text-secondary leading-[17px] text-sm'>{item.members} followers</span>
                  </div>
                </div>
                <TransparentButton
                  content={'Follow'}
                  className='px-3 py-1.5'
                />
              </div>
            )
          })}
        </div>
        {thenians.length > 3 && (
          <button
            onClick={() => {
              setLoadFollowers(loadFollowers + 3)
              setFollowing(true)
              setSwitchGroups(false)
            }}
            className={` ${thenians.length <= loadFollowers - 1 ? 'hidden' : ''} font-medium text-lg  w-full leading-5 flex justify-start text-green mt-6`}
          >
            Show More
          </button>
        )}
      </div>
      <div className='lg:bg-[#101645] lg:py-[22px] lg:px-6 w-full rounded-[5px] mt-5'>
        <span className='text-[22px] font-figtree leading-[27px] text-white font-semibold'>Join Groups</span>
        <div className='mt-6 w-full'>
          {groups.slice(0, loadGroups).map((item, idx) => {
            return (
              <div key={idx} className='flex items-center justify-between mb-6  last-of-type:mb-0'>
                <div className='flex items-center space-x-2.5'>
                  <img alt='' className='w-9 h-9 rounded-full' src={item.img} />
                  <div className='flex flex-col space-y-0.5'>
                    <span className='text-white font-medium text-[17px] font-figtree'>{item.name}</span>
                    <span className='text-secondary leading-[17px] text-sm'>{item.members} members</span>
                  </div>
                </div>
                <TransparentButton
                  content={'Join'}
                  onClickHandler={() => {}}
                  className='px-3 py-1.5'
                />
              </div>
            )
          })}
        </div>
        {groups.length > 3 && (
          <button
            onClick={() => {
              setLoadGroups(loadGroups + 3)
              setFollowing(true)
              setSwitchGroups(true)
            }}
            disabled={groups.length <= loadGroups - 1}
            className={` ${groups.length <= loadGroups - 1 ? 'hidden' : ''} font-medium text-lg  w-full leading-5 flex justify-start text-green mt-6`}
          >
            Show More
          </button>
        )}
      </div> */}

      {/* Show more modal */}
      <Modal className='max-h-[386px] overflow-auto' popup={following} setPopup={setFollowing} title='Suggested' width={465.8}>
        <div className='flex items-center justify-center space-x-[30px] mt-3'>
          <button
            className={`leading-6 text-xl ${
              !switchGroups ? ' text-white  font-semibold border-green' : ' border-transparent text-[#757384] font-medium'
            } pb-1 border-b-2`}
            onClick={() => setSwitchGroups(false)}
          >
            Thenians
          </button>
          <button
            className={`leading-6 text-xl ${
              switchGroups ? ' text-white  font-semibold border-green' : ' border-transparent text-[#757384] font-medium'
            } pb-1 border-b-2`}
            onClick={() => setSwitchGroups(true)}
          >
            Groups
          </button>
        </div>
        <div className='mt-5 w-full'>
          {!switchGroups
            ? thenians.map((item, idx) => {
                return (
                  <div key={idx} className='flex items-center justify-between mb-6  last-of-type:mb-0'>
                    <div className='flex items-center space-x-2.5'>
                      <img alt='' className='w-9 h-9 rounded-full' src={item.img} />
                      <div className='flex flex-col space-y-0.5'>
                        <span className='text-white font-medium text-[17px] font-figtree'>{item.name}</span>
                        <span className='text-secondary leading-[17px] text-sm'>{item.members} followers</span>
                      </div>
                    </div>
                    <TransparentButton content='Follow' className='px-3 py-1.5' />
                  </div>
                )
              })
            : groups.map((item, idx) => {
                return (
                  <div key={idx} className='flex items-center justify-between mb-6  last-of-type:mb-0'>
                    <div className='flex items-center space-x-2.5'>
                      <img alt='' className='w-9 h-9 rounded-full' src={item.img} />
                      <div className='flex flex-col space-y-0.5'>
                        <span className='text-white font-medium text-[17px] font-figtree'>{item.name}</span>
                        <span className='text-secondary leading-[17px] text-sm'>{item.members} members</span>
                      </div>
                    </div>
                    <TransparentButton content='Join' className='px-3 py-1.5' />
                  </div>
                )
              })}
        </div>
      </Modal>
    </div>
  )
}

export default Index

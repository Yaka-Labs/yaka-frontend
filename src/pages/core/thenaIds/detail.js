import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import TransparentButton from 'components/Buttons/transparentButton'
import DropDownCard from './dropDownCard'
import Table from './table'

const ThenaIdDetail = () => {
  const navigate = useNavigate()
  const renderContent = () => {
    return (
      <div className='flex items-center space-x-[15px] text-[17px] leading-5 text-white font-figtree font-semibold px-6 py-3 '>
        <span>View on OpenSea</span>
        <img alt='' src='/images/thenaIds/redirect.svg' />
      </div>
    )
  }
  const [share, setShare] = useState(false)
  const [dropDowns, setDropDowns] = useState({
    details: true,
    stats: true,
    description: true,
    about: true,
  })
  const [tab, setTab] = useState('OpenSea Info')

  const [openSeaDropDowns, setOpenSeaDropDowns] = useState({
    priceHistory: true,
    listings: true,
    offers: true,
  })

  const listingsHeader = ['Price', 'USD Price', 'Quantity', 'Expiration', 'From', '']
  const offersHeader = ['Price', 'USD Price', 'Quantity', 'Floor Difference', 'Expiration', 'From']
  const listingsData = [
    {
      price: '0.0955 BNB',
      usdPrice: '$37.29',
      quantity: 1,
      expiration: 'in 12 hours',
      from: 'DDB9A7',
      button: 'Buy',
    },
    {
      price: '0.0955 BNB',
      usdPrice: '$37.29',
      quantity: 1,
      expiration: 'in 12 hours',
      from: 'DDB9A7',
      button: 'Buy',
    },
  ]
  const offersData = [
    {
      price: '0.0955 BNB',
      usdPrice: '$37.29',
      quantity: 1,
      floorDifference: '3% below',
      expiration: 'in 12 hours',
      from: 'LoremuispumusdoLoremuispu',
    },
    {
      price: '0.0955 BNB',
      usdPrice: '$37.29',
      quantity: 1,
      floorDifference: '3% below',
      expiration: 'in 12 hours',
      from: 'DDB9A7',
    },
    {
      price: '0.0955 BNB',
      usdPrice: '$37.29',
      quantity: 1,
      floorDifference: '3% below',
      expiration: 'in 12 hours',
      from: 'Larathompson',
    },
    {
      price: '0.0955 BNB',
      usdPrice: '$37.29',
      quantity: 1,
      floorDifference: '3% below',
      expiration: 'in 12 hours',
      from: 'DDB9A7',
    },
    {
      price: '0.0955 BNB',
      usdPrice: '$37.29',
      quantity: 1,
      floorDifference: '3% below',
      expiration: 'in 12 hours',
      from: 'DDB9A7',
    },
    {
      price: '0.0955 BNB',
      usdPrice: '$37.29',
      quantity: 1,
      floorDifference: '3% below',
      expiration: 'in 12 hours',
      from: 'DDB9A7',
    },
  ]

  return (
    <div className='w-full max-w-[940px] 2xl:max-w-full overflow-hidden'>
      <div className='bg-cardBg p-5 rounded-[5px]'>
        <div className='table mb-5'>
          <div
            onClick={() => {
              navigate(-1)
            }}
            className='flex items-center px-4 py-1.5 rounded-full bg-body space-x-2.5 cursor-pointer'
          >
            <img alt='' src='/images/swap/back-arrow.svg' />
            <span className='text-[22px] leading-[25px] text-white font-semibold font-figtree'>Back</span>
          </div>
        </div>
        <div className='flex items-start space-x-4'>
          <img alt='' className='max-w-[350px] w-full' src='/images/thenaIds/thenaid.png' />
          <div className='w-full'>
            <div className='flex items-start justify-between w-full'>
              <div className='w-full max-w-[220px]'>
                <p className='text-[27px] leading-8 font-semibold font-figtree text-white'>hyperion.thena</p>
                <p className='text-secondary text-[15px] leading-5'>
                  Owned by <span className='text-green'>John Doe</span>
                </p>

                <p className='text-secondary text-[15px] leading-5 mt-4'>Price on OpenSea</p>
                <p className='text-[27px] leading-8 text-white font-semibold'>
                  <span className='pt-1'>0.1 BNB</span> <span className='text-lightGray leading-5 text-base !font-normal -mt-1'>$23.05</span>
                </p>
                <TransparentButton content={renderContent()} onClickHandler={() => {}} className='mt-[15px]' />
              </div>
              <div className='flex items-center justify-end space-x-2.5 relative w-full'>
                <Link to='/core/thenaIds'>
                  <button className='p-1.5 flex flex-col items-center justify-center rounded-[3px] border-[2px] border-[#0000AF]'>
                    <img alt='' src='/images/thenaIds/refresh.svg' />
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setShare(!share)
                  }}
                  className='p-1.5 flex flex-col items-center justify-center rounded-[3px] border-[2px] border-[#0000AF]'
                >
                  <img alt='' src='/images/core/share-small.svg' />
                </button>
                <OutsideClickHandler onOutsideClick={() => setShare(false)}>
                  {share && (
                    <div className='absolute max-w-[200px] w-full z-10 bg-[#1A265E] px-4 py-3 rounded-[5px] right-0 top-[58px] flex flex-col'>
                      <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                        Share on X
                      </div>
                      <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                        Share on Facebook
                      </div>
                      <div className='text-white transition-all duration-150 ease-in-out hover:opacity-70 leading-[27px] text-[15px] mb-2.5 w-full'>
                        Share on Group
                      </div>
                      <div className='mt-2.5 pt-2.5 border-t border-white border-opacity-[0.31]'>
                        <button className='text-white leading-[27px] text-[15px] hover:opacity-70 transition-all duration-150 ease-in-out'>Copy Link</button>
                      </div>
                    </div>
                  )}
                </OutsideClickHandler>
              </div>
            </div>
            <DropDownCard
              onChange={() => {
                setDropDowns({ ...dropDowns, details: !dropDowns.details })
              }}
              dropDownBol={dropDowns.details}
              title='Details'
            >
              <div className={`${dropDowns.details ? 'block' : 'hidden'} w-full mt-1.5`}>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-base leading-7 text-secondary'>Contract Address </p>
                  <p className='text-base leading-7 text-green'>0x2af7…4f8d</p>
                </div>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-base leading-7 text-secondary'>Token ID </p>
                  <p className='text-base leading-7 text-secondary'>2</p>
                </div>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-base leading-7 text-secondary'>Contract Address </p>
                  <p className='text-base leading-7 text-secondary'>ERC-721</p>
                </div>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-base leading-7 text-secondary'>Token Standard Chain </p>
                  <p className='text-base leading-7 text-secondary'>BNB Chain</p>
                </div>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-base leading-7 text-secondary'>Creator Earnings </p>
                  <p className='text-base leading-7 text-secondary'>0%</p>
                </div>
              </div>
            </DropDownCard>
            <DropDownCard
              onChange={() => {
                setDropDowns({ ...dropDowns, stats: !dropDowns.stats })
              }}
              dropDownBol={dropDowns.stats}
              title='Attributes'
            >
              <div className={`${dropDowns.stats ? 'block' : 'hidden'} w-full mt-1.5`}>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-base leading-7 text-secondary'>Length </p>
                  <p className='text-base leading-7 text-secondary'>8 of 11</p>
                </div>
              </div>
            </DropDownCard>
          </div>
        </div>
        <DropDownCard
          onChange={() => {
            setDropDowns({ ...dropDowns, description: !dropDowns.description })
          }}
          dropDownBol={dropDowns.description}
          title='Description'
        >
          <div className={`${dropDowns.description ? 'block' : 'hidden'} w-full mt-1.5`}>
            <p className='text-base leading-7 text-secondary'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in augue sit amet justo interdum rutrum a in tortor. Pellentesque suscipit
              nibh quis. Lorem ipsum dolor sit amet, consectetur adipiamet justo interdum rutrum a in tortosque suscipit nibh quis que suscipit o interdum
              rutrum a in tortor. Pellentesque suscipit nibh quis.{' '}
            </p>
          </div>
        </DropDownCard>

        <DropDownCard
          onChange={() => {
            setDropDowns({ ...dropDowns, about: !dropDowns.about })
          }}
          dropDownBol={dropDowns.about}
          title='About THENA ID'
        >
          <div className={`${dropDowns.about ? 'block' : 'hidden'} w-full mt-1.5`}>
            <p className='text-base leading-7 text-secondary'>
              THENA ID is a unique, social-driven identifier on the BNB Chain. More than a simple wallet address, it showcases a user’s involvement and standing
              within the THENA CORE network. Your .thena username is more than just an identity; it’s a social passport in the world of crypto.
              <br />
              <br />
              Join in Trading Competitions, climb the leaderboards, and show off your prowess all under your .thena username. Your trading skills and strategies
              are on full display, fostering a competitive and interactive environment.
              <br />
              <br />
              Early adopters of THENA ID also gain privileged access to new features on our platform, marking them as trailblazers in our ecosystem. Your .thena
              username will replace the traditional wallet addresses within our social platform, enabling more organic and human connections.
              <br />
              <br />
              To get started, mint your unique .thena ID directly from our website at thena.fi/core/mint.
              <br />
              <br />
              Step into the future of blockchain social interaction with THENA ID, where your crypto identity truly shines. Be part of t
            </p>
          </div>
        </DropDownCard>
      </div>
      <div className='bg-cardBg p-5 rounded-[5px] mt-5'>
        <div className='flex items-center space-x-6'>
          <button
            onClick={() => {
              setTab('OpenSea Info')
            }}
            className={`text-[22px] leading-7 font-semibold pb-[5px] font-figtree ${
              tab === 'OpenSea Info' ? 'text-white border-green' : 'text-placeholder border-transparent'
            } border-b`}
          >
            OpenSea Info
          </button>
          <button
            onClick={() => {
              setTab('FNTIFY')
            }}
            className={`text-[22px] leading-7 font-semibold pb-[5px] font-figtree ${
              tab === 'FNTIFY' ? 'text-white border-green' : 'text-placeholder border-transparent'
            } border-b`}
          >
            FNTIFY
          </button>
        </div>
        {tab === 'OpenSea Info' && (
          <>
            <DropDownCard
              onChange={() => {
                setOpenSeaDropDowns({ ...openSeaDropDowns, priceHistory: !openSeaDropDowns.priceHistory })
              }}
              dropDownBol={dropDowns.about}
              title='Price History'
            >
              <div className={`${openSeaDropDowns.priceHistory ? 'block' : 'hidden'} w-full mt-1.5`}>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-base leading-7 text-secondary'>Graph will be here</p>
                </div>
              </div>
            </DropDownCard>
            <DropDownCard
              onChange={() => {
                setOpenSeaDropDowns({ ...openSeaDropDowns, listings: !openSeaDropDowns.listings })
              }}
              dropDownBol={openSeaDropDowns.listings}
              title='Listings'
              disablePadding
              className=' py-5 px-4'
            >
              <div className={`${openSeaDropDowns.listings ? 'block' : 'hidden'} w-full mt-1.5`}>
                <Table headers={listingsHeader} rows={listingsData} />
              </div>
            </DropDownCard>{' '}
            <DropDownCard
              onChange={() => {
                setOpenSeaDropDowns({ ...openSeaDropDowns, offers: !openSeaDropDowns.offers })
              }}
              dropDownBol={openSeaDropDowns.offers}
              title='Offers'
              disablePadding
              className=' py-5 px-4'
            >
              <div className={`${openSeaDropDowns.offers ? 'block' : 'hidden'} w-full mt-1.5`}>
                <Table headers={offersHeader} rows={offersData} />
              </div>
            </DropDownCard>
          </>
        )}
      </div>
    </div>
  )
}

export default ThenaIdDetail

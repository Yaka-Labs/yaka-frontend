import React, { useState } from 'react'
import Modal from 'components/Modal'
import TransparentButton from 'components/Buttons/transparentButton'
import '../style.scss'

const Index = ({ data }) => {
  const [transictionModal, setTransictionModal] = useState(false)
  const getButton = (type) => {
    switch (type) {
      case 'follow':
        return <TransparentButton content='Follow Back' onClickHandler={() => {}} className='py-2 px-5 whitespace-nowrap' />
      case 'invitation':
        return <TransparentButton content='Join' onClickHandler={() => {}} className='py-2 px-7 whitespace-nowrap' />
      case 'transiction':
        return (
          <TransparentButton
            content='View'
            onClickHandler={() => {
              setTransictionModal(true)
            }}
            className='py-2 px-7 whitespace-nowrap'
          />
        )
      case 'nftOffer':
        return <TransparentButton content='View' onClickHandler={() => {}} className='py-2 px-7 whitespace-nowrap' />
      default:
    }
  }
  return (
    <>
      <div className='flex items-center justify-between  w-full'>
        <div className='flex items-center space-x-4'>
          <img className='w-9 h-9 rounded-full' alt='' src={data?.icon} />
          <div>
            <p dangerouslySetInnerHTML={{ __html: data.des }} className='text-white leading-4' id='dangerously-set-data' />
            <p className=' text-secondary text-sm leading-4 mt-0.5'>{data.time}</p>
          </div>
        </div>
        {getButton(data.type)}
      </div>
      <Modal setPopup={setTransictionModal} popup={transictionModal} title='Transaction Details'>
        <div className='mt-3'>
          <div className='w-full'>
            <div className='text-lightGray leading-5'>From</div>
            <div className='flex items-center space-x-2'>
              <img alt='' src='/images/core/p3.png' className='w-11 h-11 rounded-full' />
              <div className='w-full'>
                <p className='text-lg font-figtree text-white font-medium leading-5'>Lara Thompson</p>
                <p className='text-[15px] text-lightGray leading-5'>0x2641cd3a630eef903c38685571f5bc8fba0014e3</p>
              </div>
            </div>
          </div>
          <div className='w-full mt-4'>
            <div className='text-lightGray leading-5'>To</div>
            <div className='flex items-center space-x-2'>
              <img alt='' src='/images/core/p3.png' className='w-11 h-11 rounded-full' />
              <div className='w-full'>
                <p className='text-lg font-figtree text-white font-medium leading-5'>John Doe</p>
                <p className='text-[15px] text-lightGray leading-5'>0x2641cd3a630eef903c38685571f5bc8fba0014e3</p>
              </div>
            </div>
          </div>
          <div className='w-full mt-4'>
            <div className='text-lightGray leading-5'>Amount</div>
            <p className='text-2xl font-figtree text-white font-semibold leading-7 mt-px'>250 USDT</p>
          </div>
          <div className='w-full mt-4'>
            <div className='text-lightGray leading-5'>Message:</div>
            <p className=' text-lightGray leading-[22px] mt-px'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pelleque in augue sit amet justo interdum rutrum a in tortor. Pellentesque lore suscipit
              nibh quis. Lorem ipasum doewqlor sit amet, contetuasfast augue sit amet justo interdum rutrum.
            </p>
          </div>
          <button className='w-full mt-4 flex items-center text-green space-x-1.5'>
            <span>View on BscScan</span>
            <img alt='' src='/images/notifications/redirect.svg' />
          </button>
        </div>
      </Modal>
    </>
  )
}

export default Index

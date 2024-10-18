import React from 'react'
import TransparentButton from '../Buttons/transparentButton'

const Index = ({ show, className = '', showCard = () => {}, removeCard = () => {} }) => {
  return (
    <div
      onMouseEnter={showCard}
      onMouseLeave={removeCard}
      className={`bg-cardLight absolute max-w-[370px] shadow-xl block p-4 rounded-sm w-full transition-all duration-300 ease-in-out ${className} ${
        show ? 'opacity-1 z-40 hidden md:block' : 'opacity-0 hidden'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <img alt='' src='/images/core/p3.png' className='w-11 h-11' />
          <span className='text-lg leading-[22px] text-white font-medium font-figtree'>Larathompson.thena</span>
        </div>
        <TransparentButton content='Follow' className='px-[22px] py-2' />
      </div>
      <div className='flex items-center space-x-7 mt-4'>
        <div className='text-secondary'>
          <p className='text-[15px] leading-[18px] font-figtree'>Balance</p>
          <p className='text-[17px] leading-5 font-semibold'>153,719 THE</p>
        </div>
        <div className='text-secondary'>
          <p className='text-[15px] leading-[18px] font-figtree'>Followers</p>
          <p className='text-[17px] leading-5 font-semibold'>2710</p>
        </div>
        <div className='text-secondary'>
          <p className='text-[15px] leading-[18px] font-figtree'>Rank</p>
          <p className='text-[17px] leading-5 font-semibold'>12</p>
        </div>
      </div>
      <p className='text-secondary text-sm leading-5 mt-3'>
        Hi! My name is John and lorem ipsum dolor siet amet, consectetur adipiscing elit. Pellenteue in augue sit amet justo interdum sectetur adipiscing…
      </p>
    </div>
  )
}

export default Index

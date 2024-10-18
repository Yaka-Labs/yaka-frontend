import React from 'react'

const Index = ({ children, onChange, title, dropDownBol, disablePadding = false, className = '' }) => {
  return (
    <div className={`${!disablePadding ? 'p-4' : ''} bg-cardDark rounded-[5px] mt-8 w-full`}>
      <button
        onClick={() => {
          onChange()
        }}
        className={`${className} flex items-center justify-between w-full focus-within:outline-none`}
      >
        <p className='text-[22px] leading-7 text-white font-figtree font-semibold'>{title}</p>
        <img className={`${dropDownBol ? '' : ' rotate-180'} transform`} src='/images/header/dropdown-arrow.svg' alt='' />
      </button>
      {children}
    </div>
  )
}

export default Index

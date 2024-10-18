import React from 'react'

const BlueInput = ({ className, value = null, onChange = () => {}, token = null, right = null, ...rest }) => {
  return (
    <div
      className={`relative border border-blue w-full rounded-[3px] bg-body h-[42px] lg:h-[52px] text-white text-base px-4 flex items-center justify-center${
        className ? ' ' + className : ''
      }`}
    >
      <input
        className='h-full focus:outline-none w-full bg-transparent text-white placeholder-white'
        value={value || ''}
        onChange={(e) => {
          const val = rest.type === 'number' && !e.target.value ? '' : e.target.value
          onChange(val)
        }}
        {...rest}
      />
      {token && (
        <div className='flex items-center space-x-1.5 absolute right-4'>
          <img alt='' src={token.logoURI} className='w-[25px] h-[25px]' />
          <span className='text-lg text-white font-figtree leading-[22px]'>{token.symbol}</span>
        </div>
      )}
      {right}
    </div>
  )
}

export default BlueInput

/* eslint-disable */
import React from 'react'

const TransparentButton = ({ content, className, onClickHandler = null, disabled, isUpper = false }) => {
  return (
    <button
      role='button'
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onClickHandler()
        }
      }}
      className={`flex items-center justify-center text-center text-white font-figtree bg-[#FF626E33] text-[12.75px] lg:text-[14.45px]
      transition-all duration-300 ease-in-out border rounded gradient-bg font-medium ${isUpper ? ' tracking-[1.12px] lg:tracking-[1.36px]' : ''} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }${className ? ' ' + className : ''}`}
    >
      {content}
    </button>
  )
}

export default TransparentButton

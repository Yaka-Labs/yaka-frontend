import React from 'react'
import styled from 'styled-components'
import ReactLoading from 'react-loading'

const Button = styled.button`
  background: ${({ disabled }) => (disabled ? 'unset' : 'linear-gradient(269deg, #FF626E -19.87%, #C2111F 88.7%)')};
  text-shadow: ${({ disabled }) => (disabled ? 'unset' : '0px 0px 16px #935c8b')};
  &:hover {
    background-position: 100% 0%;
  }
`
const StyledButton = ({ content, className, onClickHandler = null, disabled, pending = false, isCap = false }) => {
  return (
    <Button
      disabled={disabled}
      role='button'
      aria-disabled={disabled}
      onClick={(e) => {
        if (!disabled && !pending && onClickHandler) {
          onClickHandler(e.target.value)
        }
      }}
      className={`flex items-center justify-center font-semibold transition-all duration-300 ease-in-out rounded-[6.8px] text-[12.75px] lg:text-[14.45px] font-figtree
       ${isCap ? '' : 'tracking-[1.12px] lg:tracking-[1.44px]'} ${className ? ' ' + className : ''} ${
         disabled ? '!bg-white !bg-opacity-[0.33] !text-[#090333] cursor-not-allowed' : 'text-white'
       }`}
    >
      {pending ? <ReactLoading type='spin' color='#FFFFFF' height={24} width={24} /> : content}
    </Button>
  )
}

export default StyledButton

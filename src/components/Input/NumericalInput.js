import React from 'react'
import './style.scss'

const inputRegex = /^\d*(?:\\[.])?\d*$/ // match escaped "." characters via in a non-capturing group

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export const NumericalInput = React.memo(({ value, onUserInput, placeholder, fontSize, color, fontWeight, align, ...rest }) => {
  const enforcer = (nextUserInput) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  return (
    <input
      {...rest}
      className='styled-input'
      value={value}
      style={{ textAlign: align, color, fontSize, fontWeight }}
      onChange={(event) => {
        // replace commas with periods, because uniswap exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, '.'))
      }}
      // universal input options
      inputMode='decimal'
      autoComplete='off'
      autoCorrect='off'
      // text-specific options
      type='text'
      pattern='^[0-9]*[.,]?[0-9]*$'
      placeholder={placeholder || '0.0'}
      minLength={1}
      maxLength={79}
      spellCheck='false'
    />
  )
})

export default NumericalInput

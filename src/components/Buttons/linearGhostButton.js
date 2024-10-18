import React from 'react'

const LinearGhostButton = ({ title, onClickHanlder, className, smallCase }) => {
  return (
    <button
      className={`py-[10.8px] text-white font-figtree leading-5 w-full  ${className} ${
        smallCase ? '' : 'uppercase'
      } bg-pink-gradient fonts-semibold text-[15px] md:text-[17px] border border-[#ED00C9] rounded-[3px] flex items-center justify-center flex-col`}
      onClick={() => {
        onClickHanlder()
      }}
    >
      {title}
    </button>
  )
}

export default LinearGhostButton

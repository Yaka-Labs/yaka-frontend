import React from 'react'

const Max = ({ onClickHanlder, className }) => {
  return (
    <button
      onClick={() => {
        if (onClickHanlder) {
          onClickHanlder()
        }
      }}
      className={`${className} text-white px-[11.05px] py-[5.1px] font-light text-[11.9] md:text-[13.6px]
       leading-[20.4px] hover:bg-opacity-50 transition-all duration-300 ease-in-out bg-[#FF626E] bg-opacity-10 rounded`}
    >
      MAX
    </button>
  )
}

export default Max

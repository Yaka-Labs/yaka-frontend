import React from 'react'

const Notification = ({ isClose = false, onClose = () => {}, error = false, className, children }) => {
  return (
    <div
      className={`${className} pl-3.5 pr-4 py-2.5 flex space-x-[11.5px] w-full border bg-[#0D1238] rounded-[5px] my-3.5 ${
        error ? 'border-error' : 'border-[#EDB831]'
      }`}
    >
      <img alt='' src={error ? '/images/mark/error-mark.svg' : '/images/mark/warn-mark.svg'} />
      <div className={`w-px ${error ? 'bg-error' : 'bg-[#EDB831]'}`} />
      <div className={`flex items-center space-x-2 ${className === 'w-full' ? 'w-full justify-between' : ''}`}>
        <p className='font-figtree text-white font-normal'>{children}</p>
        {isClose && (
          <button
            onClick={() => {
              onClose()
            }}
          >
            <img alt='' src='/images/common/close-button.svg' width={32} height={32} style={{ maxWidth: 'none' }} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Notification

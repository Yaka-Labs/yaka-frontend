import { SCAN_URLS } from 'config/constants'
import React from 'react'
import { ChainId } from 'thena-sdk-core'

const Message = ({ closeToast, title, type = null, hash = null, chainId = ChainId.BSC }) => (
  <div className='flex items-center justify-between'>
    <div className='flex items-center'>
      {type && <img className='message-icon' src={`/images/mark/${type}-mark.svg`} alt='' />}
      <div>
        <div className='message-title font-figtree'>{title}</div>
        {hash && (
          <div
            className='text-green text-sm leading-[20.4px] cursor-pointer flex items-center underline underline-offset-2'
            onClick={() => {
              // window.open(`${SCAN_URLS[chainId]}/transactions/${hash}`, '_blank')
                window.open(`${SCAN_URLS[chainId]}/tx/${hash}${CHAIN_URLS[chainId]}`, '_blank')
            }}
          >
            <img src='/images/svgs/link.svg' className='ml-[3.4px] text-green' alt='link' />
          </div>
        )}
      </div>
    </div>
    <img src='/images/common/close-button.svg' onClick={closeToast} alt='' />
  </div>
)

export default Message

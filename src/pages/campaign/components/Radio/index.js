/* eslint-disable */
import React from 'react'

const Radio = ({ label, checked, width = 600 }) => {
  return (
    <div style={{ width: width }} className='flex flex-wrap gap-4 items-center max-w-[660px]'>
      <label className='flex flex-row items-center w-[580px]'>
        <div className='w-4 h-4'>
          <div
            style={{ background: checked ? 'red' : '', borderWidth: checked ? '0px' : '1px' }}
            className='w-4 h-4 rounded-full border border-gray-300 peer-checked:border-transparent peer-checked:bg-red-500 flex items-center justify-center'
          >
            <span className={`${checked ? '' : 'hidden'} peer-checked:block text-white`}>✓</span>
          </div>
        </div>

        <span className='ml-2 text-white'>{label.replace(/WSEI/g, 'SEI')}</span>
      </label>
    </div>
  )
}

export default Radio

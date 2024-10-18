import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAssets } from 'state/assets/hooks'
import { formatNumber } from 'utils/formatNumber'
import SearchTokenPopup from '../SearchTokenPopup'
// import BigNumber from 'bignumber.js'

const percentArray = [25, 50, 75, 100]

const TokenInput = ({ title, asset, setAsset, otherAsset, setOtherAsset, amount, onInputChange = () => {}, disabled = false, disabledSelect = false }) => {
  const [tokenPopup, setTokenPopup] = useState(false)
  const assets = useAssets()
  const { account } = useWeb3React()

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <p className='text-secondary text-sm md:text-[13.6px] leading-[34px]'>{title}</p>
        {account && (
          <div className='flex items-center space-x-[10.2px]'>
            {!disabled && (
              <div className='flex items-center space-x-[8.5px]'>
                {percentArray.map((percent, index) => {
                  return (
                    <div
                      className='flex items-center justify-center bg-white bg-opacity-[0.08] round-[3px] text-white text-[13px] md:text-[13.6px] w-[40px] md:w-[47.6px] h-[22px] md:h-[23.8px] cursor-pointer'
                      onClick={() => asset && onInputChange(asset?.balance?.times(percent).div(100).dp(asset.decimals).toString(10) || '')}
                      key={`percent-${index}`}
                    >
                      {percent}%
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <div className='gradient-bg mt-1.5 md:mt-[8.5px] p-px w-full rounded-[3px]'>
        <div className='px-[8.5px] lg:px-[13.6px] py-[6.8px] lg:py-[8.5px] rounded-[3px] text-white'>
          <div className='flex items-center space-x-[13.6px]'>
            <input
              value={amount}
              onChange={(e) => {
                onInputChange(Number(e.target.value) < 0 ? '' : e.target.value)
              }}
              className='w-full bg-transparent !border-0 text-[17px] lg:text-[20.4px] leading-[34px] placeholder-[#757384] focus:outline-none'
              placeholder='0.00'
              type='number'
              disabled={disabled}
              min={0}
              lang='en'
            />
            {asset && (
              <div
                onClick={() => {
                  if (disabledSelect) {
                    return
                  }
                  setTokenPopup(true)
                }}
                className='w-fit flex items-center space-x-[3.4px] lg:space-x-[6.8px] font-figtree cursor-pointer'
              >
                <img className='w-[23.8px] h-[23.8px] !max-w-none' alt='' src={asset.logoURI} />
                <span className='font-medium text-sm lg:text-[1.02rem] leading-6'>{asset.symbol}</span>
                <img style={{ display: disabledSelect ? 'none' : '' }} className='!max-w-none' alt='' src='/images/swap/dropdown-arrow.png' />
              </div>
            )}
          </div>
          <div className='flex justify-between items-center text-xs lg:text-xs mt-[1.7px]'>
            <div className='truncate'>${formatNumber((asset?.price || 0) * (Number(amount) || 0))}</div>
            <p>Balance: {!asset || !account ? '-' : formatNumber(asset.balance)}</p>
          </div>
        </div>
      </div>
      {tokenPopup && (
        <SearchTokenPopup
          popup={tokenPopup}
          setPopup={setTokenPopup}
          selectedAsset={asset}
          setSelectedAsset={setAsset}
          otherAsset={otherAsset}
          setOtherAsset={setOtherAsset}
          baseAssets={assets}
        />
      )}
    </div>
  )
}

export default TokenInput

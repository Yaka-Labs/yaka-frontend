import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { formatNumber } from 'utils/formatNumber'
import DoubleCurrencyLogo from '../DoubleCurrencyLogo'

const percentArray = [25, 50, 75, 100]

const BalanceInput = ({ title, inputAmount, setInputAmount, symbol = '', logoURIs, balance = null }) => {
  const { account } = useWeb3React()
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between w-full'>
        {title && <p className='text-secondary text-sm md:text-[13.6px] leading-[34px]'>{title}</p>}
        {account && balance && (
          <div className={`flex items-center text-sm lg:text-[13.6px] space-x-[10.2px] ${!title && 'justify-between w-full'}`}>
            <div className='flex items-center space-x-[8.5px]'>
              {percentArray.map((percent, index) => {
                return (
                  <div
                    className='flex items-center justify-center bg-[#4A0205]  round-[3px] text-[13px] md:text-[13.6px] w-[40px] md:w-[47.6px] h-[22px] md:h-[23.8px] cursor-pointer'
                    onClick={() => setInputAmount(balance.times(percent).div(100).toString(10) || 0)}
                    key={`percent-${index}`}
                  >
                    {percent}%
                  </div>
                )
              })}
            </div>
            <p>Balance: {formatNumber(balance)}</p>
          </div>
        )}
      </div>
      <div className='gradient-bg mt-1.5 lg:mt-[8.5px]  p-px w-full rounded-[2.55px]'>
        <div className='px-[10.2px]  rounded-[2.55px] flex items-center justify-between'>
          <input
            className={`bg-transparent focus:outline-none ${
              logoURIs.length > 1 ? 'w-[65%]' : 'w-[80%]'
            } py-[6.8px] lg:py-[12.75px] text-[17px] lg:text-[20.4px] leading-[34px] placeholder-[#757384]`}
            value={inputAmount}
            onChange={(e) => {
              setInputAmount(Number(e.target.value) < 0 ? '' : e.target.value)
            }}
            placeholder='0.00'
            type='number'
            min={0}
            lang='en'
          />
          {logoURIs.length > 0 && (
            <div className='flex items-center justify-between space-x-[6.8px]'>
              {logoURIs.length > 1 ? (
                <DoubleCurrencyLogo logo1={logoURIs[0]} logo2={logoURIs[1]} isSmall />
              ) : (
                <img alt='' width={28} height={28} src={logoURIs[0]} />
              )}
              <p className='font-medium text-sm lg:text-[1.02rem] leading-[20.4px]'>{symbol.replace(/WSEI/g, 'SEI')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BalanceInput

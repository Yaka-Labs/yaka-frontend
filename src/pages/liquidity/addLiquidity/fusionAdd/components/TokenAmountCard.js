import React, { useMemo } from 'react'
import { WBNB } from 'thena-sdk-core'
import { useCurrencyBalance } from 'hooks/v3/useCurrencyBalances'
import { FusionRangeType } from 'config/constants'
import { formatNumber } from 'utils/formatNumber'
import { useCurrency } from 'hooks/v3/Tokens'
import { useCurrencyLogo } from 'hooks/v3/useCurrencyLogo'
import DoubleCurrencyLogo from 'components/DoubleCurrencyLogo'
import { useNetwork } from 'state/settings/hooks'

const percentArray = ['25', '50', '75', '100']

export const TokenAmountCard = ({ currency, value, maxAmount, handleInput, locked, liquidityRangeType = FusionRangeType.MANUAL_RANGE }) => {
  const { networkId } = useNetwork()
  const bnb = useCurrency('BNB')
  const balance = useCurrencyBalance(currency)
  const bnbBalance = useCurrencyBalance(bnb)
  const wBnbBalance = useCurrencyBalance(WBNB[networkId])
  const logoURI = useCurrencyLogo(currency)

  const isDouble = useMemo(() => {
    return (
      [FusionRangeType.GAMMA_RANGE, FusionRangeType.DEFIEDGE_RANGE].includes(liquidityRangeType) &&
      networkId &&
      currency?.wrapped.address.toLowerCase() === WBNB[networkId].address.toLowerCase()
    )
  }, [liquidityRangeType, currency])

  const balanceString = useMemo(() => {
    if (!balance) return 'Loading'

    if (isDouble) {
      return ((wBnbBalance ? Number(wBnbBalance.toExact()) : 0) + (bnbBalance ? Number(bnbBalance.toExact()) : 0)).toFixed(5)
    } else {
      return balance.toSignificant()
    }
  }, [balance, isDouble, wBnbBalance, bnbBalance])

  return (
    <div className='w-full'>
      {locked ? (
        <div className='bg-white bg-opacity-[0.05] flex flex-col justify-center items-center rounded-[2.55px] bg-clip-padding px-[17px] py-[13.6px] text-white text-sm lg:text-[13.6px]'>
          <img src='/images/common/lock.svg' alt='' />
          <p className='span mt-[3.4px]'>Price is outside specified price range.</p>
          <p className='span'>Single-asset deposit only.</p>
        </div>
      ) : (
        <>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center text-sm lg:text-[13.6px] space-x-[10.2px] justify-between w-full'>
              <div className='flex items-center space-x-[8.5px]'>
                {percentArray.map((percent, index) => {
                  return (
                    <div
                      className='flex items-center justify-center bg-white bg-opacity-[0.08] round-[2.55px] text-white text-[13px] md:text-[13.6px] w-[40px] md:w-[47.6px] h-[22px] md:h-[23.8px] cursor-pointer'
                      onClick={() => {
                        handleInput(maxAmount?.divide('100')?.multiply(percent)?.toExact() ?? '')
                      }}
                      key={`percent-${index}`}
                    >
                      {percent}%
                    </div>
                  )
                })}
              </div>
              <p className='text-white'>Balance: {formatNumber(balanceString)}</p>
            </div>
          </div>
          <div className='gradient-bg mt-1.5 lg:mt-[8.5px]  p-px w-full rounded-[2.55px]'>
            <div className='bg-body px-[10.2px]  rounded-[2.55px] flex items-center justify-between'>
              <input
                className={`bg-transparent ${
                  isDouble ? 'w-[35%] md:w-[50%]' : 'w-[80%]'
                } py-[8px] lg:py-[12.75px] text-xl lg:text-[20.4px] leading-[34px] placeholder-[#757384] text-white focus:outline-none`}
                value={value}
                disabled={locked}
                onChange={(e) => {
                  handleInput(Number(e.target.value) < 0 ? '' : e.target.value)
                }}
                placeholder='0.00'
                type='number'
                min={0}
                lang='en'
              />
              {currency && (
                <div className='flex items-center justify-between space-x-[6.8px]'>
                  {isDouble ? (
                    <DoubleCurrencyLogo logo1='https://cdn.thena.fi/assets/BSC.png' logo2='https://cdn.thena.fi/assets/BNB.png' isSmall />
                  ) : (
                    <img alt='' width={23.8} height={23.8} src={logoURI} />
                  )}
                  <p className='font-medium text-sm lg:text-[1.2rem] leading-[20.4px] text-white'>{isDouble ? 'BNB + WBNB' : currency.symbol}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

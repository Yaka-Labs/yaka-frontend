import React, { useMemo, useState } from 'react'
import PriceBox from 'components/PriceBox'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { useToken } from 'hooks/v3/Tokens'
import { useStableAssets } from 'hooks/v3/useStableAssets'
import { Position } from 'thena-fusion-sdk'
import { Bound } from 'state/mintV3/actions'
import { formatTickPrice } from 'v3lib/utils/formatTickPrice'
import { getPriceOrderingFromPositionForUI } from '../manualPosition'

const MinPrice = (value, symbol0, symbol1, inRange) => {
  return (
    <div className='mt-2.5 md:mt-[13px]'>
      <p className='text-base leading-5 md:text-2xl text-white font-medium'>{value}</p>
      <p className='text-xs  md:text-sm leading-[15px] md:leading-4 text-[#B8B6CB] mt-[10px] md:mt-[9px]'>
        {symbol0} per {symbol1}
      </p>
      {inRange && (
        <p className='leading-[17px] md:leading-5 text-[#B8B6CB] max-w-[200px] w-full mt-1.5 md:mt-2 font-light text-xs md:text-sm'>
          Your position will be 100% {symbol1} at this price.
        </p>
      )}
    </div>
  )
}
const MaxPrice = (value, symbol0, symbol1, inRange) => {
  return (
    <div className='mt-2.5 md:mt-[13px]'>
      <p className='text-base leading-5 md:text-2xl text-white font-medium'>{value}</p>
      <p className='text-xs  md:text-sm leading-[15px] md:leading-4 text-[#B8B6CB] mt-[10px] md:mt-[9px]'>
        {symbol0} per {symbol1}
      </p>
      {inRange && (
        <p className='leading-[17px] md:leading-5 text-[#B8B6CB] max-w-[200px] w-full mt-1.5 md:mt-2 font-light text-xs md:text-sm '>
          Your position will be 100% {symbol0} at this price.
        </p>
      )}
    </div>
  )
}
const CurrentPrice = (value, symbol0, symbol1) => {
  return (
    <div className='mt-2.5 md:mt-[13px]'>
      <p className='text-base leading-5 md:text-2xl text-white font-medium'>{value}</p>
      <p className='text-xs  md:text-sm leading-[15px] md:leading-4 text-[#B8B6CB] mt-2.5 md:mt-[13px]'>
        {symbol0} per {symbol1}
      </p>
    </div>
  )
}
const getInverter = ({ priceLower, priceUpper, quote, base, invert }) => {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  }
}

const SelectedRange = ({ pool, positionDetails, currency0, currency1 }) => {
  const [manuallyInverted, setManuallyInverted] = useState(false)
  const { token1: _token1Address, liquidity: _liquidity, tickLower: _tickLower, tickUpper: _tickUpper } = positionDetails
  const stableAssets = useStableAssets()

  const position = useMemo(() => {
    if (pool && _liquidity && typeof _tickLower === 'number' && typeof _tickUpper === 'number') {
      return new Position({
        pool,
        liquidity: _liquidity.toString(),
        tickLower: _tickLower,
        tickUpper: _tickUpper,
      })
    }
    return undefined
  }, [_liquidity, pool, _tickLower, _tickUpper])

  const tickAtLimit = useIsTickAtLimit(_tickLower, _tickUpper)

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position, stableAssets)

  // handle manual inversion
  const { priceLower, priceUpper, base } = getInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  })

  const token1 = useToken(_token1Address)
  const isCurrencyReverted = pricesFromPosition.base?.equals(token1)
  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? currency0 : currency1
  const currencyBase = inverted ? currency1 : currency0

  // check if price is within range
  const below = pool && typeof _tickLower === 'number' ? pool.tickCurrent < _tickLower : undefined
  const above = pool && typeof _tickUpper === 'number' ? pool.tickCurrent >= _tickUpper : undefined
  const inRange = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false

  return (
    <>
      <div className='flex items-center mt-[15.3px] justify-between'>
        <span className='text-sm md:text-[13.6px] leading-4 md:leading-[17px] font-medium text-[#B8B6CB]'>Selected Range</span>
        <div className='flex h-7 md:h-[30.6px] max-w-[125.8px] w-full border border-[#555367] rounded-[4.25px] relative'>
          <div
            className={`absolute ${
              manuallyInverted ? 'left-0 w-7/12 -ml-[2px]' : '-mr-[2px] right-0 w-5/12'
            } transition-all duration-300 ease-in-out bg-[#0000AF] h-[29px] md:h-[31.45px] -mt-[2px] rounded-[4.25px]`}
          />
          <div
            onClick={() => {
              setManuallyInverted(true)
            }}
            className={`w-7/12 h-full flex text-[13px] md:text-[13.6px] flex-col items-center justify-center  cursor-pointer relative z-10 ${
              manuallyInverted ? ' text-white' : 'text-[#A2A0B7]'
            } rounded-[4.25px]`}
          >
            {isCurrencyReverted ? currency0.symbol : currency1.symbol}
          </div>
          <div
            onClick={() => {
              setManuallyInverted(false)
            }}
            className={`w-5/12 h-full flex text-[13px] md:text-[13.6px] flex-col items-center justify-center  cursor-pointer relative z-10 ${
              !manuallyInverted ? ' text-white' : 'text-[#A2A0B7]'
            } rounded-[4.25px]`}
          >
            {isCurrencyReverted ? currency1.symbol : currency0.symbol}
          </div>
        </div>
      </div>
      <div className='flex items-center space-x-[10.2px] mt-[11.05px]'>
        {priceLower && (
          <PriceBox
            content={MinPrice(formatTickPrice(priceLower, tickAtLimit, Bound.LOWER), currencyQuote?.symbol, currencyBase?.symbol, inRange)}
            range='Min'
            className='w-full'
          />
        )}
        {priceUpper && (
          <PriceBox
            content={MaxPrice(formatTickPrice(priceUpper, tickAtLimit, Bound.LOWER), currencyQuote?.symbol, currencyBase?.symbol, inRange)}
            range='Max'
            className='w-full'
          />
        )}
      </div>
      {pool && (
        <PriceBox
          content={CurrentPrice((inverted ? pool.token1Price : pool.token0Price).toSignificant(6), currencyQuote?.symbol, currencyBase?.symbol)}
          range='Current'
          className='w-full mt-[10.2px]'
        />
      )}
    </>
  )
}

export default SelectedRange

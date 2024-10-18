import React, { useMemo } from 'react'
import { Percent, WBNB } from 'thena-sdk-core'
import { Position } from 'thena-fusion-sdk'
import { useToken } from 'hooks/v3/Tokens'
import usePrevious from 'hooks/usePrevious'
import { useFusion } from 'hooks/v3/useFusions'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { useCurrencyLogo } from 'hooks/v3/useCurrencyLogo'
import { useStableAssets } from 'hooks/v3/useStableAssets'
import { unwrappedToken } from 'v3lib/utils'
import { formatTickPrice } from 'v3lib/utils/formatTickPrice'
import { Bound } from 'state/mintV3/actions'

export const getPriceOrderingFromPositionForUI = (position, stables) => {
  if (!position) {
    return {}
  }

  const token0 = position.amount0.currency
  const token1 = position.amount1.currency
  if (stables.some((stable) => stable.equals(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if token1 is an WBNB, set it as the base token
  // TODO
  const bases = [...Object.values(WBNB)]
  if (bases.some((base) => base.equals(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  }
}

const ManualPosition = ({ position: positionDetails }) => {
  const { token0: _token0Address, token1: _token1Address, liquidity: _liquidity, tickLower: _tickLower, tickUpper: _tickUpper, tokenId } = positionDetails

  const token0 = useToken(_token0Address)
  const token1 = useToken(_token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined
  const logoURI0 = useCurrencyLogo(currency0)
  const logoURI1 = useCurrencyLogo(currency1)

  // construct Position from details returned
  const [poolState, pool] = useFusion(currency0 ?? undefined, currency1 ?? undefined)
  const [prevPoolState, prevPool] = usePrevious([poolState, pool]) || []
  const [, _pool] = useMemo(() => {
    if (!pool && prevPool && prevPoolState) {
      return [prevPoolState, prevPool]
    }
    return [poolState, pool]
  }, [pool, poolState, prevPool, prevPoolState])

  const position = useMemo(() => {
    if (_pool) {
      return new Position({
        pool: _pool,
        liquidity: _liquidity.toString(),
        tickLower: _tickLower,
        tickUpper: _tickUpper,
      })
    }
    return undefined
  }, [_liquidity, _pool, _tickLower, _tickUpper])

  const tickAtLimit = useIsTickAtLimit(_tickLower, _tickUpper)
  const stables = useStableAssets()
  // prices
  const priceTickInfo = getPriceOrderingFromPositionForUI(position, stables)
  const { priceLower, priceUpper, quote, base } = priceTickInfo
  // check if price is within range
  const outOfRange = _pool ? _pool.tickCurrent < _tickLower || _pool.tickCurrent >= _tickUpper : false
  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  return (
    <div>
      <div className='lg:flex justify-start items-center w-full'>
        <div className='flex items-center space-x-[8.5px]'>
          <div className='w-[37.4px] h-[37.4px] lg:w-[42.5px] lg:h-[42.5px] rounded-full flex flex-col items-center justify-center nftBox flex-shrink-0'>
            <p className='text-[9px] lg:text-[10px] font-semibold leading-[14px] text-[#090333] '>NFT ID:</p>
            <p className='text-xs lg:text-[13px] font-semibold leading-[18px] text-[#090333] '>{Number(tokenId)}</p>
          </div>
          <div className='flex items-center space-x-[6.8px] '>
            <div className='flex items-center'>
              <img alt='' className='w-[20.4px] lg:w-[25.5px] relative shadow' src={logoURI0} />
              <img alt='' className='w-[20.4px] lg:w-[25.5px] -ml-[10.2px]' src={logoURI1} />
            </div>
            <p className='text-[13px] lg:text-[16.15px] font-figtree font-semibold text-white'>
              {currency0?.symbol}/{currency1?.symbol}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-[6.8px] ml-0 lg:ml-[6.8px] mt-[6.8px] lg:mt-0'>
          <div className='bg-white bg-opacity-[0.09] py-[3.4px] pl-[10.2px] rounded-[11.05px] flex items-center space-x-[4.25px] pr-[13.6px] flex-shrink-0'>
            <div className={`${_liquidity?.eq(0) ? 'bg-red-700' : outOfRange ? 'bg-warn' : 'bg-[#55A361]'} w-[6.8px] h-[6.8px]  rounded-full`} />
            <span className='text-[12.75px] fonts-medium text-white whitespace-nowrap'>
              {_liquidity?.eq(0) ? 'Closed' : outOfRange ? 'Out of Range' : 'In Range'}
            </span>
          </div>
          <div className='bg-[#152343]  py-[3.4px]  rounded-[11.05px]   px-[6.8px].5 flex-shrink-0'>
            <span className='text-[12.75px] fonts-medium text-white whitespace-nowrap'>{`${new Percent(pool?.fee || 100, 1_000_000).toSignificant()}%`}</span>
          </div>
        </div>
      </div>
      <div className='md:flex-row flex flex-col items-center  space-y-[3.4px] md:space-y-0  md:space-x-[4.25px] text-sm font-light text-[#B8B6CB] mt-[12.75px] leading-[13.6px]'>
        <p>{`Min ${formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)} ${currencyQuote?.symbol} per ${currencyBase?.symbol}`}</p>
        <button>
          <img alt='double' className='md:block hidden' src='/images/svgs/double.svg' />
          <img alt='double arrow' className='md:hidden' src='/images/svgs/double-arrowv.svg' />
        </button>
        <p>{`Max ${formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)} ${currencyQuote?.symbol} per ${currencyBase?.symbol}`}</p>
      </div>
    </div>
  )
}

export default ManualPosition

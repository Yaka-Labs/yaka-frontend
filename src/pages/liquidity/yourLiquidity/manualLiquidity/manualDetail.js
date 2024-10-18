import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Position } from 'thena-fusion-sdk'
import { Fraction, Percent } from 'thena-sdk-core'
import Toggle from 'components/Toggle'
import LinearGhostButton from 'components/Buttons/linearGhostButton'
import NoFound from 'components/NoFound'
import { useToken } from 'hooks/v3/Tokens'
import usePrevious from 'hooks/usePrevious'
import { useFusion } from 'hooks/v3/useFusions'
import { useCurrencyLogo } from 'hooks/v3/useCurrencyLogo'
import { useV3PositionFees } from 'hooks/v3/useV3PositionFees'
import useUSDTPrice from 'hooks/v3/useUSDTPrice'
import { useAlgebraBurn } from 'hooks/v3/useAlgebra'
import { useStableAssets } from 'hooks/v3/useStableAssets'
import { unwrappedToken } from 'v3lib/utils'
import { formatCurrencyAmount, getRatio } from 'v3lib/utils/formatTickPrice'
import { useManuals } from 'state/manuals/hooks'
import SelectedRange from './components/SelectedRange'
import CollectModal from './components/CollectModal'
import RemoveModal from './components/RemoveModal'
import AddModal from './components/AddModal'
import { getPriceOrderingFromPositionForUI } from './manualPosition'

const AlgebraItem = ({ positionDetails }) => {
  const [addLiquidity, setIsLiquidity] = useState(false)
  const [withDraw, setIsWithDraw] = useState(false)
  const [fees, setCollectFees] = useState(false)
  // flag for receiving WBNB
  const [receiveWBNB, setReceiveWBNB] = useState(false)
  const { onAlgebraBurn } = useAlgebraBurn()
  const { token0: _token0Address, token1: _token1Address, liquidity: _liquidity, tickLower: _tickLower, tickUpper: _tickUpper } = positionDetails
  const navigate = useNavigate()

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

  const stables = useStableAssets()
  // prices
  const priceTickInfo = getPriceOrderingFromPositionForUI(position, stables)
  const { priceLower, priceUpper } = priceTickInfo
  // check if price is within range
  const outOfRange = _pool ? _pool.tickCurrent < _tickLower || _pool.tickCurrent >= _tickUpper : false

  const ratio = useMemo(() => {
    return priceLower && _pool && priceUpper ? getRatio(position.token0PriceLower, _pool.token0Price, position.token0PriceUpper) : undefined
  }, [_pool, priceLower, priceUpper])

  // fees
  const [feeValue0, feeValue1] = useV3PositionFees(_pool ?? undefined, positionDetails?.tokenId, receiveWBNB)
  const price0 = useUSDTPrice(token0 ?? undefined)
  const price1 = useUSDTPrice(token1 ?? undefined)

  const fiatValueOfFees = useMemo(() => {
    if (!price0 || !price1 || !feeValue0 || !feeValue1) return null

    // we wrap because it doesn't matter, the quote returns a USDC amount
    const feeValue0Wrapped = feeValue0?.wrapped
    const feeValue1Wrapped = feeValue1?.wrapped

    if (!feeValue0Wrapped || !feeValue1Wrapped) return null

    const amount0 = price0.quote(feeValue0Wrapped)
    const amount1 = price1.quote(feeValue1Wrapped)
    return amount0.add(amount1)
  }, [price0, price1, feeValue0, feeValue1])

  const prevFiatValueOfFees = usePrevious(fiatValueOfFees)
  const _fiatValueOfFees = useMemo(() => {
    if (!fiatValueOfFees && prevFiatValueOfFees) {
      return prevFiatValueOfFees
    }
    return fiatValueOfFees
  }, [fiatValueOfFees, prevFiatValueOfFees])

  const fiatValueOfLiquidity = useMemo(() => {
    if (!price0 || !price1 || !position) return
    const amount0 = price0.quote(position.amount0)
    const amount1 = price1.quote(position.amount1)
    return amount0.add(amount1)
  }, [price0, price1, position])

  const showCollectAsWbnb = Boolean(
    (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) && currency0 && currency1 && (currency0.isNative || currency1.isNative),
  )

  return (
    <>
      <div className='lg:flex justify-start items-center w-full'>
        <div className='flex items-center space-x-2.5'>
          <button
            className='w-5 lg:w-auto'
            onClick={() => {
              navigate('/liquidity')
            }}
          >
            <img alt='' src='/images/swap/back-arrow.svg' />
          </button>
          <div className='w-11 h-11 lg:w-[50px] lg:h-[50px] rounded-full flex flex-col items-center justify-center nftBox flex-shrink-0'>
            <p className='text-[9px] lg:text-[10px] font-semibold leading-[14px] text-[#090333] '>NFT ID:</p>
            <p className='text-xs lg:text-[13px] font-semibold leading-[18px] text-[#090333] '>{Number(positionDetails?.tokenId)}</p>
          </div>
          <div className='flex items-center space-x-2 '>
            <div className='flex items-center'>
              <img alt='' className='w-6 lg:w-[30px] relative shadow' src={logoURI0} />
              <img alt='' className='w-6 lg:w-[30px] -ml-3' src={logoURI1} />
            </div>
            <p className='text-[13px] lg:text-[19px] font-figtree font-semibold text-white'>
              {currency0?.symbol}/{currency1?.symbol}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2 ml-0 lg:ml-2 mt-2 lg:mt-0'>
          <div className='bg-white bg-opacity-[0.09] py-1 pl-3 rounded-[13px] flex items-center space-x-[5px] pr-4 flex-shrink-0'>
            <div className={`${_liquidity?.eq(0) ? 'bg-red-700' : outOfRange ? 'bg-warn' : 'bg-[#55A361]'} w-2 h-2  rounded-full`} />
            <span className='text-[15px] fonts-medium text-white whitespace-nowrap'>
              {_liquidity?.eq(0) ? 'Closed' : outOfRange ? 'Out of Range' : 'In Range'}
            </span>
          </div>
          <div className='bg-[#152343]  py-1  rounded-[13px]   px-2.5 flex-shrink-0'>
            <span className='text-[15px] fonts-medium text-white whitespace-nowrap'>{`${new Percent(pool?.fee || 100, 1_000_000).toSignificant()}%`}</span>
          </div>
        </div>
      </div>
      <div className='w-full mt-3 lg:mt-5'>
        <div className='flex items-center justify-between'>
          <span className='text-sm lg:text-base leading-4 lg:leading-5 font-medium text-white'>Liquidity</span>
          <span className='text-sm lg:text-base leading-4 lg:leading-5 font-light  text-white'>${formatCurrencyAmount(fiatValueOfLiquidity, 4)}</span>
        </div>
        <div className='mt-3.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-[5px]'>
              <img alt='' src={logoURI0} className='w-6 lg:w-7' />
              <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{currency0.symbol}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-lightGray leading-5 font-light'>{formatCurrencyAmount(position?.amount0, 4)}</span>
              <div className='py-1 px-2 text-sm lg:text-[15px] leading-4 lg:leading-[19px] text-white bg-[#152343] rounded-md'>{`${ratio}%`}</div>
            </div>
          </div>
          <div className='flex items-center justify-between mt-2'>
            <div className='flex items-center space-x-[5px]'>
              <img alt='' src={logoURI1} className='w-6 lg:w-7' />
              <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{currency1.symbol}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-lightGray leading-5 font-light'>{formatCurrencyAmount(position?.amount1, 4)}</span>
              <div className='py-1 px-2 text-sm lg:text-[15px] leading-4 lg:leading-[19px] text-white bg-[#152343] rounded-md'>{`${100 - ratio}%`}</div>
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-3 mt-4 pb-4 lg:pb-6 border-b border-[#5E6282] mb-3 lg:mb-[18px]'>
          <LinearGhostButton
            onClickHanlder={() => {
              setIsLiquidity(true)
            }}
            title='ADD LIQUIDITY'
          />
          {_liquidity?.eq(0) ? (
            <LinearGhostButton
              onClickHanlder={() => {
                onAlgebraBurn(positionDetails?.tokenId)
              }}
              title='BURN'
            />
          ) : (
            <LinearGhostButton
              onClickHanlder={() => {
                setIsWithDraw(true)
              }}
              title='WITHDRAW'
            />
          )}
        </div>
        <div className='w-full'>
          <div className='flex items-center justify-between'>
            <span className='text-sm lg:text-base leading-4 lg:leading-5 font-medium text-white'>Unclaimed Fees</span>
            <span className='text-sm lg:text-base leading-4 lg:leading-5 font-light  text-white'>
              $
              {_fiatValueOfFees?.greaterThan(new Fraction(1, 100))
                ? +_fiatValueOfFees.toFixed(2, { groupSeparator: ',' }) < 0.01
                  ? '<0.01'
                  : _fiatValueOfFees?.toFixed(2, {
                      groupSeparator: ',',
                    })
                : '-'}
            </span>
          </div>
          <div className='mt-3.5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-[5px]'>
                <img alt='' src={logoURI0} className='w-6 lg:w-7' />
                <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{currency0.symbol}</span>
              </div>
              <span className='text-lightGray leading-5 font-light'>{feeValue0 ? formatCurrencyAmount(feeValue0, 4) : '-'}</span>
            </div>
            <div className='flex items-center justify-between mt-2'>
              <div className='flex items-center space-x-[5px]'>
                <img alt='' src={logoURI1} className='w-6 lg:w-7' />
                <span className='text-[15px] lg:text-lg leading-[18px] lg:leading-[22px] text-white font-figtree font-medium'>{currency1.symbol}</span>
              </div>
              <span className='text-lightGray leading-5 font-light'>{feeValue1 ? formatCurrencyAmount(feeValue1, 4) : '-'}</span>
            </div>
          </div>
          {(feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) && (
            <LinearGhostButton
              onClickHanlder={() => {
                setCollectFees(true)
              }}
              title='CLAIM'
              className='mt-[13px]'
            />
          )}
          {showCollectAsWbnb && (
            <div className=' space-x-1.5 lg:space-x-2 flex items-center mt-3.5'>
              <Toggle checked={receiveWBNB} onChange={() => setReceiveWBNB(!receiveWBNB)} small rounded toggleId='collect' />
              <span className='text-sm lg:text-base text-white'>Collect as WBNB</span>
            </div>
          )}
          <SelectedRange pool={_pool} currency0={currency0} currency1={currency1} positionDetails={positionDetails} />
        </div>
      </div>
      {addLiquidity && <AddModal isOpen={addLiquidity} setIsOpen={setIsLiquidity} positionDetails={positionDetails} position={position} pool={_pool} />}
      {withDraw && <RemoveModal isOpen={withDraw} setIsOpen={setIsWithDraw} position={positionDetails} />}
      {fees && <CollectModal isOpen={fees} setIsOpen={setCollectFees} position={positionDetails} pool={_pool} feeValue0={feeValue0} feeValue1={feeValue1} />}
    </>
  )
}

const ManualDetail = () => {
  const manuals = useManuals()
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const positionDetails = useMemo(() => {
    return manuals.find((ele) => Number(ele.tokenId) === Number(tokenId))
  }, [manuals, tokenId])

  return !positionDetails ? (
    <div className='flex items-center'>
      <button
        className='w-5 lg:w-auto mr-1.5 lg:mr-5'
        onClick={() => {
          navigate('/liquidity')
        }}
      >
        <img alt='' src='/images/swap/back-arrow.svg' />
      </button>
      <NoFound title='No liquidity found' />
    </div>
  ) : (
    <AlgebraItem positionDetails={positionDetails} />
  )
}

export default ManualDetail

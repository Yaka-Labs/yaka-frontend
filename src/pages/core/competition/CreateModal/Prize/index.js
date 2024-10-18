import React, { useEffect, useMemo, useState } from 'react'
import SearchTokenPopup from 'components/SearchTokenPopup'
import LabelTooltip from 'components/TooltipLabelComponent'
import BlueInput from 'components/Input/BlueInput'
import Toggle from 'components/Toggle'
import { ordinals } from 'utils'
import { formatNumber } from 'utils/formatNumber'

const validNumber = (val) => {
  return val === '' ? 0 : Number(val)
}

const Prize = ({ data, setData, isEntryFee, setIsEntryFee }) => {
  const [isPrizeOpen, setIsPrizeOpen] = useState(false)
  const { placements, weights } = data.prize

  const total = useMemo(() => {
    return weights.reduce((sum, cur) => {
      return sum + validNumber(cur)
    }, 0)
  }, [weights])

  useEffect(() => {
    if (weights.length === placements) return
    const fixedArr = []
    for (let i = 0; i < placements; i++) {
      if (i < weights.length) fixedArr.push(weights[i])
      else fixedArr.push(0)
    }
    setData({
      ...data,
      prize: {
        ...data.prize,
        weights: fixedArr,
      },
    })
  }, [placements, weights])

  return (
    <>
      <p className='leading-6 md:leading-7 text-xl md:text-[22px] font-figtree text-white font-semibold w-full'>Prizes</p>
      <div className='md:flex items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 w-full'>
        <div className='w-full'>
          <LabelTooltip tooltipID='prizesToken' label='Prizes Token' tooltipDescription='Select the asset you would like to to pay out the prizes in.' />
          <div className='w-full relative z-10 mt-2'>
            <div
              onClick={() => {
                setIsPrizeOpen(!isPrizeOpen)
              }}
              className='cursor-pointer flex items-center justify-between border border-blue bg-body rounded-[3px] text-lg text-white px-4 h-[42px] lg:h-[52px]'
            >
              {data.prize.token ? (
                <div className='flex items-center space-x-1.5'>
                  <img alt='' src={data.prize.token.logoURI} className='w-[25px] h-[25px]' />
                  <span className='font-figtree'>{data.prize.token.symbol}</span>
                </div>
              ) : (
                <span>Select</span>
              )}
              <img
                alt=''
                className={`${isPrizeOpen ? 'rotate-180' : ''} transform transition-all duration-150 ease-in-out`}
                src='/images/swap/dropdown-arrow.png'
              />
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='flex items-center justify-between text-base leading-5'>
            <LabelTooltip
              tooltipID='hostContribution'
              label='Host Contribution'
              tooltipDescription='If you would like to contribute anything towards the prize pool yourself, you can do that here. Everything you put up will go towards the prize pool.'
            />
            <div className='text-white'>Balance: {formatNumber(data.prize.token?.balance)}</div>
          </div>
          <BlueInput
            className='mt-1.5 md:mt-2'
            type='number'
            value={data.prize.totalPrize}
            onChange={(value) => {
              setData({
                ...data,
                prize: {
                  ...data.prize,
                  totalPrize: value,
                },
              })
            }}
            min={0}
            token={data.prize.token}
          />
        </div>
      </div>
      <div className='md:flex items-start space-y-4 md:space-y-0 md:space-x-6 mt-4 w-full'>
        <div className='w-full h-[52px] flex items-center space-x-2'>
          <Toggle
            toggleId='fee'
            checked={isEntryFee}
            onChange={() => {
              if (isEntryFee) {
                setData({
                  ...data,
                  entryFee: 0,
                })
              }
              setIsEntryFee(!isEntryFee)
            }}
          />
          <LabelTooltip
            tooltipID='entryFee'
            label='Entry Fee'
            tooltipDescription='If you would like to charge an entry fee from your participants, you can do that here. All entry fee will go towards the prize pool.'
          />
        </div>
        <div className='w-full'>
          <BlueInput
            className={`${isEntryFee ? 'flex' : 'hidden'}`}
            type='number'
            value={data.entryFee}
            onChange={(value) => {
              setData({
                ...data,
                entryFee: value,
              })
            }}
            min={0}
            token={data.prize.token}
          />
        </div>
      </div>
      <LabelTooltip
        tooltipID='prizeDistribution'
        className='mt-5 md:mt-[30px] w-full'
        label='Prize Distribution'
        tooltipDescription='Here you can set the distribution for the prize pool. You can give a maximum of 25% to yourself, and you have to divide the rest of the percentages to various placements. The total prize distribution bar must equal to 100% before you can create your trading competition.'
      />
      <div className='mt-3 md:mt-4 flex items-center space-x-6 md:space-x-9 w-full'>
        <span className='text-[#E9E9F2] leading-6 md:leading-7 text-xl md:text-[22px] font-semibold whitespace-nowrap'>{total} %</span>
        <div className='w-full h-2 bg-[#272845] rounded-full overflow-hidden'>
          <div className='gradient-bg h-2 transition-all duration-300 ease-in-out rounded-full' style={{ width: `${total}%` }} />
        </div>
      </div>
      <div className='grid md:grid-cols-2 gap-y-4 gap-x-[26px] mt-5 md:mt-[30px] w-full'>
        {weights.map((item, idx) => {
          return (
            <div key={idx} className='w-full'>
              <div className='text-base leading-5 text-lightGray'>{idx === 0 ? 'Host (25% Max)' : idx + ordinals(idx) + ' Place'}</div>
              <BlueInput
                className='mt-1.5 md:mt-2'
                type='number'
                value={item > 0 ? item : ''}
                onChange={(value) => {
                  const val = validNumber(value)
                  let temp = [...weights]
                  if (val > 0) {
                    const maxValue = 100 - total + validNumber(weights[idx])
                    const MAX = idx > 1 ? Math.min(...weights.slice(1, idx).map((ele) => validNumber(ele))) : idx === 1 ? 100 : 25
                    temp[idx] = Math.min(val, maxValue, MAX)
                  } else {
                    temp[idx] = 0
                  }
                  setData({
                    ...data,
                    prize: {
                      ...data.prize,
                      weights: temp,
                    },
                  })
                }}
                min={0}
                right={<div className='absolute right-4 text-base leading-5 text-lightGray'>%</div>}
              />
            </div>
          )
        })}
      </div>
      <div className='flex items-center space-x-3 mt-4 md:mt-6'>
        <button
          onClick={() => {
            if (placements > 2) setData({ ...data, prize: { ...data.prize, placements: placements - 1 } })
          }}
          disabled={placements <= 2}
          className='bg-error disabled:!cursor-not-allowed disabled:opacity-50  w-8 h-8 flex flex-col items-center justify-center rounded-[3px]'
        >
          <img src='/images/svgs/minus.svg' alt='' />
        </button>
        <button
          onClick={() => {
            if (placements < 100) setData({ ...data, prize: { ...data.prize, placements: placements + 1 } })
          }}
          className='bg-success w-8 h-8 flex flex-col items-center justify-center rounded-[3px]'
        >
          <img src='/images/svgs/plus.svg' alt='' />
        </button>
      </div>
      <SearchTokenPopup
        popup={isPrizeOpen}
        setPopup={setIsPrizeOpen}
        setSelectedAsset={(val) => {
          setData({
            ...data,
            prize: {
              ...data.prize,
              token: val,
            },
          })
        }}
        baseAssets={data.competitionRules.tradingTokens}
        isJustSelect
      />
    </>
  )
}

export default Prize

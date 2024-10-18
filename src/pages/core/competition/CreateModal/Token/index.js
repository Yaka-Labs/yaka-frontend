import React, { useEffect, useState } from 'react'
import LabelTooltip from 'components/TooltipLabelComponent'
import { TC_MARKET_TYPES } from 'config/constants/core'
import SearchTokenPopup from 'components/SearchTokenPopup'
import Toggle from 'components/Toggle'
import BlueInput from 'components/Input/BlueInput'
import MultiSelectPopup from 'components/MultiSelectPopup'
import { useTCManagerInfo } from 'hooks/core/useTCManager'

const Token = ({ data, setData, isStarting, setIsStarting }) => {
  const [isTradeOpen, setIsTradeOpen] = useState(false)
  const [isWinningOpen, setIsWinningOpen] = useState(false)
  const { tradingTokens } = useTCManagerInfo()

  useEffect(() => {
    const { winningToken, tradingTokens } = data.competitionRules
    if (tradingTokens.length === 0 || (winningToken && !tradingTokens.find((ele) => ele.address === winningToken.address))) {
      setData({
        ...data,
        competitionRules: {
          ...data.competitionRules,
          winningToken: null,
        },
      })
    }
  }, [data.competitionRules.tradingTokens])

  return (
    <div className='w-full relative'>
      <div className='w-full'>
        <LabelTooltip
          tooltipID='competitionType'
          label='Competition Type'
          tooltipDescription='Select the competition type you would like your trading competition to be in.'
        />
        <div className='flex items-center space-x-3 mt-3'>
          <button
            onClick={() => {
              setData({
                ...data,
                market: TC_MARKET_TYPES.SPOT,
              })
            }}
            className={`px-6 py-[8.4px] text-white ${data.market === TC_MARKET_TYPES.SPOT ? 'bg-blue' : 'bg-body'} rounded-full`}
          >
            SPOT
          </button>
          <button
            onClick={() => {
              setData({
                ...data,
                market: TC_MARKET_TYPES.PERPETUAL,
              })
            }}
            disabled
            className={`px-6 disabled:cursor-not-allowed py-[8.4px] text-white ${
              data.market === TC_MARKET_TYPES.PERPETUAL ? 'bg-blue' : 'bg-body'
            } rounded-full`}
          >
            PERPETUAL
          </button>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center w-full'>
        <div className='w-full relative'>
          <div className='flex items-center justify-between w-full mt-5'>
            <LabelTooltip
              tooltipID='tradableTokens'
              label='Tradable Tokens'
              tooltipDescription='Here you can select whether you would like your participants to trade in any assets or with certain assets only.'
            />
          </div>
          <div className='w-full relative z-10 mt-2'>
            <div
              onClick={() => {
                setIsTradeOpen(!isTradeOpen)
              }}
              className='cursor-pointer flex items-center justify-between p-4 border-blue bg-body rounded-[3px] border'
            >
              <div className='text-lg leading-5 text-white'>{data.competitionRules.tradingTokens.length} Selected</div>
              <img
                alt=''
                className={`${isTradeOpen ? 'rotate-180' : ''} transform transition-all duration-150 ease-in-out`}
                src='/images/swap/dropdown-arrow.png'
              />
            </div>
          </div>
        </div>

        <div className='w-full relative'>
          <div className='flex items-center justify-between w-full mt-5'>
            <LabelTooltip
              tooltipID='winningToken'
              label='Winning Token'
              tooltipDescription='Select the token that you would like your participants to acquire and be counted towards the competition.'
            />
          </div>
          <div className='w-full relative z-10 mt-2'>
            <div
              onClick={() => {
                setIsWinningOpen(!isWinningOpen)
              }}
              className='cursor-pointer flex items-center justify-between p-4 border-blue bg-body rounded-[3px] border'
            >
              <div className='text-lg leading-5 text-white'>
                {data.competitionRules.winningToken ? (
                  <div className='flex items-center space-x-1.5'>
                    <img src={data.competitionRules.winningToken.logoURI} width={25} height={25} alt='' />
                    <span className='font-figtree'>{data.competitionRules.winningToken.symbol}</span>
                  </div>
                ) : (
                  'Select'
                )}
              </div>
              <img
                alt=''
                className={`${isWinningOpen ? 'rotate-180' : ''} transform transition-all duration-150 ease-in-out`}
                src='/images/swap/dropdown-arrow.png'
              />
            </div>
          </div>
          <div className='md:flex items-start space-y-4 md:space-y-0 md:space-x-6 mt-4 w-full'>
            <div className='w-full h-[52px] flex items-center space-x-2'>
              <Toggle
                toggleId='starting'
                checked={isStarting}
                onChange={() => {
                  if (isStarting) {
                    setData({
                      ...data,
                      competitionRules: {
                        ...data.competitionRules,
                        startingBalance: 0,
                      },
                    })
                  }
                  setIsStarting(!isStarting)
                }}
              />
              <LabelTooltip
                tooltipID='startingBalance'
                label='Required Deposit to Join'
                tooltipDescription='Minimum balance for participants to join your trading competition.'
              />
            </div>
            <div className='w-full'>
              <BlueInput
                className={`${isStarting ? 'flex' : 'hidden'}`}
                type='number'
                value={data.competitionRules.startingBalance}
                onChange={(value) => {
                  setData({
                    ...data,
                    competitionRules: {
                      ...data.competitionRules,
                      startingBalance: value,
                    },
                  })
                }}
                min={0}
                token={data.competitionRules.winningToken}
              />
            </div>
          </div>
        </div>
      </div>
      <SearchTokenPopup
        popup={isWinningOpen}
        setPopup={setIsWinningOpen}
        setSelectedAsset={(val) => {
          setData({
            ...data,
            competitionRules: {
              ...data.competitionRules,
              winningToken: val,
            },
          })
        }}
        baseAssets={data.competitionRules.tradingTokens}
        isJustSelect
      />
      <MultiSelectPopup
        popup={isTradeOpen}
        setPopup={setIsTradeOpen}
        selectedAssets={data.competitionRules.tradingTokens}
        setSelectedAssets={(val) => {
          setData({
            ...data,
            competitionRules: {
              ...data.competitionRules,
              tradingTokens: val,
            },
          })
        }}
        assets={tradingTokens}
      />
    </div>
  )
}

export default Token

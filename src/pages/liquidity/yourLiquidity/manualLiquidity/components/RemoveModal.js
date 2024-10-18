import React, { useCallback, useState } from 'react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import { useDerivedV3BurnInfo } from 'hooks/v3/useDerivedV3BurnInfo'
import useDebounce from 'hooks/useDebounce'
import { useAlgebraRemove } from 'hooks/v3/useAlgebra'
import { customNotify } from 'utils/notify'
import { useCurrencyLogo } from 'hooks/v3/useCurrencyLogo'
import StyledButton from 'components/Buttons/styledButton'
import Modal from 'components/Modal'

const slippage = 0.5
const deadline = 1200

const percentArray = [25, 50, 75, 100]
const RemoveModal = ({ isOpen, setIsOpen, position }) => {
  const [percent, setPercent] = useState(0)
  const debouncedPercent = useDebounce(percent)
  const { tokenId, liquidity } = position
  const derivedInfo = useDerivedV3BurnInfo(position, debouncedPercent)
  const { pending, onAlgebraRemove, onAlgebraRemoveAndBurn, burnPending } = useAlgebraRemove()
  const { liquidityValue0, liquidityValue1, feeValue0, feeValue1, outOfRange } = derivedInfo
  const logoURIA = useCurrencyLogo(liquidityValue0.currency)
  const logoURIB = useCurrencyLogo(liquidityValue1.currency)

  const onRemove = useCallback(() => {
    if (debouncedPercent > 0) {
      onAlgebraRemove(tokenId, derivedInfo, slippage, deadline)
    } else {
      customNotify('Invalid Amount', 'warn')
    }
  }, [tokenId, derivedInfo, debouncedPercent])

  const onRemoveAndBurn = useCallback(() => {
    if (debouncedPercent === 100) {
      onAlgebraRemoveAndBurn(tokenId, derivedInfo, slippage, deadline)
    } else {
      customNotify('Invalid Amount', 'warn')
    }
  }, [tokenId, derivedInfo, debouncedPercent])

  const removed = liquidity?.eq(0)

  return (
    <Modal popup={isOpen} setPopup={setIsOpen} title='Withdraw Liquidity' width={465.8}>
      <div className='px-[13.6px] pt-[17px] pb-[10.2px] rounded-[4.25px] bg-[#0D1238] border border-[#0000AF] mt-[11.05px]'>
        <div className='flex items-start md:items-center justify-between'>
          <div className='flex items-center space-x-[10.2px] '>
            <div className='flex items-center'>
              <img alt='' className='w-6 lg:w-[25.5px] relative shadow' src={logoURIA} />
              <img alt='' className='w-6 lg:w-[25.5px] -ml-3' src={logoURIB} />
            </div>
            <p className='text-[13px] lg:text-[16.15px] font-figtree font-semibold text-white'>
              {liquidityValue0.currency.symbol}/{liquidityValue1.currency.symbol}
            </p>
          </div>
          <div className='bg-white bg-opacity-[0.09] py-[3.4px] pl-[10.2px] mt-[6.8px] md:mt-0 rounded-[13px] flex items-center space-x-[4.25px] pr-[13.6px] flex-shrink-0'>
            <div className={`${removed ? 'bg-red-700' : !outOfRange ? 'bg-[#55A361]' : 'bg-warn'} w-[6.8px] h-[6.8px] rounded-full`} />
            <span className='text-[12.75px] fonts-medium text-white whitespace-nowrap'>{removed ? 'Closed' : !outOfRange ? 'In range' : 'Out of range'}</span>
          </div>
        </div>
        <div className='mt-[17px] flex items-center justify-between'>
          <span className='text-[#E0DEF0] leading-5'>Amount</span>
          <div className='flex items-center space-x-[8.5px]'>
            {percentArray.map((percent, index) => {
              return (
                <div
                  className='flex items-center justify-center bg-white bg-opacity-[0.08] round-[3px] text-white text-[13px] md:text-[13.6px] w-[40px] md:w-[47.6px] h-[22px] md:h-[23.8px] cursor-pointer'
                  onClick={() => setPercent(percent)}
                  key={`percent-${index}`}
                >
                  {percent}%
                </div>
              )
            })}
          </div>
        </div>
        <div className='w-full px-2.5 md:px-[13.6px] pt-4 md:pt-[17px] bg-[#090333] border border-[#ED00C9] rounded-[3px] pb-5 md:pb-[18.7px] mt-1 md:mt-[5.95px]'>
          <div className='text-lg md:text-[20.4px] leading-5 md:leading-[24.65px] text-white'>{percent}%</div>
          <Slider
            min={0}
            max={100}
            className='!mt-3 mb-0'
            value={percent}
            onChange={(value) => {
              setPercent(value)
            }}
          />
        </div>
        <div className='mt-[10.2px] w-full'>
          <div className='flex items-center justify-between text-white leading-4 md:leading-[17px] md:text-[13.6px] text-[13px]'>
            <span>Pooled {liquidityValue0?.currency.symbol}</span>
            <span>{liquidityValue0?.toSignificant()}</span>
          </div>
          <div className='flex items-center justify-between text-white leading-4 md:leading-[17px] md:text-[13.6px] text-[13px] mt-2 md:mt-[10.2px]'>
            <span>Pooled {liquidityValue1?.currency.symbol}</span>
            <span>{liquidityValue1?.toSignificant()}</span>
          </div>
          <div className='flex items-center justify-between text-white leading-4 md:leading-[17px] md:text-[13.6px] text-[13px] mt-2 md:mt-[10.2px]'>
            <span>{feeValue0?.currency.symbol} Fees Earned:</span>
            <span>{feeValue0?.toSignificant()}</span>
          </div>
          <div className='flex items-center justify-between text-white leading-4 md:leading-[17px] md:text-[13.6px] text-[13px] mt-2 md:mt-[10.2px]'>
            <span>{feeValue1?.currency.symbol} Fees Earned:</span>
            <span>{feeValue1?.toSignificant()}</span>
          </div>
        </div>

        <StyledButton disabled={pending} pending={pending} onClickHandler={onRemove} content='WITHDRAW' className='mt-[13.6px] py-[11.05px] w-full' />

        <StyledButton
          disabled={debouncedPercent < 100 || burnPending}
          pending={burnPending}
          onClickHandler={onRemoveAndBurn}
          content='WITHDRAW AND BURN'
          className='mt-[13.6px] py-[11.05px] w-full'
        />
      </div>
    </Modal>
  )
}

export default RemoveModal

import React, { useState, useEffect, useMemo } from 'react'
import { useSplit } from 'hooks/useLock'
import { formatNumber, isInvalidAmount } from 'utils/formatNumber'
import StyledButton from 'components/Buttons/styledButton'

const arrayPercent = [2, 3, 4]
const validNumber = (val) => {
  return val === '' ? 0 : Number(val)
}

const SplitTab = ({ selected }) => {
  const [numberOfInputs, setNumberOfInputs] = useState(2)
  const [customInput, setCustomInput] = useState('')
  const [percentArr, setPercentArr] = useState([])

  const { onSplit, pending } = useSplit()

  useEffect(() => {
    const fixedArr = []
    const target = customInput !== '' ? customInput : numberOfInputs
    for (let i = 0; i < target; i++) {
      fixedArr.push('')
    }
    setPercentArr(fixedArr)
  }, [numberOfInputs, customInput])

  const total = useMemo(() => {
    return percentArr.reduce((sum, cur) => {
      return sum + validNumber(cur)
    }, 0)
  }, [percentArr])

  const errorMsg = useMemo(() => {
    let isError = false
    for (let i = 0; i < percentArr.length; i++) {
      if (validNumber(percentArr[i]) === 0) {
        isError = true
        break
      }
    }
    if (isError) {
      return 'ALL YAKA PERCENTAGES SHOULD BE FILLED.'
    }
    if (total !== 100) {
      return 'TOTAL PERCENT SHOULD BE 100%.'
    }
    return null
  }, [percentArr, total])

  return (
    <>
      <div className='mt-[17px] flex items-center justify-between'>
        <span className='text-[13.6px] lg:text-[17px] text-white font-light'>veYAKA #{selected.id} to:</span>
        <p className='text-[#B8B6CB] text-[11.05px] md:text-[13.6px]'>veYAKA Balance: {formatNumber(selected.voting_amount)}</p>
      </div>
      <div className='md:mt-[8.5px] -mt-1  flex items-center flex-wrap w-full text-white text-[11.9px] md:text-[15.3px]'>
        {arrayPercent.map((item, index) => {
          return (
            <div
              className={`h-[34px]  md:h-[40.8px] px-[34px] sm:px-[16.15px] flex-grow sm:flex-grow-0 mt-[10.2px] md:mt-0  flex-shrink-0 ${
                index === 1 ? 'ml-[9.35px] sm:mr-[9.35px]' : index === 0 ? '' : 'mr-[9.35px]'
              }  ${
                item === numberOfInputs && customInput === '' ? 'gradient-bg-selected font-medium' : 'border gradient-bg font-light'
              } rounded-[3px]  flex items-center justify-center cursor-pointer`}
              key={`level-${index}`}
              onClick={() => {
                setCustomInput('')
                setNumberOfInputs(item)
              }}
            >
              {item} Tokens
            </div>
          )
        })}
        <div className='max-w-[136px] md:max-w-[132.6px] mt-[10.2px] md:mt-0   w-full relative'>
          <input
            className='placeholder-secondary  flex-shrink-0  font-normal gradient-bg w-full h-[34px] md:h-[40.8px] rounded-[3px] text-white pl-[8.5px] pr-[6.8px] text-[11.9px] md:text-[15.3px] block focus:outline-none'
            type='number'
            min={5}
            max={10}
            lang='en'
            value={customInput}
            onChange={(e) => {
              if (!isInvalidAmount(e.target.value)) {
                const nums = Number(e.target.value)
                setCustomInput(Math.max(Math.min(10, nums), 5))
              } else {
                setCustomInput('')
              }
            }}
            placeholder='Enter Amount'
          />
          {customInput !== '' && <span className='absolute z-10 text-white text-[13.6px] md:text-[15.3px] top-[8.5px] font-light right-[11.9px]'>Tokens</span>}
        </div>

        <div className='  flex justify-between  w-full mt-[17px]'>
          <div className='w-[25%] font-medium text-[11.05px] md:text-[14.45px] text-white font-figtree pl-[12.75px]'>No</div>
          <div className='w-[50%] font-medium text-[11.05px] md:text-[14.45px] text-white font-figtree'>veYAKA Amount</div>
          <div className='w-[25%] font-medium text-[11.05px] md:text-[14.45px] text-white font-figtree'>Percentage</div>
        </div>
        <div className='w-full max-h-[221px] overflow-auto'>
          {percentArr.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`gradient-bg-no-shadow p-px w-full space-y-[8.5px] lg:space-y-0 ${idx === 0 ? 'mt-[7px]' : 'mt-[13.6px]'} rounded-[3px]`}
              >
                <div className=' flex flex-row justify-between items-center rounded-[3px] bg-gradient-to-r'>
                  <div className='w-[25%] py-[9.35px] pl-[6.8px] md:py-[17px] lg:pl-[12.75px]  text-[#fff]'>
                    <div className='text-[13.6px] lg:text-[17px] font-medium'>{idx + 1}</div>
                  </div>
                  <div className='w-[50%]  text-[#fff]'>
                    <div className='text-[13.6px] lg:text-[17px] font-medium'>{formatNumber(selected.voting_amount.times(validNumber(item)).div(100))}</div>
                  </div>
                  <div className='pl-px border-l-[0.5px] border-[#BC2733] rounded-tl-none rounded-tr-[3px] rounded-br-[3px] w-[25%]'>
                    <div className=' w-full relative text-[#fff]  rounded-tr-[3px] rounded-br-[3px] '>
                      <input
                        type='number'
                        lang='en'
                        value={item}
                        onChange={(e) => {
                          const val = validNumber(e.target.value)
                          let temp = [...percentArr]
                          if (val > 0) {
                            const newVal = total - validNumber(percentArr[idx]) + val > 100 ? 100 - total + validNumber(percentArr[idx]) : val
                            temp[idx] = newVal > 0 ? newVal : ''
                            setPercentArr(temp)
                          } else {
                            temp[idx] = ''
                            setPercentArr(temp)
                          }
                        }}
                        className=' py-[9.35px] px-[11.9px] w-[90%]  md:py-[17px] lg:pl-[12.75px] text-white font-medium text-[13.6px] lg:text-[17px] bg-transparent focus:outline-none'
                      />
                      <span className='text-white font-medium text-[13.6px] lg:text-[17px] absolute right-[8.5px] md:right-[11.9px] z-10 mt-[9.35px] md:mt-[17px]'>
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className='mt-[17px] flex items-center w-full justify-between'>
          <span className='text-[13.6px] lg:text-[17px] text-white font-light'>
            Total Split Amount: <span className='text-[15.3px] lg:text-[18.7px] text-white font-medium'>{total}%</span>
          </span>
          <button
            className='text-[15.3px] font-medium text-[#26FFFE]'
            onClick={() => {
              const fixedArr = []
              for (let i = 0; i < percentArr.length; i++) {
                fixedArr.push('')
              }
              setPercentArr(fixedArr)
            }}
          >
            Reset
          </button>
        </div>
        <StyledButton
          disabled={errorMsg || pending}
          pending={pending}
          onClickHandler={() => {
            onSplit(selected, percentArr)
          }}
          content={errorMsg || 'SPLIT'}
          className='py-[11.05px] mt-[7.65px] w-full'
        />
      </div>
    </>
  )
}

export default SplitTab

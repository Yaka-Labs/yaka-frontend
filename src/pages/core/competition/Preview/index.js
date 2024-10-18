import React, { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import StyledButton from 'components/Buttons/styledButton'
import TransparentButton from 'components/Buttons/transparentButton'
import { useCreateTC, useTCManagerInfo } from 'hooks/core/useTCManager'
import { formatNumber, fromWei, toWei } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import Details from '../Details'

const Preview = ({ data, currentStep, setCurrentStep, setIsCreateOpen }) => {
  const { account } = useWeb3React()
  const { protocolFee, protocolFeeToken } = useTCManagerInfo()
  const { onCreate, pending } = useCreateTC()

  const mainData = useMemo(() => {
    const ownerFee = Math.floor(data.prize.weights[0] * 10)
    let weights = data.prize.weights.slice(1).map((ele) => {
      return Math.round((ele / (100 - data.prize.weights[0])) * 1000)
    })
    const totalWeight = weights.reduce((sum, cur) => {
      return sum + cur
    }, 0)
    weights[weights.length - 1] += 1000 - totalWeight
    return {
      ...data,
      entryFee: toWei(data.entryFee, data.prize.token.decimals).dp(0).toString(10),
      owner: {
        id: account,
      },
      prize: {
        ...data.prize,
        totalPrize: toWei(data.prize.totalPrize, data.prize.token.decimals).dp(0).toString(10),
        hostContribution: toWei(data.prize.totalPrize, data.prize.token.decimals).dp(0).toString(10),
        ownerFee,
        weights,
      },
      timestamp: {
        registrationStart: Math.floor(data.timestamp.registrationStart / 1000),
        registrationEnd: Math.floor(data.timestamp.registrationEnd / 1000),
        startTimestamp: Math.floor(data.timestamp.startTimestamp / 1000),
        endTimestamp: Math.floor(data.timestamp.endTimestamp / 1000),
      },
      competitionRules: {
        ...data.competitionRules,
        startingBalance: toWei(data.competitionRules.startingBalance, data.competitionRules.winningToken.decimals).dp(0).toString(10),
      },
    }
  }, [data, account])

  return (
    <div className='absolute inset-0 top-[94px] '>
      <div className='z-40 bg-opacity-[0.88] bg-body fixed inset-0 w-full h-full' />
      <div className='w-full z-[100] relative mx-auto max-w-[1104px]'>
        <div className='hidden lg:block sticky top-[94px] w-full max-w-[324px] bg-[#101645] px-5 py-4 rounded-[3px]'>
          <p className='leading-[33px] text-[27px] font-figtree text-white font-semibold'>Create Trading Competition?</p>
          <p className='text-lightGray text-base leading-[22px] mt-2 mb-3'>In order to create this trading competition you will have to pay a creation fee.</p>
          <div className='w-full mb-3'>
            <p className='text-lightGray text-base leading-5'>Creation Fee:</p>
            <p className='text-white leading-[30px] text-[25px] font-semibold'>
              {formatNumber(fromWei(protocolFee, protocolFeeToken?.decimals))} {protocolFeeToken?.symbol}
            </p>
          </div>
          <StyledButton
            pending={pending}
            onClickHandler={() => {
              if (fromWei(protocolFee, protocolFeeToken?.decimals).gt(protocolFeeToken?.balance)) {
                customNotify(`Insufficient ${protocolFeeToken?.symbol} Balance `, 'warn')
                return
              }
              onCreate(mainData)
            }}
            content='CREATE'
            className='w-full py-[15.75px]'
          />
          <TransparentButton
            onClickHandler={() => {
              setCurrentStep(currentStep - 1)
              setIsCreateOpen(true)
            }}
            content='BACK'
            className='w-full py-[15.75px] mt-3'
            isUpper
          />
        </div>
        <div className='flex justify-end -mt-[363px] pb-10'>
          <Details data={mainData} isPreview />
        </div>
        <div className='fixed lg:hidden bottom-0 bg-body py-3 px-5 border-t border-blue z-[100] left-0 w-full'>
          <span className='text-xl leading-6 font-semibold font-figtree text-white'>Create Trading Competition?</span>
          <p className='mt-[7px] text-lightGray leading-5 text-[15px]'>In order to create this trading competition you will have to pay a creation fee.</p>
          <div className='mt-3'>
            <span className='text-lightGray text-base leading-5'>Creation Fee:</span>
            <p className=' text-xl leading-5 text-white font-semibold '>
              {formatNumber(fromWei(protocolFee, protocolFeeToken?.decimals))} {protocolFeeToken?.symbol}
            </p>
          </div>
          <div className='flex items-center space-x-3 w-full mt-3'>
            <StyledButton
              pending={pending}
              onClickHandler={() => {
                if (fromWei(protocolFee, protocolFeeToken?.decimals).gt(protocolFeeToken?.balance)) {
                  customNotify(`Insufficient ${protocolFeeToken?.symbol} Balance `, 'warn')
                  return
                }
                onCreate(mainData)
              }}
              content='CREATE'
              className='py-3.5 w-full'
            />
            <TransparentButton
              onClickHandler={() => {
                setCurrentStep(currentStep - 1)
                setIsCreateOpen(true)
              }}
              content='BACK'
              className='py-3.5 w-full'
              isUpper
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview

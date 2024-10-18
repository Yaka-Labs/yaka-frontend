import React, { useCallback, useState } from 'react'
import Modal from 'components/Modal'
import { TC_PARTICIPANTS, TC_STEPS } from 'config/constants/core'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'
import { customNotify } from 'utils/notify'
import { isInvalidAmount } from 'utils/formatNumber'
import Prize from './Prize'
import Token from './Token'
import Time from './Time'
import Detail from './Detail'

const CreateTC = ({ isCreateOpen, setIsCreateOpen, currentStep, setCurrentStep, data, setData }) => {
  const [isStarting, setIsStarting] = useState(!isInvalidAmount(data.competitionRules.startingBalance))
  const [isEntryFee, setIsEntryFee] = useState(!isInvalidAmount(data.entryFee))

  const getErrorMsg = useCallback(
    (val) => {
      let error = ''
      switch (val) {
        case 0:
          error = !data.name ? 'Invalid Name' : !data.description ? 'Invalid Description' : ''
          break

        case 1: {
          const {
            maxParticipants,
            timestamp: { registrationStart },
          } = data
          error =
            maxParticipants < TC_PARTICIPANTS.MIN || maxParticipants > TC_PARTICIPANTS.MAX
              ? 'Invalid Max Participants'
              : registrationStart < new Date().getTime()
              ? 'Invalid Registration Start'
              : ''
          break
        }

        case 2: {
          const { winningToken, tradingTokens, startingBalance } = data.competitionRules
          error =
            tradingTokens.length < 2
              ? 'Invalid Tradable Tokens'
              : !winningToken
              ? 'Invalid Winning Token'
              : isStarting && isInvalidAmount(startingBalance)
              ? 'Invalid Amount'
              : ''
          break
        }

        case 3: {
          const { weights, totalPrize, token } = data.prize
          const total = weights.reduce((sum, cur) => {
            return sum + cur
          }, 0)
          if (!token) {
            error = 'Invalid Prize Token'
          } else if (isInvalidAmount(totalPrize) || token.balance.lt(totalPrize)) {
            error = 'Invalid Prize Amount'
          } else if (isEntryFee && isInvalidAmount(data.entryFee)) {
            error = 'Invalid Fee Amount'
          } else if (total !== 100) {
            error = 'Invalid Distribution'
          }
          break
        }

        default:
          break
      }
      return error
    },
    [data, isStarting, isEntryFee],
  )

  const renderComponent = () => {
    switch (currentStep) {
      case 0:
        return <Detail data={data} setData={setData} />
      case 1:
        return <Time data={data} setData={setData} />
      case 2:
        return <Token data={data} setData={setData} isStarting={isStarting} setIsStarting={setIsStarting} />
      case 3:
        return <Prize data={data} setData={setData} isEntryFee={isEntryFee} setIsEntryFee={setIsEntryFee} />
      default:
    }
  }

  return (
    <Modal popup={isCreateOpen} setPopup={setIsCreateOpen} title='Create Trading Competition' width={595}>
      <div className='mt-[22px] flex items-center justify-center flex-col'>
        <p className='text-[17px] lg:text-xl font-figtree leading-5 lg:leading-6 text-white font-semibold tracking-[1.7px] lg:tracking-[2px]'>
          {TC_STEPS[currentStep]}
        </p>
        <div className='flex items-center space-x-4 lg:space-x-[17px] mt-[9px] lg:mt-2.5'>
          {TC_STEPS.map((item, idx) => {
            let valid = true
            for (let subidx = 0; subidx < idx; subidx++) {
              if (getErrorMsg(subidx) !== '') {
                valid = false
                break
              }
            }
            return (
              <button
                onClick={() => {
                  setCurrentStep(idx)
                }}
                className={`w-9 h-9 lg:w-10 lg:h-10 flex flex-col items-center justify-center rounded-[3px] ${
                  idx === currentStep ? 'gradient-bg font-bold text-white' : 'bg-body text-secondary'
                } cursor-pointer disabled:cursor-not-allowed`}
                key={item}
                disabled={!valid}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>
      <div className='mt-5 flex flex-col items-center justify-center w-full'>
        {renderComponent()}
        <div className='flex items-center space-x-5 mt-6 w-full lg:w-auto'>
          {currentStep > 0 && (
            <TransparentButton
              content='BACK'
              onClickHandler={() => setCurrentStep(currentStep - 1)}
              className='w-full lg:w-auto lg:px-16 py-3.5 lg:py-3'
              isUpper
            />
          )}
          <StyledButton
            onClickHandler={() => {
              const errMsg = getErrorMsg(currentStep)
              if (errMsg) {
                customNotify(errMsg, 'warn')
              } else {
                setCurrentStep(currentStep + 1)
                if (currentStep === TC_STEPS.length - 1) {
                  setIsCreateOpen(false)
                }
              }
            }}
            content={currentStep === TC_STEPS.length - 1 ? 'PREVIEW' : 'NEXT'}
            className='w-full lg:w-auto lg:px-16 py-3.5 lg:py-3'
          />
        </div>
      </div>
    </Modal>
  )
}

export default CreateTC

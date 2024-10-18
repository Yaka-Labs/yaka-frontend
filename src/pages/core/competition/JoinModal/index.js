import React from 'react'
import { formatNumber, fromWei } from 'utils/formatNumber'
import Modal from 'components/Modal'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'
import { useRegister } from 'hooks/core/useTCManager'
import { customNotify } from 'utils/notify'

const JoinModal = ({ isOpen, setIsOpen, data }) => {
  const {
    entryFee,
    prize: { token: prizeToken },
    competitionRules: { startingBalance, winningToken },
  } = data
  const { onJoin, pending } = useRegister()

  return (
    <Modal title='Join Competition' popup={isOpen} setPopup={setIsOpen} width={391}>
      <p className='text-[15px] md:text-base md:leading-6 text-lightGray  w-full mt-1.5'>
        You need to pay an entry fee to join this trading competition, and also deposit the required amount. You will be able to withdraw the rest of your
        deposit back at the end of the competition. You will have to claim it manually.
      </p>
      <div className='mt-3 md:mt-5'>
        <div className='text-base leading-[19px] md:leading-none md:text-[17px] text-lightGray'>Entry Fee:</div>
        <div className='flex items-center space-x-1 mt-0.5 text-xl  md:text-[22px] text-white leading-6 md:leading-[26px] font-semibold'>
          {!entryFee || fromWei(entryFee).isZero() ? (
            <p>Free to join</p>
          ) : (
            <>
              <img alt='' src={prizeToken.logoURI} className='md:w-5 w-[18px] h-[15px] md:h-5' />
              <p>{formatNumber(fromWei(entryFee, prizeToken.decimals))}</p>
            </>
          )}
        </div>
      </div>
      <div className='mt-3 '>
        <div className='text-base leading-[19px] md:leading-none md:text-[17px] text-lightGray'>Required Deposit To Join:</div>
        <div className='flex items-center space-x-1 mt-0.5 text-xl  md:text-[22px] text-white leading-6 md:leading-[26px] font-semibold'>
          {fromWei(startingBalance).isZero() ? (
            <p>No deposit required</p>
          ) : (
            <>
              <img alt='' src={winningToken.logoURI} className='md:w-5 w-[18px] h-[15px] md:h-5' />
              <p>
                {formatNumber(fromWei(startingBalance, winningToken.decimals))} {winningToken.symbol}
              </p>
            </>
          )}
        </div>
      </div>

      <div className='flex space-x-3 mt-3'>
        <TransparentButton
          onClickHandler={() => {
            setIsOpen(false)
          }}
          className='w-full py-[15px] md:py-4'
          content='CANCEL'
          isUpper
        />
        <StyledButton
          pending={pending}
          onClickHandler={() => {
            if (fromWei(entryFee, prizeToken.decimals).gt(prizeToken.balance)) {
              customNotify(`Insufficient ${prizeToken.symbol} Balance `, 'warn')
              return
            }
            if (fromWei(startingBalance, winningToken.decimals).gt(winningToken.balance)) {
              customNotify(`Insufficient ${winningToken.symbol} Balance `, 'warn')
              return
            }
            onJoin(data)
          }}
          content='CONFIRM'
          className='w-full py-[15px] md:py-4'
        />
      </div>
    </Modal>
  )
}

export default JoinModal

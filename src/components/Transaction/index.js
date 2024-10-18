import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { TRANSACTION_STATUS } from 'config/constants'
import { closeTransaction } from 'state/transactions/actions'
import Modal from '../Modal'
import Spinner from '../Spinner'

const Transaction = () => {
  const { popup, title, transactions, final, link } = useSelector((state) => state.transactions)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const setPopup = useCallback(
    (value) => {
      if (!value) {
        dispatch(closeTransaction())
      }
    },
    [dispatch],
  )

  const txns = useMemo(() => {
    if (!transactions) return []
    return Object.values(transactions)
  }, [transactions])

  return (
    <Modal isTransaction width={459} popup={popup} setPopup={setPopup} title={final ? '' : title} disableOutside>
      {final ? (
        <div className='w-full flex flex-col items-center justify-center sm:min-w-[382.5px] lg:max-w-[459px]'>
          <img alt='' className='my-[27.2px]' src='/images/swap/big-checkmark1.svg' />
          <div className='max-w-[226.1px] md:max-w-[280.5px] w-full flex flex-col items-center'>
            <p className='text-white text-[22.95px] font-figtree text-center'>{final}</p>
            <p className='my-[10.2px] text-white text-base md:text-[17px] leading-[20.4px] text-center'>Transaction has been confirmed by the blockchain.</p>
          </div>
          <button
            onClick={() => {
              if (link) {
                navigate(link)
              }
              setPopup(false)
            }}
            className='w-full py-[6.8px] connect-wallet-btn text-white text-base md:text-lg leading-[27.2px] tracking-[1.44px] font-figtree transition-all duration-300 ease-out mt-[30.6px] font-bold rounded-[6.8px]'
          >
            {link ? 'CLOSE AND REDIRECT' : 'CLOSE'}
          </button>
        </div>
      ) : (
        <div className='bg-[#260508] px-[20.4px] py-[5.1px] rounded-[6.8px] mt-[13.6px] sm:min-w-[382.5px] lg:max-w-[459px]'>
          {txns &&
            txns.map((tx, index) => {
              return (
                <div className='flex items-center justify-between py-[10.2px] border-b border-[#5E6282] last:border-none' key={`tx-${index}`}>
                  <p className='text-white text-sm md:text-base leading-[17px]'>{tx.desc}</p>
                  {tx.status === TRANSACTION_STATUS.SUCCESS && <img alt='' src='/images/swap/success-mark.svg' />}
                  {tx.status === TRANSACTION_STATUS.WAITING && <img alt='' src='/images/swap/pending-mark.svg' />}
                  {tx.status === TRANSACTION_STATUS.PENDING && <Spinner />}
                  {tx.status === TRANSACTION_STATUS.FAILED && <img alt='' src='/images/swap/failed-mark.svg' />}
                </div>
              )
            })}
        </div>
      )}
    </Modal>
  )
}

export default Transaction

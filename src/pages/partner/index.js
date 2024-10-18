import React, { useEffect, useState } from 'react'
import useAutoDocumentTitle from '../../hooks/useAutoDocumentTitle'
import StyledButton from '../../components/Buttons/styledButton'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from '../../hooks/useWeb3'
import { getInitialDistributorContract } from '../../utils/contractHelpers'
import { formatEther } from 'ethers/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import { closeTransaction, completeTransaction, openTransaction } from '../../state/transactions/actions'
import { IdoTokenName } from '../lanunchpad/constant'
import { TRANSACTION_STATUS } from '../../config/constants'
import { sendContract } from '../../utils/api'
import { customNotify } from '../../utils/notify'
import { extractJsonObject } from '../../utils/formatNumber'
import { useDispatch } from 'react-redux'

const Partner = () => {
  useAutoDocumentTitle('Partner')

  const web3 = useWeb3()
  const initialDistributorContract = getInitialDistributorContract(web3)

  const [loading, setLoading] = useState(false)
  const [freshId, setFreshId] = useState()

  const { account, chainId } = useWeb3React()

  let [presaleClaimable, setPresaleClaimable] = useState(0)

  const getClaimable = async () => {
    if (account) {
      let claim = await initialDistributorContract.methods.claimableForPartner(true, account).call()
      setPresaleClaimable(Number(formatEther(claim)))
    } else {
      setPresaleClaimable(0)
    }
  }

  useEffect(() => {
    getClaimable()
  }, [account, chainId, freshId])

  const dispatch = useDispatch()
  const handleClaim = async () => {
    try {
      const claimParams = [true]
      initialDistributorContract.methods['claimForPartner'](...claimParams)
        .estimateGas({
          from: account,
          value: '0',
        })
        .then(async (res) => {
          const approveuuid = uuidv4()
          const key = uuidv4()
          setLoading(true)
          dispatch(
            openTransaction({
              key,
              title: `Claim ${IdoTokenName}`,
              transactions: {
                [approveuuid]: {
                  desc: `Claim ${IdoTokenName} For Partner`,
                  status: TRANSACTION_STATUS.START,
                  hash: null,
                },
              },
            }),
          )
          try {
            const data = await sendContract(dispatch, key, approveuuid, initialDistributorContract, 'claimForPartner', claimParams, account)
            console.log(data)
            dispatch(
              completeTransaction({
                key,
                final: 'Claim Successful',
              }),
            )
            setFreshId(key)
            setLoading(false)
          } catch (error) {
            console.log('claim error :>> ', err)
            setLoading(false)
            customNotify(`${error.reason || error.data?.message || error.message}!`, 'error')
            dispatch(closeTransaction())
          }
        })
        .catch((err) => {
          const data = extractJsonObject(err.message)
          if (data) {
            customNotify(data.message, 'error')
          } else {
            customNotify(err.message, 'error')
          }
          setLoading(false)
        })
    } catch (error1) {
      customNotify(`${error1.reason || error1.data?.message || error1.message}!`, 'error')
      setLoading(false)
    }
  }

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  const showTime = () => {
    return !(timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0)
  }

  useEffect(() => {
    const targetDate = new Date('2024-10-05T18:00:00+08:00')

    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(timer)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])
  return (
    <div className='mx-auto flex flex-col items-center justify-center pt-[90px] md:pt-[102px] px-[17px] xl:px-0'>
      <div className='max-w-[952px] w-full mt-[11.05px]'>
        <div>
          <div>
            <div className='flex items-center justify-between mb-[40px]'>
              <div>
                <span>
                  Claimable：<span style={{ color: 'red' }}>{presaleClaimable}</span>
                </span>
                {showTime() && (
                  <span style={{ 'margin-left': '20px' }}>
                    Claim will be open after this：
                    <span style={{ color: 'red' }}>
                      {timeLeft.hours}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </span>
                )}
              </div>

              <StyledButton
                disabled={presaleClaimable <= 0}
                pending={loading}
                onClickHandler={handleClaim}
                content='Claim'
                className='py-[8px] px-[13.6px] w-1/6'
                isCap
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Partner

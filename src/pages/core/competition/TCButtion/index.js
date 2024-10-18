import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import StyledButton from 'components/Buttons/styledButton'
import { EVENT_TYPES } from 'config/constants/core'
import { getEventType } from 'utils'
import JoinModal from '../JoinModal'
import ClaimModal from '../ClaimModal'

const TCButtion = ({ item, isFull = false }) => {
  const navigate = useNavigate()
  const [joinNow, setJoinNow] = useState(false)
  const [claimNow, setClaimNow] = useState(false)
  const { account } = useWeb3React()

  const { participants } = item

  const eventType = useMemo(() => {
    return getEventType(item.timestamp)
  }, [item])

  const renderJoined = () => {
    return (
      <div className='flex items-center space-x-1'>
        <img alt='' src='/images/core/disable-checkmark.svg' />
        <p>Joined</p>
      </div>
    )
  }

  if (!account) return

  return (
    <div>
      {eventType === EVENT_TYPES.LIVE
        ? participants.length > 0 &&
          participants.find((ele) => ele.participant.id === account?.toLowerCase()) && (
            <StyledButton
              onClickHandler={(e) => {
                navigate(`/core/comps/${item.id.toLowerCase()}/trade`)
              }}
              content='Trade'
              className={`w-full px-4 py-[9px]${!isFull ? ' lg:w-auto' : ''}`}
              isCap
            />
          )
        : eventType === EVENT_TYPES.UPCOMING &&
          (participants.find((ele) => ele.participant.id === account.toLowerCase()) ? (
            <StyledButton disabled content={renderJoined()} className={`w-full px-4 py-[9px]${!isFull ? ' lg:w-auto' : ''}`} isCap />
          ) : (
            <StyledButton
              onClickHandler={() => {
                setJoinNow(true)
              }}
              content='Join'
              className={`w-full px-4 py-[9px]${!isFull ? ' lg:w-auto' : ''}`}
              isCap
            />
          ))}
      {joinNow && <JoinModal isOpen={joinNow} setIsOpen={setJoinNow} data={item} />}
      {claimNow && <ClaimModal isOpen={claimNow} setIsOpen={setClaimNow} name={item.name} />}
    </div>
  )
}

export default TCButtion

import React, { useEffect, useState } from 'react'
import { getSeiCampaignStage2Contract } from 'utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3'

export const useCheckInviter = (inviterAddress) => {
  const web3 = useWeb3()
  const contract = getSeiCampaignStage2Contract(web3)

  const [isInviter, setIsInviter] = useState(false)

  const handleCheck = async () => {
    if (inviterAddress) {
      const bool = await contract.methods.inviteBadgeOf(inviterAddress).call()
      console.log('bool', bool)
      setIsInviter(bool)
    }
  }

  useEffect(() => {
    handleCheck()
  }, [inviterAddress])

  return isInviter
}

export default useCheckInviter

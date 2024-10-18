/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react'

import Radio from '../Radio'
import { usePools } from 'state/pools/hooks'
import { getPairV3APIContract, getSeiCampaignStage2Contract } from 'utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3'
import { useWeb3React } from '@web3-react/core'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { veTHEsContext } from 'context/veTHEsConetext'
import { sendContract } from 'utils/api'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { getSeiCampaignStage2Address } from 'utils/addressHelpers'
import { useNetwork } from 'state/settings/hooks'
import { customNotify } from 'utils/notify'

const maxSwapCnt = 100
const maxDepositCnt = 150
const maxinvitedCnt = 300
const maxLockedCnt = 100
const Accomplishment = () => {
  const pools = usePools()
  const { account, chainId } = useWeb3React()
  const web3 = useWeb3()
  const navigate = useNavigate()
  const [rank, setRank] = useState(0)
  const [swapCnt, setSwapCnt] = useState(0)
  const [depositCnt, setDeposit] = useState(0)
  const [invitedCnt, setInvitedCnt] = useState(0)
  const [lockedCnt, setLockedCnt] = useState(0)
  const [voteCnt, setVoteCnt] = useState(0)
  const veTHEs = useContext(veTHEsContext)
  const dispatch = useDispatch()
  const approveuuid = uuidv4()
  const key = uuidv4()
  const { networkId } = useNetwork()

  const [poolStates, setPoolStates] = useState([])

  const [swapBadge, setSwapBadge] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    console.log('swapCnt + depositCnt + invitedCnt + lockedCnt + voteCnt', swapCnt, depositCnt, invitedCnt, lockedCnt, voteCnt)
    setRank(swapCnt + depositCnt + invitedCnt + lockedCnt + voteCnt)
  }, [swapCnt, depositCnt, invitedCnt, lockedCnt, voteCnt])

  const handleGetData = async () => {
    const contract = getSeiCampaignStage2Contract(web3)

    let sumSwap = 0
    let sumDeposit = 0

    const addresses = [
      '0xa40c9b5d23bfa600a54f12a5e37dd4a90af4fa17',
      '0x38c79f7fb21846bad705c669758228a796a2a329',
      '0xd4da53630b6600e4d372ba4cdbc128648654dcf7',
      '0x06b68bfc551ebd274902fedcf6a7a9c512763520',
      '0x2037118d36e204bacc39d0f0df8a6f30887fcb26',
      // '0xfc11c64f2e96f51f449dbec0decbc684fc6417c2',
    ]
    console.log('addresses', addresses)
    const states = []

    console.log('pools', JSON.stringify(pools))

    // Promise.all
    await Promise.all(
      pools.map(async (item) => {
        try {
          const swapCnt = await contract.methods.getSwapCntOf(account, item.address).call()
          sumSwap += parseInt(swapCnt ?? 0)
          console.log('item.symbol', item.symbol)
          console.log('item.address', item.address)

          console.log('swapCnt', swapCnt)
          console.log('sumSwap', sumSwap)

          const depositCnt = await contract.methods.depositCntOf(account, item.address).call()
          sumDeposit += parseInt(depositCnt ?? 0)

          item.isDeposit = parseInt(depositCnt ?? 0) != 0
          item.isSwap = parseInt(swapCnt ?? 0) != 0

          if (addresses.includes(item.address)) {
            states.push({
              symbol: item.symbol,
              address: item.address,
              isDeposit: parseInt(depositCnt ?? 0) != 0,
              isSwap: parseInt(swapCnt ?? 0) != 0,
            })
          }
        } catch (error) {
          console.log('error', error)
        }
      }),
    )
      .then(() => {
        console.log('sumSwap1', sumSwap)
        console.log('sumDeposit1', sumDeposit)
        const sortArr = states.sort((a, b) => b.address - a.address)

        const swapCnt = sortArr.filter((item) => item.isSwap).length * 20
        const depositCnt = sortArr.filter((item) => item.isDeposit).length * 30

        setSwapCnt(swapCnt > maxSwapCnt ? maxSwapCnt : swapCnt)
        setDeposit(depositCnt > maxDepositCnt ? maxDepositCnt : depositCnt)

        setPoolStates(sortArr)
      })
      .catch((error) => {
        console.error('Error in processing:', error)
      })

    const invitedCntOf = await contract.methods.invitedCntOf(account).call()
    const invitedCnt = invitedCntOf * 30 > maxinvitedCnt ? maxinvitedCnt : invitedCntOf * 30
    setInvitedCnt(invitedCnt)

    const swapBadgeOf = await contract.methods.swapBadgeOf(account).call()
    setSwapBadge(swapBadgeOf)

    const userCnt = await contract.methods.getUserCnt().call()
    console.log('userCnt1', userCnt)

    const batchGetUserInfo = await contract.methods.batchGetUserInfo(0, 100).call()
    console.log('batchGetUserInfo', batchGetUserInfo)

    const lockedCntOf = await contract.methods.lockedCntOf(account).call()
    console.log('lockedCntOf', lockedCntOf)
    setLockedCnt(lockedCntOf > 0 ? maxLockedCnt : 0)

    const votededCntOf = await contract.methods.votededCntOf(account).call()
    setVoteCnt(votededCntOf > 0 ? 100 : 0)
  }

  const getInviteCnt = async () => {
    const contract = getSeiCampaignStage2Contract(web3)

    const invitedCntOf = await contract.methods.invitedCntOf(account).call()
    console.log('invitedCntOf', invitedCntOf)
    const swapBadgeOf = await contract.methods.swapBadgeOf(account).call()
    console.log('swapBadgeOf', swapBadgeOf)

    // const contract = getPairV3APIContract(web3,chainId)
    // const arr = ["0xd4da53630b6600e4d372ba4cdbc128648654dcf7","0x1a0037b80a09a068c17e6f7a010133e4c28bd26e","0x2037118d36e204bacc39d0f0df8a6f30887fcb26","0x9d005cb960d4c5bf9f43205aa69a60d410b39376","0x408f342bcd286bb5d0e73f8a2137892416f42bc3","0x38c79f7fb21846bad705c669758228a796a2a329","0xdc2bc1ac5a4e4996a80bc7cd1c70ba741ab6df82","0xa40c9b5d23bfa600a54f12a5e37dd4a90af4fa17","0x06b68bfc551ebd274902fedcf6a7a9c512763520","0x50f78f4bc66679847cf17f020e2b721c7bbc168c","0x4c74b326d2cefa555a750768007549569e04a79c","0x8651edb120d629249a50fca6e01d6366faaf1126","0x568f2ee5c636192936e9ba450c70a04a13abeb29","0xc396631ea50e978524259c0fcc4c580c342d0068","0x1f2d735250866dd81a48ecbb5f6e55448951dbbb","0xb3e5de9031b856077c3529ce973852de30584bf4","0x9efd4e782b9bcf81349f0ac36dc37f7629b3c6ef","0x7a41dde53eb68bd9732a2550f443d7a9ff8e4c4a","0xf1f60867906d8a2298d3ad96e89a6bc29a958aef","0x2d1e08a30b25e67cd7f629ccb1c8e212a8db5229","0xb9b7bc22c5c7c7d4840eadfa18cd865c059926ff","0xe43dbf0484a1e77185107fb53ba92a18c42cf86f","0x0d71dae892444fb9b95de9d43bea500339d4c94c","0xfc11c64f2e96f51f449dbec0decbc684fc6417c2","0xd3caf42076418c2030b5d51d83da26946ed51e6d","0x55f0f26dd8ec263e4934012306e6c02f94e59516","0xa48ac5a3ad64d0f98182a0947b01b8896e57ffe8","0xc8d492061a47fac61c25a6878cb43b33b3f1479f","0x85871677e8bc36fc5d5a4c3ea39a7baf504eeed1"]
    // arr.map(async(item,index)=>{
    //   const data = await contract.methods.getPairAccount(item, "0xDb764b744011FF5b775Fe4e4471DAEd9A89d9b7A").call()
    //   console.log(index+1,data);

    // })
  }

  const handleVerify = async () => {
    const contract = getSeiCampaignStage2Contract(web3, getSeiCampaignStage2Address(networkId))

    if (veTHEs.length > 0) {
      try {
        const inviter = localStorage.getItem('inviter')
        console.log('inviter', inviter)
        console.log('veTHEs', veTHEs)

        const isVerify = await sendContract(dispatch, key, approveuuid, contract, 'verifyVote', [veTHEs[veTHEs.length - 1].id, inviter], account)

        // const isVerify = await contract.methods.verifyVote(veTHEs[veTHEs.length-1].id, inviter).call()

        if (isVerify) {
          customNotify('Passed verification!', 'success')
          handleGetData()
        }
      } catch (error) {
        customNotify('Passed verification!', 'error')
      }
    }
  }

  useEffect(() => {
    if (!account) {
      return
    }
    setTimeout(() => {
      handleGetData()
    }, 3000)
  }, [account])

  const handleInvite = () => {
    const baseUrl = window.location.href
    const url = new URL(baseUrl)
    url.searchParams.append('inviter', account)
    copyText(url)
    toast.success(`Invitation link: ${url} has been copied`, {
      icon: false,
      style: { width: '800px' },
    })
    setIsCopied(true)
  }

  const copyText = (text) => {
    const input = document.createElement('input')
    input.setAttribute('value', text)
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const inviter = url.searchParams.get('inviter')
    if (inviter) {
      localStorage.setItem('inviter', inviter)
    }
  }, [])

  return (
    <div>
      <div className='text-gray-500 text-[22px] my-7'>
        Total Points : <span className='text-white'>{rank}</span>
      </div>
      <div className='gradient-bg p-4 mb-4'>
        <div className='flex gap-3 items-center justify-between'>
          <div onClick={getInviteCnt}>
            {swapCnt >= maxSwapCnt ? <img width={96} src='/images/campaign/Swap.png' /> : <img width={96} src='/images/campaign/Swap1.png' />}
          </div>
          <div className='flex flex-col gap-1 w-[200px]'>
            {/* <div className='text-[20px]'>Swap <span>{parseFloat(swapCnt) * 20}/120</span></div>  */}
            <div className='text-[20px]'>
              Swap{' '}
              <span>
                {swapCnt}/{maxSwapCnt}
              </span>
            </div>
            <span className='text-gray-500 text-sm'>Earn 20 points for your first swap in each pool</span>
          </div>
          <div className='flex flex-wrap gap-4 items-center max-w-[660px] '>
            {poolStates.map((item) => {
              return <Radio key={item.address} label={item.symbol} checked={item.isSwap} width={200} />
            })}
          </div>
          <button
            onClick={() => {
              navigate(`/swap`)
            }}
            className='bg-[#9E2019] w-[90px] cursor-pointer h-[40px] rounded disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            Go
          </button>
        </div>
      </div>
      <div className='gradient-bg p-4 mb-4'>
        <div className='flex gap-3 items-center justify-between'>
          <div>
            {depositCnt >= maxDepositCnt ? <img width={96} src='/images/campaign/Deposit.png' /> : <img width={96} src='/images/campaign/Deposit1.png' />}
          </div>
          <div className='flex flex-col gap-1 w-[200px]'>
            <div className='text-[20px]'>
              Add Liquidity{' '}
              <span>
                {depositCnt}/{maxDepositCnt}
              </span>
            </div>
            <span className='text-gray-500 text-sm'>Earn 30 points for adding liquidity in each pool</span>
          </div>
          <div className='flex flex-wrap gap-4 items-center max-w-[660px]'>
            {poolStates.map((item) => {
              return <Radio key={item.address} label={item.symbol} checked={item.isDeposit} width={200} />
            })}
          </div>
          <button
            onClick={() => {
              navigate(`/liquidity`)
            }}
            className='bg-[#9E2019] w-[90px] h-[40px] rounded disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            Go
          </button>
        </div>
      </div>
      <div className='gradient-bg p-4 mb-4'>
        <div className='flex gap-3 items-center justify-between'>
          <div>
            {invitedCnt >= maxinvitedCnt ? <img width={96} src='/images/campaign/Invite.png' /> : <img width={96} src='/images/campaign/Invite1.png' />}
          </div>
          <div className='flex flex-col gap-1 w-[200px]'>
            <div className='text-[20px]'>
              Invite{' '}
              <span>
                {invitedCnt}/{maxinvitedCnt}
              </span>
            </div>
            <span className='text-gray-500 text-sm'>Earn 30 points for each valid invitation.</span>
          </div>
          <div className='w-[660px]'>
            <div className='flex flex-col gap-2 '>
              <Radio label={'Unlock the invitation link by completing a swap and adding liquidity.'} checked={swapBadge && depositCnt > 0} />
              <Radio
                label={`Invited ${
                  invitedCnt / 30 > 10 ? 10 : invitedCnt / 30
                }/10 (Invitees must complete at least one of the following actions: Swap, Deposit, Lock, or Vote)`}
                checked={invitedCnt / 30 >= 10}
              />
            </div>
          </div>
          <button
            disabled={!account || !swapBadge || depositCnt === 0}
            className='bg-[#9E2019] w-[90px] h-[40px] rounded disabled:bg-gray-400 disabled:cursor-not-allowed'
            onClick={handleInvite}
          >
            {isCopied ? (
              <span className='flex items-center gap-1 justify-center'>
                Copied <img width={10} src='/images/campaign/Union.png' />
              </span>
            ) : (
              'Invite'
            )}
          </button>
        </div>
      </div>
      <div className='flex w-full gap-4 justify-between'>
        <div className='gradient-bg p-4 mb-4 w-1/2'>
          <div className='flex gap-3 items-center justify-between'>
            <div className='flex items-center gap-4'>
              {lockedCnt > 0 ? <img width={96} src='/images/campaign/Lock.png' /> : <img width={96} src='/images/campaign/Lock1.png' />}
              <div className='flex flex-col gap-1 w-[200px]'>
                <div className='text-[20px]'>
                  Lock{' '}
                  <span>
                    {lockedCnt > 0 ? 100 : 0}/{maxLockedCnt}
                  </span>
                </div>
                <span className='text-gray-500 text-sm'>Earn 100 points by locking $YAKA.</span>
              </div>
            </div>
            <div className='flex-auto'>
              <div className='flex justify-end'>
                <button
                  onClick={() => {
                    navigate(`/lock`)
                  }}
                  className='bg-[#9E2019] w-[90px] h-[40px] rounded disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='gradient-bg p-4 mb-4 w-1/2'>
          <div className='flex gap-3 items-center justify-between'>
            <div className='flex items-center gap-4'>
              {voteCnt >= 100 ? <img width={96} src='/images/campaign/Vote.png' /> : <img width={96} src='/images/campaign/Vote1.png' />}
              <div className='flex flex-col gap-1 w-[200px]'>
                <div className='text-[20px]'>
                  Vote <span>{voteCnt}/100</span>
                </div>
                <span className='text-gray-500 text-sm'>Earn 100 points by completing a vote using veYAKA.</span>
              </div>
            </div>
            <div className='flex-auto'>
              <div className='flex justify-end flex-col items-end gap-2'>
                <button className='bg-[#9E2019] w-[90px] h-[40px] rounded disabled:bg-gray-400 disabled:cursor-not-allowed'>Go</button>
                <button onClick={handleVerify} className='bg-[#ED790F] w-[90px] h-[40px] rounded disabled:bg-gray-400 disabled:cursor-not-allowed'>
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Accomplishment

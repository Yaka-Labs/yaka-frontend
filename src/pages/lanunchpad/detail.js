import React, { useEffect, useState } from 'react'
import './style.scss'
import Vector from './img/Vector.svg'
import arrow from './img/arrow.svg'
import back from './img/back.svg'
import StyledButton from 'components/Buttons/styledButton'
import { useParams } from 'react-router-dom'
import { lanunchpadProjects, getLinkLogo } from './index'
import { useNavigate } from 'react-router-dom'
import BalanceInput from 'components/Input/BalanceInput'
import sei from './img/sei.svg'
import TokenInput from 'components/Input/TokenInput'
import { useAssets } from 'state/assets/hooks'
import { formatEther, parseEther } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getInitialDistributorContract, getTokenSaleContract, getWBNBContract } from '../../utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3'
import { sendContract } from 'utils/api'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import MerkleTree from 'merkletreejs'
import { keccak256 } from '@ethersproject/keccak256'
import { getInitialDistributorAddress, getTokenSaleAddress } from 'utils/addressHelpers'
import { extractJsonObject, formatNumber, toWei } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import { IdoTokenName, RaiseTokenName, StagesDict } from './constant'
import { closeTransaction, completeTransaction, openTransaction } from '../../state/transactions/actions'
import { TRANSACTION_STATUS } from '../../config/constants'
import { zeroAddress } from '@defi.org/web3-candies'
import { isAddress } from '@ethersproject/address'
import InviteButton from './invite'
const Lanunchpad = () => {
  const params = useParams()
  const projectId = params && params.projectId ? params.projectId : '1'
  const inviterAddress = params && params.inviterAddress ? params.inviterAddress : zeroAddress
  console.log('inviterAddress', inviterAddress)
  const web3 = useWeb3()
  const [projects, setProjects] = useState(lanunchpadProjects)
  const { account, chainId } = useWeb3React()
  const project = projects.find((item) => item.id === projectId)
  const [firstAmount, setFirstAmount] = useState(0)
  const [expectedYaka, setExpectedYaka] = useState(0)
  const [minAmount, setMinAmount] = useState(10)
  const contract = getTokenSaleContract(web3)
  const initialDistributorContract = getInitialDistributorContract(web3)

  const [leave1, setLeave1] = useState([])

  useEffect(() => {
    const fetchLeave1 = async () => {
      try {
        const response = await fetch('/wl1.txt')
        const result = await response.text()
        console.log('leave1', result)
        setLeave1(JSON.parse(result))
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchLeave1()
  }, [])

  const [leave2, setLeave2] = useState([])

  useEffect(() => {
    const fetchLeave2 = async () => {
      try {
        const response = await fetch('/wl2.txt')
        const result = await response.text()
        console.log('leave2', result)
        setLeave2(JSON.parse(result))
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchLeave2()
  }, [])

  useEffect(() => {
    if (firstAmount !== '') {
      setExpectedYaka(firstAmount / StagesDict[project.stage].price)
    }
  }, [firstAmount])
  const assets = useAssets()

  // console.log({ assets })
  // const token = assets[0]
  const [firstAsset, setFirstAsset] = useState(null)
  useEffect(() => {
    const token = assets.find((item) => item.address === 'SEI')
    setFirstAsset(token)
  }, [assets])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [freshId, setFreshId] = useState()

  const onInputChange = () => {}

  const getData = async () => {
    try {
      console.log({ contract })

      const min = await contract.methods.MIN_PAYMENT_AMOUNT().call()
      console.log({ min })

      setMinAmount(formatEther(min))

      const stageData = await contract.methods.stage().call()
      const claimBegin = await contract.methods.claimBegin().call()
      const seiBalanceWei = await web3.eth.getBalance(getTokenSaleAddress())
      console.log({ seiBalanceWei })

      // const raise1 = await contract.methods.wlTotalSupply().call()
      // const totalAllocation1 = await contract.methods.WL_TOTAL_SUPPLY_MAX().call()

      const raise1_1 = await contract.methods.wlTotalSupply1().call()
      const totalAllocation1_1 = await contract.methods.WL_TOTAL_SUPPLY_MAX_1().call()
      const raise1_2 = await contract.methods.wlTotalSupply2().call()
      const totalAllocation1_2 = await contract.methods.WL_TOTAL_SUPPLY_MAX_2().call()

      const raise2 = await contract.methods.publicTotalSupply().call()
      const totalAllocation2 = await contract.methods.PUBLIC_TOTAL_SUPPLY_MAX().call()

      let userInfo = {}
      let yourAllocation = 0
      let userInfo_1 = {}
      let yourAllocation_1 = 0
      let userInfo_2 = {}
      let yourAllocation_2 = 0
      let yourSeiBalanceWei = 0
      let publicSaleOf = 0
      let publicSaleRemainOf = 0
      let linearClaimed = 0
      let directClaimed = 0
      let publicClaimed = 0
      if (account) {
        // userInfo = await contract.methods.userInfoOf(account).call()
        // yourAllocation = formatEther(BigNumber(userInfo.reserve0).plus(BigNumber(userInfo.reserve1)).toFixed())
        userInfo_1 = await contract.methods.userInfoOf1(account).call()
        yourAllocation_1 = BigNumber(userInfo_1.purchase).toFixed()
        userInfo_2 = await contract.methods.userInfoOf2(account).call()
        yourAllocation_2 = BigNumber(userInfo_2.purchase).toFixed()
        publicSaleOf = await contract.methods.publicSaleOf(account).call()
        publicSaleRemainOf = await contract.methods.publicSaleRemainOf(account).call()
        yourAllocation = BigNumber(userInfo_1.purchase).plus(BigNumber(userInfo_2.purchase)).plus(BigNumber(publicSaleOf)).toFixed()
        yourSeiBalanceWei = await web3.eth.getBalance(account)
        linearClaimed = BigNumber(userInfo_1.linearClaimed).plus(BigNumber(userInfo_2.linearClaimed)).toFixed()
        directClaimed = BigNumber(userInfo_1.directClaimed).plus(BigNumber(userInfo_2.directClaimed)).toFixed()
        publicClaimed = BigNumber(publicSaleOf).minus(BigNumber(publicSaleRemainOf)).toFixed()
      } else {
        yourSeiBalanceWei = 0
      }

      console.log({ userInfo_1 })
      console.log({ userInfo_2 })

      let PURCHASE_PERSON_REMAIN = 0
      const PURCHASE_MAX_1 = await contract.methods.PURCHASE_MAX_1().call()
      const PURCHASE_MAX_2 = await contract.methods.PURCHASE_MAX_2().call()

      let curLeftYAKA = 0

      if (stageData === '1') {
        curLeftYAKA = formatEther(BigNumber(totalAllocation1_1).minus(BigNumber(raise1_1)).toFixed())
        // userInfo = userInfo_1
        PURCHASE_PERSON_REMAIN = formatEther(BigNumber(PURCHASE_MAX_1).minus(BigNumber(yourAllocation_1)).toFixed())
      }

      if (stageData === '2') {
        curLeftYAKA = formatEther(BigNumber(totalAllocation1_2).minus(BigNumber(raise1_2)).toFixed())
        // userInfo = userInfo_2
        PURCHASE_PERSON_REMAIN = formatEther(BigNumber(PURCHASE_MAX_2).minus(BigNumber(yourAllocation_2)).toFixed())
      }

      if (stageData === '3') {
        curLeftYAKA = formatEther(BigNumber(totalAllocation2).minus(BigNumber(raise2)).toFixed())
        PURCHASE_PERSON_REMAIN = formatEther(BigNumber(totalAllocation2).minus(BigNumber(raise2)).toFixed())
      }

      let publicClaimable = 0
      let whitelistClaimable = 0

      console.log({ stageData })

      if (stageData === '5' && account) {
        let claim1 = publicSaleRemainOf
        publicClaimable = Number(formatEther(claim1))
        // let claim2 = await contract.methods.claimableForWL(account).call()
        if (account) {
          let claim2 = await initialDistributorContract.methods.claimableForTokenSale(account).call()
          whitelistClaimable = +Number(formatEther(claim2))
        }
      }

      const data = projects.map((item, index) => {
        if (index === 0) {
          item.stage = stageData
          item.price = StagesDict[stageData].price + RaiseTokenName
          item.totalRaise = formatEther(seiBalanceWei)
          item.yourSeiBalanceWei = yourSeiBalanceWei
          item.totalSold = formatEther(BigNumber(raise1_1).plus(BigNumber(raise1_2)).plus(BigNumber(raise2)).toFixed())
          item.totalAllocation = formatEther(BigNumber(totalAllocation1_1).plus(BigNumber(totalAllocation1_2)).plus(BigNumber(totalAllocation2)).toFixed())
          item.yourAllocation = formatEther(yourAllocation)
          item.yourAllocation_1 = formatEther(yourAllocation_1)
          item.yourAllocation_2 = formatEther(yourAllocation_2)
          item.publicSaleOf = formatEther(BigNumber(publicSaleOf).toFixed())
          item.publicSaleRemainOf = formatEther(BigNumber(publicSaleRemainOf).toFixed())

          item.yourPay =
            item.yourAllocation_1 * StagesDict['1'].price + item.yourAllocation_2 * StagesDict['2'].price + item.publicSaleOf * StagesDict['3'].price
          item.PURCHASE_PERSON_REMAIN = PURCHASE_PERSON_REMAIN
          item.curLeftYAKA = curLeftYAKA
          item.publicClaimable = publicClaimable
          item.whitelistClaimable = whitelistClaimable
          item.totalClaimed = formatEther(BigNumber(linearClaimed).plus(BigNumber(directClaimed)).plus(BigNumber(publicClaimed)).toFixed())
          item.expectedYaka = 0
        }
        return item
      })
      setProjects(data)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getData()
  }, [account, chainId, freshId])

  const handleJoin = async () => {
    try {
      // let minSei = minAmount*StagesDict[project.stage].price
      console.log('firstAmount', firstAmount, typeof firstAmount)
      console.log('minAmount', minAmount, typeof minAmount)
      console.log(BigNumber(firstAmount) < BigNumber(minAmount))
      if (BigNumber(firstAmount) < BigNumber(minAmount)) {
        customNotify(`Pay amount must be greater than ${minAmount}!`, 'info')
        return
      }

      let amount = 0

      amount = firstAmount / StagesDict[project.stage].price
      // if (project.stage+'' === '3'){

      amount = amount - 0.0000001
      // }
      console.log('yakaAmount', amount, typeof amount)
      let leaves = []
      if (StagesDict[project.stage].title === StagesDict[1].title) {
        leaves = leave1
        if (leaves.length === 0) {
          customNotify('Please Whitelist Loading...', 'info')
          return
        }
      } else if (StagesDict[project.stage].title === StagesDict[2].title) {
        leaves = leave2
        if (leaves.length === 0) {
          customNotify('Please Whitelist Loading...', 'info')
          return
        }
      }

      const tree = new MerkleTree(leaves, keccak256, { hashLeaves: true, sortPairs: true })
      const root = tree.getHexRoot()
      console.log('root', root)

      const leaf = keccak256(account)
      console.log('leaf', leaf.toString('hex'))
      const proof = tree.getHexProof(leaf)

      let buyParams = [parseEther(amount + '').toString(), inviterAddress, proof]
      console.log('buyParams', buyParams)
      let tempMsgValue = parseEther(firstAmount)
      console.log('msg.Value', tempMsgValue)
      debugger
      contract.methods['buy'](...buyParams)
        .estimateGas({
          from: account,
          value: tempMsgValue,
        })
        .then(async (res) => {
          setLoading(true)
          const approveuuid = uuidv4()
          const key = uuidv4()
          dispatch(
            openTransaction({
              key,
              title: `Contribute ${RaiseTokenName}`,
              transactions: {
                [approveuuid]: {
                  desc: `Contribute ${formatNumber(firstAmount)} ${RaiseTokenName}`,
                  status: TRANSACTION_STATUS.START,
                  hash: null,
                },
              },
            }),
          )
          try {
            const data = await sendContract(dispatch, key, approveuuid, contract, 'buy', buyParams, account, tempMsgValue)
            console.log('buyResult', data)
            dispatch(
              completeTransaction({
                key,
                final: 'Contribute Successful',
              }),
            )
            setFreshId(key)
            setLoading(false)
          } catch (err) {
            console.log('join error :>> ', err)
            setLoading(false)
            customNotify(`${err.reason || err.data?.message || err.message}!`, 'error')
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
        })
    } catch (error1) {
      customNotify(`${error1.reason || error1.data?.message || error1.message}!`, 'error')
    }
  }

  const handleClaimPublic = async () => {
    try {
      const claimParams = [account]

      contract.methods['publicSaleClaim'](...claimParams)
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
                  desc: `Claim ${IdoTokenName} In Public Stage`,
                  status: TRANSACTION_STATUS.START,
                  hash: null,
                },
              },
            }),
          )
          try {
            const data = await sendContract(dispatch, key, approveuuid, contract, 'publicSaleClaim', claimParams, account)
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
        })
    } catch (error1) {
      customNotify(`${error1.reason || error1.data?.message || error1.message}!`, 'error')
    }
  }
  const handleClaim = async () => {
    try {
      const claimParams = []
      initialDistributorContract.methods['claimForTokenSale'](...claimParams)
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
                  desc: `Claim ${IdoTokenName} In Seed & Whitelist`,
                  status: TRANSACTION_STATUS.START,
                  hash: null,
                },
              },
            }),
          )
          try {
            const data = await sendContract(dispatch, key, approveuuid, initialDistributorContract, 'claimForTokenSale', claimParams, account)
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
        })
    } catch (error1) {
      customNotify(`${error1.reason || error1.data?.message || error1.message}!`, 'error')
    }
  }

  return (
    <div className='mx-auto flex flex-col items-center justify-center pt-[76.5px] md:pt-[76.5px] px-[17px] xl:px-0'>
      <div className='max-w-[952px] w-full mt-[27.2px] gradient-bg'>
        <div className='p-[13.6px]'>
          <div onClick={() => navigate(-1)} className='font-semibold text-[22.1px] text-white flex gap-[13.6px] items-center mb-[10.2px] cursor-pointer'>
            <img src={back} /> Launchpad
          </div>

          <div className='w-full rounded-xl'>
            <div className='relative'>
              <img className=' rounded-tl-xl rounded-tr-xl' width={'100%'} height={153} src={project.banner} />
              <div className='flex gap-[5.1px] absolute top-[12.75px] left-[25.5px]'>
                <div className='bg-[#FFC700] text-[11.05px] font-semibold py-[2px] px-[6.8px] rounded-lg text-black'>{project.status}</div>
                <div className='bg-[#00000066] text-[11.05px] font-semibold py-[2px] px-[6.8px] rounded-lg'>{project.type}</div>
              </div>
              <div className='absolute w-full bottom-[-42.5px] flex justify-between px-[12.75px]'>
                <div className='flex items-end gap-[6.8px]'>
                  <img className='rounded-tl-xl rounded-tr-xl' width={74.8} height={74.8} src={project.logo} />
                  <span className='mb-[13.6px] font-semibold'>{project.projectName}</span>
                </div>

                <div className='flex gap-[6.8px] items-end justify-between'>
                  {project.links.map((item, index) => {
                    return (
                      <div key={index} onClick={() => window.open(item.url)} className='cursor-pointer'>
                        <img width={25.5} height={25.5} src={getLinkLogo(item.type)} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-[13.6px] p-[13.6px] mt-[42.5px]'>
              <div className='text-[11.9px]'>{project.descFull}</div>
              <div className='container mx-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <div className='bg-[#C81F391A] h-fit rounded py-2 '>
                    <div className='flex flex-col justify-center items-center w-full'>
                      <span className='text-[13px] text-[#FFFFFFCC]'>Total {IdoTokenName} Sold</span>
                      <span className='text-[17px] text-white font-semibold'>
                        {formatNumber(project.totalSold, true)} / {formatNumber(project.totalAllocation, true)} (
                        {((project.totalSold / project.totalAllocation) * 100).toFixed(6)} %)
                      </span>
                    </div>
                  </div>
                  <div className='bg-[#C81F391A] h-fit rounded py-2 '>
                    <div className='flex flex-col justify-center items-center w-full'>
                      <span className='text-[13px] text-[#FFFFFFCC]'>Total Raised</span>
                      <span className='text-[17px] text-white font-semibold'>
                        {formatNumber(project.totalRaise, true)} {RaiseTokenName}
                      </span>
                    </div>
                  </div>
                  <div className='bg-[#C81F391A] h-fit rounded py-2 '>
                    <div className='flex flex-col justify-center items-center w-full'>
                      <span className='text-[13px] text-[#FFFFFFCC]'>Your Secured Quota</span>
                      <span className='text-[17px] text-white font-semibold'>
                        {formatNumber(project.yourAllocation, true)} {IdoTokenName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className='mb-2'>Time line</div>
                <div className='flex items-center gap-3'>
                  <div
                    className={`${StagesDict[project.stage].title === StagesDict[1].title ? 'gradient-bg-btn' : 'bg-[#C81F391A]'} flex justify-between items-center gap-2 rounded w-full px-3 py-[2px]`}
                  >
                    <div style={{ display: StagesDict[project.stage].title === StagesDict[1].title ? '' : 'none' }} className='w-[20%]'>
                      <img src={Vector} />
                    </div>
                    <span className='w-full flex justify-center ml-[-10%]'>{StagesDict[1].title}</span>
                  </div>

                  <img src={arrow} />
                  <div
                    className={`${StagesDict[project.stage].title === StagesDict[2].title ? 'gradient-bg-btn' : 'bg-[#C81F391A]'} flex justify-between items-center gap-2 rounded w-full px-3 py-[2px]`}
                  >
                    <div style={{ display: StagesDict[project.stage].title === StagesDict[2].title ? '' : 'none' }} className='w-[20%]'>
                      <img src={Vector} />
                    </div>
                    <span className='w-full flex justify-center ml-[-10%]'>{StagesDict[2].title}</span>
                  </div>

                  <img src={arrow} />

                  <div
                    className={`${StagesDict[project.stage].title === StagesDict[3].title ? 'gradient-bg-btn' : 'bg-[#C81F391A]'} flex justify-between items-center gap-2 rounded w-full px-3 py-[2px]`}
                  >
                    <div style={{ display: StagesDict[project.stage].title === StagesDict[3].title ? '' : 'none' }} className='w-[20%]'>
                      <img src={Vector} />
                    </div>
                    <span className='w-full flex justify-center ml-[-10%]'>{StagesDict[3].title}</span>
                  </div>

                  <img src={arrow} />

                  <div
                    className={`${StagesDict[project.stage].title === StagesDict[4].title ? 'gradient-bg-btn' : 'bg-[#C81F391A]'} flex justify-between items-center gap-2 rounded w-full px-3 py-[2px]`}
                  >
                    <div style={{ display: StagesDict[project.stage].title === StagesDict[4].title ? '' : 'none' }} className='w-[20%]'>
                      <img src={Vector} />
                    </div>
                    <span className='w-full flex justify-center ml-[-10%]'>{StagesDict[4].title}</span>
                  </div>

                  <img src={arrow} />

                  <div
                    className={`${StagesDict[project.stage].title === StagesDict[5].title ? 'gradient-bg-btn' : 'bg-[#C81F391A]'} flex justify-between items-center gap-2 rounded w-full px-3 py-[2px]`}
                  >
                    <div style={{ display: StagesDict[project.stage].title === StagesDict[5].title ? '' : 'none' }} className='w-[20%]'>
                      <img src={Vector} />
                    </div>
                    <span className='w-full flex justify-center ml-[-10%]'>{StagesDict[5].title}</span>
                  </div>
                </div>
              </div>
              {(StagesDict[project.stage].title === StagesDict[1].title ||
                StagesDict[project.stage].title === StagesDict[2].title ||
                StagesDict[project.stage].title === StagesDict[3].title) && (
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-2'>
                    <span className='text-[11.9px]'>{IdoTokenName} quota left in this round :</span>
                    <div className='bg-[#C81F391A] p-[3.4px] text-[11.9px]'>{formatNumber(project.curLeftYAKA, true)}</div>
                  </div>

                  {/*<div className='flex items-center gap-2'>*/}
                  {/*  <span className='text-[11.9px]'>Current stage ends in :</span>*/}
                  {/*  <div className='bg-[#C81F391A] p-[3.4px] text-[11.9px]'>{project.time}</div>*/}
                  {/*</div>*/}
                </div>
              )}

              {(StagesDict[project.stage].title === StagesDict[1].title ||
                StagesDict[project.stage].title === StagesDict[2].title ||
                StagesDict[project.stage].title === StagesDict[3].title) && (
                <div className='flex justify-between items-start gap-[13.6px]'>
                  <div className='flex flex-col gap-[10.2px]  w-1/2'>
                    <div className='text-[17px]'>{StagesDict[project.stage].title} Stage</div>
                    <div className='text-[11.9px] p-2 bg-[#C81F391A] w-fit'>
                      {IdoTokenName} Price: {StagesDict[project.stage].price} {RaiseTokenName}
                    </div>
                    <div className='text-[11.9px] text-[#ffffffb0]'>
                      The YAKA IDO progresses through exclusive Seed and Whitelist rounds for selected participants, opens to all in the Public round, and
                      concludes with a claim phase, with updates provided via official twitter & discord throughout the process.
                    </div>
                    <InviteButton account={account}></InviteButton>
                  </div>
                  <div className='flex flex-col gap-3 w-1/2'>
                    <div className='text-[13.6px] flex justify-between'>
                      <div>Purchasable {IdoTokenName}</div>
                      <div>{formatNumber(project.PURCHASE_PERSON_REMAIN, true)}</div>
                    </div>
                    <div className='text-[13.6px] flex justify-between'>
                      <div>Amount of {RaiseTokenName} to Join</div>
                      <div>{account ? formatNumber(formatEther(project.yourSeiBalanceWei), true) : '-'}</div>
                    </div>
                    <div className=''>
                      <TokenInput
                        disabled={account === undefined}
                        disabledSelect={true}
                        title=''
                        asset={firstAsset}
                        setAsset={(e) => {
                          setFirstAsset(e)
                        }}
                        onInputChange={(data) => {
                          setFirstAmount(data)
                        }}
                        amount={firstAmount}
                      />
                      <div className='text-[11.9px] flex justify-center my-[8.5px]'>
                        <span>
                          Expect to receive {formatNumber(expectedYaka)} {IdoTokenName} allocation in this stage
                        </span>
                      </div>
                      <div className='flex items-center justify-center gap-2 w-full'>
                        {firstAmount === '' || BigNumber(parseEther(firstAmount + '') + '').isEqualTo(BigNumber(0)) ? (
                          <StyledButton disabled={true} content='Enter Amount' className='py-[8.5px] px-[13.6px] w-full' isCap />
                        ) : BigNumber(parseEther(firstAmount + '') + '').gt(BigNumber(project.yourSeiBalanceWei + '')) ? (
                          <StyledButton disabled={true} content='Insufficient Balance' className='py-[8.5px] px-[13.6px] w-full' isCap />
                        ) : expectedYaka > project.PURCHASE_PERSON_REMAIN ? (
                          <StyledButton disabled={true} content='Insufficient Quota' className='py-[8.5px] px-[13.6px] w-full' isCap />
                        ) : (
                          <StyledButton pending={loading} onClickHandler={handleJoin} content='Join' className='py-[8.5px] px-[13.6px] w-full' isCap />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {StagesDict[project.stage].title === StagesDict[4].title && (
                <div className='flex justify-between items-start gap-[13.6px]'>
                  <div className='flex flex-col gap-[10.2px]  w-1/2'>
                    <div className='text-[17px]'>Ended</div>
                    <div className='text-[11.9px] text-[#ffffffb0]'>Please waiting to claim your shares.</div>
                    <InviteButton account={account}></InviteButton>
                  </div>
                  <div className='flex flex-col gap-[10.2px] w-1/2'>
                    <div className='text-[13.6px] flex justify-between'>
                      <div>Your contribution</div>
                      <div>
                        {formatNumber(project.yourPay, true)} {RaiseTokenName}
                      </div>
                    </div>
                    <div className='text-[13.6px] flex justify-between'>
                      <div>Your total purchased</div>
                      <div>
                        {formatNumber(project.yourAllocation, true)} {IdoTokenName}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {StagesDict[project.stage].title === StagesDict[5].title && (
                <div className='flex justify-between items-start gap-4'>
                  <div className='flex flex-col gap-3  w-1/2'>
                    <div className='text-[17px]'>Ended</div>
                    <div className='text-[11.9px] text-[#ffffffb0]'>Your shares are now claimable!</div>
                    <InviteButton account={account}></InviteButton>
                  </div>
                  <div className='flex flex-col gap-3 w-1/2'>
                    <div className='text-[13.6px] flex justify-between'>
                      <div>Purchased {IdoTokenName}</div>
                      <div>
                        {formatNumber(project.yourAllocation, true)} {IdoTokenName}
                      </div>
                    </div>
                    <div className='text-[13.6px] flex justify-between'>
                      <div>Public Claimable</div>
                      <div>
                        {formatNumber(project.publicClaimable, true)} {IdoTokenName}
                      </div>
                    </div>
                    <div className='text-[13.6px] flex justify-between'>
                      <div>Seed & Whitelist Claimable</div>
                      <div>
                        {formatNumber(project.whitelistClaimable, true)} {IdoTokenName}
                      </div>
                    </div>
                    {/*<div className='text-[13.6px] flex justify-between'>*/}
                    {/*  <div>Claimed</div>*/}
                    {/*  <div>*/}
                    {/*    {formatNumber(project.totalClaimed, true)} {IdoTokenName}*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                    <div className='flex items-center justify-center gap-2 w-full'>
                      {account &&
                        (project.publicSaleRemainOf > 0 ? (
                          <StyledButton
                            pending={loading}
                            onClickHandler={handleClaimPublic}
                            content='Claim Public'
                            className='py-[8px] px-[13.6px] w-full'
                            isCap
                          />
                        ) : (
                          <StyledButton
                            disabled={project.whitelistClaimable <= 0}
                            pending={loading}
                            onClickHandler={handleClaim}
                            content='Claim Whitelist'
                            className='py-[8px] px-[13.6px] w-full'
                            isCap
                          />
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lanunchpad

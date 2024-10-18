import React, { useEffect, useState } from 'react'
import Pagination from 'components/Pagination'
import * as XLSX from 'xlsx'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import SearchInput from 'components/Input/SearchInput'
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

const Nft = () => {
  useAutoDocumentTitle('NFT')
  const [dataSource, setDataSource] = useState([])

  const [totalDataSource, setTotalDataSource] = useState([])

  const [originDataSource, setOriginDataSource] = useState([])

  const [pageNum, setPageNum] = useState(1)

  const [pageSize, setPageSize] = useState(10)

  const [currentPage, setCurrentPage] = useState(0)

  const [pageTotal, setPageTotal] = useState(0)

  const [searchText, setSearchText] = useState('')

  const web3 = useWeb3()
  const initialDistributorContract = getInitialDistributorContract(web3)

  const [loading, setLoading] = useState(false)
  const [freshId, setFreshId] = useState()

  const { account, chainId } = useWeb3React()

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
    setPageNum(event.selected + 1)
  }

  const getExcel = (filename) => {
    axios
      .get(`/excel/${filename}`, { responseType: 'arraybuffer' })
      .then((res) => {
        let data = new Uint8Array(res.data)
        let wb = XLSX.read(data, { type: 'array' })
        let sheets = wb.Sheets
        transformSheets(sheets)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  let [presaleClaimable, setPresaleClaimable] = useState(0)

  const getClaimable = async () => {
    if (account) {
      let claim = await initialDistributorContract.methods.claimableForPresale(account).call()
      setPresaleClaimable(Number(formatEther(claim)))
    } else {
      setPresaleClaimable(0)
    }
  }

  const [bonusTotal, setBonusTotal] = useState('0')

  const transformSheets = (sheets) => {
    let content1 = []
    let tmplist = []
    for (let key in sheets) {
      //https://github.com/SheetJS/js-xlsx#utility-functions
      tmplist.push(XLSX.utils.sheet_to_json(sheets[key]).length)
      content1.push(XLSX.utils.sheet_to_json(sheets[key]))
    }
    if (content1[0].length <= pageSize) {
      setDataSource(content1[0])
    } else {
      setDataSource(content1[0].slice(0, pageSize))
    }

    setTotalDataSource(content1[0])

    setOriginDataSource(content1[0])

    let totalAmount = 0
    content1[0].forEach((item) => {
      const keys = Object.keys(item)
      let key = ''
      if (keys.length >= 2) {
        key = keys[1]
      }
      if (key) {
        totalAmount = BigNumber(totalAmount).plus(item[key]).toNumber()
      }
    })
    setBonusTotal(BigNumber(totalAmount).toFixed(2))
    setPageTotal(tmplist[0])
  }

  useEffect(() => {
    getExcel('dashboard.csv')
  }, [])

  useEffect(() => {
    const start = (pageNum - 1) * pageSize
    const end = (pageNum - 1) * pageSize + pageSize
    setDataSource(totalDataSource.slice(start, end))
  }, [pageSize, pageNum])

  useEffect(() => {
    const result = []
    originDataSource.forEach((item) => {
      if (item.address && item.address.indexOf(searchText) !== -1) {
        result.push(item)
      }
    })
    setTotalDataSource(result)
    setPageTotal(result.length)
    setPageNum(1)
    setDataSource(result.slice(0, pageSize))
  }, [searchText])

  useEffect(() => {
    getClaimable()
  }, [account, chainId, freshId])

  const dispatch = useDispatch()
  const handleClaim = async () => {
    try {
      const claimParams = []
      initialDistributorContract.methods['claimForPresale'](...claimParams)
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
                  desc: `Claim ${IdoTokenName} For NFT Holder`,
                  status: TRANSACTION_STATUS.START,
                  hash: null,
                },
              },
            }),
          )
          try {
            const data = await sendContract(dispatch, key, approveuuid, initialDistributorContract, 'claimForPresale', claimParams, account)
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
          <div className=''>
            <div className='flex items-center justify-between mb-[10px]'>
              <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Address' />
              <div className='text-gray-500 text-[17px]'>
                Aggregate User Bonuses : <span className='text-white'>{bonusTotal}</span>
              </div>
            </div>
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
                disabled={showTime() || presaleClaimable <= 0}
                pending={loading}
                onClickHandler={handleClaim}
                content='Claim'
                className='py-[8px] px-[13.6px] w-1/6'
                isCap
              />
            </div>
            <div className='flex justify-between px-[20.4px] text-white/[0.6] mb-[6.8px]'>
              <div className='w-1/2 truncate'>Address</div>
              {/* <div className='w-1/4'>Referral Points</div> */}
              <div className='w-1/2'>Bonus</div>
            </div>
            <div className='gradient-bg '>
              {dataSource.map((item, index) => {
                return (
                  <div className='flex justify-between px-[20.4px] pt-[13.6px] pb-[13.6px] border-b border-[#9552524D]' key={index}>
                    <div className='w-1/2 truncate '>{item.address?.slice(0, 4) + '...' + item.address?.slice(-4)}</div>
                    {/* <div className='w-1/4'>{item.invitedCntOf}</div> */}
                    <div className='w-1/2'>{BigNumber(item.point || 0).toFixed(2, BigNumber.ROUND_HALF_UP)}</div>
                  </div>
                )
              })}
            </div>
            <Pagination
              pageSize={pageSize}
              setPageSize={setPageSize}
              handlePageClick={handlePageClick}
              pageCount={Math.ceil(pageTotal / pageSize)}
              currentPage={currentPage}
              total={pageTotal}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nft

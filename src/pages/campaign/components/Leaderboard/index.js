/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { getSeiCampaignStage2Contract } from 'utils/contractHelpers'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from 'hooks/useWeb3'
import Pagination from 'components/Pagination'
import {getRankList, getProgress, getDepositRankList} from 'utils/dexOpApi'
import {CAMPAIGN_RANK_FILTERS, POOL_FILTERS, SIZES} from "../../../../config/constants";
import TabFilter from "../../../../components/TabFilter";

const Leaderboard = () => {
  const web3 = useWeb3()
  const { account } = useWeb3React()

  // const [address, setAddress] = useState([])
  // const [points, setPoints] = useState([])
  const [dataSource, setDataSource] = useState([])

  const [pageNum, setPageNum] = useState(1)

  const [pageSize, setPageSize] = useState(10)

  const [currentPage, setCurrentPage] = useState(0)

  const [pageTotal, setPageTotal] = useState(0)

  const [progressData, setProgressData] = useState({})

  const [filter, setFilter] = useState(CAMPAIGN_RANK_FILTERS.TOTAL)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
    setPageNum(event.selected + 1)
  }

  useEffect(() => {
    console.log('filter changed')
    setCurrentPage(0)
    setPageNum(1)
  }, [filter])

  useEffect(() => {
    // handleGetData()
    console.log(filter)
    if (filter === CAMPAIGN_RANK_FILTERS.TOTAL){
      console.log('getRankList')
      getRankList(pageNum, pageSize).then((res) => {
        if (res && res.msg === 'success') {
          setDataSource(res.data.list || [])
          setPageTotal(res.data.total)
        }
      })
    }else{
      console.log('getDepositRankList')
      getDepositRankList(pageNum, pageSize).then((res) => {
        if (res && res.msg === 'success') {
          setDataSource(res.data.list || [])
          setPageTotal(res.data.total)
        }
      })
    }
  }, [pageSize, pageNum, filter])

  useEffect(() => {
    if (account) {
      getProgress(account).then((res) => {
        if (res && res.msg === 'success') {
          setProgressData(res.data)
        }
      })
    }
  }, [account])

  return (
    <div className=''>
      <div className={'flex justify-between  my-[23.8px]'}>
        <div className='text-gray-500 text-[18.7px]'>
          Your Rank : <span className='text-white'>{(filter === CAMPAIGN_RANK_FILTERS.TOTAL ?progressData.ranking:progressData.depositRanking) || '-'}</span>
        </div>
        <div>
          <TabFilter data={Object.values(CAMPAIGN_RANK_FILTERS)} filter={filter} setFilter={setFilter} size={SIZES.LARGE}/>
        </div>
      </div>
      <div className='flex justify-between px-[20.4px] text-white/[0.6] mb-[6.8px]'>
        <div className='w-1/3'>Rank</div>
        <div className='w-1/3 truncate'>Address</div>
        {/* <div className='w-1/4'>Referral Points</div> */}
        <div className='w-1/3'>{filter}</div>
      </div>

      <div className='gradient-bg '>
        {dataSource.map((item, index) => {
          return (
            <div className='flex justify-between px-[20.4px] pt-[13.6px] pb-[13.6px] border-b border-[#9552524D]' key={index}>
              <div className='w-1/3'>{index + currentPage * pageSize + 1}</div>
              <div className='w-1/3 truncate '>{item.address?.slice(0, 4) + '...' + item.address?.slice(-4)}</div>
              {/* <div className='w-1/4'>{item.invitedCntOf}</div> */}
              <div className='w-1/3'>{(filter === CAMPAIGN_RANK_FILTERS.TOTAL ?item.totalPoints:item.totalTvlPoints) || 0}</div>
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
  )
}
export default Leaderboard

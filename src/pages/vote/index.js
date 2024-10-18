import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import TabFilter from 'components/TabFilter'
import SearchInput from 'components/Input/SearchInput'
import Timer from 'components/Timer'
import MobileFilterModal from 'components/MobileFilterModal'
import { formatNumber } from 'utils/formatNumber'
import VeTHESelect from 'components/VeTHESelect'
import Toggle from 'components/Toggle'
import { useEpochTimer, useVoteEmissions } from 'hooks/useGeneral'
import { POOL_FILTERS } from 'config/constants'
import { veTHEsContext } from 'context/veTHEsConetext'
import usePrices from 'hooks/usePrices'
import { usePools } from 'state/pools/hooks'
import Table from './table'
import useAutoDocumentTitle from '../../hooks/useAutoDocumentTitle'

const sortOptions = [
  {
    label: 'APR',
    value: 'apr',
    isDesc: true,
    width: 'w-[15%]',
  },
  {
    label: 'Total Votes',
    value: 'votes',
    isDesc: true,
    width: 'w-[15%]',
  },
  {
    label: 'Rewards',
    value: 'rewards',
    isDesc: true,
    width: 'w-[15%]',
  },
  {
    label: 'Reward Estimate',
    value: 'perRewards',
    isDesc: true,
    width: 'w-[20%]',
  },
  {
    label: 'Your Vote',
    value: 'your',
    isDesc: true,
    width: 'w-[12%]',
  },
]

const Vote = () => {
  useAutoDocumentTitle('Vote')
  const [filter, setFilter] = useState(POOL_FILTERS.ALL)
  const [sort, setSort] = useState(sortOptions[2])
  const [mobileFilter, setMobileFilter] = useState(false)
  const [isVoted, setIsVoted] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [veTHE, setVeTHE] = useState(null)
  const [percent, setPercent] = useState({})
  const fusions = usePools()
  const veTHEs = useContext(veTHEsContext)
  const { voteEmssions } = useVoteEmissions()
  const { days, hours, mins, epoch } = useEpochTimer()
  const navigate = useNavigate()
  const prices = usePrices()
  let { veId } = useParams()
  const { account } = useWeb3React()

  const avgApr = useMemo(() => {
    if (fusions && fusions.length > 0 && prices) {
      const totalBribe = fusions.reduce((sum, cur) => {
        return sum.plus(cur.gauge.bribeUsd)
      }, new BigNumber(0))
      const totalWeight = fusions.reduce((sum, cur) => {
        return sum.plus(cur.gauge.weight)
      }, new BigNumber(0))
      const totalVoteUsd = totalWeight.times(prices.THE)
      return totalVoteUsd.isZero() ? 0 : totalBribe.times(52).div(totalVoteUsd).times(100)
    }
    return new BigNumber(0)
  }, [fusions, prices])

  useEffect(() => {
    if (veTHEs && veTHEs.length > 0 && veId) {
      const item = veTHEs.find((ele) => ele.id === veId)
      if (!item) {
        navigate('/404')
        return
      }
      setVeTHE(item)
    }
  }, [veTHEs, veId])

  const totalInfo = useMemo(() => {
    return [
      {
        title: 'Your veYAKA Balance',
        balance: veTHE ? formatNumber(veTHE.voting_amount) : '-',
      },
      {
        title: 'Emissions / % of Vote',
        balance: '$' + formatNumber(voteEmssions),
      },
      {
        title: 'Average Voting APR',
        balance: formatNumber(avgApr) + '%',
      },
      {
        title: `Epoch ${epoch} Ends In`,
        balance: `${days}d ${hours}h ${mins}m`,
      },
    ]
  }, [veTHE, voteEmssions, avgApr, mins])

  const pools = useMemo(() => {
    return (
      fusions
        // .filter((pair) => pair.gauge.address !== ZERO_ADDRESS && pair.isValid && pair.gauge.isAlive)
        .map((pair) => {
          const perRewards = pair.gauge.bribeUsd.div(pair.gauge.weight.plus(1000)).times(1000)
          let votes = {
            weight: new BigNumber(0),
            weightPercent: new BigNumber(0),
            rewards: new BigNumber(0),
            perRewards,
          }
          if (veTHE && veTHE.votes.length > 0) {
            const found = veTHE.votes.find((ele) => ele.address.toLowerCase() === pair.address.toLowerCase())
            if (found) {
              const rewards =
                !veTHE.votedCurrentEpoch || pair.gauge.weight.isZero() ? new BigNumber(0) : pair.gauge.bribeUsd.div(pair.gauge.weight).times(found.weight)
              votes = {
                ...found,
                rewards,
                perRewards,
              }
            }
          }
          return {
            ...pair,
            votes,
          }
        })
    )
  }, [fusions, veTHE])

  useEffect(() => {
    if (JSON.stringify(percent) === '{}') {
      let data = {}
      pools.map((item) => {
        console.log(item.address, item.votes.weightPercent.toString())
        if (Number(item.votes.weightPercent.toString()) > 0) {
          data[item.address] = Number(item.votes.weightPercent.toString())
        }
      })
      console.log('vvvv', data)
      setPercent(data)
    }
  }, [pools])

  const expectedRewards = useMemo(() => {
    return pools.reduce((acc, cur) => {
      return acc.plus(cur.votes.rewards)
    }, new BigNumber(0))
  }, [pools])

  useEffect(() => {
    if (veTHE) {
      setVeTHE(veTHEs.find((item) => item.id === veTHE.id))
    }
  }, [veTHEs, veTHE])

  const votedGauges = useMemo(() => {
    const temp = []
    for (let i = 0; i < Object.keys(percent).length; i++) {
      const key = Object.keys(percent)[i]
      if (!isNaN(Number(percent[key])) && Number(percent[key]) !== 0) {
        const found = pools.find((pool) => pool.address === key)
        temp.push({
          ...found,
          votes: percent[key],
        })
      }
    }
    return temp
  }, [pools, percent])

  const totalPercent = useMemo(() => {
    return Object.values(percent).reduce((sum, current) => {
      return sum + (!current || current === '' ? 0 : Number(current))
    }, 0)
  }, [percent])

  return (
    <div className='max-w-[1020px] px-[17px] sm:px-[40.8px] md:px-[95.2px] mdLg:px-[34px] lg:px-[17px] xl:px-0 pt-[68px]  md:pt-[102px] mx-auto'>
      <div className='lg:flex items-start justify-between lg:space-x-[6.8px] xl:space-x-[17px]'>
        <div className='w-full lg:w-[30%] xl:w-1/3'>
          <div className='max-w-[382.5px]'>
            <h1 className='text-[28.9px] md:text-[30.6px] xl:text-[35.7px] font-semibold text-white  font-figtree'>Vote</h1>
            <p className='text-[#b8b6cb] text-[13.6px] md:text-[15.3px] leading-[18.7px] md:leading-[20.4px] mt-1'>
              Select your veYAKA and use 100% of your votes for one or more pools to earn bribes and trading fees.&nbsp;
              <a href='https://yaka.gitbook.io/yaka-finance' target='_blank' rel='noreferrer' className='text-green'>
                Learn More
              </a>
            </p>
          </div>
        </div>
        <Timer arr={totalInfo} className='w-full lg:w-[70%] xl:w-2/3 mt-[13.6px] lg:mt-0' />
      </div>
      <div className='flex flex-col lg:flex-row items-center justify-between w-full mt-[13.6px] lg:mt-[19.55px] lg:space-x-[23.8px] xl:space-x-[51px] relative'>
        <div className='w-full lg:w-[55%] xl:w-1/2 lg:flex-row flex flex-col-reverse lg:items-center lg:space-x-[17px]'>
          <div className='flex items-center w-full mt-[11.9px] lg:mt-0'>
            <SearchInput searchText={searchText} setSearchText={setSearchText} placeholder='Search LP' />
            {/* filter button for mobile */}
            <button
              onClick={() => {
                setMobileFilter(!mobileFilter)
              }}
              className='w-[40.8px] flex-shrink-0 h-[35.7px] lg:hidden ml-[10.2px]'
            >
              <img alt='filter svg' className='w-[40.8px] h-[35.7px]' src='/images/common/filter.svg' />
            </button>
          </div>
          <VeTHESelect className='lg:max-w-[255px] w-full' isSelected={veTHE} setIsSelected={setVeTHE} />
        </div>
        {account && (
          <div className='gradient-bg p-px rounded-[5px] w-full lg:w-auto mt-[11.9px] lg:mt-0'>
            <div className='solid-bg rounded-[5px] flex items-center justify-between w-full h-[35.7px] md:h-[44.2px] lg:space-x-[34px] px-[10.2px] lg:px-[17px]'>
              <div className='flex items-center justify-between md:justify-start space-x-1 xl:space-x-[10.2px]'>
                <p className='text-white font-figtree font-light'>Expected Rewards:</p>
                <p className='text-[13.6px] lg:text-[18.7px] font-medium text-white'>${formatNumber(expectedRewards)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='flex items-center justify-between w-full mt-[13.6px] lg:mt-[19.55px] lg:space-x-[23.8px] xl:space-x-[51px] relative'>
        {/* for desktop */}
        <div className='w-full hidden lg:flex items-center space-x-[27.2px]'>
          <TabFilter data={Object.values(POOL_FILTERS)} filter={filter} setFilter={setFilter} />
          <div className='flex items-center space-x-[6.8px]'>
            <Toggle checked={isVoted} onChange={() => setIsVoted(!isVoted)} toggleId='isVoted' />
            <p className='text-lightGray text-[11.9px] xl:text-[14.45px] whitespace-nowrap'>Voted Only</p>
          </div>
        </div>
        {/* mobile filters popup */}
        {mobileFilter && (
          <MobileFilterModal
            setMobileFilter={setMobileFilter}
            setFilter={setFilter}
            filter={filter}
            tabs={Object.values(POOL_FILTERS)}
            isVote
            isVoted={isVoted}
            setIsVoted={setIsVoted}
            sort={sort}
            setSort={setSort}
            sortOptions={sortOptions}
          />
        )}
      </div>
      {votedGauges.length > 0 && (
        <div className='mt-[13.6px]'>
          <p className='text-white font-figtree'>Your Votes:</p>
          <div className='flex overflow-auto mb-[13.6px] lg:mb-0 pb-[6.8px] lg:pb-0  w-full mt-[5.1px] lg:-mt-[8.5px] space-x-[13.6px] lg:space-x-[27.2px]'>
            {votedGauges.map((pool, idx) => {
              return (
                <div
                  key={idx}
                  className='flex lg:my-[13.6px] flex-shrink-0 max-w-[238px] lg:max-w-[224.4px] xl:max-w-[233.75px] rounded-md border border-[#C81F39]'
                >
                  <div className='flex items-center w-3/4 bg-[#FF626E] bg-opacity-10 rounded-tl-md rounded-bl-md border-r border-[#C81F39]'>
                    <button
                      className='border-r border-[#C81F39] md:w-[34px] md:h-[34px]'
                      onClick={() => {
                        setPercent({
                          ...percent,
                          [pool.address]: '',
                        })
                      }}
                    >
                      <img alt='' src='/images/common/close-button.svg' />
                    </button>
                    <div className='flex items-center w-full space-x-[6.8px] ml-[5.1px] py-[5.1px]'>
                      <div className='flex items-center  -space-x-[6.8px]'>
                        <img className='relative w-[20.4px] h-[20.4px] z-[1]' alt='' src={pool.token0?.logoURI} />
                        <img className='relative w-[20.4px] h-[20.4px]' alt='' src={pool.token1?.logoURI} />
                      </div>
                      <div>
                        <p className='text-[1rem] font-semibold font-figtree lg:text-[13.6px] xl:text-[14.45px] leading-[17px]'>
                          {pool.symbol.replace(/WSEI/g, 'SEI')}
                        </p>
                        <p className='tracking-[0.66px] text-[9.35px] xl:text-xs leading-none'>{pool.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className='relative w-1/5 lg:w-[28%] bg-[#FF626E] bg-opacity-10'>
                    <input
                      onChange={(e) => {
                        const val = isNaN(Number(percent[pool.address])) ? 0 : Number(percent[pool.address])
                        const newVal = isNaN(Number(e.target.value)) || Number(e.target.value) < 0 ? 0 : Math.floor(Number(e.target.value))
                        const maxValue = 100 - totalPercent + val === 0 ? '' : 100 - totalPercent + val
                        let final = newVal === 0 ? '' : totalPercent - val + newVal > 100 ? maxValue : newVal
                        setPercent({
                          ...percent,
                          [pool.address]: !e.target.value ? '' : final,
                        })
                      }}
                      type='number'
                      lang='en'
                      className='py-[10.2px] w-[90%] pl-[10.2px] text-white font-medium text-[15.3px] lg:text-[17px] bg-transparent focus:outline-none'
                      value={pool.votes}
                    />
                    <span className='text-white font-medium text-[15.3px] lg:text-[17px] absolute right-0  mt-[10.2px] -mr-1.5 lg:mr-1.5'>%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className='mt-[13.6px]'>
        <Table
          pools={pools}
          sort={sort}
          setSort={setSort}
          sortOptions={sortOptions}
          filter={filter}
          searchText={searchText}
          isVoted={isVoted}
          veTHE={veTHE}
          percent={percent}
          setPercent={setPercent}
          totalPercent={totalPercent}
        />
      </div>
    </div>
  )
}

export default Vote

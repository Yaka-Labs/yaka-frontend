import React, { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toggle from 'components/Toggle'
import TransparentButton from 'components/Buttons/transparentButton'
import MobileFilterModal from 'components/MobileFilterModal'
import { POOL_FILTERS } from 'config/constants'
import { VaultsContext } from 'context/VaultsContext'
import SearchInput from 'components/Input/SearchInput'
import Notification from 'components/Notification'
import TablePairs from './components/tablePairs'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const sortOptions = [
  {
    label: 'Your Deposit',
    value: 'depositSymbol',
    isDesc: true,
  },
  {
    label: 'Vault',
    value: 'vaultSymbol',
    isDesc: true,
  },
  {
    label: 'APR',
    value: 'apr',
    isDesc: true,
  },
  {
    label: 'Total Staked',
    value: 'tvl',
    isDesc: true,
  },
  {
    label: 'My Stake',
    value: 'stake',
    isDesc: true,
  },
  {
    label: 'Earnings',
    value: 'earn',
    isDesc: true,
  },
]

const renderContent = () => {
  return (
    <div className='flex items-center space-x-2 py-2.5 z-10'>
      <img src='/images/whiteList/add-icon.svg' alt='' />
      <span>ADD LIQUIDITY</span>
    </div>
  )
}

const Vaults = () => {
  useAutoDocumentTitle('Vaults')
  const [isActiveShow, setIsActiveShow] = useState(true)
  const [mobileFilter, setMobileFilter] = useState(false)
  const [isStaked, setIsStaked] = useState(false)
  const [isInactive, setIsInactive] = useState(false)
  const [warning, setWarning] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [sort, setSort] = useState(sortOptions[0])
  const vaults = useContext(VaultsContext)

  const filteredVaults = useMemo(() => {
    let final
    if (isInactive) {
      final = vaults.filter((ele) => ele.gauge.apr.isZero())
    } else {
      final = vaults.filter((ele) => !ele.gauge.apr.isZero())
    }
    const res = final.filter((item) => {
      return (isStaked && !item.account.gaugeBalance.isZero()) || !isStaked
    })
    if (!searchText || searchText === '') {
      return res
    }
    return (
      res &&
      res.filter((item) => {
        const withSpace = item.symbol.replace('/', ' ')
        const withComma = item.symbol.replace('/', ',')
        return (
          item.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
          withSpace.toLowerCase().includes(searchText.toLowerCase()) ||
          withComma.toLowerCase().includes(searchText.toLowerCase())
        )
      })
    )
  }, [vaults, searchText, isStaked, isInactive])

  const sortedPools = useMemo(() => {
    return filteredVaults.sort((a, b) => {
      let res
      switch (sort.value) {
        case 'depositSymbol':
          res = (a.depositToken > b.depositToken ? 1 : -1) * (sort.isDesc ? 1 : -1)
          break
        case 'vaultSymbol':
          res = (a.symbol > b.symbol ? 1 : -1) * (sort.isDesc ? 1 : -1)
          break
        case 'tvl':
          res = a.gauge.tvl
            .minus(b.gauge.tvl)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'stake':
          res = a.account.stakedUsd
            .minus(b.account.stakedUsd)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break
        case 'earn':
          res = a.account.earnedUsd
            .minus(b.account.earnedUsd)
            .times(sort.isDesc ? -1 : 1)
            .toNumber()
          break

        default:
          break
      }
      return res
    })
  }, [filteredVaults, sort])

  const navigate = useNavigate()

  const handlePopup = () => {
    navigate('/add')
  }

  return (
    <div className='max-w-[1200px] px-5 sm:px-16 md:px-28 mdLg:px-40 lg:px-5 xl:px-0 pt-20 mx-auto'>
      <img
        src='/images/common/perps-desktop.png'
        className='hidden lg:block mx-auto my-5 cursor-pointer'
        alt=''
        onClick={() => {
          window.open('https://alpha.thena.fi', '_blank')
        }}
      />
      <img
        src='/images/common/perps-mobile.png'
        className='block lg:hidden mx-auto mb-5 cursor-pointer'
        alt=''
        onClick={() => {
          window.open('https://alpha.thena.fi', '_blank')
        }}
      />
      <div className='lg:flex items-end justify-between'>
        <div className='w-full'>
          <h1 className='text-[34px] md:text-[42px] font-semibold text-white  font-figtree'>Single Token Vaults</h1>
          <p className='text-[#b8b6cb] text-base md:text-lg leading-[22px] md:leading-6 mt-1'>
            Deposit single sided liquidity. Stake the LP tokens to earn fees.&nbsp;
            <a href='https://docs.ichi.org/home/yield-iq/algorithm-design' target='_blank' rel='noreferrer' className='text-green'>
              Learn More
            </a>
          </p>
        </div>
      </div>
      {warning && (
        <Notification isClose onClose={() => setWarning(false)}>
          ICHI vaults enable users to contribute a single token to a Liquidity Pool (LP). The primary goal of this strategy is to grow your initial deposit,
          maintaining its share within the range of [65% - 95%] to minimize exposure to the other token in the LP. Profit is achieved by strategically selling
          during upward market movements to augment the original deposit. Upon withdrawal, users may receive a portion of their funds as the other token in the
          LP.
        </Notification>
      )}
      <div className='flex flex-col-reverse space-y-2 lg:space-y-0 lg:flex-row justify-between mt-4'>
        <div className='mt-3 lg:mt-0 flex lg:items-center lg:space-x-5 relative'>
          <SearchInput setSearchText={setSearchText} searchText={searchText} placeholder='Search Vault or Token' />
          {/* for desktop */}
          <div className='w-full ml-3 hidden lg:flex items-center space-x-8'>
            <div className='flex items-center space-x-2'>
              <Toggle checked={isStaked} onChange={() => setIsStaked(!isStaked)} toggleId='isStaked' />
              <p className='text-lightGray text-sm xl:text-[17px] whitespace-nowrap'>Staked Only</p>
            </div>
            <div className='flex items-center space-x-2'>
              <Toggle checked={isInactive} onChange={() => setIsInactive(!isInactive)} toggleId='isInactive' />
              <p className='text-lightGray text-sm xl:text-[17px] whitespace-nowrap'>Inactive Vaults</p>
            </div>
          </div>
          {/* filter button for mobile */}
          <div className='lg:hidden'>
            <button
              onClick={() => {
                setMobileFilter(!mobileFilter)
              }}
              className='w-12 flex-shrink-0 h-[42px]'
            >
              <img alt='' className='w-12 h-[42px]' src='/images/common/filter.svg' />
            </button>
          </div>
          {mobileFilter && (
            <MobileFilterModal
              setMobileFilter={setMobileFilter}
              tabs={Object.values(POOL_FILTERS)}
              isStaked={isStaked}
              setIsStaked={setIsStaked}
              isInactive={isInactive}
              setIsInactive={setIsInactive}
              sort={sort}
              setSort={setSort}
              sortOptions={sortOptions}
            />
          )}
        </div>
        <TransparentButton content={renderContent()} className='h-[52px] px-3 lg:px-7' onClickHandler={handlePopup} isUpper />
      </div>
      <div className='flex items-center justify-between mt-[31px] pb-[11px] border-b border-[#757384]'>
        <div className='flex items-center space-x-1.5'>
          <span className='text-white text-[18px] lg:text-[22px] font-semibold font-figtree'>{isInactive ? 'INACTIVE' : 'ACTIVE'} VAULTS</span>
          {/* <img alt='' src='/images/swap/question-mark.png' /> */}
        </div>
        <div className='text-[#26FFFE] text-[15px] lg:text-[18px] font-medium cursor-pointer' onClick={() => setIsActiveShow(!isActiveShow)}>
          {isActiveShow ? 'Hide -' : 'Show +'}
        </div>
      </div>
      {isActiveShow && (
        <div className='mt-4'>
          <TablePairs pools={sortedPools} sort={sort} setSort={setSort} sortOptions={sortOptions} searchText={searchText} isStaked={isStaked} />
        </div>
      )}
    </div>
  )
}

export default Vaults

import React, { useContext, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { veTHEsContext } from 'context/veTHEsConetext'
import { formatNumber } from 'utils/formatNumber'
import usePrices from 'hooks/usePrices'
import { useClaimAll, useExpectedRewards, useGetVeRewards } from 'hooks/useRewards'
import StyledButton from 'components/Buttons/styledButton'
import TabFilter from 'components/TabFilter'
import DropDown from 'components/DropDown'
import { SIZES } from 'config/constants'
import CurrentTable from './currentTable'
import ExpectedTable from './expectedTable'
import useAutoDocumentTitle from '../../hooks/useAutoDocumentTitle'

const rewardsTypes = ['Current Epoch', 'Next Epoch']
const WalletOption = {
  label: 'Total Rewards (Wallet)',
}

const Index = () => {
  useAutoDocumentTitle('Rewards')
  const [veTHE, setVeTHE] = useState(WalletOption)
  const veTHEs = useContext(veTHEsContext)
  const veRewards = useGetVeRewards(veTHE)
  const expectedRewards = useExpectedRewards(veTHE)
  const prices = usePrices()
  const { onClaimAll, pending } = useClaimAll()
  const [filter, setFilter] = useState(rewardsTypes[0])

  const filteredVeTHEs = useMemo(() => {
    return !veTHE.id ? veTHEs.filter((ele) => ele.rebase_amount.gt(0)) : veTHE.rebase_amount.gt(0) ? [veTHE] : []
  }, [veTHEs, veTHE])

  const currentRewards = useMemo(() => {
    return [...veRewards, ...filteredVeTHEs]
  }, [filteredVeTHEs, veRewards])

  const totalUsd = useMemo(() => {
    let total = [...veRewards].reduce((sum, current) => {
      return sum.plus(current.totalUsd)
    }, new BigNumber(0))
    filteredVeTHEs.forEach((ele) => {
      total = total.plus(ele.rebase_amount.times(prices.THE))
    })
    return total
  }, [veTHE, veRewards, filteredVeTHEs, prices])

  const totalExpectedUsd = useMemo(() => {
    return expectedRewards.reduce((sum, current) => {
      return sum.plus(current.totalUsd)
    }, new BigNumber(0))
  }, [expectedRewards])

  const options = useMemo(() => {
    const arr = []
    arr.push(WalletOption)
    veTHEs.forEach((ele) => {
      arr.push({
        ...ele,
        label: `veYAKA #${ele.id}`,
      })
    })
    return arr
  }, [veTHEs])

  return (
    <div className='max-w-[1020px] px-[17px] sm:px-[54.4px] md:px-[95.2px] mdLg:px-[136px]  lg:px-[17px] xl:px-0 pt-[68px] mx-auto'>
      {/* <img
        src='/images/common/perps-desktop.png'
        className='hidden lg:block mx-auto my-5 cursor-pointer'
        alt=''
        onClick={() => {
          window.open('https://alpha.thena.fi', '_blank')
        }}
      /> */}
      {/* <img
        src='/images/common/perps-mobile.png'
        className='block lg:hidden mx-auto mb-5 cursor-pointer'
        alt=''
        onClick={() => {
          window.open('https://alpha.thena.fi', '_blank')
        }}
      /> */}
      <div>
        <h1 className='text-[28.9px] md:text-[35.7px] font-semibold text-white  font-figtree'>Rewards</h1>
        <p className='text-[#b8b6cb] text-[13.6px] md:text-[15.3px] leading-[18.7px] md:leading-[20.4px] mt-1'>
          Claim your bribes, fees and veYAKA rebase here.
        </p>
      </div>
      <div className='lg:flex items-center justify-between lg:space-x-[51px] mt-[13.6px] lg:mt-[19.55px]'>
        <div className='w-full lg:w-1/2'>
          <DropDown options={options} sort={veTHE} setSort={setVeTHE} />
        </div>
        <div className='w-full lg:w-1/2'>
          <div className='gradient-bg w-full lg:w-auto p-px rounded-[5px] mt-[10.2px] lg:mt-0'>
            <div className='solid-bg rounded-[5px] lg:flex items-center justify-between w-full h-auto lg:h-[64.6px] py-[11.9px] px-[10.2px] lg:px-[13.6px] xl:px-[17px]'>
              <div className='flex items-center justify-between md:justify-start space-x-1 xl:space-x-2'>
                <p className='text-[13.6px] lg:text-[13.6px] text-white font-figtree font-light'>Total Claimable Rewards:</p>
                <p className='text-[18.7px] lg:text-[18.7px] font-medium text-white'>
                  ${formatNumber(filter === rewardsTypes[0] ? totalUsd : totalExpectedUsd)}
                </p>
              </div>
              {filter === rewardsTypes[0] && (
                <StyledButton
                  disabled={totalUsd.isZero() || pending}
                  onClickHandler={() => {
                    onClaimAll(veRewards, filteredVeTHEs, veTHE)
                  }}
                  className='px-[17px] py-[6.8px] md:py-[7.65px] mt-[10.2px] lg:mt-0 w-full lg:w-auto'
                  content='CLAIM ALL'
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <TabFilter data={rewardsTypes} filter={filter} setFilter={setFilter} className='mt-[13.6px] lg:mt-[19.55px]' size={SIZES.LARGE} />
      {filter === rewardsTypes[0] ? <CurrentTable rewards={currentRewards} veTHE={veTHE} /> : <ExpectedTable rewards={expectedRewards} veTHE={veTHE} />}
    </div>
  )
}

export default Index

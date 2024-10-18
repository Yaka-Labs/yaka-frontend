import React, { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sticky from 'react-stickynode'
import moment from 'moment'
import { useWeb3React } from '@web3-react/core'
import TransparentButton from 'components/Buttons/transparentButton'
import SearchInput from 'components/Input/SearchInput'
import { formatNumber } from 'utils/formatNumber'
import { veTHEsContext } from 'context/veTHEsConetext'
import { useWalletModal } from 'state/settings/hooks'
import { useWithdraw } from 'hooks/useLock'
import { useTHEAsset } from 'hooks/useGeneral'
import NoFound from 'components/NoFound'
import usePrices from 'hooks/usePrices'
import ManageModal from './manageModal'
import CreateModal from './createModal'
import useAutoDocumentTitle from '../../hooks/useAutoDocumentTitle'
// import ReactTooltip from 'react-tooltip'

const Lock = () => {
  useAutoDocumentTitle('Lock')
  const [searchText, setSearchText] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isManageOpen, setIsManageOpen] = useState(false)
  const veTHEs = useContext(veTHEsContext)
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const { onWithdraw, pending } = useWithdraw()
  const prices = usePrices()
  const theAsset = useTHEAsset()
  const navigate = useNavigate()
  // const [arrow, setArrow] = useState(false)

  const renderButton = () => {
    if (account) {
      return (
        <div className='flex items-center space-x-3'>
          <img src='/images/common/lock.svg' alt='' />
          <span className='w-40'>CREATE LOCK</span>
        </div>
      )
    } else {
      return <span>CONNECT WALLET</span>
    }
  }

  const filteredData = useMemo(() => {
    return !searchText ? veTHEs : veTHEs.filter((item) => item.id.toString().includes(searchText))
  }, [searchText, veTHEs])

  const selectedItem = useMemo(() => {
    return selectedId ? veTHEs.find((item) => item.id === selectedId) : null
  }, [veTHEs, selectedId])

  return (
    <>
      <div className='max-w-[1020px] min-h-[382.5px] px-[17px] sm:px-[54.4px] md:px-[95.2px] mdLg:px-[34px] lg:px-[17px] xl:px-0 pt-[68px]  md:pt-[102px] mx-auto'>
        <div className='lg:flex justify-between items-center'>
          <div className='max-w-[452.2px] w-full'>
            <h1 className='text-[28.9px] md:text-[35.7px] font-semibold text-white  font-figtree'>Lock</h1>

            <p className='text-[#b8b6cb] text-base leading-[18.7px] md:leading-[20.4px] mt-1'>
              Lock YAKA into veYAKA to earn and govern. Vote with veYAKA to earn bribes and trading fees. veYAKA can be transferred, merged and split. You can
              hold multiple positions.&nbsp;
              <a href='https://yaka.gitbook.io/yaka-finance' target='_blank' rel='noreferrer' className='text-[#C2111F]'>
                Learn More
              </a>
            </p>
          </div>
          {/* <div className='mt-3 lg:mt-0 bg-white w-full lg:max-w-[220px]  bg-opacity-[0.05]  rounded-[3px] bg-clip-padding px-5 py-3.5 text-white'>
            <div className='w-full'>
              <p className='font-figtree text-sm leading-4 xl:text-base xl:leading-5'>veYAKA Total APR</p>
              <div
                onMouseEnter={() => {
                  setArrow(true)
                }}
                onMouseLeave={() => {
                  setArrow(false)
                }}
                data-tip
                data-for={`tip`}
                className='flex items-center space-x-1 cursor-pointer max-w-[68px]'
              >
                <span className='text-lg lg:text-2xl xl:text-[27px] leading-5 lg:leading-8'>99%</span>
                <img
                  className={`${arrow ? 'rotate-180' : 'rotate-0'} transition-all duration-300 ease-in-out`}
                  alt=''
                  src='/images/common/triangle.svg'
                />
                <ReactTooltip
                  className='max-w-[180px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body '
                  id={`tip`}
                  place='right'
                  effect='solid'
                >
                  <p> YAKA</p>
                </ReactTooltip>
              </div>
            </div>
          </div> */}
          <div className='mt-[10.2px] xl:mt-0 w-full flex-col-reverse flex lg:flex-row items-center lg:justify-end lg:space-y-0 lg:space-x-[10.2px]'>
            <SearchInput searchText={searchText} setSearchText={setSearchText} placeholder='Search veYAKA ID' onlyNumber />
            <TransparentButton
              content={renderButton()}
              className='h-[44.2px] px-[23.8px] mb-[10.2px] lg:mb-0 w-full lg:w-auto !rounded-[5.1px]  gradient-bg-purple bg-[#ff626e00]'
              onClickHandler={() => {
                if (account) {
                  setIsCreateOpen(true)
                } else {
                  openWalletModal()
                }
              }}
              isUpper
            />
          </div>
        </div>
        {filteredData && filteredData.length > 0 ? (
          <div className='w-full mt-[11.9px] lg:mt-[17px]'>
            <Sticky
              enabled
              innerActiveClass='gradientBorder'
              top={80.75}
              activeClass=''
              innerClass='px-[20.4px]  lg:flex justify-between hidden z-[5] py-[0.475rem] lg:!-mb-[16.15px] xl:!mb-0 lg:!top-[-16.15px] xl:!top-[0]'
              className='z-[5]'
            >
              <div className='w-[15%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree'>veYAKA ID</div>
              <div className='w-[17%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree'>Lock Value</div>
              <div className='w-[17%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree'>Locked Amount</div>
              <div className='w-[17%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree'>Lock Expire</div>
              <div className='w-[17%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree'>Votes Used</div>
              <div className='w-[17%] font-medium text-[14.45px] xl:text-[15.3px] text-white font-figtree' />
            </Sticky>
            <div className='flex flex-col'>
              {filteredData &&
                filteredData.map((item, index) => {
                  return (
                    <div key={`vethe-${index}`} className='gradient-bg p-px shadow-box space-y-[8.5px] lg:space-y-0 mt-[13.6px] first:mt-0 rounded-[3px]'>
                      <div className='px-[13.6px] py-[10.2px] lg:p-[20.4px] flex flex-col lg:flex-row justify-between items-center rounded-[3px] bg-gradient-to-r'>
                        <div className='w-full lg:w-[15%] mt-[10.2px] lg:mt-0 text-lightGray font-figtree'>
                          <div className='lg:hidden text-[11.05px] font-semibold'>veYAKA ID</div>
                          <div className='text-[15.3px] lg:text-[17px] font-medium'>{item.id}</div>
                        </div>
                        <div className='w-full lg:w-[34%] flex mt-[10.2px] lg:mt-0 text-lightGray'>
                          <div className='w-1/2'>
                            <div className='lg:hidden text-[11.05px] font-figtree font-semibold'>Lock Value</div>
                            <div className='text-13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>{formatNumber(item.voting_amount)} veYAKA</div>
                            <div className='text-[12.75px] text-secondary'>${formatNumber(item.voting_amount.times(prices.THE))}</div>
                          </div>
                          <div className='w-1/2'>
                            <div className='lg:hidden text-[11.05px] font-figtree font-semibold'>Locked Amount</div>
                            <div className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px]'>{formatNumber(item.amount)} YAKA</div>
                            <div className='text-[12.75px] text-secondary'>${formatNumber(item.amount.times(prices.THE))}</div>
                          </div>
                        </div>
                        <div className='w-full lg:w-[34%] flex lg:items-center mt-[10.2px] lg:mt-0 text-lightGray'>
                          <div className='w-1/2'>
                            <div className='lg:hidden text-[11.05px] font-figtree font-semibold'>Lock Expire</div>
                            <div className='text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px] text-lightGray'>
                              {moment.unix(item.lockEnd).format('MMM DD, YYYY')}
                            </div>
                            <div className='text-[12.75px] text-secondary'>{item.diffDates}</div>
                          </div>
                          <div className='w-1/2 text-lightGray'>
                            <div className='lg:hidden text-[11.05px] font-figtree font-semibold'>Votes Used</div>
                            <div
                              className={`text-[13.6px] sm:text-[14.45px] lg:text-[12.75px] xl:text-[14.45px] font-figtree font-semibold ${
                                item.votedCurrentEpoch ? 'text-success' : 'text-error'
                              }`}
                            >
                              {item.votedCurrentEpoch ? 'Yes' : 'No'}
                            </div>
                          </div>
                        </div>
                        <div className='w-full lg:w-[17%] flex lg:justify-end space-x-[12.325px] mt-[10.2px] mb-[6.8px] lg:mb-0 lg:mt-0'>
                          {item.voting_amount.isZero() ? (
                            <div
                              className='text-base text-green cursor-pointer'
                              onClick={() => {
                                if (!pending) {
                                  onWithdraw(item)
                                }
                              }}
                            >
                              Withdraw
                            </div>
                          ) : (
                            <>
                              <TransparentButton
                                onClickHandler={() => {
                                  navigate(`/vote/${item.id}`)
                                }}
                                content='Vote'
                                className='h-[34px] px-[13.6px] lg:w-auto w-full'
                              />
                              <TransparentButton
                                onClickHandler={() => {
                                  setSelectedId(item.id)
                                  setIsManageOpen(true)
                                }}
                                content='Manage'
                                className='h-[34px] px-[13.6px] lg:w-auto w-full'
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        ) : (
          <div className='w-full mt-[11.9px] lg:mt-[17px]'>
            <NoFound title={account ? 'No positions found' : 'Please connect your wallet'} />
          </div>
        )}
      </div>
      {isCreateOpen && <CreateModal isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} theAsset={theAsset} />}
      {isManageOpen && <ManageModal isOpen={isManageOpen} setIsOpen={setIsManageOpen} selected={selectedItem} theAsset={theAsset} />}
    </>
  )
}

export default Lock

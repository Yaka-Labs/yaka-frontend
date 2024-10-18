import React, { useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import {CHAIN_LIST, DEFAULT_CHAIN_ID, SupportedChainIds} from 'config/constants'
import { ChainId } from 'thena-sdk-core'
import { useNetwork } from 'state/settings/hooks'
import './style.scss'
import { addRPC } from 'utils/addRPC'
// import { addRPC } from 'utils/addRPC'

const NetworkSwitch = ({ setOpen = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { networkId, switchNetwork } = useNetwork()
  const { chainId, account } = useWeb3React()

  const chainInfo = useMemo(() => {
    return CHAIN_LIST[networkId || ChainId.BSC || DEFAULT_CHAIN_ID]
  }, [networkId])

  useEffect(() => {
    console.log('chainId,networkId', chainId, networkId)
    if (account && chainId !== networkId && SupportedChainIds.includes(chainId)) {
      switchNetwork(chainId)
    }
  }, [account, chainId, networkId])

  return (
    <div>
      <div
        className='py-2'
        onMouseEnter={() => {
          setIsOpen(true)
        }}
        onMouseLeave={() => {
          setIsOpen(false)
        }}
      >
        <div className='h-11 px-3 flex items-center space-x-1 cursor-pointer bg-[#FFFFFF1C] bg-opacity-[0.45] rounded-[8px]'>
          <img src={chainInfo?.img} alt='' width={22} height={22} />
          <span className='text-[17px]'>{chainInfo?.title}</span>
          <img alt='dropdown' src='/images/header/dropdown-arrow.svg' className={`${isOpen ? 'rotate-0' : 'rotate-180'} transition-all duration-150`} />
        </div>
      </div>
      <div
        className='relative'
        onMouseEnter={() => {
          setIsOpen(true)
        }}
        onMouseLeave={() => {
          setIsOpen(false)
        }}
      >
        <div
          className={`flex flex-col space-y-2 py-3 px-[22px] min-w-[150px] w-max absolute z-40 border border-[#C81F39] bg-[#360E12] rounded-[3px] ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          {Object.values(CHAIN_LIST).map((_item) => {
            return (
              <div
                key={_item.chainId}
                className='flex items-center space-x-1.5 cursor-pointer hover:text-red'
                onClick={() => {
                  if (account) {
                    addRPC(_item.chainId)
                  } else {
                    switchNetwork(_item.chainId)
                  }
                  setIsOpen(false)
                  setOpen(false)
                }}
              >
                <img src={_item.img} alt='' style={{ width: '24px' }} />
                <span className='text-[17px]'>{_item.title}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NetworkSwitch

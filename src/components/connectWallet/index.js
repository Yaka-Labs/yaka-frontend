import React, { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import useAuth from 'hooks/useAuth'
import { CONNECTORS } from 'config/constants'
import { useNetwork, useWalletModal } from 'state/settings/hooks'
import { saveUserWalletType } from 'utils/dexOpApi'

const Index = ({ setConnector, setSelected }) => {
  const { login } = useAuth()
  const [activeConnector, setActiveConnector] = useState(null)
  const { closeWalletModal } = useWalletModal()
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  useEffect(() => {
    if (account && activeConnector) {
      closeWalletModal()
      setConnector(activeConnector)
      console.log('登录成功', account, activeConnector)
      saveUserWalletType(account, activeConnector['connector'])
    }
  }, [account, activeConnector])

  const onConnect = useCallback(
    (type) => {
      login(type, networkId)
    },
    [login, networkId],
  )

  return (
    <>
      <div className='bg-body bg-opacity-[0.5] fixed z-[50] inset-0 w-full h-full' />
      <div className='pt-[12.75px] pb-[17px] px-3 lg:px-[17px] max-w-[90%] lg:max-w-[462.4px] fixed w-full h-fit bg-body border inset-0 mx-auto top-[32.5px] lg:m-auto z-[51] border-[#B51B27] rounded-[6.8px] tool-tip'>
        <div className='flex items-center justify-between'>
          <p className='text-lg lg:text-[18.7px] text-white leading-[34px] font-medium font-figtree'>Connect Your Wallet</p>
          <button onClick={() => closeWalletModal()}>
            <img alt='' src='/images/common/close-button2.svg' />
          </button>
        </div>
        <div className='mt-[15px] lg:mt-[19.55px] grid lg:grid-cols-2 gap-2.5 lg:gap-3'>
          {CONNECTORS.map((item, idx) => {
            return (
              <div
                onClick={() => {
                  setSelected(true)
                  onConnect(item.connector)
                  setActiveConnector(item)
                }}
                key={idx}
                className='group h-[60px] lg:h-[64.6px] rounded-[6.8px] flex cursor-pointer items-center px-2.5 lg:pl-[25.5px] border1-[#091491] hover:border1-[#0000FF] border1 transition-all duration-300 ease-in-out  tool-tip-block'
              >
                <img
                  className='group-hover:shadow-[#0000FF] drop--xl w-10 h-10 lg:w-11 lg:h-11 transition-all duration-300 ease-in-out'
                  alt={idx}
                  src={item.logo}
                />
                <p className='ml-[10.2px] text-white font-figtree text-[15px] lg:text-[15px] font-semibold leading-none'>{item.title}</p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Index

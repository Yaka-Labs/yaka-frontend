import React from 'react'
import StyledButton from 'components/Buttons/styledButton'
import { ChainId } from 'thena-sdk-core'
import { useNetwork } from 'state/settings/hooks'
import { useWeb3React } from '@web3-react/core'
import { addRPC } from 'utils/addRPC'
import {DEFAULT_CHAIN_ID} from "../../config/constants";

const SwitchModal = ({ isOpen, setIsOpen }) => {
  const { networkId, switchNetwork } = useNetwork()
  const { account } = useWeb3React()
  return (
    <>
      <div
        onClick={() => {
          setIsOpen(false)
        }}
        className={`fixed ${
          isOpen ? 'visible z-[150] opacity-100' : 'z-0 invisible opacity-0'
        } inset-0 w-full h-full transition-all duration-300 ease-in-out bg-opacity-[0.7] bg-body`}
      />

      <div
        className={`${
          isOpen ? 'z-[151] visible opacity-100' : 'z-0 invisible opacity-0'
        } w-full inset-0 fixed transition-all duration-300 ease-in-out flex items-center min-h-screen justify-center flex-col paraent`}
      >
        <div className='max-w-[92%] sm:min-w-[425px] sm:max-w-[425px] md:min-w-[499.8px] md:max-w-[499.8px] mx-auto w-full rounded-[5px] gradient-bg p-px'>
          <div className='popup-gradientbg px-[10.2px] py-[10.2px] rounded-[5px] md:px-6 md:py-5'>
            <p className='text-center text-white text-[18.7px] lg:text-[22.95px] font-semibold font-figtree'>Check your network</p>
            <div className='mt-[10.2px] text-center text-lightGray text-[12.75px] md:text-[15.3px] font-medium'>
              <p>Please switch your network to {networkId === ChainId.BSC ? 'BNB Chain' : networkId === 1328? 'Sei Arctic-1' : 'Sei Mainnet'}</p>
            </div>
            <StyledButton
              onClickHandler={() => {
                if (account) {
                  addRPC(networkId)
                } else {
                  switchNetwork(networkId)
                }
                setIsOpen(false)
              }}
              content='Switch network in wallet'
              className='py-[11.05px] w-full px-[29.55px] mt-[17px]'
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default SwitchModal

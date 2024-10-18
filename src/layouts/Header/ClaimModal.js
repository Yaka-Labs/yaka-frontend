import React, { useCallback, useState } from 'react'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'
import { getYakaFaucetContract } from '../../utils/contractHelpers'
import useWeb3 from '../../hooks/useWeb3'
import { customNotify } from '../../utils/notify'
import { useWeb3React } from '@web3-react/core'
import { useWalletModal } from '../../state/settings/hooks'
import { extractJsonObject } from '../../utils/formatNumber'

const ClaimModal = ({ isOpen, setIsOpen }) => {
  const [pending, setPending] = useState(false)
  const web3 = useWeb3()
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()

  const handleClaim = useCallback(async () => {
    setPending(true)
    try {
      const contract = getYakaFaucetContract(web3)
      contract.methods['claim']()
        .estimateGas({
          from: account,
        })
        .then((res) => {
          contract.methods['claim']()
            .send({
              from: account,
              value: '0',
            })
            .on('transactionHash', (tx) => {})
            .then((res) => {
              setIsOpen(false)
              setPending(false)
              customNotify('Transaction Successful!', 'success')
            })
            .catch((err) => {
              setIsOpen(false)
              setPending(false)
              customNotify(err.message, 'error')
            })
        })
        .catch((err) => {
          const data = extractJsonObject(err.message)
          if (data) {
            customNotify(data.message, 'error')
          } else {
            customNotify(err.message, 'error')
          }
          setPending(false)
        })
    } catch (e) {
      console.log(e)
      setPending(false)
    }
  }, [account])

  return (
    <>
      <div
        onClick={() => {
          setIsOpen(false)
        }}
        className={`fixed ${
          isOpen ? 'visible z-[150] opacity-100' : 'z-0 invisible opacity-0'
        } inset-0 w-full h-full transition-all duration-300 ease-in-out bg-opacity-[0.5] bg-body`}
      />

      <div
        className={`${
          isOpen ? 'z-[151] visible opacity-100' : 'z-0 invisible opacity-0'
        } w-full inset-0 fixed transition-all duration-300 ease-in-out flex items-center min-h-screen justify-center flex-col paraent`}
      >
        <div className='max-w-[92%] sm:min-w-[500px] sm:max-w-[500px] md:min-w-[588px] md:max-w-[588px] mx-auto w-full rounded-[5px] gradient-bg p-px'>
          <div className='px-3 py-3 rounded-[5px] md:px-6 md:py-5 bg-[#360E12]'>
            <div className='text-center text-white text-[22px] lg:text-[27px] font-semibold font-figtree'>Click Claim Button To Get 1 YAKA</div>

            <div className='flex items-center mt-5 w-full space-x-[18px]'>
              {account ? (
                <StyledButton
                  onClickHandler={() => {
                    handleClaim()
                  }}
                  content='Claim'
                  pending={pending}
                  className='py-[13px] w-1/2 px-[23px]'
                />
              ) : (
                <StyledButton
                  onClickHandler={() => {
                    setIsOpen(false)
                    openWalletModal()
                  }}
                  content='CONNECT WALLET'
                  className='py-[13px] text-white mt-2 md:mt-3 w-full'
                />
              )}

              <TransparentButton onClickHandler={() => setIsOpen(false)} content='CANCEL' className='py-[13px] px-[26px] w-1/2' isUpper />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ClaimModal

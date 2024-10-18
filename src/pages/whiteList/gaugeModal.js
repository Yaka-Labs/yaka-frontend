import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import StyledButton from 'components/Buttons/styledButton'
import PoolSelect from 'components/PoolSelect'
import SubPage from 'components/SubPage'
import { useV3Voter } from 'hooks/useContract'
import { useWalletModal } from 'state/settings/hooks'
import { useAddGauge } from 'hooks/useWhitelist'
import { ZERO_ADDRESS } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import { usePools } from 'state/pools/hooks'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const GaugeModal = () => {
  useAutoDocumentTitle('AddGauge')
  const [pool, setPool] = useState(null)
  const { account } = useWeb3React()
  const fusions = usePools()
  const fusionsWithGauges = useMemo(() => {
    return fusions.filter((pair) => pair && pair.gauge.address === ZERO_ADDRESS && pair.isValid)
  }, [fusions])
  const { onAddGauge, pending } = useAddGauge()
  const { openWalletModal } = useWalletModal()
  const voterContract = useV3Voter()
  const { final } = useSelector((state) => state.transactions)

  const errorMsg = useMemo(() => {
    if (!pool) {
      return 'CHOOSE POOL'
    }
    return null
  }, [pool])

  useEffect(() => {
    if (final) {
      setPool(null)
    }
  }, [final])

  return (
    <SubPage title='Add Gauge'>
      <div className='w-full pt-3 md:pt-[17px]'>
        {!account ? (
          <StyledButton onClickHandler={openWalletModal} content='CONNECT WALLET' className='py-[11.05px] mt-[13.6px] w-full' />
        ) : (
          <>
            <div className='flex flex-col w-full items-center justify-center mt-3 md:mt-[17px]'>
              <div className='w-full'>
                <p className='text-secondary texts-[13px] md:text-[13.6px]'>Choose Pool</p>
                <PoolSelect pool={pool} setPool={setPool} pools={fusionsWithGauges} />
              </div>
            </div>
            <StyledButton
              disabled={errorMsg || pending}
              pending={pending}
              onClickHandler={async () => {
                console.log('pool.token0.address', pool.token0.address)
                console.log('pool.token1.address', pool.token1.address)
                // const res = await Promise.all([
                //   voterContract.methods.isWhitelisted(pool.token0.address).call(),
                //   voterContract.methods.isWhitelisted(pool.token1.address).call(),
                // ])
                onAddGauge(pool)

                // if (res[0] && res[1]) {
                //   onAddGauge(pool)
                // } else {
                //   customNotify('Tokens are not whitelisted', 'warn')
                // }
              }}
              content={errorMsg || 'CONFIRM'}
              className='w-full h-[35.7px] sm:h-[40.8px] mdLg:h-[51px] mt-[15.3px] px-[19.55px]'
            />
          </>
        )}
      </div>
    </SubPage>
    // </CommonHollowModal>
  )
}

export default GaugeModal

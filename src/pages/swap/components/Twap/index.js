import { Orders as ThenaOrders, TWAP as ThenaTWAP } from '@orbs-network/twap-ui-thena'
import { useWeb3React } from '@web3-react/core'
import { useWalletModal } from 'state/settings/hooks'
import SearchTokenPopup from 'components/SearchTokenPopup'
import { useAssets } from 'state/assets/hooks'

const Twap = () => {
  const { account, library } = useWeb3React()
  const assets = useAssets()
  const { openWalletModal } = useWalletModal()

  return (
    <div className='w-full max-w-[588px] mx-auto relative mt-[25px] pb-28 xl:pb-0 2xl:pb-[150px]'>
      <div className='gradient-bg shadow-[0_0_50px_#48003d] p-px relative z-[10] rounded-[5px]'>
        <div className='solid-bg rounded-[5px] px-3 md:px-6 py-3 md:py-4'>
          <div className='flex items-center justify-between'>
            <p className='font-figtree text-[23px] md:text-[27px] leading-10 text-white font-semibold'>Twap</p>
          </div>
          <div className='mt-3 md:mt-[26px]'>
            <ThenaTWAP
              connect={() => openWalletModal()}
              account={account}
              TokenSelectModal={SearchTokenPopup}
              provider={library}
              dappTokens={assets}
              isDarkTheme
              srcToken='BNB'
              dstToken='0xf4c8e32eadec4bfe97e0f595add0f4450a863a11'
              limit={false}
            />
          </div>
        </div>
      </div>
      <div className='gradient-bg mt-5 shadow-[0_0_50px_#48003d] p-px relative rounded-[5px]'>
        <div className='solid-bg rounded-[5px] px-3 md:px-6 py-3 md:py-4'>
          <ThenaOrders />
        </div>
      </div>
    </div>
  )
}

export default Twap

import React from 'react'
import { SquidWidget } from '@0xsquid/widget'

const Cross = () => {
  return (
    <div className='mx-auto relative mt-[25px] pb-28 xl:pb-0 2xl:pb-[150px]'>
      <SquidWidget
        config={{
          style: {
            neutralContent: '#B8B6CB',
            baseContent: '#FFFFFF',
            base100: '#090333',
            base200: '#210e43',
            base300: '#101645',
            error: '#CF3A41',
            warning: '#EDB831',
            success: '#51B961',
            primary: '#CC00C2',
            secondary: '#0000AF',
            secondaryContent: '#FFFFFF',
            neutral: '#1A023D',
            roundedBtn: '99px',
            roundedBox: '7px',
            roundedDropDown: '5px',
            displayDivider: false,
            advanced: {
              transparentWidget: false,
            },
          },
          integratorId: 'thena-swap-widget',
          companyName: 'THENA',
          slippage: 1.5,
          infiniteApproval: false,
          instantExec: false,
          apiUrl: 'https://api.0xsquid.com',
          priceImpactWarnings: {
            warning: 3,
            critical: 5,
          },
          initialFromChainId: 1,
          initialToChainId: 56,
          preferDex: ['Thena_v3', 'Thena'],

          // Mark fantom as not coming soon
          comingSoonChainIds: [
            // Mainnet
            'cosmoshub-4',
            'crescent-1',
            'injective-1',
            'juno-1',
            'kaiyo-1',
            'osmosis-1',
            'secret-4',
            'phoenix-1',
            'agoric-3',
            'mantle-1',
            'axelar-dojo-1',
            'comdex-1',
            'evmos_9001-2',
            'fetchhub-4',
            'kichain-2',
            'regen-1',
            'umee-1',
          ],
        }}
      />
    </div>
  )
}

export default Cross

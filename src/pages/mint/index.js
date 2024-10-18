import React from 'react'
import Hero from './newHero'
import Mint from './nft'
import DetailMint from './detailMint'
import useAutoDocumentTitle from "../../hooks/useAutoDocumentTitle";

const Index = () => {
  useAutoDocumentTitle('Mint')
  return (
    <>
      <Hero />
      <div className='w-full mt-[88px] pb-[100px] md:pb-0 md:mt-[159px]'>
        <Mint reverse src='/images/mint/coins.png' title='Earn Trading Fees'>
          theNFT stakers share a portion of THENA’s trading fees, claimable on a weekly basis.
        </Mint>
        <Mint reverse={false} src='/images/mint/statue.png' title='Earn Royalties'>
          theNFT stakers share the 1% royalty from secondary sales{' '}
          <a rel='noreferrer' href='https://element.market/collections/thenian' className='text-lg text-[#26FFFE]' target='_blank'>
            Element
          </a>{' '}
          and other marketplaces.
        </Mint>
        <DetailMint />
      </div>
    </>
  )
}

export default Index

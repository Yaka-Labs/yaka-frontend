import React, { useMemo, useState } from 'react'
import Toggle from 'components/Toggle'
import NFTCard from '../tabsCommon/nftsCard'

const Index = ({ nftsData }) => {
  const [sale, setSale] = useState(false)
  const filteredData = useMemo(() => {
    return sale ? nftsData.filter((item) => item.price) : nftsData
  }, [nftsData, sale])
  return (
    <div className='bg-cardBg px-5 py-6 rounded-[5px] mt-5'>
      <p className='text-[22px] leading-7 font-figtree font-semibold text-white'>
        theNFTs <span className='!font-normal'>(5)</span>
      </p>
      <div className='flex items-center space-x-2 mt-4'>
        <Toggle toggleId='hidePassword' checked={sale} onChange={() => setSale(!sale)} />
        <p className='text-lightGray text-sm xl:text-[17px] whitespace-nowrap'>For Sale Only</p>
      </div>
      <div className='mt-5 grid grid-cols-3 gap-5'>
        {filteredData.map((item, idx) => {
          return <NFTCard key={idx} item={item} />
        })}
      </div>
    </div>
  )
}

export default Index

import React from 'react'
import TransparentButton from 'components/Buttons/transparentButton'
import './style.scss'

const Index = ({ data }) => {
  return (
    <div className='w-full mt-4'>
      <div className='w-full flex items-center justify-center relative py-5'>
        <img alt='' src='/images/core/nft-bg-image.png' className='absolute object-cover object-center inset-0 w-full h-full' />
        <img alt='' src={data.nftImage} className='relative border border-[#0000AF] rounded-[3px] shadow-[0px_0px_40px_#0000A8]' />
      </div>
      <div className='flex items-center justify-between px-5 mt-3.5'>
        <div>
          <p className='text-[22px] text-white leading-[27px] font-figtree font-medium'>{data.title}</p>
          <p dangerouslySetInnerHTML={{ __html: data.info }} className='text-lightGray mt-2 mb-4 text-sm leading-5  ' id='paragraph-info' />
        </div>
        <TransparentButton onClickHandler={() => {}} content='View' className='w-[112px] px-4 py-[9px] bg-[#bd00ed1a]' />
      </div>
    </div>
  )
}

export default Index

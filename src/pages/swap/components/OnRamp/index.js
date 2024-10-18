import React from 'react'

const OnRamp = () => {
  const key = process.env.REACT_APP_ONRAMP_KEY
  return (
    <div className='mx-auto relative mt-[25px] pb-28 xl:pb-0 2xl:pb-[150px]'>
      <iframe
        src={`https://buy.onramper.com/?apiKey=${key}&defaultCrypto=bnb_bsc&themeName=dark&containerColor=160339
        &primaryColor=d100ce&secondaryColor=0a0533&cardColor=1f0f41&primaryTextColor=ffffff&secondaryTextColor=b8b6cb&borderRadius=0.2`}
        className='w-[375px] lg:w-[420px] h-[630px] m-auto rounded-[0.32rem] border border-[#cc00c2]'
        title='Onramper Widget'
        allow='accelerometer; autoplay; camera; gyroscope; payment'
      />
    </div>
  )
}

export default OnRamp

import React from 'react'

const isLotteryDisabled = true

const Lottery = () => {
  return (
    <div className='lg:ml-6 w-full mt-3 lg:mt-0'>
      <div className={`${isLotteryDisabled ? 'mt-0' : 'mt-10 lg:mt-[50px]'}`}>
        <h3 className='font-figtree text-[27px] leading-6  md:text-4xl font-medium gradient-text'>Lottery</h3>
        {/* <p className='text-[#B8B6CB] leading-[22px] lg:leading-6 mt-2 lg:mt-1'>
          The 8 winners of the weekly draw are chosen randomly. The more tickets you have earned, the higher your chances are!
        </p> */}
      </div>

      <div className='mt-5 w-full'>
        <div className='gradient-bg p-px shadow-[0_0_50px_#48003d] rounded-[3px] w-full mt-3 lg:mt-3.5'>
          <div className='solid-bg relative px-3 py-4 lg:p-6 rounded-[3px] h-full md:flex-row flex flex-col items-end  justify-center md:justify-between'>
            <div className='w-full md:max-w-[320px] lg:max-w-[480px] xl:max-w-[550px]'>
              <div className='w-full pb-3.5 border-bottom-gradient flex flex-col lg:flex-row justify-between'>
                <div>
                  <p className='text-sm lg:text-lg font-figtree text-white leading-[17px] lg:leading-[22px]'>Last Week Result:</p>
                  <p className='text-[23px] lg:text-[27px] text-[#E9E9F2] leading-7 lg:leading-8 lg:mt-1'>-</p>
                </div>
              </div>
              <div className='w-full mt-5 md:min-h-[167px]'>
                <p className='text-sm lg:text-lg font-figtree text-white leading-[17px] lg:leading-[22px]'>Last Week Winners:</p>
                <p className='text-[23px] lg:text-[27px] text-[#E9E9F2] leading-7 lg:leading-8 lg:mt-1 '>-</p>
              </div>
            </div>
            <img
              className='md:absolute  md:w-1/3 lg:w-1/4 xl:w-auto right-0 bottom-0 -mb-4 md:mb-0 -mr-3 md:mr-0'
              alt='lottery'
              src='/images/referral/illustration.png'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lottery

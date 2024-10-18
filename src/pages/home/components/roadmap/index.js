import React from 'react'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import './style.scss'

const cardFirst = [
  'Concentrated Liquidity',
  'Cross-chain Swaps',
  'Perpetuals Internal Testing',
  'LIMIT and TWAP Orders',
  'WARP Launchpad Accelerator',
  'OpenZeppelin Audit',
  '$THE Lending & Borrowing',
]
const cardSecond = [
  'Expert Trading Mode',
  'Perpetuals DEX',
  'THENA Debit Card',
  'Fiat on/off-ramp',
  'CORE Social Hub',
  'THENA Bank Account',
  'THENA Labs R&D Unit',
]
const cardThird = ['Tier 1 CEX Listing(s)', 'Top 1 DEX on BNB Chain', 'One Million Users']

const Line = styled.div`
  div {
    -webkit-animation: heightMove 1s;
    -moz-animation: heightMove 1s;
    -o-animation: heightMove 1s;
    animation: heightMove 1s;
    animation-fill-mode: forwards;
    background: #ec00c9;
    width: 0;
    animation-delay: 0.5s;
    @keyframes heightMove {
      100% {
        width: 100%;
      }
    }
    @media (min-width: 1024px) {
      width: auto;
      height: 0;
      @keyframes heightMove {
        100% {
          height: 100%;
        }
      }
    }
  }
`
const Line2 = styled.div`
  div {
    -webkit-animation: heightMove2 2s;
    -moz-animation: heightMove2 2s;
    -o-animation: heightMove2 2s;
    animation: heightMove2 2s;
    animation-fill-mode: forwards;
    background: #ec00c9;
    width: 0;
    animation-delay: 3s;
    @keyframes heightMove2 {
      100% {
        width: 100%;
      }
    }
    @media (min-width: 1024px) {
      width: auto;
      height: 0;
      @keyframes heightMove2 {
        100% {
          height: 100%;
        }
      }
    }
  }
`
const Line3 = styled.div`
  div {
    -webkit-animation: heightMove3 2s;
    -moz-animation: heightMove3 2s;
    -o-animation: heightMove3 2s;
    animation: heightMove3 2s;
    animation-fill-mode: forwards;
    background: #ec00c9;
    width: 0;
    animation-delay: 7s;
  }
`
const MainLine = styled.div`
  .insideLine {
    -webkit-animation: increase 3s;
    box-shadow: 0px 0px 10px #ec00c9;
    -moz-animation: increase 3s;
    -o-animation: increase 3s;
    animation: increase 3s;
    animation-fill-mode: forwards;
    background: #ec00c9;
    height: 0%;
    @keyframes increase {
      0% {
        height: 0%;
      }
      100% {
        height: 41.6%;
      }
    }
    @media (min-width: 1024px) {
      height: auto;
      width: 0%;
      @keyframes increase {
        0% {
          width: 0%;
        }
        100% {
          width: 50%;
        }
      }
    }
  }
`

const RoadMap = () => {
  const { ref, inView } = useInView({
    threshold: 0,
  })

  return (
    <div ref={ref} className='roadmap-section relative pb-[113px] 3xl:pb-[233px] bg-body  z-20'>
      {inView && (
        <>
          <img alt='' src='/images/home/roadmap-bg.png' className='w-full h-full xl:h-auto bg-index desktop-1 absolute bottom-0' />
          <div className='roadmap-wrapper mx-auto container-main z-40 relative'>
            <div className='flex w-full md:justify-center'>
              <div className='heading-section gradient-text font-figtree lg:text-center'>Roadmap</div>
            </div>
            <div className='flex md:justify-center lg:justify-start lg:flex-col  mt-9 md:mt-[102px] relative'>
              <MainLine className='relative lg:absolute w-1 lg:w-full flex lg:h-1 lg:mt-[60px] bg-opacity-[0.18] bg-[#ffe3fb]'>
                <div className='insideLine w-full lg:h-full' />
              </MainLine>
              <img className='absolute lg:block hidden -mt-[50px] lg:-ml-[112px] xl:-ml-[110px] mover-pointer' src='/images/home/light.svg' alt='' />
              <img
                className='absolute lg:hidden -mt-[68px] -ml-[68px] mdLg:left-[213px] md:left-[117px] md:ml-0 mover-pointer'
                src='/images/home/light1.svg'
                alt=''
              />
              <div className='lg:flex items-start justify-between lg:gap-[42px] ml-8 lg:ml-0'>
                <div className='flex flex-col lg:items-center lg:justify-center lg:w-1/3'>
                  <p className='leading-8 card-heading text-[23px] lg:text-[27px] font-figtree text-left  lg:text-center'>Q2 2023</p>
                  <div className='flex lg:items-center lg:flex-col justify-center mt-2 lg:mt-8 w-full'>
                    <Line className='lg:h-[45px] w-[25px] h-0.5 lg:w-0.5  bg-opacity-[0.18] bg-[#ffe3fb] -ml-8 lg:ml-0 -mt-6 lg:mt-auto mr-2 lg:mr-0'>
                      <div className='vertical-line w-full h-full lg:w-0.5' />
                    </Line>
                    <div className='card-layout p-px w-full'>
                      <div className='card-inner px-4 lg:px-6 py-3 lg:py-4 text-[#E5E7EB]'>
                        {cardFirst.map((item, idx) => {
                          return (
                            <div className={`flex items-center lg:items-start space-x-[11.35px] ${idx !== cardFirst.length - 1 ? 'mb-2' : ''}`} key={idx}>
                              {idx < 10 ? (
                                <div className='mt-1 lg:mt-2'>
                                  <img alt='' src='/images/home/checkmark.svg' />
                                </div>
                              ) : (
                                <div className='lg:mt-px text-[#E5E7EB]'>‣</div>
                              )}
                              <p className='text-[15px] lg:text-lg'>{item}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-[38px] lg:mt-0 flex flex-col lg:items-center lg:justify-center lg:w-1/3'>
                  <p className='leading-8 card-heading text-[23px] lg:text-[27px] font-figtree text-left  lg:text-center'>Q3/Q4 2023</p>
                  <div className='flex lg:items-center lg:flex-col justify-center mt-2 lg:mt-8 w-full'>
                    <Line2 className='lg:h-[45px] w-[25px] h-0.5 lg:w-0.5  bg-opacity-[0.18] bg-[#ffe3fb] -ml-8 lg:ml-0 -mt-6 lg:mt-auto mr-2 lg:mr-0'>
                      <div className='vertical-line w-full h-full lg:w-0.5' />
                    </Line2>
                    <div className='card-layout p-px w-full'>
                      <div className='card-inner px-4 lg:px-6 py-3 lg:py-4 text-[#E5E7EB]'>
                        {cardSecond.map((item, idx) => {
                          return (
                            <div className={`flex items-center lg:items-start space-x-[11.35px] ${idx !== cardSecond.length - 1 ? 'mb-2' : ''}`} key={idx}>
                              <div className='lg:mt-px text-[#E5E7EB]'>‣</div>
                              <p className='text-[15px] lg:text-lg'>{item}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-[38px] lg:mt-0 flex flex-col lg:items-center lg:justify-center lg:w-1/3'>
                  <p className='leading-8 card-heading text-[23px] lg:text-[27px] font-figtree text-left  lg:text-center'>Future Beyond</p>
                  <div className='flex lg:items-center lg:flex-col justify-center mt-2 lg:mt-8 w-full'>
                    <Line3 className='lg:h-[45px] w-[25px] h-0.5 lg:w-0.5  bg-opacity-[0.18] bg-[#ffe3fb] -ml-8 lg:ml-0 -mt-6 lg:mt-auto mr-2 lg:mr-0'>
                      <div className='vertical-line w-full h-full lg:w-0.5' />
                    </Line3>
                    <div className='card-layout p-px w-full'>
                      <div className='card-inner px-4 lg:px-6 py-3 lg:py-4 text-[#E5E7EB]'>
                        {cardThird.map((item, idx) => {
                          return (
                            <div className={`flex items-center lg:items-start space-x-[11.35px] ${idx !== cardThird.length - 1 ? 'mb-2' : ''}`} key={idx}>
                              <div className='lg:mt-px text-[#E5E7EB]'>‣</div>
                              <p className='text-[15px] lg:text-lg'>{item}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RoadMap

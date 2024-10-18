import React from 'react'
import styled from 'styled-components'
import TransparentButton from 'components/Buttons/transparentButton'
import StyledButton from 'components/Buttons/styledButton'

const Card = styled.div`
  .inside {
    // background: transparent linear-gradient(90deg, #1d023b 0%, #17023e 100%) 0% 0% no-repeat padding-box;
    z-index: 2;
  }
  // background: transparent linear-gradient(166deg, #09033300 0%, #ed00c9 27%, #bd00ed 73%, #09033300 100%) 0% 0% no-repeat padding-box;
  position: relative;
  animation: gradient 2s ease infinite;
  background-size: 150% 150%;

  &::before {
    // background: transparent linear-gradient(113deg, #ed00c9 0%, #bd00ed 100%) 0% 0% no-repeat padding-box;
    z-index: 1;
    opacity: 1;
    transition: opacity 0.25s linear;
    position: absolute;
    content: '';
    border-radius: 5px;
    inset: 0;
  }
  // &:hover::before {
  //   opacity: 0;
  // }
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  // &:hover .inside::before {
  //   opacity: 1;
  // }
  .inside::before {
    background: transparent linear-gradient(92deg, #090240 0%, #090333 100%) 0% 0% no-repeat padding-box;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.25s linear;
    position: absolute;
    content: '';
    border-radius: 5px;
    inset: 0;
  }
  // button {
  //   background-image: linear-gradient(to right, #d800b7, #b100de, #b100de, #d800b7);
  //   background-size: 300% 100%;
  //   border-radius: 3px;
  //   text-shadow: 0px 0px 16px #935c8b;
  //   z-index: 2;
  //   &:hover {
  //     background-position: 100% 0%;
  //   }
  // }
  // button::before {
  //   background: transparent linear-gradient(90deg, #1d023b 0%, #17023e 100%) 0% 0% no-repeat padding-box;
  //   z-index: 1;
  //   opacity: 0;
  //   transition: opacity 0.25s linear;
  //   position: absolute;
  //   content: '';
  //   border-radius: 3px;
  //   inset: 0;
  //   margin: 1px;
  // }
  // &:hover button::before {
  //   opacity: 1;
  // }
`
const Index = ({ className, title, img, para, button, setOpen, cta }) => {
  const renderContent = () => {
    return (
      <div className='flex items-center space-x-[6.8px] px-[34px] h-[44.2px] relative z-[1]'>
        <img src='/images/whiteList/add-icon.svg' alt='' />
        <span>{button}</span>
      </div>
    )
  }
  return (
    <Card className={`rounded-[4.25px] wrapper relative`}>
      <div className='inside md:py-[26.35px] px-[18.7px] pt-[22.1px] pb-[13.6px] md:px-[29.75px]  md:flex items-start md:space-x-[17px] m-px relative gradient-bg bg-[#FF626E33]'>
        <div className='max-w-[70.55px] mt-[10.2px] z-[1] relative'>
          <img alt='' src={img} />
        </div>
        <div className='max-w-[278.8px] z-[1] relative mt-4 md:mt-0'>
          <p className='text-[23px] md:text-[25.5px] font-figtree font-medium gradient-text'>{title}</p>
          <div className='mb-4 lg:min-h-[61.2px] md:mb-[20.4px] mt-1 md:mt-[5.3125px] text-lightGray opacity-[0.88] text-[15px] md:text-[14.45px] leading-[25px] md:leading-[20.4px]'>
            {para}
          </div>
          {cta ? (
            <StyledButton content={renderContent()} onClickHandler={setOpen} className='w-full md:w-auto max-w-[187px] py-[0.85px]' />
          ) : (
            <TransparentButton content={renderContent()} onClickHandler={setOpen} className='w-full md:w-auto max-w-[187px]' isUpper />
          )}
        </div>
      </div>
    </Card>
  )
}

export default Index

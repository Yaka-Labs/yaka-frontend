import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StyledButton from 'components/Buttons/styledButton'
import Notification from 'components/Notification'
import SearchTokenPopup from 'components/SearchTokenPopup'
import Inputs from './inputs'
import './style.scss'

const Mint = () => {
  const [tokenPopup, setTokenPopup] = useState(false)
  const [mintNow, setMintNow] = useState(false)
  const [mint, setMint] = useState(true)
  const [fullRangeWarningShown, setFullRangeWarningShown] = useState(false)
  const navigator = useNavigate()
  const links = [
    {
      img: '/images/footer/twitter.png',
      url: 'https://twitter.com/ThenaFi_',
    },
    {
      img: '/images/footer/medium.png',
      url: 'https://medium.com/@ThenaFi',
    },
    {
      img: '/images/footer/discord.png',
      url: 'https://discord.gg/yaka-finance',
    },
    {
      img: '/images/footer/telegram.png',
      url: 'https://t.me/+Lr-8OJpzxBo4Yjg0',
    },
    {
      img: '/images/footer/geckoterminal.png',
      url: 'https://www.geckoterminal.com/bsc/thena/pools',
    },
  ]
  const [inputs, setInputs] = useState([
    {
      value: '',
    },
  ])
  const [giftInputs, setGiftInputs] = useState([
    {
      value: '',
    },
  ])

  return (
    <>
      {mintNow ? (
        <>
          <div id='retrobg'>
            <div id='retrobg-sky'>
              <div id='retrobg-stars'>
                <div className='retrobg-star' style={{ left: '5%', top: '55%', transform: 'scale( 2 )' }} />
                <div className='retrobg-star' style={{ left: '7%', top: '5%', transform: 'scale( 2 )' }} />
                <div className='retrobg-star' style={{ left: '10%', top: '45%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '12%', top: '35%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '15%', top: '39%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '20%', top: '10%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '35%', top: '50%', transform: 'scale( 2 )' }} />
                <div className='retrobg-star' style={{ left: '40%', top: '16%', transform: 'scale( 2 )' }} />
                <div className='retrobg-star' style={{ left: '43%', top: '28%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '45%', top: '30%', transform: 'scale( 3 )' }} />
                <div className='retrobg-star' style={{ left: '55%', top: '18%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '60%', top: '23%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '62%', top: '44%', transform: 'scale( 2 )' }} />
                <div className='retrobg-star' style={{ left: '67%', top: '27%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '75%', top: '10%', transform: 'scale( 2 )' }} />
                <div className='retrobg-star' style={{ left: '80%', top: '25%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '83%', top: '57%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '90%', top: '29%', transform: 'scale( 2 )' }} />
                <div className='retrobg-star' style={{ left: '95%', top: '5%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '96%', top: '72%', transform: 'scale( 1 )' }} />
                <div className='retrobg-star' style={{ left: '98%', top: '70%', transform: 'scale( 3 )' }} />
              </div>
              <div id='retrobg-sunwrap'>
                <div id='retrobg-sun' />
              </div>
              <div id='retrobg-mountains'>
                <div id='retrobg-mountains-left' className='retrobg-mountain' />
                <div id='retrobg-mountains-right' className='retrobg-mountain' />
              </div>
              <div id='retrobg-citywrap'>
                <div id='retrobg-city'>
                  <div style={{ left: '4.0%', height: '20%', width: '3.0%' }} className='retrobg-building' />
                  <div style={{ left: '6.0%', height: '50%', width: '1.5%' }} className='retrobg-building' />
                  <div style={{ left: '8.0%', height: '25%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '12.0%', height: '30%', width: '3.0%' }} className='retrobg-building' />
                  <div style={{ left: '13.0%', height: '55%', width: '3.0%' }} className='retrobg-building retrobg-antenna' />
                  <div style={{ left: '17.0%', height: '20%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '18.5%', height: '70%', width: '1.5%' }} className='retrobg-building' />
                  <div style={{ left: '20.0%', height: '30%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '21.5%', height: '80%', width: '2.0%' }} className='retrobg-building retrobg-antenna' />
                  <div style={{ left: '25.0%', height: '60%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '28.0%', height: '40%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '30.0%', height: '70%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '35.0%', height: '65%', width: '4.0%' }} className='retrobg-building retrobg-antenna' />
                  <div style={{ left: '38.0%', height: '40%', width: '3.0%' }} className='retrobg-building' />
                  <div style={{ left: '42.0%', height: '60%', width: '2.0%' }} className='retrobg-building' />
                  <div style={{ left: '43.0%', height: '85%', width: '4.0%' }} className='retrobg-building retrobg-antenna' />
                  <div style={{ left: '45.0%', height: '40%', width: '3.0%' }} className='retrobg-building' />
                  <div style={{ left: '48.0%', height: '25%', width: '3.0%' }} className='retrobg-building' />
                  <div style={{ left: '50.0%', height: '80%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '52.0%', height: '32%', width: '5.0%' }} className='retrobg-building' />
                  <div style={{ left: '55.0%', height: '55%', width: '3.0%' }} className='retrobg-building retrobg-antenna' />
                  <div style={{ left: '58.0%', height: '45%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '61.0%', height: '90%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '66.0%', height: '99%', width: '4.0%' }} className='retrobg-building retrobg-antenna' />
                  <div style={{ left: '69.0%', height: '30%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '73.5%', height: '90%', width: '2.0%' }} className='retrobg-building' />
                  <div style={{ left: '72.0%', height: '70%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '75.0%', height: '60%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '80.0%', height: '40%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '83.0%', height: '70%', width: '4.0%' }} className='retrobg-building retrobg-antenna' />
                  <div style={{ left: '87.0%', height: '60%', width: '3.0%' }} className='retrobg-building retrobg-antenna' />
                  <div style={{ left: '93.0%', height: '50%', width: '3.0%' }} className='retrobg-building' />
                  <div style={{ left: '91.0%', height: '30%', width: '4.0%' }} className='retrobg-building' />
                  <div style={{ left: '94.0%', height: '20%', width: '3.0%' }} className='retrobg-building' />
                  <div style={{ left: '98.0%', height: '35%', width: '2.0%' }} className='retrobg-building' />
                </div>
              </div>
            </div>
            <div id='retrobg-ground'>
              <div id='retrobg-lineswrap'>
                <div id='retrobg-lines'>
                  <div id='retrobg-vlines'>
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                    <div className='retrobg-vline' />
                  </div>
                  <div id='retrobg-hlines'>
                    <div className='retrobg-hline' />
                    <div className='retrobg-hline' />
                    <div className='retrobg-hline' />
                    <div className='retrobg-hline' />
                    <div className='retrobg-hline' />
                    <div className='retrobg-hline' />
                    <div className='retrobg-hline' />
                    <div className='retrobg-hline' />
                  </div>
                </div>
              </div>
              <div id='retrobg-groundshadow' />
            </div>
          </div>
          <div className='fixed z-[5]  bg-[#090333]/30 inset-0 w-full h-full' />
        </>
      ) : (
        <img alt='' src='/images/mintId/bg-image.png' className='inset-0 w-full h-full fixed bg-cover bg-center z-0' />
      )}
      <div className='flex items-center justify-center flex-col min-h-screen relative z-10 px-5 xl:px-0 '>
        <div className='w-full  max-w-[588px] gradient-bg rounded-[5px] p-px mintIdBoxShadow max-h-[630px] overflow-auto h-full -mt-16 lg:mt-0'>
          <div className='p-3 lg:p-4 w-full rounded-[5px]  mintIdBox'>
            <div className='flex items-center w-full justify-between'>
              <div
                className='flex items-center space-x-2.5 lg:space-x-5'
                onClick={() => {
                  navigator(-1)
                }}
              >
                <img alt='' src='/images/swap/back-arrow.svg' />
                <p className='leading-7 text-[23px] lg:leading-8 lg:text-[27px] font-figtree text-white font-semibold'>Mint THENA ID</p>
              </div>
              <Link to='/core/thenaIds'>
                <button className='text-green leading-5'>Check Available IDs</button>
              </Link>
            </div>
            <div className='flex items-center mt-2.5 lg:mt-4 space-x-6 lg:space-x-[30px] w-full '>
              <div onClick={() => setMint(true)} className='flex items-center space-x-2 cursor-pointer'>
                <div className='w-[18px] h-[18px] lg:w-6 lg:h-6 flex flex-col items-center justify-center rounded-full bg-body  border-pink border'>
                  <div className={`w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full ${mint ? 'bg-pink' : ''}`} />
                </div>
                <span htmlFor='wallet' className='text-white text-sm lg:text-[17px] leading-4 lg:leading-5 '>
                  Mint Now
                </span>
              </div>
              <div onClick={() => setMint(false)} className='flex items-center space-x-2 cursor-pointer'>
                <div className='w-[18px] h-[18px] lg:w-6 lg:h-6 flex flex-col items-center justify-center rounded-full bg-body  border-pink border'>
                  <div className={`w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full ${mint ? '' : 'bg-pink'}`} />
                </div>
                <span htmlFor='wallet' className='text-white text-sm lg:text-[17px] leading-4 lg:leading-5 '>
                  Mint As Gift{' '}
                </span>
              </div>
            </div>
            <div className='flex flex-col items-center justify-center w-full mt-[18px] lg:mt-4'>
              {mint ? <Inputs setInputs={setInputs} inputs={inputs} /> : <Inputs setInputs={setGiftInputs} inputs={giftInputs} />}
            </div>
            {fullRangeWarningShown && (
              <Notification error isClose onClose={() => setFullRangeWarningShown(false)}>
                Can only contain alphanumeric characters (letters A-Z, a-z, numbers 0-9) and emojis
              </Notification>
            )}
            <ul className=' mt-2.5 lg:mt-3 text-lightGray text-[13px] lg:text-[15px] leading-4 lg:leading-[22px] rounded-[3px]'>
              <li>• Price depends on the length of the name</li>
              <li>• Once minted, you can not change your username</li>
              <li>• You can mint multiple THENA IDs</li>
            </ul>

            {!mint && (
              <>
                <p className='text-lightGray text-[13px] lg:text-base leading-4 lg:leading-5 mt-4'>Send To</p>
                <div className='gradient-bg mt-2 p-px w-full rounded-[3px]'>
                  <div className='bg w-full  rounded-[3px] !text-[22px]  relative'>
                    <input
                      type='text'
                      placeholder='Wallet Address'
                      className='focus:outline-none px-3 lg:px-3.5 bg-body text-base lg:!text-[22px] placeholder-[#757384] h-12 lg:h-[66px] w-full text-white  rounded-[3px]'
                    />
                  </div>
                </div>
              </>
            )}
            <div className='mt-4 relative'>
              <span className='text-lightGray text-[13px] lg:text-base leading-4 lg:leading-10'>Select Token For Payment</span>
              <div className='gradient-bg  p-px w-full rounded-[3px]'>
                <div
                  onClick={() => {
                    setTokenPopup(!tokenPopup)
                  }}
                  className='flex items-center cursor-pointer justify-between px-3 lg:px-4 py-[15px] bg-body h-12 lg:h-[66px] rounded-[3px]'
                >
                  <div className='flex items-center space-x-1.5 text-white text-base lg:text-xl font-medium leading-5'>
                    <img alt='' className='w-6 h-6 lg:w-[25px] lg:h-[25px] rounded-full' src='https://cdn.thena.fi/assets/USDC.png' />
                    <span className='mt-px'>USDC</span>
                  </div>
                  <img alt='' src='/images/swap/dropdown-arrow.png' />
                </div>
              </div>
              <div className='mt-3 lg:mt-4 text-lightGray'>
                <p className='text-[13px] lg:text-base leading-4 lg:leading-5'>Price</p>
                <span className='text-2xl lg:text-4xl leading-[29px] lg:leading-[44px] text-white font-semibold'>60 USDT</span>
              </div>
            </div>
            <StyledButton
              onClickHandler={() => {
                setMintNow(true)
              }}
              content={mint ? 'MINT NOW' : 'MINT & SEND AS GIFT'}
              className='py-[13px] mt-3 lg:mt-4 w-full'
            />
          </div>
        </div>
        <div className='lg:flex-row flex items-center justify-center flex-col-reverse  lg:justify-between max-w-[1280px] mx-auto w-full absolute bottom-5'>
          <p className='textxl text-white opacity-[0.88]'>Copyright © 2023 Thena. All rights reserved.</p>
          <div className='flex items-center space-x-[14px]'>
            {links.map((item, idx) => {
              return (
                <a key={idx} href={item.url} rel='noreferrer' target='_blank'>
                  <img alt='' className='max-w-[44px]' src={item.img} />
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {tokenPopup && (
        <SearchTokenPopup
          popup={tokenPopup}
          setPopup={setTokenPopup}
          selectedAsset={[]}
          setSelectedAsset={() => {}}
          otherAsset={[]}
          setOtherAsset={() => {}}
          baseAssets={[]}
        />
      )}
    </>
  )
}

export default Mint

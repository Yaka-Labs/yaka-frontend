import React from 'react'
import { useLocation } from 'react-router-dom'
import './style.scss'

const Footer = () => {
  const route = useLocation()
  return (
    <div id='footer' className={`footer-wrap lg:[127.5px]  3xl:pt-[20%] relative ${route.pathname.includes('referral') ? 'hidden' : 'block'} lg:block`}>
      <div className='lite-footer'>
        <div className='flex items-center justify-center'>
          <a href='https://discord.gg/yaka-finance' target='_blank' rel='noreferrer' className='mr-[34px]'>
            <img src='/images/footer/discord-1.svg' alt='' />
          </a>
          <a href='https://t.me/YAKA_Finance' target='_blank' rel='noreferrer' className='mr-[34px]'>
            <img src='/images/footer/telegram-1.svg' alt='' />
          </a>
          <a href='https://twitter.com/YakaFinance' target='_blank' rel='noreferrer'>
            <img src='/images/footer/twitter-1.svg' alt='' />
          </a>
        </div>
        <div className='flex items-center justify-center mt-[34px]'>©2024, All right reserved</div>
      </div>
      <div className='big-footer w-full relative lg:block max-w-[1020px] pt-[68px] pb-[95.2px] xl:pb-0  px-[17px] xl:px-0 mx-auto'>
        <div className='w-full content-wrapper-footer'>
          <div className='footer-tab flex'>
            <div className='footer-yaka flex flex-col'>
              <div className='footer-title'>YAKA</div>
              <div className='footer-desc'>
                <span>Sei's native liquidity engine</span>
              </div>
            </div>
            <div className='footer-socials'>
              <div className='footer-title'>Socials</div>
              <div className='footer-desc flex flex-col gap-2'>
                <a href='https://twitter.com/YakaFinance' target='_blank' rel='noreferrer'>
                  <span>Twitter</span>
                </a>
                <a href='https://t.me/YAKA_Finance' target='_blank' rel='noreferrer'>
                  <span>Telegram</span>
                </a>
                <a href='https://discord.com/invite/yaka-finance' target='_blank' rel='noreferrer'>
                  <span>Discord</span>
                </a>
              </div>
            </div>
            <div className='footer-docs'>
              <div className='footer-title'>Docs</div>
              <div className='footer-desc flex flex-col gap-2'>
                <a href='https://yaka.gitbook.io/yaka-finance' target='_blank' rel='noreferrer'>
                  <span>Docs</span>
                </a>
                <a href='https://medium.com/@YAKA_Finance' target='_blank' rel='noreferrer'>
                  <span>Medium</span>
                </a>
              </div>
            </div>
          </div>
          <div className='footer-line'>
            <br />
          </div>
          <div className='links-wrapper'>
            <div className='copy-right'>©2024, All right reserved</div>
            <div className='yaka flex'>
              <img className='relative z-10 logo-icon' alt='' src='/images/header/logo-icon.svg' />
              <img className='relative z-10 logo-word' alt='' src='/images/header/logo-word.svg' />
            </div>
            <div className='flex socials'>
              <a href='https://discord.gg/yaka-finance' target='_blank' rel='noreferrer'>
                <div className='footer-img'>
                  <img src='/images/footer/discord-1.svg' alt='' />
                </div>
              </a>
              <a href='https://t.me/YAKA_Finance' target='_blank' rel='noreferrer'>
                <div className='footer-img'>
                  <img src='/images/footer/telegram-1.svg' alt='' />
                </div>
              </a>
              <a href='https://twitter.com/YakaFinance' target='_blank' rel='noreferrer'>
                <div className='footer-img'>
                  <img src='/images/footer/twitter-1.svg' alt='' />
                </div>
              </a>
              <a href='https://medium.com/@YAKA_Finance' target='_blank' rel='noreferrer'>
                <div className='footer-img'>
                  <img src='/images/footer/link-1.svg' alt='' />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

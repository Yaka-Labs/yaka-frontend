import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import OutsideClickHandler from 'react-outside-click-handler'
import { ChainId } from 'thena-sdk-core'
import useAuth from 'hooks/useAuth'
import useGoogleAnalytics from 'hooks/useGoogleAnalytics'
import { CONNECTORS } from 'config/constants'
import { useNetwork, useWalletModal } from 'state/settings/hooks'
import usePrices from 'hooks/usePrices'
// import { formatNumber } from 'utils/formatNumber'
import Transaction from 'components/Transaction'
import ConnectWallet from 'components/connectWallet'
import Menu from './Menu'
import NetworkSwitch from './NetworkSwitch'
import SwitchModal from './SwitchModal'
import './style.scss'
import Faucet from './Faucet'
import ClaimModal from './ClaimModal'
import { ConnectorNames } from 'config/constants'
import TotalTvl from './TotalTvl'

const MENUS = [
  {
    name: 'TRADE',
    dropdown: true,
    items: [
      {
        name: 'Swap',
        link: '/swap',
      },
      {
        name: (
          <div className='flex items-center'>
            <img src='/images/header/beta.svg' alt='THENA Alpha' />
            <span className='ml-1'>ALPHA</span>
          </div>
        ),
        link: 'https://alpha.thena.fi',
        external: true,
      },
      {
        name: 'Cross Chain',
        link: '/swap/cross',
      },
      {
        name: 'Buy Crypto',
        link: '/swap/onramp',
      },
    ],
  },
  {
    name: 'EARN',
    dropdown: true,
    items: [
      {
        name: 'Liquidity',
        link: '/liquidity',
      },
      {
        name: 'Pools',
        link: '/pools',
      },
      {
        name: 'Single Token Vaults',
        link: '/vaults',
      },
    ],
  },
  {
    name: 'veTHE',
    dropdown: true,
    items: [
      {
        name: 'Lock',
        link: '/lock',
      },
      {
        name: 'Vote',
        link: '/vote',
      },
      {
        name: 'Rewards',
        link: '/rewards',
      },
    ],
  },
  {
    name: 'GAUGES',
    link: '/whitelist',
  },
  // {
  //   name: 'CORE',
  //   link: '/core',
  // },
  {
    name: 'MORE',
    dropdown: true,
    items: [
      {
        name: 'Analytics',
        link: '/analytics',
      },
      {
        name: 'theNFT',
        link: '/theNFT',
      },
      {
        name: 'Referral',
        link: '/referral',
      },
      {
        name: 'V1',
        link: 'https://v1.thena.fi/',
        external: true,
      },
      {
        name: 'Docs',
        link: 'https://yaka.gitbook.io/yaka-finance',
        external: true,
      },
    ],
  },
]

const OP_MENUS = [
  {
    name: 'SWAP',
    link: '/swap',
  },
  // {
  //   name: 'TRADE',
  //   dropdown: true,
  //   items: [
  //     {
  //       name: 'Swap',
  //       link: '/swap',
  //     },
  //     // {
  //     //   name: (
  //     //     <div className='flex items-center'>
  //     //       <img src='/images/header/beta.svg' alt='THENA Alpha' />
  //     //       <span className='ml-1'>ALPHA</span>
  //     //     </div>
  //     //   ),
  //     //   link: 'https://alpha.thena.fi',
  //     //   external: true,
  //     // },
  //     // {
  //     //   name: 'Buy Crypto',
  //     //   link: '/swap/onramp',
  //     // },
  //   ],
  // },
  {
    name: 'EARN',
    dropdown: true,
    items: [
      {
        name: 'Liquidity',
        link: '/liquidity',
      },
      {
        name: 'Pools',
        link: '/pools',
      },
      {
        name: 'Single Token Vaults',
        link: '#',
        disabled: true,
      },
    ],
  },
  {
    name: 'YAKA',
    dropdown: true,
    items: [
      {
        name: 'Lock',
        link: '/lock',
      },
      {
        name: 'Vote',
        link: '/vote',
      },
      {
        name: 'Rewards',
        link: '/rewards',
      },
    ],
  },
  {
    name: 'GAUGES',
    link: '/whitelist',
  },
  // {
  //   name: 'CAMPAIGN',
  //   dropdown: false,
  //   link: '/campaign',
  // },
  {
    name: 'LAUNCHPAD',
    dropdown: false,
    link: '/launchpad',
  },
  {
    name: 'NFT',
    dropdown: false,
    link: '/nft',
  },
  {
    name: 'MORE',
    dropdown: true,
    items: [
      {
        name: 'Analytics',
        link: '#',
        disabled: true,
      },
      {
        name: 'Docs',
        link: 'https://yaka.gitbook.io/',
        external: true,
      },
    ],
  },
]

const MobileMenu = ({ item, idx, pathname }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <li key={idx} className='links'>
      {item.dropdown ? (
        <OutsideClickHandler
          onOutsideClick={() => {
            setIsOpen(false)
          }}
        >
          <div className='relative'>
            <div
              onClick={() => {
                setIsOpen(!isOpen)
              }}
              className='flex items-center space-x-1 cursor-pointer relative z-10  font-light text-white'
            >
              <span>{item.name}</span>
              <img
                alt='dropdown'
                src='/images/header/dropdown-arrow.svg'
                className={`${!isOpen ? 'rotate-180' : 'rotate-0'} transition-all duration-150 ease-in-out`}
              />
            </div>
            {isOpen && (
              <div className='py-3 px-[22px] min-w-[205px] w-max absolute top-10 border border-[#C81F39] bg-[#360E12] rounded-[3px] -left-[74px] z-40 rounded-[3px] flex flex-col items-center text-[17px] leading-9'>
                {item.items.map((_item, j) => {
                  return _item.external ? (
                    <p
                      className='hover:text-red cursor-pointer'
                      key={`subitem-${j}`}
                      onClick={() => {
                        window.open(_item.link, '_blank')
                        setIsOpen(false)
                      }}
                    >
                      {_item.name}
                    </p>
                  ) : (
                    <Link
                      key={j}
                      onClick={() => {
                        setIsOpen(false)
                      }}
                      className={`${pathname === _item.link ? 'text-red' : ''} no-link hover:text-red`}
                      to={_item.link}
                    >
                      {_item.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </OutsideClickHandler>
      ) : item.external ? (
        <a className='external' href={item.link} target='_blank' rel='noreferrer'>
          {item.name}
        </a>
      ) : (
        <Link
          className={`${item.disabled ? 'link-disabled ' : 'hover:text-red '} ${pathname === item.link ? 'text-red' : ''} no-link hover:text-red`}
          to={item.link}
        >
          {item.name}
        </Link>
      )}
    </li>
  )
}

const Header = () => {
  useGoogleAnalytics()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [warning, setWarning] = useState(false)
  const [connector, setConnector] = useState(null)
  const [secondDrop, setSecondDrop] = useState(false)
  const [mobileDrop, setMobileDrop] = useState(false)
  const { account, chainId } = useWeb3React()
  const { logout } = useAuth()
  const [scroll, setScroll] = useState(false)
  const [selected, setSelected] = useState(false)
  const prices = usePrices()
  const { isWalletOpen, openWalletModal, closeWalletModal } = useWalletModal()
  const { networkId } = useNetwork()
  const navigate = useNavigate()

  const menuList = useMemo(() => {
    return networkId === ChainId.BSC ? MENUS : OP_MENUS
  }, [networkId])

  useEffect(() => {
    if (
      networkId === ChainId.OPBNB &&
      (pathname.includes('/lock') ||
        pathname.includes('/vote') ||
        pathname.includes('/rewards') ||
        pathname.includes('/whitelist') ||
        pathname.includes('/theNFT'))
    ) {
      navigate('/')
    }
  }, [networkId, pathname])

  useEffect(() => {
    console.log('networkId', networkId)
    console.log('chainId', chainId)

    if (networkId !== chainId && account) {
      setWarning(true)
    } else {
      setWarning(false)
    }
  }, [networkId, chainId, account])

  useEffect(() => {
    // if (prices && prices.THE) {
    //   document.title = `THENA - $${formatNumber(prices.THE)}`
    // }
  }, [prices])

  const listener = useCallback(() => {
    setScroll(window.scrollY > 30)
  }, [setScroll])

  useEffect(() => {
    document.addEventListener('scroll', listener)
    return () => {
      document.removeEventListener('scroll', listener)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
    closeWalletModal()
    setMobileDrop(false)
  }, [pathname])

  useEffect(() => {
    if (account) {
      if (!connector && !selected) {
        const connectorID = localStorage.getItem('connectorID')
        const name = ConnectorNames[connectorID]
        setConnector(CONNECTORS.find((item) => item.connector === name))
        setSelected(false)
      }
    } else {
      setConnector(null)
    }
  }, [account, connector, selected, setSelected])

  const dropDownhandler = () => {
    if (connector) {
      setSecondDrop(!secondDrop)
    } else {
      openWalletModal()
    }
  }

  const onDisconnect = () => {
    logout()
    setConnector(null)
    setSecondDrop(false)
  }

  const onMobileDisconnect = () => {
    logout()
    setConnector(null)
    setMobileDrop(false)
  }

  useEffect(() => {})

  return (
    <>
      {isWalletOpen && <ConnectWallet setConnector={setConnector} setSelected={setSelected} />}
      <div className='header-wrap fixed w-full z-[120]'>
        <div className={`${scroll ? 'bg-[#170f0f]' : 'bg-transparent'} transition-all duration-300 ease-in-out`}>
          <div className='header px-auto max-w-[1105px] pt-[68px] pb-[95.2px] xl:pb-0  px-[17px] xl:px-0 mx-auto'>
            <Link to='/'>
              <img className='logo relative z-10 logo-icon' alt='' src='/images/header/logo-icon.svg' />
              <img className='logo relative z-10 logo-word' alt='' src='/images/header/logo-word.svg' />
            </Link>
            <ul className='w-fit justify-center hidden xl:flex items-center space-x-[20.4px]'>
              {menuList.map((item, idx) => {
                return <Menu item={item} key={`main-${idx}`} idx={idx} />
              })}
            </ul>
            <div className='xl:flex items-center space-x-[10.2px] hidden'>
              {/*<Faucet />*/}
              <TotalTvl></TotalTvl>
              {/*<NetworkSwitch />*/}
              <OutsideClickHandler
                onOutsideClick={() => {
                  setSecondDrop(false)
                }}
              >
                <div
                  onClick={() => {
                    dropDownhandler()
                  }}
                  className={`${
                    connector ? 'px-[8.5px] tracking-[1.12px] max-w-[177.65px] w-full' : 'px-[11.9px] text-xs tracking-[2px] xl:px-[25px] xl:tracking-[2px]'
                  } bg-[#bd00ed1a] h-[37.4px] items-center font-semibold
                text-white md:text-sm relative z-20 text-base leading-7 connect-wallet font-figtree flex connect-wallet-top`}
                >
                  {connector ? (
                    <div className='flex items-center space-x-[13.6px]  xl:space-x-[17px]'>
                      <div className='flex items-center flex-shrink-0 space-x-[6.8px]'>
                        <img src={connector.logo} className='max-w-[20.4px] h-[20.4px] ' alt='' />
                        <p>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}</p>
                      </div>
                      <button className={`${secondDrop ? ' rotate-180' : ' rotate-0'} transition-all duration-300 ease-in-out transform w-full`}>
                        <img className='w-[13.6px] h-[13.6px] flex-shrink-0 xl:w-auto xl:h-auto' src='/images/header/chevron.svg' alt='' />
                      </button>
                    </div>
                  ) : (
                    'CONNECT WALLET'
                  )}
                </div>

                {secondDrop && (
                  <div className='absolute max-w-[177.65px] w-full py-[12.75px] px-[17px] border border-[#C81F39] bg-[#360E12]   rounded-[3px] top-[51px] mt-[17px] hidden xl:block z-[101]'>
                    <button onClick={onDisconnect} className='flex items-center space-x-[5.73px]'>
                      <img className='max-w-[20.4px] h-6' alt='' src='/images/header/logout-icon.svg' />
                      <p className='flex-shrink-0 text-[12.75px] text-white'>Logout</p>
                    </button>
                  </div>
                )}
              </OutsideClickHandler>
            </div>
            <button
              onClick={() => {
                setOpen(true)
                setSecondDrop(false)
              }}
              className='bg-transparent w-[27.2px] xl:hidden'
            >
              <img alt='' src='/images/header/hamburger-menu.png' />
            </button>
          </div>
        </div>
      </div>

      {/* mobile flow */}
      <div className={`top-bg !z-[1000] xl:hidden ${open ? 'top-0' : 'top-minus'}`}>
        <div className='inner-tab'>
          <div className='top-navigation'>
            <Link to='/'>
              <img className='logo-2' alt='' src='/images/header/logo-icon.svg' />
            </Link>
            <div
              onClick={() => {
                setOpen(false)
                closeWalletModal()
              }}
              className='closeButton'
            >
              <img alt='' src='/images/common/close-button2.svg' />
            </div>
          </div>
          <div className='bottom-navigation w-full'>
            <ul className='flex flex-col items-center justify-center'>
              {menuList.map((item, idx) => {
                return <MobileMenu item={item} idx={idx} pathname={pathname} key={`mobile-${idx}`} />
              })}
            </ul>
            {/*<Faucet />*/}
            <TotalTvl></TotalTvl>
            {/*<NetworkSwitch setOpen={setOpen} />*/}
            {!connector ? (
              <button
                onClick={() => {
                  openWalletModal()
                  setOpen(false)
                }}
                className='mobile-btn font-figtree'
              >
                <div className='line1' />
                <div className='line2' />
                CONNECT WALLET
              </button>
            ) : (
              <div className='relative max-w-[230px] flex flex-col items-center justify-center w-full'>
                <div
                  onClick={() => {
                    setMobileDrop(!mobileDrop)
                  }}
                  className='px-3 py-[9px] tracking-[1.12px] max-w-[209px] w-full bg-[#bd00ed1a] mt-4 text-white text-sm leading-7 connect-wallet-2 font-figtree connect-wallet-top'
                >
                  <div className='flex items-center space-x-7'>
                    <div className='flex items-center flex-shrink-0 space-x-2'>
                      <img src={connector.logo} className='max-w-[24px] h-6 ' alt='' />
                      <p className='drop-shadow-[0px_0px_4px_#0000004D]'>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}</p>
                    </div>
                    <button className='w-4 h-4 flex-shrink-0'>
                      <img className='w-full h-full' src='/images/header/chevron.svg' alt='' />
                    </button>
                  </div>
                </div>
                {mobileDrop && (
                  <div className='absolute max-w-[250px] w-full py-[15px] px-[18px] border-[#C81F39] bg-[#360E12] border hover:border-[#C81F39]  rounded-[3px] top-[80px]'>
                    <button onClick={onMobileDisconnect} className='flex items-center space-x-[5.73px] w-full'>
                      <img className='max-w-[24px] h-6' alt='' src='/images/header/logout-icon.svg' />
                      <p className='flex-shrink-0 text-[15px] text-white'>Logout</p>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Transaction />
      {warning && <SwitchModal isOpen={warning} setIsOpen={setWarning} />}
    </>
  )
}

export default Header

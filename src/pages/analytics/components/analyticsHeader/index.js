import React, { useMemo, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import TabFilter from 'components/TabFilter'
import SearchInput from 'components/Input/SearchInput'
import { useAnalyticsVersion } from 'hooks/useGeneral'
import { ANALYTIC_VERSIONS } from 'config/constants'
import { useAllTokenData } from 'context/TokenData'
import { useAllPairData } from 'context/PairData'
import { isAddress } from 'ethers/lib/utils'

const Tabs = ['OVERVIEW', 'TOKENS', 'PAIRS']

const getSubRoute = (item) => {
  return item === Tabs[0] ? '' : item === Tabs[1] ? '/tokens' : '/pairs'
}

const escapeRegExp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const StepSize = 3

const AnalyticsHeader = ({ data }) => {
  const [searchText, setSearchText] = useState('')
  const version = useAnalyticsVersion()
  const [pairsMore, setPairsMore] = useState(StepSize)
  const [tokensMore, setTokensMore] = useState(StepSize)
  const tokens = useAllTokenData(ANALYTIC_VERSIONS.total)
  const pairs = useAllPairData(ANALYTIC_VERSIONS.total)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeTab = useMemo(() => {
    const arr = pathname.split('/')
    let result
    switch (arr[arr.length - 1]) {
      case 'pairs':
        result = Tabs[2]
        break
      case 'tokens':
        result = Tabs[1]
        break

      default:
        result = Tabs[0]
        break
    }
    return result
  }, [pathname])
  const menuRef = useRef(null)
  const wrapperRef = useRef(null)

  const filteredTokens = useMemo(() => {
    if (!searchText) {
      return tokens
    }
    if (tokens && tokens.length > 0) {
      return tokens
        .filter((token) => {
          const regexMatches = Object.keys(token).map((tokenEntryKey) => {
            const valid = isAddress(searchText)
            if (tokenEntryKey === 'id' && valid) {
              return token[tokenEntryKey].match(new RegExp(escapeRegExp(searchText), 'i'))
            }
            if (tokenEntryKey === 'symbol' && !valid) {
              return token[tokenEntryKey].match(new RegExp(escapeRegExp(searchText), 'i'))
            }
            if (tokenEntryKey === 'name' && !valid) {
              return token[tokenEntryKey].match(new RegExp(escapeRegExp(searchText), 'i'))
            }
            return false
          })
          return regexMatches.some((m) => m)
        })
        .sort((tokenA, tokenB) => {
          return Number(tokenA.oneDayVolumeUSD) > Number(tokenB.oneDayVolumeUSD) ? -1 : 1
        })
    }
    return []
  }, [tokens, searchText])

  const filteredPairs = useMemo(() => {
    if (!searchText) {
      return pairs
    }
    if (pairs && pairs.length > 0) {
      return pairs
        .filter((pair) => {
          if (searchText.includes(' ')) {
            const pairA = searchText.split(' ')[0]?.toLowerCase()
            const pairB = searchText.split(' ')[1]?.toLowerCase()
            return (
              (pair.token0.symbol.toLowerCase().includes(pairA) || pair.token0.symbol.toLowerCase().includes(pairB)) &&
              (pair.token1.symbol.toLowerCase().includes(pairA) || pair.token1.symbol.toLowerCase().includes(pairB))
            )
          }
          if (searchText && searchText.includes('/')) {
            const pairA = searchText.split('/')[0]?.toLowerCase()
            const pairB = searchText.split('/')[1]?.toLowerCase()
            return (
              (pair.token0.symbol.toLowerCase().includes(pairA) || pair.token0.symbol.toLowerCase().includes(pairB)) &&
              (pair.token1.symbol.toLowerCase().includes(pairA) || pair.token1.symbol.toLowerCase().includes(pairB))
            )
          }
          const regexMatches = Object.keys(pair).map((field) => {
            if (field === 'id' && isAddress(searchText)) {
              return pair[field].match(new RegExp(escapeRegExp(searchText), 'i'))
            }
            if (field === 'token0' || field === 'token1') {
              if (!pair[field].name || !pair[field].symbol) {
                return false
              }
              return pair[field].symbol.match(new RegExp(escapeRegExp(searchText), 'i')) || pair[field].name.match(new RegExp(escapeRegExp(searchText), 'i'))
            }
            return false
          })
          return regexMatches.some((m) => m)
        })
        .sort((tokenA, tokenB) => {
          return Number(tokenA.trackedReserveUSD) > Number(tokenB.trackedReserveUSD) ? -1 : 1
        })
    }
    return []
  }, [pairs, searchText])

  const handleClick = (e) => {
    if (!(menuRef.current && menuRef.current.contains(e.target)) && !(wrapperRef.current && wrapperRef.current.contains(e.target))) {
      setTokensMore(StepSize)
      setPairsMore(StepSize)
      setMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <>
      <h1 className='text-[34px] md:text-[42px] font-semibold text-white  font-figtree'>THENA Analytics</h1>
      <div className='w-full md:w-auto flex justify-center mt-3'>
        <div className='flex h-11 w-full md:w-auto'>
          <Link className='w-full md:w-auto' to={`/analytics/${ANALYTIC_VERSIONS.v1}`}>
            <div
              className={`md:w-[100px] h-full flex justify-center items-center cursor-pointer 
              ${
                version === ANALYTIC_VERSIONS.v1
                  ? 'text-white font-semibold border-[#ED00C9] border rounded-[5px] -ml-px popup-gradientbg'
                  : 'text-[#A2A0B7] font-normal border-[#555367] border-l border-t border-b rounded-l-[5px] -mr-[3px] -ml-px'
              } `}
            >
              V1
            </div>
          </Link>
          <Link className='w-full md:w-auto' to={`/analytics/${ANALYTIC_VERSIONS.fusion}`}>
            <div
              className={`md:w-[100px] h-full flex justify-center items-center cursor-pointer 
              ${
                version === ANALYTIC_VERSIONS.fusion
                  ? 'text-white font-semibold border-[#ED00C9] border rounded-[5px] -ml-px popup-gradientbg'
                  : 'text-[#A2A0B7] font-normal border-[#555367] border-t border-b -mr-[3px] -ml-[3px]'
              } `}
            >
              FUSION
            </div>
          </Link>
          <Link className='w-full md:w-auto' to={`/analytics/${ANALYTIC_VERSIONS.total}`}>
            <div
              className={`md:w-[100px] h-full flex justify-center items-center cursor-pointer
              ${
                version === ANALYTIC_VERSIONS.total
                  ? 'text-white font-semibold border-[#ED00C9] border rounded-[5px] -mr-px popup-gradientbg'
                  : 'text-[#A2A0B7] font-normal border-[#555367] border-r border-t border-b rounded-r-[5px] -ml-[3px] -mr-px'
              }`}
            >
              TOTAL
            </div>
          </Link>
        </div>
      </div>
      <div className='lg:flex items-center justify-between mt-5 lg:mt-11'>
        {data ? (
          <p className='text-[15px] leading-[15px] text-[#B8B6CB]'>
            <span
              className='cursor-pointer'
              onClick={() => {
                navigate(`/analytics/${version}`)
              }}
            >
              Analytics
            </span>
            &nbsp;{'>'}&nbsp;
            <span
              className='cursor-pointer'
              onClick={() => {
                navigate(`/analytics/${version}/${data.token0 ? 'pairs' : 'tokens'}`)
              }}
            >
              {data.token0 ? 'Pairs' : 'Tokens'}
            </span>
            &nbsp;{'>'}&nbsp;
            <span className='text-white font-medium'>{data.token0 ? data.token0.symbol + '/' + data.token1.symbol : data.symbol}</span>&nbsp;
            <span>({data.id && data.id.slice(0, 6) + '...' + data.id.slice(38, 42)})</span>
          </p>
        ) : (
          <div className='flex md:flex-row flex-col md:space-y-0 space-y-4 items-center justify-between  w-full'>
            <TabFilter
              wfull
              data={Tabs}
              filter={activeTab}
              setFilter={(item) => {
                navigate(`/analytics/${version}${getSubRoute(item)}`)
              }}
            />
            <div className='md:max-w-[300px] w-full relative '>
              <div ref={menuRef}>
                <SearchInput setSearchText={setSearchText} searchText={searchText} full placeholder='Search Pair or Token' onFocus={() => setMenuOpen(true)} />
              </div>
              {menuOpen && (
                <div ref={wrapperRef} className='absolute border border-blue w-full  rounded-[3px] mt-3 z-20  bg-body h-[300px] overflow-auto pb-2.5'>
                  <p className='font-medium text-lg leading-[1.5] text-white m-3'>Pairs</p>
                  {filteredPairs.slice(0, pairsMore).map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className='px-3 py-1 my-1 flex items-center space-x-2 cursor-pointer hover:bg-[#373d51]'
                        onClick={() => {
                          navigate(`/analytics/${item.isFusion ? ANALYTIC_VERSIONS.fusion : ANALYTIC_VERSIONS.v1}/pair/${item.id}`)
                        }}
                      >
                        <div className='flex items-center -space-x-2'>
                          <img alt={`token ${item.token0.symbol}`} src={item.token0.logoURI} className='w-7 h-7 z-20 relative' />
                          <img alt={`token ${item.token1.symbol}`} src={item.token1.logoURI} className='w-7 h-7 ' />
                        </div>
                        <small className='text-sm leading-[1.57] text-[#c7cad9]'>
                          {item.token0.symbol}/{item.token1.symbol}
                        </small>
                        {item.fee && (
                          <div className='py-1 px-2 rounded-md bg-white bg-opacity-[0.07] text-[#c7cad9] leading-4 text-sm'>
                            {Number(item.fee) / 10000}% Fee
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {filteredPairs.length > StepSize && filteredPairs.length >= pairsMore && (
                    <button
                      onClick={() => {
                        setPairsMore(pairsMore + StepSize)
                      }}
                      className='mt-1 px-3 text-[#26FFFE] text-sm leading-[1.57]'
                    >
                      Show More
                    </button>
                  )}
                  {filteredPairs.length === 0 && <div className='mt-1 px-3 text-[#c7cad9] text-sm leading-[1.57]'>No results</div>}

                  <p className='font-medium text-lg leading-[1.5] text-white m-3'>Tokens</p>
                  {filteredTokens.slice(0, tokensMore).map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className='px-3 py-1 my-1 flex items-center space-x-2 cursor-pointer hover:bg-[#373d51]'
                        onClick={() => {
                          navigate(`/analytics/total/token/${item.id}`)
                        }}
                      >
                        <div className='flex items-center -space-x-2'>
                          <img alt={`token ${item.symbol}`} src={item.logoURI} className='w-7 h-7' />
                        </div>
                        <small className='text-sm leading-[1.57]  text-[#c7cad9]'>
                          {item.name} ({item.symbol})
                        </small>
                      </div>
                    )
                  })}
                  {filteredTokens.length > StepSize && filteredTokens.length >= tokensMore && (
                    <button
                      onClick={() => {
                        setTokensMore(tokensMore + StepSize)
                      }}
                      className='mt-1 px-3 text-[#26FFFE] text-sm leading-[1.57]'
                    >
                      Show More
                    </button>
                  )}
                  {filteredTokens.length === 0 && <div className='mt-1 px-3 text-[#c7cad9] text-sm leading-[1.57]'>No results</div>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AnalyticsHeader

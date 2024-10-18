import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { formatNumber } from 'utils/formatNumber'
import { addToken } from 'utils/addRPC'
import Modal from '../Modal'
import NoFound from '../NoFound'

const CommonTokens = [
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // usdc
  '0x55d398326f99059fF775485246999027B3197955', // usdt
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', // eth
  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', // btc
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // busd
  '0x90c97f71e18723b0cf0dfa30ee176ab653e89f40', // frax
  '0xF4C8E32EaDEC4BFe97E0F595AdD0f4450a863a11', // the
  '0x4200000000000000000000000000000000000006',
  '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3',
  '0xe7798f023fc62146e8aa1b36da45fb70855a77ea',
  '0x7c6b91d9be155a6db01f749217d76ff02a7227f2',
  '0x9d94A7fF461e83F161c8c040E78557e31d8Cba72',
  '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
]

const SearchTokenPopup = ({
  popup,
  setPopup,
  selectedAsset,
  setSelectedAsset,
  otherAsset,
  setOtherAsset,
  baseAssets,
  onAssetSelect = () => {},
  isJustSelect = false,
}) => {
  const [manage, setManage] = useState(false)
  const [searchText, setSearchText] = useState('')
  const { account } = useWeb3React()
  const inputRef = useRef()

  const filteredAssets = useMemo(() => {
    return searchText
      ? baseAssets.filter(
          (asset) =>
            asset.name.toLowerCase().includes(searchText.toLowerCase()) ||
            asset.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
            asset.address.toLowerCase().includes(searchText.toLowerCase()),
        )
      : baseAssets
  }, [baseAssets, searchText])

  const commonAssets = useMemo(() => {
    return baseAssets.filter((asset) => asset.address === 'BNB' || CommonTokens.some((ele) => ele.toLowerCase() === asset.address.toLowerCase()))
  }, [baseAssets])

  useEffect(() => {
    if (!popup) {
      setSearchText('')
    } else {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 300)
    }
  }, [popup])

  return (
    <Modal popup={popup} setPopup={setPopup} title={manage ? 'Manage Tokens' : 'Select a Token'} isBack={manage} setIsBack={setManage} width={459} isToken>
      <>
        <div className='w-full'>
          <div className='px-3 md:px-[20.4px]'>
            <div className='w-full mt-[10.2px] rounded-[2.55px]'>
              <input
                ref={inputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder='Search by name, symbol or address'
                className='placeholder-[#757384] h-[47.6px] w-full text-white text-base md:text-[15.3px] px-[13.6px] py-[15.3px] rounded-[2.55px] tool-tip-input'
              />
            </div>
          </div>
          {!isJustSelect && (
            <div className='w-full mt-3.5 md:mt-[15.3px] px-3 md:px-[20.4px]'>
              <p className='text-[13px] md:text-[13px] tracking-[0.52px] md:tracking-[0.56px] font-figtree text-secondary mb-1'>COMMON TOKENS</p>
              <div className='flex flex-wrap md:-mx-3'>
                {commonAssets.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className='px-2 md:px-[10.2px] cursor-pointer py-1 md:py-[5.1px] border m-[4.25px] flex items-center space-x-[4.25px] border-[#343434] rounded-[10.2px] hover:bg-body'
                      onClick={() => {
                        if (otherAsset && otherAsset.address === item.address) {
                          const temp = selectedAsset
                          setSelectedAsset(otherAsset)
                          setOtherAsset(temp)
                        } else {
                          setSelectedAsset(item)
                        }
                        onAssetSelect()
                        setPopup(false)
                      }}
                    >
                      <img alt='' src={item.logoURI} width={28} height={28} loading='lazy' />
                      <p className='text-sm md:text-[13.6px] text-white font-figtree'>{item.symbol}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className='w-full mt-[10.2px]'>
          <div className='flex justify-between text-[13px] md:text-[13px] tracking-[0.52px] md:tracking-[0.56px] font-figtree text-secondary mb-1 px-3 md:px-[20.4px]'>
            <span>TOKEN NAME</span>
            {account && !isJustSelect && <span>BALANCE</span>}
          </div>
          <div className='w-full mt-3 md:mt-[11.05px] max-h-[289px] overflow-auto'>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, idx) => {
                return (
                  <div
                    key={`asset-${idx}`}
                    className='flex items-center justify-between py-[5.1px] px-3 md:px-[20.4px] cursor-pointer hover:bg-body'
                    onClick={() => {
                      if (otherAsset && otherAsset.address === asset.address) {
                        const temp = selectedAsset
                        setSelectedAsset(otherAsset)
                        setOtherAsset(temp)
                      } else {
                        setSelectedAsset(asset)
                      }
                      onAssetSelect()
                      setPopup(false)
                    }}
                  >
                    <div className='flex items-center space-x-2.5 md:space-x-[10.2px]'>
                      <img alt='logo' src={asset.logoURI} className='flex-shrink-0' width={23.8} height={23.8} loading='lazy' />
                      <div>
                        <div className='flex items-center space-x-[3.4px]'>
                          <p className='text-white text-sm md:text-[13.6px] font-figtree'>{asset.symbol}</p>
                          {account && asset.address !== 'BNB' && (
                            <img
                              className='cursor-pointer'
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                addToken(asset)
                              }}
                              alt=''
                              src='/images/common/token-add.svg'
                              width={11.9}
                              height={11.9}
                              loading='lazy'
                            />
                          )}
                        </div>
                        <p className='text-[13px] md:text-[13px] tracking-[0.52px] text-secondary'>{asset.name}</p>
                      </div>
                    </div>
                    {account && !isJustSelect && (
                      <div className='flex flex-col items-end'>
                        <p className='text-sm md:text-[13.6px] text-white'>{formatNumber(asset.balance) || ''}</p>
                        <p className='text-[13px] md:text-[13px] tracking-[0.52px] text-secondary'>${formatNumber(asset.balance.times(asset.price))}</p>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <NoFound title='No tokens found' />
            )}
          </div>
          {/* <div className='flex items-center justify-center w-full pt-[0.775rem]'>
              <button
                onClick={() => {
                  setManage(true)
                }}
                className='text-sm md:text-[17px] text-green text-center'
              >
                Manage Tokens
              </button>
            </div> */}
        </div>
      </>
    </Modal>
  )
}

export default SearchTokenPopup

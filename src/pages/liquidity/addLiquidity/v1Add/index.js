import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { formatNumber, getWrappedAddress, isInvalidAmount, ZERO_ADDRESS } from 'utils/formatNumber'
import { customNotify } from 'utils/notify'
import { useAddLiquidity } from 'hooks/useLiquidity'
import { useNetwork, useSettings, useWalletModal } from 'state/settings/hooks'
import { getWBNBAddress } from 'utils/addressHelpers'
import StyledButton from 'components/Buttons/styledButton'
import TokenInput from 'components/Input/TokenInput'
import Switch from 'components/Switch'
import { DEFAULT_CHAIN_ID, POOL_TYPES } from 'config/constants'
import { useAssets } from 'state/assets/hooks'
import { usePools } from 'state/pools/hooks'
import LiquidityInfo from '../../yourLiquidity/components/liquidityInfo'
import useCheckInviter from '../../../../hooks/useCheckInviter'
import { toast } from 'react-toastify'

const TABS = ['STABLE', 'VOLATILE']

let previousPair

const V1Add = () => {
  const [firstAmount, setFirstAmount] = useState('')
  const [firstAsset, setFirstAsset] = useState()
  const [secondAmount, setSecondAmount] = useState('')
  const [secondAsset, setSecondAsset] = useState()
  const [inviter, setInviter] = useState(ZERO_ADDRESS)
  const [activeTab, setActiveTab] = useState(TABS[1])
  const [init, setInit] = useState(false)
  // const [options, setoptions] = useState(false)
  const { account } = useWeb3React()
  const { openWalletModal } = useWalletModal()
  const { onAdd, onAddAndStake } = useAddLiquidity()
  const assets = useAssets()
  const { slippage, deadline } = useSettings()
  const { address: poolAddress } = useParams()
  const pools = usePools()
  const navigate = useNavigate()
  const { networkId } = useNetwork()

  const v1pools = useMemo(() => {
    return pools.filter((fusion) => fusion.type === POOL_TYPES.V1)
  }, [pools])
  useEffect(() => {
    if (v1pools && v1pools.length > 0 && poolAddress) {
      const item = v1pools.find((ele) => ele.address.toLowerCase() === poolAddress.toLowerCase())
      if (!item) {
        navigate('/404')
      }
    }
  }, [v1pools, poolAddress])

  const isStable = useMemo(() => {
    return activeTab === TABS[0]
  }, [activeTab])

  // const isInvited = useMemo(() => {
  //   return useCheckInviter(inviter)
  // }, [inviter])

  useEffect(() => {
    // const inviterParam = window.localStorage.getItem('inviter')
    // if (inviterParam) {
    //   setInviter(inviterParam)
    // }
    if (!poolAddress) {
      if (!firstAsset) {
        if (networkId === DEFAULT_CHAIN_ID) {
          setFirstAsset(assets.find((asset) => asset.symbol === 'YAKA'))
        } else {
          setFirstAsset(assets.find((asset) => asset.symbol === 'BNB'))
        }
      }
      if (!secondAsset) {
        if (networkId === DEFAULT_CHAIN_ID) {
          setSecondAsset(assets.find((asset) => asset.symbol === 'SEI'))
        } else {
          setSecondAsset(assets.find((asset) => asset.symbol === 'YAKA'))
        }
      }
    } else if (v1pools && v1pools.length > 0 && !init) {
      const item = v1pools.find((ele) => ele.address.toLowerCase() === poolAddress)

      setFirstAsset(
        assets.find((asset) =>
          item.token0.address.toLowerCase() === getWBNBAddress(asset.chainId).toLowerCase()
            ? // ? asset.symbol === 'WSEI'
              asset.symbol === 'SEI'
            : asset.address.toLowerCase() === item.token0.address.toLowerCase(),
        ),
      )
      setSecondAsset(
        assets.find((asset) =>
          item.token1.address.toLowerCase() === getWBNBAddress(asset.chainId).toLowerCase()
            ? // ? asset.symbol === 'WSEI'
              asset.symbol === 'SEI'
            : asset.address.toLowerCase() === item.token1.address.toLowerCase(),
        ),
      )
      setActiveTab(item.stable ? TABS[0] : TABS[1])
      setInit(true)
    }
  }, [assets, poolAddress, v1pools, inviter])

  useEffect(() => {
    if (firstAsset) {
      setFirstAsset(assets.find((asset) => asset.address === firstAsset.address))
    }
    if (secondAsset) {
      setSecondAsset(assets.find((asset) => asset.address === secondAsset.address))
    }
  }, [assets, firstAsset, secondAsset])

  const pool = useMemo(() => {
    if (v1pools && v1pools.length > 0 && firstAsset && secondAsset) {
      return v1pools.find(
        (pool) =>
          [getWrappedAddress(firstAsset), getWrappedAddress(secondAsset)].includes(getWrappedAddress(pool.token0)) &&
          [getWrappedAddress(firstAsset), getWrappedAddress(secondAsset)].includes(getWrappedAddress(pool.token1)) &&
          pool.stable === isStable &&
          pool.type === POOL_TYPES.V1,
      )
    } else {
      return null
    }
  }, [firstAsset, secondAsset, v1pools, isStable])

  const isReverse = useMemo(() => {
    if (pool && firstAsset) {
      return getWrappedAddress(pool.token1) === getWrappedAddress(firstAsset)
    }
    return false
  }, [pool, firstAsset])

  const onFirstChange = useCallback(
    (val) => {
      setFirstAmount(val)
      console.log('firstAsset1', firstAsset.address.toLowerCase() === getWBNBAddress(firstAsset.chainId).toLowerCase())
      console.log({ pool })
      if (pool) {
        const firstReserve = isReverse ? pool.token1.reserve : pool.token0.reserve
        const secondReserve = isReverse ? pool.token0.reserve : pool.token1.reserve
        // setSecondAmount(val ? secondReserve.times(val).div(firstReserve).dp(secondAsset.decimals).toString(10) : '')
        const data = val ? secondReserve.times(val).div(firstReserve).dp(secondAsset.decimals).toString(10) : ''
        console.log('secondReserve', secondReserve)

        console.log('data', data)
        //handle sei
        // if (firstAsset.address.toLowerCase() === getWBNBAddress(firstAsset.chainId).toLowerCase()) {
        //   setSecondAmount(Number(data) + Number(data) * 0.01)
        //   return
        // }
        // //handle sei
        // if (secondAsset.address.toLowerCase() === getWBNBAddress(secondAsset.chainId).toLowerCase()) {
        //   setSecondAmount(Number(data) - Number(data) * 0.01)
        //   return
        // }

        setSecondAmount(data)
      }
    },
    [isReverse, pool, setFirstAmount, setSecondAmount],
  )

  const onSecondChange = useCallback(
    (val) => {
      setSecondAmount(val)
      if (pool) {
        const firstReserve = isReverse ? pool.token1.reserve : pool.token0.reserve
        const secondReserve = isReverse ? pool.token0.reserve : pool.token1.reserve
        // setFirstAmount(val ? firstReserve.times(val).div(secondReserve).dp(firstAsset.decimals).toString(10) : '')
        const data = val ? firstReserve.times(val).div(secondReserve).dp(firstAsset.decimals).toString(10) : ''

        // //handle sei
        // if (firstAsset.address.toLowerCase() === getWBNBAddress(firstAsset.chainId).toLowerCase()) {
        //   setFirstAmount(Number(data) - Number(data) * 0.01)
        //   return
        // }

        // //handle sei
        // if (secondAsset.address.toLowerCase() === getWBNBAddress(secondAsset.chainId).toLowerCase()) {
        //   setFirstAmount(Number(data) + Number(data) * 0.01)
        //   return
        // }
        setFirstAmount(data)
      }
    },
    [isReverse, pool, setFirstAmount, setSecondAmount],
  )

  const errorMsg = useMemo(() => {
    if (!firstAsset || !secondAsset) {
      return 'Invalid Asset'
    }
    if (isInvalidAmount(firstAmount) || isInvalidAmount(secondAmount)) {
      return 'Invalid Amount'
    }
    console.log({ firstAsset })
    console.log({ secondAsset })

    if (firstAsset.balance.lt(firstAmount)) {
      return 'Insufficient ' + firstAsset.symbol + ' Balance'
    }
    if (secondAsset.balance.lt(secondAmount)) {
      return 'Insufficient ' + secondAsset.symbol + ' Balance'
    }
    return null
  }, [firstAmount, secondAmount, firstAsset, secondAsset])
  const isInviter = useCheckInviter(inviter)

  const onAddAndStakeLiquidity = useCallback(() => {
    if (errorMsg) {
      customNotify(errorMsg, 'warn')
      return
    }
    // if (inviter && !isInviter && inviter !== ZERO_ADDRESS) {
    //   localStorage.setItem('inviter', ZERO_ADDRESS)
    //   setInviter(ZERO_ADDRESS)
    //   toast.error(`Invalid inviter`, {
    //     icon: false,
    //     style: { width: '300px' },
    //   })
    //   return
    // }
    onAddAndStake(pool, firstAsset, secondAsset, firstAmount, secondAmount, isStable, slippage, deadline, inviter)
  }, [pool, firstAsset, secondAsset, firstAmount, secondAmount, isStable, slippage, deadline])

  const onAddLqiduity = useCallback(() => {
    if (errorMsg) {
      customNotify(errorMsg, 'warn')
      return
    }
    // console.log(inviter, isInviter)
    // if (inviter && !isInviter && inviter !== ZERO_ADDRESS) {
    //   localStorage.setItem('inviter', ZERO_ADDRESS)
    //   setInviter(ZERO_ADDRESS)
    //   toast.error(`Invalid inviter`, {
    //     icon: false,
    //     style: { width: '300px' },
    //   })
    //   return
    // }
    onAdd(firstAsset, secondAsset, firstAmount, secondAmount, isStable, slippage, deadline, inviter, pool)
  }, [firstAsset, secondAsset, firstAmount, secondAmount, isStable, slippage, deadline, inviter])

  useEffect(() => {
    if (pool) {
      if (previousPair !== pool.address) {
        previousPair = pool.address
        const firstReserve = isReverse ? pool.token1.reserve : pool.token0.reserve
        const secondReserve = isReverse ? pool.token0.reserve : pool.token1.reserve
        if (firstAmount && secondAmount) {
          setSecondAmount(secondReserve.times(firstAmount).div(firstReserve).dp(secondAsset.decimals).toString(10))
        }

        if (!firstAmount && secondAmount) {
          setFirstAmount(firstReserve.times(secondAmount).div(secondReserve).dp(firstAsset.decimals).toString(10))
        }

        if (firstAmount && !secondAmount) {
          setSecondAmount(secondReserve.times(firstAmount).div(firstReserve).dp(secondAsset.decimals).toString(10))
        }
      } else {
        previousPair = pool.address
      }
    } else {
      previousPair = undefined
    }
  }, [pool, isReverse])

  // useEffect(()=>{
  //   console.log("firstAsset",firstAsset);
  //   console.log("secondAsset",secondAsset);
  //   if(firstAsset.address.toLowerCase() === getWBNBAddress(firstAsset.chainId).toLowerCase()){
  //     setSecondAmount(secondAmount+secondAmount*0.01)
  //   }

  // },[firstAmount])

  console.log({ firstAsset })

  return (
    <div>
      <Switch data={TABS} active={activeTab} setActive={setActiveTab} />
      <div className='mt-3 md:mt-[11.9px]'>
        <div className='flex flex-col w-full items-center justify-center '>
          <TokenInput
            title='Input'
            asset={firstAsset}
            setAsset={setFirstAsset}
            otherAsset={secondAsset}
            setOtherAsset={setSecondAsset}
            amount={firstAmount}
            onInputChange={(e) => onFirstChange(e)}
          />
          <div className='my-[17px] z-[8]'>
            <img src='/images/common/square-plus.svg' alt='' />
          </div>
          <TokenInput
            title='Input'
            asset={secondAsset}
            setAsset={setSecondAsset}
            otherAsset={firstAsset}
            setOtherAsset={setFirstAsset}
            amount={secondAmount}
            onInputChange={(e) => onSecondChange(e)}
          />
        </div>
      </div>
      {pool ? (
        <LiquidityInfo pool={pool} />
      ) : (
        firstAsset &&
        secondAsset && (
          <div className='mt-[13.6px]'>
            <div className='text-secondary text-sm md:text-[13.6px] pb-[0.85px] border-b border-[#757384]'>Starting Liquidity Info</div>
            <div className='flex justify-around mt-[13.6px] w-full'>
              <div className='flex flex-col items-center justify-between'>
                <p className='text-white text-sm md:text-[13.6px] leading-[17px] font-medium'>
                  {firstAmount && secondAmount && !new BigNumber(secondAmount).isZero() ? formatNumber(firstAmount / secondAmount) : '0'}
                </p>
                <p className='text-white text-sm md:text-[13.6px] leading-[17px]'>
                  {firstAsset.symbol} per {secondAsset.symbol}
                </p>
              </div>
              <div className='flex flex-col items-center justify-between'>
                <p className='text-white text-sm md:text-[13.6px] leading-[17px] font-medium'>
                  {firstAmount && secondAmount && !new BigNumber(firstAmount).isZero() ? formatNumber(secondAmount / firstAmount) : '0'}
                </p>
                <p className='text-white text-sm md:text-[13.6px] leading-17px'>
                  {secondAsset.symbol} per {firstAsset.symbol}
                </p>
              </div>
            </div>
          </div>
        )
      )}
      {account ? (
        <div className='mt-[27.2px] flex flex-col space-y-[10.2px]'>
          {pool && pool.gauge.address !== ZERO_ADDRESS && false && (
            <StyledButton onClickHandler={onAddAndStakeLiquidity} content='ADD LIQUIDITY & STAKE LP' className='py-[11.05px] px-[16.15px] w-full' />
          )}
          <StyledButton onClickHandler={onAddLqiduity} content='ADD LIQUIDITY' className='py-[11.05px] px-[16.15px] w-full' />
        </div>
      ) : (
        <StyledButton onClickHandler={openWalletModal} content='CONNECT WALLET' className='py-[11.05px] px-[16.15px] mt-[13.6px] w-full' />
      )}
    </div>
  )
}

export default V1Add

import React, { useState, useEffect, createContext } from 'react'
import { useLocation } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import useRefresh from 'hooks/useRefresh'
import { fetchVaultsData } from 'utils/fetchVaultsData'
import { fetchUserVaultsData } from 'utils/fetchUserInfo'
import { ZERO_VALUE, fromWei } from 'utils/formatNumber'
import { useAssets } from 'state/assets/hooks'
import { useNetwork } from 'state/settings/hooks'

const VaultsContext = createContext([])

const VaultsContextProvider = ({ children }) => {
  const [vaults, setVaults] = useState([])
  const { fastRefresh } = useRefresh()
  const route = useLocation()
  const { pathname } = route
  const assets = useAssets()
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  useEffect(() => {
    const getVaultsData = async () => {
      try {
        const data = await fetchVaultsData(networkId)
        let userInfos = []
        if (account && data.length > 0) {
          userInfos = await fetchUserVaultsData(data, account, networkId)
        }
        const final = data.map((vault) => {
          const asset0 = assets.find((asset) => asset.address.toLowerCase() === vault.token0Address.toLowerCase())
          const asset1 = assets.find((asset) => asset.address.toLowerCase() === vault.token1Address.toLowerCase())
          const asset2 = assets.find((asset) => asset.address.toLowerCase() === vault.rewardAddress.toLowerCase())
          const reserve0 = fromWei(vault.reserve0, asset0.decimals)
          const reserve1 = fromWei(vault.reserve1, asset1.decimals)
          const tvl = reserve0.times(asset0.price).plus(reserve1.times(asset1.price))
          const lpPrice = vault.totalSupply.isZero() ? ZERO_VALUE : tvl.div(vault.totalSupply)
          const gaugeTvl = vault.gaugeSupply.times(lpPrice)
          const reward0PerYearInUsd = fromWei(vault.rewardRate0, asset0.decimals)
            .times(asset0.price)
            .times(86400 * 365)
          const reward1PerYearInUsd = fromWei(vault.rewardRate1, asset1.decimals)
            .times(asset1.price)
            .times(86400 * 365)
          const reward2PerYearInUsd = fromWei(vault.rewardRate2, asset2.decimals)
            .times(asset2.price)
            .times(86400 * 365)
          const isTwoRewards = [asset0.address.toLowerCase(), asset1.address.toLowerCase()].includes(asset2.address.toLowerCase())
          const totalRewards = reward0PerYearInUsd.plus(reward1PerYearInUsd).plus(isTwoRewards ? 0 : reward2PerYearInUsd)
          const apr = gaugeTvl.isZero() ? ZERO_VALUE : totalRewards.div(gaugeTvl).times(100)

          const found = userInfos.find((item) => item.address.toLowerCase() === vault.address.toLowerCase())
          let user = {
            walletBalance: ZERO_VALUE,
            gaugeBalance: ZERO_VALUE,
            gaugeEarned: ZERO_VALUE,
            totalLp: ZERO_VALUE,
            staked0: ZERO_VALUE,
            staked1: ZERO_VALUE,
            stakedUsd: ZERO_VALUE,
            earned0: ZERO_VALUE,
            earned1: ZERO_VALUE,
            earnedUsd: ZERO_VALUE,
            total0: ZERO_VALUE,
            total1: ZERO_VALUE,
            totalUsd: ZERO_VALUE,
          }
          if (found) {
            const earned0 = fromWei(found.earned0, asset0.decimals)
            const earned1 = fromWei(found.earned1, asset1.decimals)
            const earned2 = fromWei(found.earned2, asset1.decimals)

            user = {
              ...found,
              staked0: vault.totalSupply ? found.gaugeBalance.times(reserve0).div(vault.totalSupply) : ZERO_VALUE,
              staked1: vault.totalSupply ? found.gaugeBalance.times(reserve1).div(vault.totalSupply) : ZERO_VALUE,
              stakedUsd: found.gaugeBalance.times(lpPrice),
              total0: vault.totalSupply ? found.totalLp.times(reserve0).div(vault.totalSupply) : ZERO_VALUE,
              total1: vault.totalSupply ? found.totalLp.times(reserve1).div(vault.totalSupply) : ZERO_VALUE,
              totalUsd: found.totalLp.times(lpPrice),
              earned0,
              earned1,
              earned2: isTwoRewards ? null : earned2,
              earnedUsd: earned0
                .times(asset0.price)
                .plus(earned1.times(asset1.price))
                .plus(isTwoRewards ? 0 : earned2.times(asset2.price)),
            }
          }

          return {
            address: vault.address,
            symbol: vault.symbol,
            title: 'Ichi',
            totalSupply: vault.totalSupply,
            lpPrice,
            token0: {
              ...asset0,
              reserve: reserve0,
              allowed: vault.allowed0,
            },
            token1: {
              ...asset1,
              reserve: reserve1,
              allowed: vault.allowed1,
            },
            reward: asset2,
            depositToken: vault.allowed0 ? asset0.symbol : asset1.symbol,
            gauge: {
              address: vault.gaugeAddress,
              tvl: gaugeTvl,
              apr,
              pooled0: vault.totalSupply ? reserve0.times(vault.gaugeSupply).div(vault.totalSupply) : ZERO_VALUE,
              pooled1: vault.totalSupply ? reserve1.times(vault.gaugeSupply).div(vault.totalSupply) : ZERO_VALUE,
            },
            account: user,
          }
        })
        setVaults(final)
      } catch (e) {
        console.error('vaults fetched had error', e)
      }
    }
    if (assets.length > 0) {
      getVaultsData()
    } else {
      setVaults([])
    }
  }, [fastRefresh, pathname, assets, account, networkId])

  return <VaultsContext.Provider value={vaults}>{children}</VaultsContext.Provider>
}

export { VaultsContext, VaultsContextProvider }

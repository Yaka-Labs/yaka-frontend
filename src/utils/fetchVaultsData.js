import { ICHI_VAULTS } from 'config/constants/ichiVaults'
import { gaugeSimpleAbi, ichiVaultAbi } from 'config/abi/v3'
import { multicall } from './multicall'
import { fromWei } from './formatNumber'

const fetchTotalSupply = async (chainId) => {
  const calls = ICHI_VAULTS[chainId].map((vault) => {
    return {
      address: vault.address,
      name: 'totalSupply',
    }
  })

  const rawRes = await multicall(ichiVaultAbi, calls, chainId)
  return rawRes.map((totalSupply) => {
    return fromWei(totalSupply)
  })
}

const fetchTotalAmounts = async (chainId) => {
  const calls = ICHI_VAULTS[chainId].map((vault) => {
    return {
      address: vault.address,
      name: 'getTotalAmounts',
    }
  })

  const rawRes = await multicall(ichiVaultAbi, calls, chainId)
  return rawRes
}

const fetchGaugeReward0 = async (chainId) => {
  const calls = ICHI_VAULTS[chainId].map((vault) => {
    return {
      address: vault.gaugeAddress,
      name: 'rewardRate',
      params: [vault.token0Address],
    }
  })

  const rawRes = await multicall(gaugeSimpleAbi, calls, chainId)
  return rawRes
}

const fetchGaugeReward1 = async (chainId) => {
  const calls = ICHI_VAULTS[chainId].map((vault) => {
    return {
      address: vault.gaugeAddress,
      name: 'rewardRate',
      params: [vault.token1Address],
    }
  })

  const rawRes = await multicall(gaugeSimpleAbi, calls, chainId)
  return rawRes
}

const fetchGaugeReward2 = async (chainId) => {
  const calls = ICHI_VAULTS[chainId].map((vault) => {
    return {
      address: vault.gaugeAddress,
      name: 'rewardRate',
      params: [vault.rewardAddress],
    }
  })

  const rawRes = await multicall(gaugeSimpleAbi, calls, chainId)
  return rawRes
}

const fetchGaugeSupply = async (chainId) => {
  const calls = ICHI_VAULTS[chainId].map((vault) => {
    return {
      address: vault.address,
      name: 'balanceOf',
      params: [vault.gaugeAddress],
    }
  })

  const rawRes = await multicall(ichiVaultAbi, calls, chainId)
  return rawRes.map((ele) => {
    return fromWei(ele)
  })
}

export const fetchVaultsData = async (chainId) => {
  if (ICHI_VAULTS[chainId].length === 0) return []
  const [totalSupply, totalAmounts, reward2, reward0, reward1, gaugeSupply] = await Promise.all([
    fetchTotalSupply(chainId),
    fetchTotalAmounts(chainId),
    fetchGaugeReward2(chainId),
    fetchGaugeReward0(chainId),
    fetchGaugeReward1(chainId),
    fetchGaugeSupply(chainId),
  ])
  return ICHI_VAULTS[chainId].map((vault, index) => {
    return {
      ...vault,
      totalSupply: totalSupply[index],
      reserve0: totalAmounts[index][0]._hex,
      reserve1: totalAmounts[index][1]._hex,
      rewardRate2: reward2[index][0]._hex,
      rewardRate0: reward0[index][0]._hex,
      rewardRate1: reward1[index][0]._hex,
      gaugeSupply: gaugeSupply[index],
    }
  })
}

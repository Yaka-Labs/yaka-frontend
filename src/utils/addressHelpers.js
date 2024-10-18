import { FUSION_QUOTER_ADDRESSES, FUSION_ROUTER_ADDRESSES, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, V1_ROUTER_ADDRESSES } from 'thena-sdk-core'
import addresses from 'config/constants/contracts'
import { GAMMA_UNIPROXY_ADDRESSES, VAULT_DEPOSIT_GUARD_ADDRESS } from 'config/constants/v3/addresses'
import { DEFAULT_CHAIN_ID } from '../config/constants'
import contracts from 'config/constants/contracts'

export const getAddress = (address) => {
  return address[DEFAULT_CHAIN_ID]
}

export const getMultiCallAddress = (chainId) => {
  return addresses.multiCall[chainId]
}

export const getTHEAddress = (chainId) => {
  return addresses.THE[chainId]
}

export const getWBNBAddress = (chainId) => {
  return addresses.WBNB[chainId]
}

export const getETHAddress = (chainId) => {
  return addresses.ETH[chainId]
}

export const getPairV3APIAddress = (chainId) => {
  return addresses.pairV3API[chainId]
}

export const getThenianAddress = () => {
  return getAddress(addresses.thenian)
}

export const getRouterAddress = (chainId) => {
  if (chainId === DEFAULT_CHAIN_ID) {
    return contracts.router[chainId]
  }

  return V1_ROUTER_ADDRESSES[chainId]
}

export const getYakaFaucetAddress = () => {
  return '0xECccCA2eC94C1D01Cd83DA6217541082ac625a48'
}

export const getActivityAddress = (chainId) => {
  if (chainId === 1328) {
    return '0x8Cd4ebe9C68CEc2a1308961cb01F5EFAD32810F5'
  }
  if (chainId === 1329) {
    return '0x8Cd4ebe9C68CEc2a1308961cb01F5EFAD32810F5'
  }
  return V1_ROUTER_ADDRESSES[chainId]
}

export const getVeTHEAddress = () => {
  console.log('addresses', getAddress(addresses.veTHE))
  return getAddress(addresses.veTHE)
}

export const getVeDistAddress = () => {
  return getAddress(addresses.veDist)
}

export const getVoterAddress = () => {
  return getAddress(addresses.voter)
}

export const getMinterAddress = () => {
  return getAddress(addresses.minter)
}

export const getRewardsV3APIAddress = () => {
  return getAddress(addresses.rewardsV3API)
}

export const getVeTHEV3APIAddress = () => {
  return getAddress(addresses.veTHEV3API)
}

export const getStakingAddress = () => {
  return getAddress(addresses.staking)
}

export const getNewStakingAddress = () => {
  return getAddress(addresses.newStaking)
}

export const getRoyaltyAddress = () => {
  return getAddress(addresses.royalty)
}

export const getDibsAddress = () => {
  return getAddress(addresses.dibs)
}

export const getDibsLotteryAddress = () => {
  return getAddress(addresses.dibsLottery)
}

export const getMuonAddress = () => {
  return getAddress(addresses.muon)
}

export const getQuoterAddress = () => {
  return getAddress(FUSION_QUOTER_ADDRESSES)
}

export const getGammaUNIProxyAddress = () => {
  return getAddress(GAMMA_UNIPROXY_ADDRESSES)
}

export const getAlgebraAddress = (chainId) => {
  if (chainId === 1328) return '0xE94de02e52Eaf9F0f6Bf7f16E4927FcBc2c09bC7'
  if (chainId === 1329) return '0xE94de02e52Eaf9F0f6Bf7f16E4927FcBc2c09bC7'
  return NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId]
}

export const getV3VoterAddress = () => {
  return getAddress(addresses.v3voter)
}

export const getFusionRouterAddress = (chainId) => {
  return FUSION_ROUTER_ADDRESSES[chainId]
}

export const getOpenOceanRouterAddress = () => {
  return getAddress(addresses.openOcean)
}

export const getVaultDepositAddress = (networkId) => {
  return VAULT_DEPOSIT_GUARD_ADDRESS[networkId]
}

// CORE
export const getTCManagerAddress = () => {
  return getAddress(addresses.tcManager)
}

export const getSeiCampaignStage2Address = () => {
  return getAddress(addresses.seiCampaignStage2Address)
}

export const getTokenSaleAddress = () => {
  return getAddress(addresses.tokenSaleAddress)
}

export const getInitialDistributorAddress = () => {
  return getAddress(addresses.initialDistributorAddress)
}

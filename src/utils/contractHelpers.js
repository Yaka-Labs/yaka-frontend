import {
  ERC20Abi,
  gaugeAbi,
  multiCallAbi,
  routerAbi,
  ThenianAbi,
  veDistAbi,
  veTHEAbi,
  bribeAbi,
  minterAbi,
  pairAbi,
  pairV3APIAbi,
  stakingAbi,
  royaltyAbi,
  dibsAbi,
  muonAbi,
  wbnbAbi,
  dibsLotteryAbi,
  veTheV3ApiAbi,
  rewardsV3APIAbi,
  v3voterAbi,
  extraRewarderAbi,
  activityAbi,
  yakaFaucetAbi,
} from 'config/abi'
import {
  algebraAbi,
  gammaClearingAbi,
  gammaHypervisorAbi,
  gammaUniProxyAbi,
  gaugeSimpleAbi,
  ichiVaultAbi,
  quoterAbi,
  vaultDepositGaurdAbi,
  defiedgeStrategyAbi,
  seiCampaignStage2Abi,
  tokenSaleAbi,
  initialDistributorAbi,
} from 'config/abi/v3'
import { tcManagerAbi, tcSpotAbi } from 'config/abi/core'
import { getWeb3NoAccount } from './web3'
import {
  getActivityAddress,
  getAlgebraAddress,
  getDibsAddress,
  getDibsLotteryAddress,
  getGammaUNIProxyAddress,
  getMinterAddress,
  getMultiCallAddress,
  getMuonAddress,
  getNewStakingAddress,
  getQuoterAddress,
  getRewardsV3APIAddress,
  getRouterAddress,
  getRoyaltyAddress,
  getStakingAddress,
  getTCManagerAddress,
  getThenianAddress,
  getV3VoterAddress,
  getVaultDepositAddress,
  getVeDistAddress,
  getVeTHEAddress,
  getVeTHEV3APIAddress,
  getWBNBAddress,
  getSeiCampaignStage2Address,
  getYakaFaucetAddress,
  getPairV3APIAddress,
  getTokenSaleAddress,
  getInitialDistributorAddress,
} from './addressHelpers'

const getContract = (abi, address, web3) => {
  const _web3 = web3 ?? getWeb3NoAccount()
  return new _web3.eth.Contract(abi, address)
}

export const getERC20Contract = (web3, address) => {
  return getContract(ERC20Abi, address, web3)
}

export const getWBNBContract = (web3, chainId) => {
  return getContract(wbnbAbi, getWBNBAddress(chainId), web3)
}

export const getMulticallContract = (web3, chainId) => {
  return getContract(multiCallAbi, getMultiCallAddress(chainId), web3)
}

export const getThenianContract = (web3) => {
  return getContract(ThenianAbi, getThenianAddress(), web3)
}

export const getYakaFaucetContract = (web3) => {
  return getContract(yakaFaucetAbi, getYakaFaucetAddress(), web3)
}

export const getRouterContract = (web3, chainId) => {
  return getContract(routerAbi, getRouterAddress(chainId), web3)
}

export const getActivityContract = (web3, chainId) => {
  return getContract(activityAbi, getActivityAddress(chainId), web3)
}

export const getVeTHEContract = (web3) => {
  return getContract(veTHEAbi, getVeTHEAddress(), web3)
}

export const getVeDistContract = (web3) => {
  return getContract(veDistAbi, getVeDistAddress(), web3)
}

export const getMinterContract = (web3) => {
  return getContract(minterAbi, getMinterAddress(), web3)
}

export const getVeTHEV3APIContract = (web3) => {
  return getContract(veTheV3ApiAbi, getVeTHEV3APIAddress(), web3)
}

export const getRewardsV3APIContract = (web3) => {
  return getContract(rewardsV3APIAbi, getRewardsV3APIAddress(), web3)
}

export const getGaugeContract = (web3, address) => {
  return getContract(gaugeAbi, address, web3)
}

export const getBribeContract = (web3, address) => {
  return getContract(bribeAbi, address, web3)
}

export const getPairContract = (web3, address) => {
  return getContract(pairAbi, address, web3)
}

export const getPairV3APIContract = (web3, chainId) => {
  return getContract(pairV3APIAbi, getPairV3APIAddress(chainId), web3)
}

export const getStakingContract = (web3) => {
  return getContract(stakingAbi, getStakingAddress(), web3)
}

export const getNewStakingContract = (web3) => {
  return getContract(stakingAbi, getNewStakingAddress(), web3)
}

export const getRoyaltyContract = (web3) => {
  return getContract(royaltyAbi, getRoyaltyAddress(), web3)
}

export const getDibsContract = (web3) => {
  return getContract(dibsAbi, getDibsAddress(), web3)
}

export const getDibsLotteryContract = (web3) => {
  return getContract(dibsLotteryAbi, getDibsLotteryAddress(), web3)
}

export const getMuonContract = (web3) => {
  return getContract(muonAbi, getMuonAddress(), web3)
}

export const getQuoterContract = (web3) => {
  return getContract(quoterAbi, getQuoterAddress(), web3)
}

export const getGammaUNIProxyContract = (web3) => {
  return getContract(gammaUniProxyAbi, getGammaUNIProxyAddress(), web3)
}

export const getGammaClearingContract = (address, web3) => {
  return getContract(gammaClearingAbi, address, web3)
}

export const getGammaHyperVisorContract = (web3, address) => {
  return getContract(gammaHypervisorAbi, address, web3)
}

export const getAlgebraContract = (web3, chainId) => {
  return getContract(algebraAbi, getAlgebraAddress(chainId), web3)
}

export const getV3VoterContract = (web3) => {
  return getContract(v3voterAbi, getV3VoterAddress(), web3)
}

export const getExtraRewarder = (web3) => {
  return getContract(extraRewarderAbi, '0xA7266B2303725F731851dfE944a432f8A2EA5c9c', web3)
}

export const getVaultDepositContract = (networkId, web3) => {
  return getContract(vaultDepositGaurdAbi, getVaultDepositAddress(networkId), web3)
}

export const getDefiedgeStrategyContract = (address, web3) => {
  return getContract(defiedgeStrategyAbi, address, web3)
}

// CORE
export const getTCManagerContract = (web3) => {
  return getContract(tcManagerAbi, getTCManagerAddress(), web3)
}

export const getTCSpotContract = (web3, address) => {
  return getContract(tcSpotAbi, address, web3)
}

export const getIchiVaultContract = (web3, address) => {
  return getContract(ichiVaultAbi, address, web3)
}

export const getGaugeSimpleContract = (web3, address) => {
  return getContract(gaugeSimpleAbi, address, web3)
}

export const getSeiCampaignStage2Contract = (web3) => {
  return getContract(seiCampaignStage2Abi, getSeiCampaignStage2Address(), web3)
}
export const getTokenSaleContract = (web3) => {
  return getContract(tokenSaleAbi, getTokenSaleAddress(), web3)
}

export const getInitialDistributorContract = (web3) => {
  return getContract(initialDistributorAbi, getInitialDistributorAddress(), web3)
}

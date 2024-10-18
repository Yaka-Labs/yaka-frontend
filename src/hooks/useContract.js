import { useMemo } from 'react'
import {
  getAlgebraContract,
  getDibsContract,
  getDibsLotteryContract,
  getExtraRewarder,
  getGammaUNIProxyContract,
  getMinterContract,
  getMuonContract,
  getNewStakingContract,
  getQuoterContract,
  getRouterContract,
  getRoyaltyContract,
  getStakingContract,
  getTCManagerContract,
  getThenianContract,
  getV3VoterContract,
  getVaultDepositContract,
  getVeDistContract,
  getVeTHEContract,
  getActivityContract,
} from 'utils/contractHelpers'
import { useNetwork } from 'state/settings/hooks'
import useWeb3 from './useWeb3'

export const useThenian = () => {
  const web3 = useWeb3()
  return useMemo(() => getThenianContract(web3), [web3])
}

export const useRouter = () => {
  const web3 = useWeb3()
  const { networkId } = useNetwork()
  return useMemo(() => getRouterContract(web3, networkId), [web3, networkId])
}

export const useActivity = () => {
  const web3 = useWeb3()
  const { networkId } = useNetwork()
  return useMemo(() => getActivityContract(web3, networkId), [web3, networkId])
}

export const useVeTHE = () => {
  const web3 = useWeb3()
  return useMemo(() => getVeTHEContract(web3), [web3])
}

export const useVeDist = () => {
  const web3 = useWeb3()
  return useMemo(() => getVeDistContract(web3), [web3])
}

export const useMinter = () => {
  const web3 = useWeb3()
  return useMemo(() => getMinterContract(web3), [web3])
}

export const useStaking = () => {
  const web3 = useWeb3()
  return useMemo(() => getStakingContract(web3), [web3])
}

export const useNewStaking = () => {
  const web3 = useWeb3()
  return useMemo(() => getNewStakingContract(web3), [web3])
}

export const useRoyalty = () => {
  const web3 = useWeb3()
  return useMemo(() => getRoyaltyContract(web3), [web3])
}

export const useDibs = () => {
  const web3 = useWeb3()
  return useMemo(() => getDibsContract(web3), [web3])
}

export const useDibsLottery = () => {
  const web3 = useWeb3()
  return useMemo(() => getDibsLotteryContract(web3), [web3])
}

export const useMuon = () => {
  const web3 = useWeb3()
  return useMemo(() => getMuonContract(web3), [web3])
}

export const useQuoter = () => {
  const web3 = useWeb3()
  return useMemo(() => getQuoterContract(web3), [web3])
}

export const useGammaUNIProxy = () => {
  const web3 = useWeb3()
  return useMemo(() => getGammaUNIProxyContract(web3), [web3])
}

export const useAlgebra = () => {
  const web3 = useWeb3()
  const { networkId } = useNetwork()
  return useMemo(() => getAlgebraContract(web3, networkId), [web3, networkId])
}

export const useV3Voter = () => {
  const web3 = useWeb3()
  return useMemo(() => getV3VoterContract(web3), [web3])
}

export const useExtraRewarder = () => {
  const web3 = useWeb3()
  return useMemo(() => getExtraRewarder(web3), [web3])
}

export const useVaultDepositGaurd = () => {
  const web3 = useWeb3()
  const { networkId } = useNetwork()
  return useMemo(() => getVaultDepositContract(networkId, web3), [web3, networkId])
}

// Core
export const useTCManager = () => {
  const web3 = useWeb3()
  return useMemo(() => getTCManagerContract(web3), [web3])
}

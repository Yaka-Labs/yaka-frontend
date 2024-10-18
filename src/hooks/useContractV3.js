import { useMemo } from 'react'
import { MULTICALL_ADDRESSES, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from 'thena-sdk-core'
import { GAMMA_UNIPROXY_ADDRESSES, VAULT_DEPOSIT_GUARD_ADDRESS } from 'config/constants/v3/addresses'
import { algebraAbi, gammaUniProxyAbi, multicallV3Abi, quoterAbi, vaultDepositGaurdAbi } from 'config/abi/v3'
import { getContract } from 'utils/contract'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useContract(addressOrAddressMap, ABI, withSignerIfPossible = true) {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account])
}

export function useContracts(addressOrAddressMaps, ABI, withSignerIfPossible = true) {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMaps || !ABI || !library || !chainId) return []
    return addressOrAddressMaps.map((addressOrAddressMap) => {
      let address
      if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
      else address = addressOrAddressMap[chainId]
      if (!address) return null
      try {
        return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    })
  }, [addressOrAddressMaps, ABI, library, chainId, withSignerIfPossible, account])
}

const FUSION_QUOTER_ADDRESSES_SEI = {
  56: '0xeA68020D6A9532EeC42D4dB0f92B83580c39b2cA',
  204: '0xF15B76244C184b4CCD37F419e0F4591B3FAB9290',
  1328: '0x28DeD2af752655Df5Ee92450DC259F92a5ABe449',
  1329: '0x28DeD2af752655Df5Ee92450DC259F92a5ABe449',
}

export function useMulticall2Contract() {
  return useContract(MULTICALL_ADDRESSES, multicallV3Abi, false)
}

export function useV3Quoter() {
  return useContract(FUSION_QUOTER_ADDRESSES_SEI, quoterAbi, false)
}

export function useV3GammaUniproxy() {
  return useContract(GAMMA_UNIPROXY_ADDRESSES, gammaUniProxyAbi, false)
}

export function useV3Algebra() {
  return useContract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, algebraAbi, false)
}

export function useV3VaultDepositGaurd() {
  return useContract(VAULT_DEPOSIT_GUARD_ADDRESS, vaultDepositGaurdAbi, false)
}

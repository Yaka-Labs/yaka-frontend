import Web3 from 'web3'
import { ChainId } from 'thena-sdk-core'
import getRpcUrl from './getRpcUrl'
import { DEFAULT_CHAIN_ID } from '../config/constants'

export const getWeb3NoAccount = (networkId = DEFAULT_CHAIN_ID) => {
  const RPC_URL = getRpcUrl(networkId)
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 })
  return new Web3(httpProvider)
}

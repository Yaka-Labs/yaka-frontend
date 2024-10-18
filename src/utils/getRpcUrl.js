import random from 'lodash/random'
import { ChainId } from 'thena-sdk-core'
import { DEFAULT_CHAIN_ID } from '../config/constants'

// Array of available nodes to connect to
const Nodes = {
  // [ChainId.BSC]: ['https://bsc-dataseed.binance.org/', 'https://bsc.publicnode.com/', 'https://bscrpc.com/'],
  // [ChainId.OPBNB]: ['https://opbnb-mainnet-rpc.bnbchain.org'],
  1328: ['https://evm-rpc-testnet.sei-apis.com'],
  1329: ['https://evm-rpc.sei-apis.com'],
}

const getRpcUrl = (networkId = DEFAULT_CHAIN_ID) => {
  const mainNodes = Nodes[networkId]
  return mainNodes[random(0, mainNodes.length - 1)]
}

export default getRpcUrl

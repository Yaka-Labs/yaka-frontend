import { ChainId } from 'thena-sdk-core'

const NetworkData = {
  [ChainId.BSC]: {
    chainId: `0x${ChainId.BSC.toString(16)}`,
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  [ChainId.OPBNB]: {
    chainId: `0x${ChainId.OPBNB.toString(16)}`,
    chainName: 'opBNB',
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://opbnb-mainnet-rpc.bnbchain.org'],
    blockExplorerUrls: ['https://opbnb.bscscan.com/'],
  },
  // [713715]: {
  //   chainId: `0x${Number(713715).toString(16)}`,
  //   chainName: 'Sei Arctic-1',
  //   nativeCurrency: {
  //     name: 'Sei',
  //     symbol: 'Sei',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://evm-rpc-arctic-1.sei-apis.com'],
  //   blockExplorerUrls: ['https://seitrace.com/'],
  // },
  [1328]: {
    chainId: `0x${Number(1328).toString(16)}`,
    chainName: 'Sei testnet',
    nativeCurrency: {
      name: 'Sei',
      symbol: 'Sei',
      decimals: 18,
    },
    rpcUrls: ['https://evm-rpc-testnet.sei-apis.com'],
    blockExplorerUrls: ['https://seitrace.com/'],
  },
  [1329]: {
    chainId: `0x${Number(1329).toString(16)}`,
    chainName: 'Sei',
    nativeCurrency: {
      name: 'Sei',
      symbol: 'Sei',
      decimals: 18,
    },
    rpcUrls: ['https://evm-rpc.sei-apis.com'],
    blockExplorerUrls: ['https://seitrace.com/'],
  },
}

export const addRPC = async (networkId) => {
  const provider = window.stargate?.wallet?.ethereum?.signer?.provider?.provider ?? window.ethereum
  if (provider) {
    try {
      if (window.compassEvm) {
        await window.compassEvm.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${networkId.toString(16)}` }],
        })
      }
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      console.log('switchError', NetworkData)
      if (switchError?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [NetworkData[networkId]],
          })
          return true
        } catch (error) {
          console.error('Failed to setup the network', error)
          return false
        }
      }
      return false
    }
  }
}

export const addToken = async (asset) => {
  const provider = window.stargate?.wallet?.ethereum?.signer?.provider?.provider ?? window.ethereum
  if (provider) {
    try {
      // wasAdded is a boolean. Like any RPC method, an error can be thrown.
      const wasAdded = await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC-20 tokens, but eventually more!
          options: {
            address: asset.address, // The address of the token.
            symbol: asset.symbol, // A ticker symbol or shorthand, up to 5 characters.
            decimals: asset.decimals, // The number of decimals in the token.
            image: asset.logoURI, // A string URL of the token logo.
          },
        },
      })

      if (wasAdded) {
        console.log('Token Added!')
      } else {
        console.log('Your loss!')
      }
    } catch (error) {
      console.log(error)
    }
  }
}

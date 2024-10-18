import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

export function useActiveWeb3React() {
  const context = useWeb3React()
  const library = context.active ? new Web3Provider(context.library || window.ethereum, 'any') : undefined
  return {
    ...context,
    library,
  }
}

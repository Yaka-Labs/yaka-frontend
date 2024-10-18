import { useMemo } from 'react'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import { useNetwork } from 'state/settings/hooks'
import { getWeb3NoAccount } from 'utils/web3'

const useWeb3 = () => {
  const { library } = useWeb3React()
  const { networkId } = useNetwork()

  return useMemo(() => {
    return library ? new Web3(library) : getWeb3NoAccount(networkId)
  }, [library, networkId])
}

export default useWeb3

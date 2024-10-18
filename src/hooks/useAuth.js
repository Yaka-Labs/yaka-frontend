import { useCallback } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { ConnectorNames } from 'config/constants'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnectV2, WalletConnectConnectorV2 } from 'utils/walletConnectConnectorV2'
import { connectorsByName } from 'utils/connectors'
import { addRPC } from 'utils/addRPC'
import { customNotify } from 'utils/notify'

const CONNECTOR_LOCAL_STORAGE_KEY = 'thena-local-key'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const login = useCallback(
    (connectorID, networkId) => {
      const connector = connectorsByName[connectorID]
      localStorage.setItem('connectorID', connectorID)
      if (connector) {
        if (connectorID === ConnectorNames.Coin98Wallet) {
          if (!window.coin98 && !window.binanceChain && !window.binanceChain?.isCoin98) {
            customNotify('Coin98 Extension is not installed!', 'warn')
            return
          }
        }
        if (connectorID === ConnectorNames.OkxWallet) {
          if (typeof window.okxwallet === 'undefined') {
            customNotify('OKX Extension is not installed!', 'warn')
            return
          }
        }
        if (connectorID === ConnectorNames.CompassWallet) {
          if (typeof window.compassEvm === 'undefined') {
            customNotify('Compass Extension is not installed!', 'warn')
            return
          }
        }
        activate(connector, async (error) => {
          if (error instanceof UnsupportedChainIdError) {
            if (
              [ConnectorNames.MetaMask, ConnectorNames.OkxWallet, ConnectorNames.CompassWallet, ConnectorNames.Coinbase, ConnectorNames.TrustWallet].includes(
                connectorID,
              )
            ) {
              const hasSetup = await addRPC(networkId)
              if (hasSetup) {
                activate(connector)
              }
            } else {
              customNotify('Please connect your wallet to BNB Chain.', 'warn')
            }
          } else {
            window.localStorage.removeItem(CONNECTOR_LOCAL_STORAGE_KEY)
            if (error instanceof NoEthereumProviderError) {
              customNotify('No provider was found', 'error')
            } else if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnectV2) {
              if (connector instanceof WalletConnectConnectorV2) {
                const walletConnector = connector
                walletConnector.walletConnectProvider = null
              }
              customNotify('User denied account authorization', 'error')
            } else {
              customNotify(error.message, 'error')
            }
          }
        })
      } else {
        customNotify('The connector config is wrong', 'error')
      }
    },
    [activate],
  )

  const logout = useCallback(() => {
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName[ConnectorNames.WalletConnect].close()
      connectorsByName[ConnectorNames.WalletConnect].walletConnectProvider = null
    }
    window.localStorage.removeItem(CONNECTOR_LOCAL_STORAGE_KEY)
  }, [deactivate])

  return { login, logout }
}

export default useAuth

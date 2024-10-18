import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { ConnectorNames, SupportedChainIds } from 'config/constants'
import getNodeUrl from './getRpcUrl'
import { WalletConnectConnectorV2 } from './walletConnectConnectorV2'
import { CompassConnectConnector } from './compassConnectConnector'
import { SeifConnectConnector } from './seifConnectConnector'

const rpcUrl = getNodeUrl()

export const injected = new InjectedConnector({
  supportedChainIds: SupportedChainIds,
})

export const compass = new CompassConnectConnector()
export const seif = new SeifConnectConnector()

const walletconnect = new WalletConnectConnectorV2({
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  chains: SupportedChainIds,
  showQrModal: true,
})

const walletlink = new WalletLinkConnector({
  url: rpcUrl,
  appName: 'THENA',
  supportedChainIds: SupportedChainIds,
})

export const connectorsByName = {
  [ConnectorNames.MetaMask]: injected,
  [ConnectorNames.TrustWallet]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.Coinbase]: walletlink,
  [ConnectorNames.Coin98Wallet]: injected,
  [ConnectorNames.OkxWallet]: injected,
  [ConnectorNames.CompassWallet]: compass,
  [ConnectorNames.SeifWallet]: seif,
}

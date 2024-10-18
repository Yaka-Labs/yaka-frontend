import { AbstractConnector } from '@web3-react/abstract-connector'

export class UserRejectedRequestError extends Error {
  constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class WalletConnectConnectorV2 extends AbstractConnector {
  constructor(config) {
    super({ supportedChainIds: config.chains })
    this.config = config

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }

  handleChainChanged(chainId) {
    this.emitUpdate({ chainId })
  }

  handleAccountsChanged(accounts) {
    this.emitUpdate({ account: accounts[0] })
  }

  handleDisconnect() {
    // we have to do this because of a @walletconnect/web3-provider bug
    if (this.walletConnectProvider) {
      this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
      this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
      this.walletConnectProvider = undefined
    }
    this.emitDeactivate()
  }

  async activate() {
    if (!this.walletConnectProvider) {
      const WalletConnectProvider = await import('@walletconnect/ethereum-provider').then((m) => m.EthereumProvider)
      this.walletConnectProvider = await WalletConnectProvider.init(this.config)
    }

    // ensure that the uri is going to be available, and emit an event if there's a new uri
    if (!this.walletConnectProvider.connected) {
      await this.walletConnectProvider.connect({ chains: this.config.chains })
    }

    let account
    account = await new Promise((resolve, reject) => {
      const userReject = () => {
        // Erase the provider manually
        this.walletConnectProvider = undefined
        reject(new UserRejectedRequestError())
      }

      // Workaround to bubble up the error when user reject the connection
      this.walletConnectProvider.on('disconnect', () => {
        // Check provider has not been enabled to prevent this event callback from being called in the future
        if (!account) {
          userReject()
        }
      })

      this.walletConnectProvider
        .enable()
        .then((accounts) => resolve(accounts[0]))
        .catch((error) => {
          // TODO ideally this would be a better check
          if (error.message === 'User closed modal') {
            userReject()
            return
          }
          reject(error)
        })
    }).catch((err) => {
      throw err
    })

    this.walletConnectProvider.on('disconnect', this.handleDisconnect)
    this.walletConnectProvider.on('chainChanged', this.handleChainChanged)
    this.walletConnectProvider.on('accountsChanged', this.handleAccountsChanged)

    return { provider: this.walletConnectProvider, account }
  }

  async getProvider() {
    return this.walletConnectProvider
  }

  async getChainId() {
    return Promise.resolve(this.walletConnectProvider.chainId)
  }

  async getAccount() {
    return Promise.resolve(this.walletConnectProvider.accounts).then((accounts) => accounts[0])
  }

  deactivate() {
    if (this.walletConnectProvider) {
      this.walletConnectProvider.removeListener('disconnect', this.handleDisconnect)
      this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
      this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
      this.walletConnectProvider.disconnect()
    }
  }

  async close() {
    this.emitDeactivate()
  }
}

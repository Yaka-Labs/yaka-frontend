import { AbstractConnector } from '@web3-react/abstract-connector'

export class SeifConnectConnector extends AbstractConnector {
  constructor(config) {
    super()
    this.config = config
    this.chainId = null
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
  }

  handleAccountsChanged = (accounts) => {
    this.emitUpdate({ account: accounts[0] })
  }

  handleChainChanged = (chainId) => {
    this.emitUpdate({ chainId, provider: window['__seif'] })
  }

  async addListeners() {
    if (window['__seif']) {
      window['__seif'].on('accountsChanged', this.handleAccountsChanged)
      window['__seif'].on('chainChanged', this.handleChainChanged)
    }
  }

  async activate() {
    if (window['__seif']) {
      const accounts = await window['__seif'].request({ method: 'eth_requestAccounts' })
      this.addListeners()
      return {
        provider: window['__seif'],
        account: accounts[0],
      }
    } else {
      throw new Error('Seif Wallet not installed')
    }
  }

  async getChainId() {
    if (!this.chainId) {
      try {
        this.chainId = await window['__seif'].request({ method: 'eth_chainId' })
      } catch (error) {
        throw new Error('Failed to get chain ID')
      }
    }
    return this.chainId
  }

  deactivate() {
    if (window['__seif']) {
      this.removeListener('chainChanged', this.handleChainChanged)
      this.removeListener('accountsChanged', this.handleAccountsChanged)
    }
  }

  async close() {
    this.emitDeactivate()
  }
}

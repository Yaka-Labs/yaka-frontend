import { AbstractConnector } from '@web3-react/abstract-connector'

export class CompassConnectConnector extends AbstractConnector {
  constructor(config) {
    super()
    this.config = config
    this.chainId = null
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    // this.handleDisconnect = this.handleDisconnect.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleAccountsChanged = (accounts) => {
    this.emitUpdate({ account: accounts[0] })
  }

  handleChainChanged = (chainId) => {
    this.emitUpdate({ chainId, provider: window.compassEvm })
  }

  // handleDisconnect() {
  //   if (window.compassEvm) {
  //     this.removeListener('chainChanged', this.handleChainChanged)
  //     this.removeListener('accountsChanged', this.handleAccountsChanged)
  //   }
  // }

  handleClose() {
    this.emitDeactivate()
  }

  async addListeners() {
    if (window.compassEvm) {
      window.compassEvm.on('accountsChanged', this.handleAccountsChanged)
      window.compassEvm.on('chainChanged', this.handleChainChanged)
      // window.compassEvm.on('disconnect', this.handleDisconnect)
      window.compassEvm.on('close', this.handleClose)
    }
  }

  async activate() {
    if (window.compassEvm) {
      const accounts = await window.compassEvm.request({ method: 'eth_requestAccounts' })
      this.addListeners()
      return {
        provider: window.compassEvm,
        account: accounts[0],
      }
    } else {
      throw new Error('Compass Wallet not installed')
    }
  }

  async getChainId() {
    if (!this.chainId) {
      try {
        this.chainId = await window.compassEvm.request({ method: 'eth_chainId' })
      } catch (error) {
        throw new Error('Failed to get chain ID')
      }
    }
    return this.chainId
  }

  deactivate() {
    if (window.compassEvm) {
      this.removeListener('chainChanged', this.handleChainChanged)
      this.removeListener('accountsChanged', this.handleAccountsChanged)
      // this.removeListener('disconnect', this.handleDisconnect)
      this.removeListener('close', this.handleClose)
    }
  }

  async close() {
    this.emitDeactivate()
  }
}

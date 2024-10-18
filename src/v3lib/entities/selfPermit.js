import { Interface } from '@ethersproject/abi'
import { selfPermitAbi } from 'config/abi/v3'
import { toHex } from 'thena-fusion-sdk'

function isAllowedPermit(permitOptions) {
  return 'nonce' in permitOptions
}

export class SelfPermit {
  static INTERFACE = new Interface(selfPermitAbi.abi)

  constructor() {
    if (this.constructor === SelfPermit) {
      throw new Error("Abstract classes can't be instantiated.")
    }
  }

  static encodePermit(token, options) {
    return isAllowedPermit(options)
      ? SelfPermit.INTERFACE.encodeFunctionData('selfPermitAllowed', [
          token.address,
          toHex(options.nonce),
          toHex(options.expiry),
          options.v,
          options.r,
          options.s,
        ])
      : SelfPermit.INTERFACE.encodeFunctionData('selfPermit', [token.address, toHex(options.amount), toHex(options.deadline), options.v, options.r, options.s])
  }
}

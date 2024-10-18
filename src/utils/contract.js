import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { ADDRESS_ZERO } from 'thena-fusion-sdk'

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === ADDRESS_ZERO) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

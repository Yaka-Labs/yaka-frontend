import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from 'thena-sdk-core'
import { POOL_DEPLOYER_ADDRESSES, POOL_INIT_CODE_HASHES } from '../constants'

/**
 * Computes a pool address
 * @param tokenA The first token of the pair, irrespective of sort order
 * @param tokenB The second token of the pair, irrespective of sort order
 * @returns The pool address
 */
export function computePoolAddress({
  tokenA,
  tokenB,
}: {
  tokenA: Token
  tokenB: Token
}): string {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  return getCreate2Address(
    POOL_DEPLOYER_ADDRESSES[tokenA.chainId],
    keccak256(['bytes'], [defaultAbiCoder.encode(['address', 'address'], [token0.address, token1.address])]),
    POOL_INIT_CODE_HASHES[tokenA.chainId],
  )
}

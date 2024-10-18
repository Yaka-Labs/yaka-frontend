import { ChainId } from "thena-sdk-core"

export const POOL_DEPLOYER_ADDRESSES: { [key: number]: string} = {
  [ChainId.BSC]: '0xc89F69Baa3ff17a842AB2DE89E5Fc8a8e2cc7358',
  [ChainId.OPBNB]: '0x306F06C147f064A010530292A1EB6737c3e378e4',
  1328: '0x6AD6A4f233F1E33613e996CCc17409B93fF8bf5f',
  1329: '0x6AD6A4f233F1E33613e996CCc17409B93fF8bf5f',
}

export const POOL_INIT_CODE_HASHES: { [key: number]: string} = {
  [ChainId.BSC]: '0xd61302e7691f3169f5ebeca3a0a4ab8f7f998c01e55ec944e62cfb1109fd2736',
  [ChainId.OPBNB]: '0xc65e01e65f37c1ec2735556a24a9c10e4c33b2613ad486dd8209d465524bc3f4',
  1328: '0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d',
  1329: '0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d',
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACING: number= 60

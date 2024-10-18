import { DEFAULT_CHAIN_ID } from './index'
import { getWBNBAddress } from '../../utils/addressHelpers'

export const SEI_PYTH_ADDRESS = '53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb'

export const SEIYAN_PYTH_ADDRESS = 'bd72041b2d8fc342693b70012010db5398b032cba2dbe78d672a7e31c2be8de8'

export const pythTokens = [
  {
    address: 'SEI',
    name: 'SEI',
    symbol: 'SEI',
    decimals: 18,
    pythAddress: SEI_PYTH_ADDRESS,
  },
  {
    name: 'SEIYAN',
    symbol: 'SEIYAN',
    decimals: 18,
    chainId: DEFAULT_CHAIN_ID,
    address: '0x5f0E07dFeE5832Faa00c63F2D33A0D79150E8598', //主网地址
    pythAddress: SEIYAN_PYTH_ADDRESS,
  },
  {
    name: 'Wrapped Sei',
    symbol: 'WSEI',
    decimals: 18,
    chainId: DEFAULT_CHAIN_ID,
    address: getWBNBAddress(DEFAULT_CHAIN_ID),
    pythAddress: SEI_PYTH_ADDRESS,
  },
]

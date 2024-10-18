import { ChainId, WBNB } from 'thena-sdk-core'

export const DEFAULT_CHAIN_ID = 1329
export const CHAIN_LIST = {
  // [ChainId.BSC]: {
  //   chainId: ChainId.BSC,
  //   title: 'BNB Chain',
  //   img: '/images/header/bnb.svg',
  //   scanUrl: 'https://bscscan.com',
  //   scanName: 'View on BscScan',
  // },
  // [ChainId.OPBNB]: {
  //   chainId: ChainId.OPBNB,
  //   title: 'opBNB',
  //   img: '/images/header/opbnb.svg',
  //   scanUrl: 'https://opbnb.bscscan.com/',
  //   scanName: 'View on opBNBScan',
  // },
  [DEFAULT_CHAIN_ID]: {
    chainId: DEFAULT_CHAIN_ID,
    title: `Sei${DEFAULT_CHAIN_ID === 1328 ? ' testnet' : ''}`,
    img: 'https://i.ibb.co/XVGXBxT/sei.png',
    scanUrl: 'https://seitrace.com/',
    scanName: 'View on seiScan',
  },
}

export const CURRENCY_LIST = {
  [ChainId.BSC]: 'BNB',
  1328: 'SEI',
  1329: 'SEI',
}

export const FAUCET_LIST = {
  // [ChainId.BSC]: {
  //   chainId: ChainId.BSC,
  //   title: 'BNB Chain',
  //   img: '/images/header/bnb.svg',
  //   scanUrl: 'https://bscscan.com',
  //   scanName: 'View on BscScan',
  // },
  // [ChainId.OPBNB]: {
  //   chainId: ChainId.OPBNB,
  //   title: 'opBNB',
  //   img: '/images/header/opbnb.svg',
  //   scanUrl: 'https://opbnb.bscscan.com/',
  //   scanName: 'View on opBNBScan',
  // },
  yaka: {
    title: 'YAKA',
    img: 'https://i.ibb.co/b2NwDmg/yaka.png',
    url: '',
  },
  sei: {
    title: 'SEI',
    img: 'https://i.ibb.co/XVGXBxT/sei.png',
    url: 'https://sei-evm.faucetme.pro/',
  },
}

export const TRANSACTION_STATUS = {
  START: 'start',
  WAITING: 'waiting',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
}

export const LOTTERY_STATUS = {
  UNKNOWN: 0,
  WON: 1,
  LOST: 2,
}

export const ConnectorNames = {
  MetaMask: 'MetaMask',
  TrustWallet: 'TrustWallet',
  CompassWallet: 'CompassWallet',
  WalletConnect: 'WalletConnect',
  Coinbase: 'Coinbase',
  Coin98Wallet: 'Coin98Wallet',
  OkxWallet: 'OkxWallet',
  SeifWallet: 'SeifWallet',
}

export const CONNECTORS = [
  {
    key: 'metamask',
    logo: '/images/wallets/metamask-logo.svg',
    title: 'MetaMask',
    connector: ConnectorNames.MetaMask,
  },
  {
    key: 'compass',
    logo: '/images/wallets/compass-logo.png',
    title: 'Compass',
    connector: ConnectorNames.CompassWallet,
  },
  {
    key: 'seif',
    logo: '/images/wallets/seif.svg',
    title: 'Seif Wallet',
    connector: ConnectorNames.SeifWallet,
  },
  // {
  //   key: 'trustwallet',
  //   logo: '/images/wallets/trustwallet-logo.svg',
  //   title: 'Trust Wallet',
  //   connector: ConnectorNames.TrustWallet,
  // },
  {
    key: 'walletConnect',
    logo: '/images/wallets/walletconnect-logo.svg',
    title: 'Wallet Connect',
    connector: ConnectorNames.WalletConnect,
  },
  {
    key: 'coinbase',
    logo: '/images/wallets/coinbase-wallet-logo.svg',
    title: 'Coinbase Wallet',
    connector: ConnectorNames.Coinbase,
  },
  {
    key: 'coin98',
    logo: '/images/wallets/coin98-wallet-logo.svg',
    title: 'Coin98 Wallet',
    connector: ConnectorNames.Coin98Wallet,
  },
  {
    key: 'okx',
    logo: '/images/wallets/okx-wallet-logo.svg',
    title: 'OKX',
    connector: ConnectorNames.OkxWallet,
  },
]

export const SupportedChainIds = [ChainId.BSC, ChainId.OPBNB, DEFAULT_CHAIN_ID]
// export const SupportedChainIds = [ChainId.BSC, ChainId.OPBNB, 1329]

export const V1_ROUTE_ASSETS = {
  [ChainId.BSC]: [
    {
      symbol: 'WBNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      logoURI: 'https://cdn.thena.fi/assets/WBNB.png',
    },
    {
      symbol: 'BUSD',
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      logoURI: 'https://cdn.thena.fi/assets/BUSD.png',
    },
    {
      symbol: 'USDC',
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      logoURI: 'https://cdn.thena.fi/assets/USDC.png',
    },
    {
      symbol: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955',
      logoURI: 'https://cdn.thena.fi/assets/USDT.png',
    },
    {
      symbol: 'FRAX',
      address: '0x90c97f71e18723b0cf0dfa30ee176ab653e89f40',
      logoURI: 'https://cdn.thena.fi/assets/FRAX.png',
    },
    {
      symbol: 'BNBx',
      address: '0x1bdd3cf7f79cfb8edbb955f20ad99211551ba275',
      logoURI: 'https://cdn.thena.fi/assets/BNBx.png',
    },
    {
      symbol: 'CUSD',
      address: '0xFa4BA88Cf97e282c505BEa095297786c16070129',
      logoURI: 'https://cdn.thena.fi/assets/CUSD.png',
    },
    {
      symbol: 'HAY',
      address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
      logoURI: 'https://cdn.thena.fi/assets/HAY.png',
    },
    {
      symbol: 'USD+',
      address: '0xe80772eaf6e2e18b651f160bc9158b2a5cafca65',
      logoURI: 'https://cdn.thena.fi/assets/USDPlus.png',
    },
    {
      symbol: 'stkBNB',
      address: '0xc2e9d07f66a89c44062459a47a0d2dc038e4fb16',
      logoURI: 'https://cdn.thena.fi/assets/stkBNB.png',
    },
    {
      symbol: 'ankrBNB',
      address: '0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827',
      logoURI: 'https://cdn.thena.fi/assets/ankrBNB.png',
    },
    {
      symbol: 'THE',
      address: '0xF4C8E32EaDEC4BFe97E0F595AdD0f4450a863a11',
      logoURI: 'https://thena.fi/logo.png',
    },
  ],
  [ChainId.OPBNB]: [
    {
      symbol: 'WBNB',
      address: WBNB[ChainId.OPBNB].address,
      logoURI: 'https://cdn.thena.fi/assets/WBNB.png',
    },
    {
      symbol: 'USDT',
      address: '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3',
      logoURI: 'https://cdn.thena.fi/assets/USDT.png',
    },
    {
      symbol: 'ETH',
      address: '0xe7798f023fc62146e8aa1b36da45fb70855a77ea',
      logoURI: 'https://cdn.thena.fi/assets/ETH.png',
    },
    {
      symbol: 'BTCB',
      address: '0x7c6b91d9be155a6db01f749217d76ff02a7227f2',
      logoURI: 'https://cdn.thena.fi/assets/BTCB.png',
    },
  ],
  1328: [],
  1329: [],
}

export const TAX_ASSETS = {
  [ChainId.BSC]: [
    '0x74ccbe53f77b08632ce0cb91d3a545bf6b8e0979', // fBOMB
    '0xc95cd75dcea473a30c8470b232b36ee72ae5dcc2', // CHAM
    '0x3a806a3315e35b3f5f46111adb6e2baf4b14a70d', // LIBERA
    '0x9a7b04fd5788ea39819723e7eb9ef5f609bc57ab', // cpTHE
    '0x5dbcb073bedb36a411b5dd9b23b47ccbb5f7238f', // cpTHENA
    '0xa7266989b0df675cc8257d53b6bc1358faf6626a', // IPAD
  ],
  [ChainId.OPBNB]: [],
  1328: [],
  1329: [],
}

export const NEXT_EPOCH_TIMESTAMP = 1696464000

export const NEW_POOLS = {
  [ChainId.BSC]: ['0xdc6f26e5f8a7ea128a8a06ce07681b3cde5280f2', '0x01dd2d28eeb95d740acb5344b1e2c99b61cc3e64'],
  [ChainId.OPBNB]: [],
  1328: [],
  1329: [],
}

export const SCAN_URLS = {
  [ChainId.BSC]: 'https://seistream.app',
  [ChainId.OPBNB]: 'https://opbnb.bscscan.com',
  // 1329: 'https://seistream.app',
  1329: 'https://seitrace.com',
  1328: 'https://seitrace.com',
}

export const CHAIN_URLS = {
  [ChainId.BSC]: '',
  [ChainId.OPBNB]: '',
  1329: '?chain=pacific-1',
  1328: '?chain=atlantic-2',
}

export const STABLE_TOKENS = {
  [ChainId.BSC]: {
    BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    DAI: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    DEI: '0xDE1E704dae0B4051e80DAbB26ab6ad6c12262DA0',
    USD: '0xe80772eaf6e2e18b651f160bc9158b2a5cafca65',
    ETS: '0x5B852898CD47d2Be1d77D30377b3642290f5Ec75',
    HAY: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
    FRAX: '0x90c97f71e18723b0cf0dfa30ee176ab653e89f40',
    CUSD: '0xFa4BA88Cf97e282c505BEa095297786c16070129',
    MAI: '0x3F56e0c36d275367b8C502090EDF38289b3dEa0d',
    DOLA: '0x2F29Bc0FFAF9bff337b31CBe6CB5Fb3bf12e5840',
    DUSD: '0x8ec1877698acf262fe8ad8a295ad94d6ea258988',
    CASH: '0x54c331bb7d32fbfc17bc9accab2e2d12d0d1b222',
    USDV: '0x953e94caf91a1e32337d0548b9274f337920edfa',
  },
  [ChainId.OPBNB]: {
    USDT: '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3',
  },
  1328: {
    USDT: '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3',
  },
  1329: {
    USDT: '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3',
  },
}

export const DoubleRewarders = {
  [ChainId.BSC]: [
    {
      pairAddress: '0x2b3510f57365aa17bff8e6360ea67c136175dc6d',
      doubleRewarderAddress: '0xA7266B2303725F731851dfE944a432f8A2EA5c9c',
      doubleRewarderSymbol: 'PSTAKE',
    },
    {
      pairAddress: '0x3765476bffe43cf4c0656bf3a7529c54ae247056',
      doubleRewarderAddress: '0x28BB19EAFB1f637ECC754f458f9d415b00287AF7',
      doubleRewarderSymbol: 'liveTHE',
    },
  ],
  [ChainId.OPBNB]: [],
  1328: [],
  1329: [],
}

export const PERIOD_LEVELS = [
  {
    value: 0,
    label: '2 weeks',
  },
  {
    value: 1,
    label: '6 months',
  },
  {
    value: 2,
    label: '1 year',
  },
  {
    value: 3,
    label: '2 years',
  },
]

export const NUMBER_OF_NOWS = [10, 20, 30, 40]

export const POOL_FILTERS = {
  ALL: 'ALL',
  STABLE: 'STABLE',
  V1: 'V1',
  // FUSION: 'FUSION',
}

export const POOL_TYPES = {
  V1: 'V1',
  FUSION: 'FUSION',
}

export const SIZES = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
}

export const FusionRangeType = {
  ICHI_RANGE: 'ichi',
  GAMMA_RANGE: 'gamma',
  DEFIEDGE_RANGE: 'defiedge',
  MANUAL_RANGE: 'manual',
}

export const REFERRAL_TABS = ['code', 'rewards', 'leaderboard', 'lottery']

export const STABLE_FEE = 0.0001
export const VOLATILE_FEE = 0.002
export const TVL_INCREASE = 1e6

export const TXN_TYPE = {
  ALL: 'All',
  SWAP: 'Swaps',
  ADD: 'Adds',
  REMOVE: 'Removes',
}

export const ANALYTIC_VERSIONS = {
  v1: 'v1',
  fusion: 'fusion',
  total: 'total',
}

export const ANALYTIC_CHART = {
  ONE_MONTH_CHART: 1,
  THREE_MONTH_CHART: 2,
  SIX_MONTH_CHART: 3,
  ONE_YEAR_CHART: 4,
  ALL_CHART: 5,
  CHART_COUNT: 60, // limit analytics chart items not more than 60
}

export const TIMEFRAME_OPTIONS = {
  WEEK: '1 week',
  MONTH: '1 month',
  // THREE_MONTHS: '3 months',
  // YEAR: '1 year',
  HALF_YEAR: '6 months',
  ALL_TIME: 'All time',
}

export const MARKET_TYPES = ['MAIN', 'FUSION', 'V1']

export const SWAP_TYPES = ['MARKET', 'LIMIT', 'TWAP', 'CROSS-CHAIN', 'ON-RAMP']

export const WSEI_ADDRESS = '0x027D2E627209f1cebA52ADc8A5aFE9318459b44B'

export const CAMPAIGN_RANK_FILTERS = {
  TOTAL: 'Total Points',
  DEPOSIT: 'Deposit Points',
}

import { ChainId, WBNB } from 'thena-sdk-core'

const contracts = {
  //YAKA
  THE: {
    [ChainId.BSC]: '0xF4C8E32EaDEC4BFe97E0F595AdD0f4450a863a11',
    [ChainId.OPBNB]: '',
    1328: '0xE552d1440d7324981e9996828D2225BfaB9A3156', // sure
    1329: '0x51121BCAE92E302f19D06C193C95E1f7b81a444b', // sure
  },
  WBNB: {
    [ChainId.BSC]: WBNB[ChainId.BSC].address,
    [ChainId.OPBNB]: WBNB[ChainId.OPBNB].address,
    1328: '0x3921eA6Cf927BE80211Bb57f19830700285b0AdA', //sure
    1329: '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7', //sure
  },
  ETH: {
    [ChainId.BSC]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    [ChainId.OPBNB]: '0xe7798f023fc62146e8aa1b36da45fb70855a77ea',
  },
  thenian: {
    [ChainId.BSC]: '0x2Af749593978CB79Ed11B9959cD82FD128BA4f8d',
  },
  multiCall: {
    [ChainId.BSC]: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
    [ChainId.OPBNB]: '0xD6f6e27e96535749587Ac77bfc83607A743e765f',
    1328: '0x48852eC20202fcaFea5d09E2484b6EBB77A08Cda', //sure
    1329: '0x37E73056Ee8af05ad53621F4f8dc7c2A8C9E134e', //sure
  },
  router: {
    // [ChainId.BSC]: '0x20a304a7d126758dfe6B243D0fc515F83bCA8431',
    // [ChainId.BSC]: '0x9B237893321b2D447E1D1Ae02004ebA30b187D0d',
    [ChainId.BSC]: '0xd4ae6eCA985340Dd434D38F470aCCce4DC78D109',
    1328: '0xFD2C04eF9924cd0D02a0f4B7977aEBa1Da541ad1', //sure
    1329: '0x9f3B1c6b0CDDfE7ADAdd7aadf72273b38eFF0ebC', //sure
  },
  factory: {
    [ChainId.BSC]: '0xAFD89d21BdB66d00817d4153E055830B1c2B3970',
    97: '0x86D22c4130401a5723fFD6C0c798c205A2Fea1ed',
  },
  veTHE: {
    [ChainId.BSC]: '0xfBBF371C9B0B994EebFcC977CEf603F7f31c070D',
    1328: '0x9c6b2099e2BFF2DF90d51F9A54D25062a2884608', // sure
    1329: '0x86a247Ef0Fc244565BCab93936E867407ac81580', // sure
  },
  // RewardsDistributor.sol
  veDist: {
    [ChainId.BSC]: '0xA6e0e731Cb1E99AedE0f9C9128d04F948E18727D',
    1328: '0x41d15B79E9A0f58F40c2825Caa72CBc2A7D63100', // sure
    // 1329: '0xbC8F002982364280B8dcFd35b2e6b86aeA88BD06', // sure
    1329: '0xaC76B04F87ccbfb4ba01f76F34B9f1B770839ebe',
  },
  voter: {
    [ChainId.BSC]: '0x62Ee96e6365ab515Ec647C065c2707d1122d7b26',
  },
  v3voter: {
    [ChainId.BSC]: '0x3A1D0952809F4948d15EBCe8d345962A282C4fCb',
    1328: '0xC1D2Ea7ECaDeC9E7f661Fe74c9e97AB84D582D3b', // sure
    1329: '0x36068f15f257896E03fb7EdbA3D18898d0ade809', // sure
  },
  minter: {
    [ChainId.BSC]: '0x86069FEb223EE303085a1A505892c9D4BdBEE996',
    1328: '0x289B2EdB1e4bf8a12D2e2dB7450CAF082262b444', // sure
    1329: '0x5a4849e824923449C652642F30A015dCDaE3697E', // sure
  },
  pairV3API: {
    [ChainId.BSC]: '0x53a67b6b57907aa1926e95b004578a9bacb72e15',
    [ChainId.OPBNB]: '0xCB78f8d9DFb78CD43Bd2dC9Ffe75E39fBE7F2820',
    1328: '0x157572A68f7a120D12cE96AF0c87c1C7A8642348',
    1329: '0x58EE66328e2D2E69Bae047771D6f18E3719b7935',
  },
  // veNFTAPI
  veTHEV3API: {
    [ChainId.BSC]: '0x47a02aa02c7d2ee818778039ba4f20dfdac772d9',
    97: '',
    1328: '0x4517368209654Da40b35D449D6972502B306e23e', // sure
    1329: '0x2affEA6EBf5D874b9eC64bE3EA9c7A82C069cddD', // sure
  },
  rewardsV3API: {
    [ChainId.BSC]: '0x0b6CFf48836Eea83795Ab8b9a04b1b4654d96c46',
    97: '',
    1328: '0x010c8E8fF75e87EA2029e4866370c5A7d5D047d1', // sure
    1329: '0xbc87C7e5dc9E71Eab9CC642A9DE61A50D5ea8458', // sure
  },
  staking: {
    [ChainId.BSC]: '0xe58E64fb76e3C3246C34Ee596fB8Da300b5Adfbb',
    97: '',
  },
  newStaking: {
    [ChainId.BSC]: '0x11746fd90091228a97974435d6bE5E10BDA92f7C',
    97: '',
  },
  royalty: {
    [ChainId.BSC]: '0xBB2caf56BF29379e329dFED453cbe60E4d913882',
    97: '',
  },
  dibs: {
    [ChainId.BSC]: '0x664cE330511653cB2744b8eD50DbA31C6c4C08ca',
    97: '',
  },
  dibsLottery: {
    [ChainId.BSC]: '0x287ed50e4c158dac38e1b7e16c50cd1b2551a300',
    97: '',
  },
  muon: {
    [ChainId.BSC]: '0xBa079Ad36E48e75b8b37f17aF1Fc285bceB84391',
    97: '',
  },
  openOcean: {
    [ChainId.BSC]: '0x6352a56caadc4f1e25cd6c75970fa768a3304e64',
    97: '',
  },
  tcManager: {
    [ChainId.BSC]: '0xa3122E54E8CB38aa0707c35f0D4034560987cC55',
    97: '',
  },

  seiCampaignStage2Address: {
    1328: '0x2Fb74665fE0e4BA0B961114054dDEFeCf7a98C4E', //sure
    1329: '0x2Fb74665fE0e4BA0B961114054dDEFeCf7a98C4E', //not found
  },
  tokenSaleAddress: {
    1328: '0x4A160B88F89BD7f27482c3D842C76E60a2889e23',
    1329: '0xf3b49Cce29D175EffE5c80382502868b29F727Ad', //sure
  },
  initialDistributorAddress: {
    // 1328: '0xAA779Bb32802D5Eb9173a85e5b22Bc1ff2d29B83',
    1328: '0x66AE81861a796e84ca13aCd42bFab863f5172a60',
    1329: '0x18Ed6E09719093fA42A521dD5b50FB206204B122',
  },
}
export default contracts

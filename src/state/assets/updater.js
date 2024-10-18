import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import useRefresh from 'hooks/useRefresh'
import { getAssetsData } from 'utils/api'
import { multicall, tryMulticall } from 'utils/multicall'
import { fromWei } from 'utils/formatNumber'
import { getWeb3NoAccount } from 'utils/web3'
import { ERC20Abi } from 'config/abi'
import { useNetwork } from 'state/settings/hooks'
import { liquidityHub } from 'components/LiquidityHub'
import { updateAssets } from './actions'
import { pythTokens, SEI_PYTH_ADDRESS, SEIYAN_PYTH_ADDRESS } from 'config/constants/tokens'

const fetchAssetsBalances = async (assets, account, networkId) => {
  const calls = assets.map((asset) => {
    return {
      address: asset.address,
      name: 'balanceOf',
      params: [account],
    }
  })
  const rawTokenBalances = await tryMulticall(ERC20Abi, calls, networkId)
  // console.log({ rawTokenBalances })
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance, index) => {
    return fromWei(tokenBalance, assets[index].decimals || 18).toString(10)
  })
  // console.log({ parsedTokenBalances })

  return parsedTokenBalances
}

const fetchTokenBalance = async (address, account, web3) => {
  return 0
  try {
    const contract = new web3.eth.Contract(ERC20Abi, address)
    const balance = await contract.methods.balanceOf(account).call()
    const decimals = await contract.methods.decimals().call()
    console.log(balance, decimals)
    return balance / 10 ** decimals
  } catch (e) {
    console.log(e)
    return 0
  }
}

const fetchUserAssetsData = async (assets, account, networkId) => {
  const web3 = getWeb3NoAccount(networkId)
  const nonBnbAssets = assets.slice(1) // first is SEI

  // const [bnbBalance, iSeiBalance, userBalances] = await Promise.all([
  //   web3.eth.getBalance(account),
  //   fetchTokenBalance('0xe9cbf9dcc0e14f0502de826ccace352fd4083a10', account, web3),
  //   fetchAssetsBalances(nonBnbAssets, account, networkId),
  // ])

  const [bnbBalance, userBalances] = await Promise.all([web3.eth.getBalance(account), fetchAssetsBalances(nonBnbAssets, account, networkId)])

  const bnbAssetInfo = {
    ...assets[0],
    balance: fromWei(bnbBalance).toString(10),
  }

  // const iSeiInfo = {
  //   ...assets[1],
  //   balance: iSeiBalance,
  // }

  const nonBnbAssetsInfo = nonBnbAssets.map((asset, index) => {
    return {
      ...asset,
      balance: userBalances[index],
    }
  })
  return [
    bnbAssetInfo,
    // iSeiInfo,
    ...nonBnbAssetsInfo,
  ]
}

const Updater = () => {
  const dispatch = useDispatch()
  const { networkId } = useNetwork()
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()
  const { liquidityHubEnabled } = liquidityHub.useLiquidtyHubSettings()

  const windowVisible = useIsWindowVisible()

  const fetchInfo = useCallback(async () => {
    let result = []
    try {
      const ids = [
        '0x' + SEI_PYTH_ADDRESS, //sei
        '0x' + SEIYAN_PYTH_ADDRESS, //seiyan
        // "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",//btc
        // "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",//eth
      ]
      const params = new URLSearchParams()
      ids.forEach((id) => params.append('ids[]', id))
      let pythData = []

      try {
        await fetch(`https://hermes.pyth.network/v2/updates/price/latest?${params.toString()}`).then(async (response) => {
          const res = await response.json()
          pythData = res.parsed
        })
      } catch (error) {
        console.error('pyth fetched had error', error)
      }

      const assets = await getAssetsData(networkId, liquidityHubEnabled)

      if (assets) {
        if (account) {
          try {
            const data = await fetchUserAssetsData(assets, account, networkId)
            data.map((item) => {
              const filterToken = pythTokens.filter((el) => el.address === item.address)
              item.pythAddress = filterToken[0]?.pythAddress ?? ''

              const filterData = pythData.filter((el) => el.id === item.pythAddress)
              if (filterData.length > 0) {
                item.price = Number(filterData[0].price.price) / 10 ** 8
              }
              return item
            })

            const sortedData = data.sort((a, b) => {
              if (new BigNumber(a.balance).times(a.price).lt(new BigNumber(b.balance).times(b.price))) return 1
              if (new BigNumber(a.balance).times(a.price).gt(new BigNumber(b.balance).times(b.price))) return -1
              return 0
            })
            result = sortedData
          } catch (e) {
            console.error('User Assets fetch had error', e)
            result = assets
          }
        } else {
          result = assets
        }
      }
    } catch (error) {
      console.error('Assets fetched had error', error)
    }
    dispatch(
      updateAssets({
        assets: result.map((item) => {
          return {
            ...item,
            chainId: networkId,
          }
        }),
        networkId,
      }),
    )
  }, [dispatch, account, networkId, liquidityHubEnabled])

  useEffect(() => {
    if (!windowVisible) return
    fetchInfo()
  }, [windowVisible, fastRefresh, fetchInfo])

  return null
}

export default Updater

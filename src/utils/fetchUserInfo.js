import BigNumber from 'bignumber.js'
import { gaugeSimpleAbi, ichiVaultAbi } from 'config/abi/v3'
import { multicall } from './multicall'
import { fromWei } from './formatNumber'
import { getVeTHEV3APIContract } from './contractHelpers'

export const fetchUserVeTHEs = async (web3, account) => {
  const veTHEAPIContract = getVeTHEV3APIContract(web3)
  const veTHEInfos = await veTHEAPIContract.methods.getNFTFromAddress(account).call()
  return veTHEInfos.map((veTHE) => {
    const lockedEnd = Number(veTHE[7])
    const diff = Math.ceil((lockedEnd - new Date().getTime() / 1000) / 86400)
    const totalVotes = veTHE[9].reduce((sum, current) => {
      return sum.plus(current[1])
    }, new BigNumber(0))

    const votedWeek = Math.floor(Number(veTHE[8]) / (86400 * 7))
    const currentWeek = Math.floor(new Date().getTime() / (86400 * 7 * 1000))
    const votedCurrentEpoch = votedWeek === currentWeek && veTHE[1]

    return {
      decimals: Number(veTHE[0]),
      voted: veTHE[1],
      votedCurrentEpoch,
      attachments: veTHE[2],
      id: veTHE[3],
      amount: fromWei(veTHE[4]),
      voting_amount: fromWei(veTHE[5]),
      rebase_amount: fromWei(veTHE[6]),
      lockEnd: lockedEnd,
      vote_ts: veTHE[8],
      votes: veTHE[9].map((item) => {
        return {
          address: item[0],
          weight: fromWei(item[1]),
          weightPercent: totalVotes.isZero() ? new BigNumber(0) : new BigNumber(item[1]).div(totalVotes).times(100),
        }
      }),
      diffDates: diff > 0 ? 'Expires in ' + diff + ' days' : 'Expired ' + diff * -1 + ' days ago',
    }
  })
}

const fetchUserWalletBalance = async (vaults, account, chainId) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.address,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawRes = await multicall(ichiVaultAbi, calls, chainId)
  return rawRes.map((ele) => {
    return fromWei(ele)
  })
}

const fetchUserGaugeBalance = async (vaults, account, chainId) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.gaugeAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawRes = await multicall(gaugeSimpleAbi, calls, chainId)
  return rawRes.map((ele) => {
    return fromWei(ele)
  })
}

const fetchUserEarned0 = async (vaults, account, chainId) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.gaugeAddress,
      name: 'earned',
      params: [account, vault.token0Address],
    }
  })

  const rawRes = await multicall(gaugeSimpleAbi, calls, chainId)
  return rawRes
}

const fetchUserEarned1 = async (vaults, account, chainId) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.gaugeAddress,
      name: 'earned',
      params: [account, vault.token1Address],
    }
  })

  const rawRes = await multicall(gaugeSimpleAbi, calls, chainId)
  return rawRes
}

const fetchUserEarned2 = async (vaults, account, chainId) => {
  const calls = vaults.map((vault) => {
    return {
      address: vault.gaugeAddress,
      name: 'earned',
      params: [account, vault.rewardAddress],
    }
  })

  const rawRes = await multicall(gaugeSimpleAbi, calls, chainId)
  return rawRes
}

export const fetchUserVaultsData = async (vaults, account, networkId) => {
  const [walletBalances, gaugeBalances, earned0, earned1, earned2] = await Promise.all([
    fetchUserWalletBalance(vaults, account, networkId),
    fetchUserGaugeBalance(vaults, account, networkId),
    fetchUserEarned0(vaults, account, networkId),
    fetchUserEarned1(vaults, account, networkId),
    fetchUserEarned2(vaults, account, networkId),
  ])

  return vaults.map((vault, index) => {
    return {
      address: vault.address,
      walletBalance: walletBalances[index],
      gaugeBalance: gaugeBalances[index],
      totalLp: gaugeBalances[index].plus(walletBalances[index]),
      earned0: earned0[index],
      earned1: earned1[index],
      earned2: earned2[index],
    }
  })
}

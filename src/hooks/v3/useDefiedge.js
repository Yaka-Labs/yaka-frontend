import { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { v4 as uuidv4 } from 'uuid'
import { TRANSACTION_STATUS } from 'config/constants'
import { useActivePreset, useV3MintActionHandlers } from 'state/mintV3/hooks'
import { completeTransaction, openTransaction, updateTransaction } from 'state/transactions/actions'
import { getERC20Contract, getDefiedgeStrategyContract, getWBNBContract, getGaugeContract } from 'utils/contractHelpers'
import { getAllowance, sendContract } from 'utils/api'
import { MAX_UINT256, ZERO_VALUE, formatNumber, fromWei, toWei } from 'utils/formatNumber'
import { multicall } from 'utils/multicall'
import { defiedgeStrategyAbi } from 'config/abi/v3'
import { useContract } from 'hooks/useContractV3'
import { useNetwork } from 'state/settings/hooks'
import { useDefiedges } from 'state/pools/hooks'
import { usePairs } from 'context/PairsContext'
import useWeb3 from '../useWeb3'

const useDefiedgesInfo = () => {
  const [info, setInfo] = useState([])
  const defiedges = useDefiedges()
  const { networkId } = useNetwork()
  const pairs = usePairs()

  const fetchInfo = useCallback(async () => {
    const tickCalls = defiedges.map((pair) => {
      return {
        address: pair.address,
        name: 'getTicks',
      }
    })
    const poolCalls = defiedges.map((pair) => {
      return {
        address: pair.address,
        name: 'pool',
      }
    })
    const [ticks, pools] = await Promise.all([multicall(defiedgeStrategyAbi, tickCalls, networkId), multicall(defiedgeStrategyAbi, poolCalls, networkId)])
    const final = defiedges.map((pair, index) => {
      const pool = pairs.find((ele) => pools[index][0].toLowerCase() === ele.address)
      return {
        ...pair,
        lower: ticks[index][0].length > 0 ? ticks[index][0][0][0] : 0,
        upper: ticks[index][0].length > 0 ? ticks[index][0][0][1] : 0,
        current: pool?.globalState.tick || 0,
      }
    })
    setInfo(final)
  }, [defiedges, pairs])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])

  return info
}

const useDefiedgeAdd = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const preset = useActivePreset()
  const { networkId } = useNetwork()

  const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers()

  const handleDefiedgeAdd = useCallback(
    async (amountA, amountB, amountToWrap, defiedgeStrategy) => {
      const baseCurrency = amountA.currency
      const quoteCurrency = amountB.currency
      const baseCurrencyAddress = baseCurrency.wrapped ? baseCurrency.wrapped.address.toLowerCase() : ''
      const quoteCurrencyAddress = quoteCurrency.wrapped ? quoteCurrency.wrapped.address.toLowerCase() : ''
      const defiedgeStrategyAddress = defiedgeStrategy ? defiedgeStrategy.address : undefined
      const defiedgeStrategyContract = getDefiedgeStrategyContract(defiedgeStrategy.address, web3)

      if (!amountA || !amountB || !defiedgeStrategyAddress || !defiedgeStrategyContract) return

      const key = uuidv4()
      const wrapuuid = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const supplyuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity`,
          transactions: {
            ...(amountToWrap
              ? {
                  [wrapuuid]: {
                    desc: `Wrap ${formatNumber(fromWei(amountToWrap.toString(10)))} BNB for WBNB`,
                    status: TRANSACTION_STATUS.WAITING,
                    hash: null,
                  },
                }
              : {}),
            [approve0uuid]: {
              desc: `Approve ${baseCurrency.symbol}`,
              status: amountToWrap ? TRANSACTION_STATUS.START : TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [approve1uuid]: {
              desc: `Approve ${quoteCurrency.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [supplyuuid]: {
              desc: 'Deposit tokens in the pool',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      if (amountToWrap) {
        const wbnbContract = getWBNBContract(web3, networkId)
        try {
          await sendContract(dispatch, key, wrapuuid, wbnbContract, 'deposit', [], account, amountToWrap.toString(10))
        } catch (err) {
          console.log('wrap error :>> ', err)
          setPending(false)
          return
        }
      }

      let isApproved = true
      const baseTokenContract = getERC20Contract(web3, baseCurrencyAddress)
      const baseAllowance = await getAllowance(baseTokenContract, defiedgeStrategyAddress, account)
      if (fromWei(baseAllowance, baseCurrency.decimals).lt(amountA.toExact())) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve0uuid, baseTokenContract, 'approve', [defiedgeStrategyAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 0 error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve0uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      isApproved = true
      const quoteTokenContract = getERC20Contract(web3, quoteCurrencyAddress)
      const quoteAllowance = await getAllowance(quoteTokenContract, defiedgeStrategyAddress, account)
      if (fromWei(quoteAllowance, quoteCurrency.decimals).lt(amountB.toExact())) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve1uuid, quoteTokenContract, 'approve', [defiedgeStrategyAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 0 error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve1uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      const firstParam = (baseCurrencyAddress === defiedgeStrategy.token0.address.toLowerCase() ? amountA : amountB).numerator.toString()
      const secondParam = (baseCurrencyAddress === defiedgeStrategy.token0.address.toLowerCase() ? amountB : amountA).numerator.toString()

      try {
        await sendContract(dispatch, key, supplyuuid, defiedgeStrategyContract, 'mint', [firstParam, secondParam, '0', '0', '0'], account)
      } catch (err) {
        console.log('supply error :>> ', err)
        setPending(false)
        return
      }
      onFieldAInput('')
      onFieldBInput('')
      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Added',
        }),
      )
      setPending(false)
    },
    [account, web3, preset],
  )

  const handleDefiedgeAddAndStake = useCallback(
    async (amountA, amountB, amountToWrap, defiedgeStrategy) => {
      const baseCurrency = amountA.currency
      const quoteCurrency = amountB.currency
      const baseCurrencyAddress = baseCurrency.wrapped ? baseCurrency.wrapped.address.toLowerCase() : ''
      const quoteCurrencyAddress = quoteCurrency.wrapped ? quoteCurrency.wrapped.address.toLowerCase() : ''
      const defiedgeStrategyAddress = defiedgeStrategy ? defiedgeStrategy.address : undefined
      const defiedgeStrategyContract = getDefiedgeStrategyContract(defiedgeStrategy.address, web3)

      if (!amountA || !amountB || !defiedgeStrategyAddress || !defiedgeStrategyContract) return

      const key = uuidv4()
      const wrapuuid = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const supplyuuid = uuidv4()
      const approve2uuid = uuidv4()
      const stakeuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Add ${baseCurrency.symbol}/${quoteCurrency.symbol} liquidity`,
          transactions: {
            ...(amountToWrap
              ? {
                  [wrapuuid]: {
                    desc: `Wrap ${formatNumber(fromWei(amountToWrap.toString(10)))} BNB for WBNB`,
                    status: TRANSACTION_STATUS.WAITING,
                    hash: null,
                  },
                }
              : {}),
            [approve0uuid]: {
              desc: `Approve ${baseCurrency.symbol}`,
              status: amountToWrap ? TRANSACTION_STATUS.START : TRANSACTION_STATUS.WAITING,
              hash: null,
            },
            [approve1uuid]: {
              desc: `Approve ${quoteCurrency.symbol}`,
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [supplyuuid]: {
              desc: 'Deposit tokens in the pool',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [approve2uuid]: {
              desc: 'Approve LP',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
            [stakeuuid]: {
              desc: 'Stake LP',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )

      if (amountToWrap) {
        const wbnbContract = getWBNBContract(web3, networkId)
        try {
          await sendContract(dispatch, key, wrapuuid, wbnbContract, 'deposit', [], account, amountToWrap.toString(10))
        } catch (err) {
          console.log('wrap error :>> ', err)
          setPending(false)
          return
        }
      }

      let isApproved = true
      const baseTokenContract = getERC20Contract(web3, baseCurrencyAddress)
      const baseAllowance = await getAllowance(baseTokenContract, defiedgeStrategyAddress, account)
      if (fromWei(baseAllowance, baseCurrency.decimals).lt(amountA.toExact())) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve0uuid, baseTokenContract, 'approve', [defiedgeStrategyAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 0 error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve0uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      isApproved = true
      const quoteTokenContract = getERC20Contract(web3, quoteCurrencyAddress)
      const quoteAllowance = await getAllowance(quoteTokenContract, defiedgeStrategyAddress, account)
      if (fromWei(quoteAllowance, quoteCurrency.decimals).lt(amountB.toExact())) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve1uuid, quoteTokenContract, 'approve', [defiedgeStrategyAddress, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 0 error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve1uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }

      const firstParam = (baseCurrencyAddress === defiedgeStrategy.token0.address.toLowerCase() ? amountA : amountB).numerator.toString()
      const secondParam = (baseCurrencyAddress === defiedgeStrategy.token0.address.toLowerCase() ? amountB : amountA).numerator.toString()

      try {
        await sendContract(dispatch, key, supplyuuid, defiedgeStrategyContract, 'mint', [firstParam, secondParam, '0', '0', '0'], account)
      } catch (err) {
        console.log('supply error :>> ', err)
        setPending(false)
        return
      }
      isApproved = true
      const pairBalance = await defiedgeStrategyContract.methods.balanceOf(account).call()
      const pairAllowance = await getAllowance(defiedgeStrategyContract, defiedgeStrategy.gauge.address, account)
      if (fromWei(pairAllowance).lt(fromWei(pairBalance))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve2uuid, defiedgeStrategyContract, 'approve', [defiedgeStrategy.gauge.address, MAX_UINT256], account)
        } catch (err) {
          console.log('approve 2 error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve2uuid,
            status: TRANSACTION_STATUS.SUCCESS,
          }),
        )
      }
      const params = [pairBalance]
      const gaugeContract = getGaugeContract(web3, defiedgeStrategy.gauge.address)
      try {
        await sendContract(dispatch, key, stakeuuid, gaugeContract, 'deposit', params, account)
      } catch (err) {
        console.log('stake error :>> ', err)
        setPending(false)
        return
      }
      onFieldAInput('')
      onFieldBInput('')
      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Added',
        }),
      )
      setPending(false)
    },
    [account, web3, preset],
  )

  return { onDefiedgeAdd: handleDefiedgeAdd, onDefiedgeAddAndStake: handleDefiedgeAddAndStake, pending }
}

const useDefiedgeRemove = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const preset = useActivePreset()

  const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers()

  const handleDefiedgeRemove = useCallback(
    async (defiedgeStrategy, share) => {
      const {
        address: strategyAddress,
        token0: { symbol: baseSymbol },
        token1: { symbol: quoteSymbol },
      } = defiedgeStrategy
      const key = uuidv4()
      const removeuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Remove ${baseSymbol}/${quoteSymbol} liquidity`,
          transactions: {
            [removeuuid]: {
              desc: 'Remove liquidity',
              status: TRANSACTION_STATUS.START,
              hash: null,
            },
          },
        }),
      )
      const contract = getDefiedgeStrategyContract(strategyAddress, web3)

      try {
        await sendContract(dispatch, key, removeuuid, contract, 'burn', [toWei(share).toFixed(0), '0', '0'], account)
      } catch (err) {
        console.log('remove error :>> ', err)
        setPending(false)
        return
      }
      onFieldAInput('')
      onFieldBInput('')
      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Removed',
        }),
      )
      setPending(false)
    },
    [account, web3, preset],
  )

  return { onDefiedgeRemove: handleDefiedgeRemove, pending }
}

const useDefiedgeAUM = (strategy) => {
  const [total0, setTotal0] = useState(ZERO_VALUE)
  const [total1, setTotal1] = useState(ZERO_VALUE)

  const contract = useContract(strategy, defiedgeStrategyAbi)

  const fetchInfo = () => {
    contract.callStatic
      .getAUMWithFees(true)
      .then((data) => {
        setTotal0(new BigNumber(data.amount0.add(data.totalFee0).toString()))
        setTotal1(new BigNumber(data.amount1.add(data.totalFee1).toString()))
      })
      .catch((e) => {
        console.warn(e)
      })
      .finally(() => {
        return {
          total0,
          total1,
        }
      })
  }

  useEffect(() => {
    if (!contract) return
    fetchInfo()
  }, [])

  return { total0, total1 }
}

export { useDefiedgeAdd, useDefiedgeRemove, useDefiedgesInfo, useDefiedgeAUM }

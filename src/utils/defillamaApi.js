const fetchTotalTvl = async (chainId) => {
  try {
    // const url = chainId === ChainId.BSC ? `${backendApi}/fusions` : `${yakaApi}/fusions`
    const url = 'https://api.llama.fi/updatedProtocol/yaka-finance'
    const response = await fetch(url, {
      method: 'get',
    })
    const res = await response.json()
    // console.log('totaltvl')
    // console.log(res)
    return res.currentChainTvls?.Sei ?? 0
  } catch (ex) {
    console.error('v3 Pairs fetched had error', ex)
    return []
  }
}

export { fetchTotalTvl }

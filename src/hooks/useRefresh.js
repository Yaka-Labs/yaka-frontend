import { useContext } from 'react'
import { RefreshContext } from 'context/RefreshContext'

const useRefresh = () => {
  const { fastest, fast, slow, tvlRefreshFlag } = useContext(RefreshContext)
  return { fastestRefresh: fastest, fastRefresh: fast, slowRefresh: slow, tvlRefresh: tvlRefreshFlag }
}

export default useRefresh

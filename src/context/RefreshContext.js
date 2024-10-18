import React, { useState, useEffect, useMemo } from 'react'

const FASTEST_INTERVAL = 6000
const FAST_INTERVAL = 20000
const SLOW_INTERVAL = 60000
const TVL_INTERVAL = 1800000

const RefreshContext = React.createContext({ slow: 0, fast: 0, fastest: 0, tvlRefreshFlag: 0 })

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider = ({ children }) => {
  const [slow, setSlow] = useState(0)
  const [fast, setFast] = useState(0)
  const [fastest, setFastest] = useState(0)
  const [tvlRefreshFlag, setTvlRefreshFlag] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      setFastest((prev) => prev + 1)
    }, FASTEST_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      setFast((prev) => prev + 1)
    }, FAST_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      setSlow((prev) => prev + 1)
    }, SLOW_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      setTvlRefreshFlag((prev) => prev + 1)
    }, TVL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  const value = useMemo(() => {
    return { slow, fast, fastest, tvlRefreshFlag }
  }, [slow, fast, fastest, tvlRefreshFlag])

  return <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>
}

export { RefreshContext, RefreshContextProvider }

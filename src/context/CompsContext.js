import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useRefresh from 'hooks/useRefresh'
import { getCompetitions } from 'utils/api'
import { useAssets } from 'state/assets/hooks'

const CompsContext = React.createContext([])

const CompsContextProvider = ({ children }) => {
  const [comps, setComps] = useState([])
  const { fastRefresh } = useRefresh()
  const route = useLocation()
  const { pathname } = route
  const assets = useAssets()

  useEffect(() => {
    const getCompsData = async () => {
      try {
        const res = await getCompetitions()
        const data = res.map((comp) => {
          return {
            ...comp,
            prize: {
              ...comp.prize,
              token: assets.find((ele) => ele.address.toLowerCase() === comp.prize.token.toLowerCase()),
            },
            competitionRules: {
              ...comp.competitionRules,
              winningToken: assets.find((ele) => ele.address.toLowerCase() === comp.competitionRules.winningToken.toLowerCase()),
              tradingTokens: assets.filter((ele) => comp.competitionRules.tradingTokens.map((sub) => sub.toLowerCase()).includes(ele.address)),
            },
          }
        })
        setComps(data)
      } catch (e) {
        console.error('comps fetched had error', e)
      }
    }
    if (pathname.includes('/core/comps') && assets.length > 0) {
      getCompsData()
    }
  }, [fastRefresh, pathname, assets])

  return <CompsContext.Provider value={comps}>{children}</CompsContext.Provider>
}

export { CompsContext, CompsContextProvider }

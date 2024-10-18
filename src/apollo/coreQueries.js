import gql from 'graphql-tag'

export const LEADERBOARD = (days) => {
  const queryString = days
    ? `
    query leaderboard {
      leaderboard(period: "${days}"){
        address
        rank
        volume
      }
    }
    `
    : `query leaderboard {
      leaderboard{
        address
        rank
        volume
      }
    }
    `

  return gql(queryString)
}

export const USER_BY_ID = (userId) => {
  const queryString = `
    query userById {
      userById(id: "${userId}") {
        id
        balance
        firstInteractAt
        isContract
      }
    }
    `

  return gql(queryString)
}

export const TOKEN_BY_ID = (tokenId) => {
  const tokenDetails = `
    query tokenDetails {
      tokenById(id: "${tokenId}") {
        symbol
        bnbPrice
        decimals
        id
      }
    }  
  `
  return gql(tokenDetails)
}

export const COMPETITION_BY_ID = (competitionId) => {
  const competitionsDetails = `
    query tradingCompetitionById {
      tradingCompetitionById(id: "${competitionId}") {
        id
        competitionRules {
          startingBalance
          tradingTokens
          winningToken
        }
        description
        entryFee
        market
        maxParticipants
        participantCount
        name
        owner{
          id
        }
        prize {
          ownerFee
          token
          totalPrize
          hostContribution
          weights
          winType
        }
        participants {
          id
          winAmount
          participant {
            balance
            firstInteractAt
            id
            isContract
          }
        }
        tradingCompetitionSpot
        timestamp {
          endTimestamp
          registrationEnd
          registrationStart
          startTimestamp
        }
      }
    }
    `
  return gql(competitionsDetails)
}

export const TC_PARTCIPANTS = (tcCompetitionId, userId) => {
  const query = gql`
    query MyQuery {
      tcParticipants(where: { id_eq: "${tcCompetitionId}-${userId}" }) {
        id
      }
    }
  `
  return query
}

export const TRADING_COMPETITION_LIST = (ownerId) => {
  const query = gql`
    query TradingCompetitions {
      tradingCompetitions${ownerId ? `(where: { owner_eq: "${ownerId}" })` : ''} {
        competitionRules {
          startingBalance
          tradingTokens
          winningToken
        }
        description
        entryFee
        id
        market
        maxParticipants
        participantCount
        participants {
          id
          winAmount
          participant {
            balance
            firstInteractAt
            id
            isContract
          }
        }
        name
        owner{
          id
        }
        timestamp {
          endTimestamp
          registrationEnd
          registrationStart
          startTimestamp
        }
        prize {
          ownerFee
          token
          totalPrize
          weights
          winType
        }
        tradingCompetitionSpot
      }
    }
  `

  return query
}

export const TC_PARTCIPANTS_BY_COMPETITION_ID = (id) => {
  const query = gql`
    query MyQuery {
      tcParticipants(where: { id_startsWith: "${id}" }) {
        id
        participant {
          id
          usernameNfts {
            id
            name
          }
        }
        pnl
        startBalance
        tradingCompetition {
          competitionRules {
            winningToken
            winningTokenDecimal
          }
        }
        winAmount
      }
    }
  `
  return query
}

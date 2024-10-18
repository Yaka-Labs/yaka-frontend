import { createApi } from '@reduxjs/toolkit/query/react'
import { ClientError, gql, GraphQLClient } from 'graphql-request'
import store from 'state'
import { ChainId } from 'thena-sdk-core'

const CHAIN_SUBGRAPH_URL = {
  [ChainId.BSC]: 'https://api.thegraph.com/subgraphs/name/thenaursa/thena-fusion',
  [ChainId.OPBNB]: 'https://open-platform-ap.nodereal.io/05d844a21964497bbbcaae823c36871b/opbnb-mainnet-graph-query/subgraphs/name/thena/exchange-fusion',
}
// Graphql query client wrapper that builds a dynamic url based on chain id
const graphqlRequestBaseQuery = () => {
  return async ({ document, variables }) => {
    const chainId = store.getState().settings?.networkId ?? ChainId.BSC
    try {
      const subgraphUrl = chainId ? CHAIN_SUBGRAPH_URL[chainId] : undefined

      if (!subgraphUrl) {
        return {
          error: {
            name: 'UnsupportedChainId',
            message: 'Subgraph queries against ChainId are not supported.',
            stack: '',
          },
        }
      }

      return {
        data: await new GraphQLClient(subgraphUrl).request(document, variables),
        meta: {},
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const { name, message, stack, request, response } = error
        return { error: { name, message, stack }, meta: { request, response } }
      }
      throw error
    }
  }
}

export const api = createApi({
  reducerPath: 'dataApi',
  baseQuery: graphqlRequestBaseQuery(),
  endpoints: (builder) => ({
    allV3Ticks: builder.query({
      query: ({ poolAddress, skip = 0 }) => ({
        document: gql`
          query allV3Ticks($poolAddress: String!, $skip: Int!) {
            ticks(first: 1000, skip: $skip, where: { poolAddress: $poolAddress }, orderBy: tickIdx) {
              tickIdx
              liquidityNet
              price0
              price1
            }
          }
        `,
        variables: {
          poolAddress,
          skip,
        },
      }),
    }),
  }),
})

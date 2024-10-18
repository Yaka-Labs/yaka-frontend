import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ChainId } from 'thena-sdk-core'

export const v1Client = {
  [ChainId.BSC]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/thenaursa/thena-v1',
    }),
    cache: new InMemoryCache(),
    shouldBatch: true,
  }),
  [ChainId.OPBNB]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://open-platform-ap.nodereal.io/05d844a21964497bbbcaae823c36871b/opbnb-mainnet-graph-query/subgraphs/name/thena/exchange-v1',
    }),
    cache: new InMemoryCache(),
    shouldBatch: true,
  }),
}

export const fusionClient = {
  [ChainId.BSC]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/thenaursa/thena-fusion',
    }),
    cache: new InMemoryCache(),
    shouldBatch: true,
  }),
  [ChainId.OPBNB]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://open-platform-ap.nodereal.io/05d844a21964497bbbcaae823c36871b/opbnb-mainnet-graph-query/subgraphs/name/thena/exchange-fusion',
    }),
    cache: new InMemoryCache(),
    shouldBatch: true,
  }),
  713715: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/thenaursa/thena-fusion',
    }),
    cache: new InMemoryCache(),
    shouldBatch: true,
  }),
}

export const blockClient = {
  [ChainId.BSC]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/iliaazhel/bsc-blocks',
    }),
    cache: new InMemoryCache(),
    shouldBatch: true,
  }),
  [ChainId.OPBNB]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://open-platform-ap.nodereal.io/05d844a21964497bbbcaae823c36871b/opbnb-mainnet-graph-query/subgraphs/name/thena/opbnb-blocks',
    }),
    cache: new InMemoryCache(),
    shouldBatch: true,
  }),
}

export const dibsClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/spsina/dibs',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const squidClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://squid.subsquid.io/thena-squid/graphql',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export default v1Client

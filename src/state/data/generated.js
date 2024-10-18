import { api } from './slice'

const AllV3TicksDocument = `
    query allV3Ticks($poolAddress: String!, $skip: Int!) {
  ticks(
    first: 1000
    skip: $skip
    where: {poolAddress: $poolAddress}
    orderBy: tickIdx
  ) {
    tickIdx
    liquidityNet
    price0
    price1
  }
}
`

const injectedRtkApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    allV3Ticks: build.query({
      query: (variables) => ({ document: AllV3TicksDocument, variables }),
    }),
  }),
})

export { injectedRtkApi as api }

import { createReducer } from '@reduxjs/toolkit'
import {
  addBookMarkPair,
  addBookMarkToken,
  removeBookmarkPair,
  removeBookmarkToken,
  updateBlockNumber,
  updateBookmarkPairs,
  updateBookmarkTokens,
  addCompetitionData,
  addEventsData,
  addPostData,
} from './actions'

const initialState = {
  blockNumber: {},
  bookmarkedTokens: [],
  bookmarkedPairs: [],
  competitionsData: {},
  eventsData: {},
  postData: {},
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(addBookMarkToken, (state, { payload }) => {
      const tokens = state.bookmarkedTokens
      tokens.push(payload)
      state.bookmarkedTokens = tokens
    })
    .addCase(removeBookmarkToken, (state, { payload }) => {
      const tokenIndex = state.bookmarkedTokens.indexOf(payload)
      const tokens = state.bookmarkedTokens.slice(0, tokenIndex - 1).concat(state.bookmarkedTokens.slice(tokenIndex + 1, state.bookmarkedTokens.length - 1))
      state.bookmarkedTokens = tokens
    })
    .addCase(updateBookmarkTokens, (state, { payload }) => {
      state.bookmarkedTokens = payload
    })
    .addCase(addBookMarkPair, (state, { payload }) => {
      const pairs = state.bookmarkedPairs
      pairs.push(payload)
      state.bookmarkedPairs = pairs
    })
    .addCase(removeBookmarkPair, (state, { payload }) => {
      const pairIndex = state.bookmarkedPairs.indexOf(payload)
      const pairs = state.bookmarkedPairs.slice(0, pairIndex - 1).concat(state.bookmarkedPairs.slice(pairIndex + 1, state.bookmarkedPairs.length - 1))
      state.bookmarkedPairs = pairs
    })
    .addCase(updateBookmarkPairs, (state, { payload }) => {
      state.bookmarkedPairs = payload
    })
    .addCase(addCompetitionData, (state, { payload }) => {
      state.competitionsData = payload
    })
    .addCase(addEventsData, (state, { payload }) => {
      state.eventsData = payload
    })
    .addCase(addPostData, (state, { payload }) => {
      state.postData = payload
    }),
)

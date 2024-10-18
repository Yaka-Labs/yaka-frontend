/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { ChainId } from 'thena-sdk-core'
import { updateTotalTvl } from './actions'

export const initialState = {
  data: {
    [ChainId.BSC]: { totaltvl: 0 },
    [ChainId.OPBNB]: { totaltvl: 0 },
    [1329]: { totaltvl: 0 },
  },
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateTotalTvl, (state, { payload }) => {
    const { totaltvl, networkId } = payload
    return {
      ...state,
      data: {
        ...state.data,
        [networkId]: { totaltvl },
      },
    }
  }),
)

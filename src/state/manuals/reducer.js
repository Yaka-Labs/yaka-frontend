/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { updateManuals } from './actions'

export const initialState = {
  data: [],
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateManuals, (state, { payload }) => {
    return {
      ...state,
      data: payload,
    }
  }),
)

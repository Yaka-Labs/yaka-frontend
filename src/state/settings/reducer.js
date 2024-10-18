/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
// import { ChainId } from 'thena-sdk-core'
import { closeWallet, openWallet, switchNetwork, updateDeadline, updateSlippage } from './actions'
import {DEFAULT_CHAIN_ID} from "../../config/constants";

export const initialState = {
  // networkId: ChainId.BSC,
  networkId: DEFAULT_CHAIN_ID,
  isWalletOpen: false,
  slippage: 0.5,
  deadline: 20,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(switchNetwork, (state, { payload }) => {
      return {
        ...state,
        networkId: payload,
      }
    })
    .addCase(openWallet, (state) => {
      return {
        ...state,
        isWalletOpen: true,
      }
    })
    .addCase(closeWallet, (state) => {
      return {
        ...state,
        isWalletOpen: false,
      }
    })
    .addCase(updateSlippage, (state, { payload }) => {
      return {
        ...state,
        slippage: payload,
      }
    })
    .addCase(updateDeadline, (state, { payload }) => {
      return {
        ...state,
        deadline: payload,
      }
    }),
)

/* eslint-disable */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { save, load } from 'redux-localstorage-simple'
import transactionsReducer from './transactions/reducer'
import settingsReducer from './settings/reducer'
import mintV3Reducer from './mintV3/reducer'
import multicallV3Reducer from './multicall/v3/reducer'
import applicationReducer from './application/reducer'
import assetsReducer from './assets/reducer'
import poolsReducer from './pools/reducer'
import manualsReducer from './manuals/reducer'
import { api as dataApi } from './data/slice'
import totaltvlReducer from './totaltvl/reducer'

const PERSISTED_KEYS = ['transactions', 'settings', 'assets', 'pools', 'totaltvl']

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  blacklist: [],
  storage,
  version: 1,
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    transactions: transactionsReducer,
    settings: settingsReducer,
    mintV3: mintV3Reducer,
    multicallV3: multicallV3Reducer,
    application: applicationReducer,
    assets: assetsReducer,
    pools: poolsReducer,
    manuals: manualsReducer,
    [dataApi.reducerPath]: dataApi.reducer,
    totaltvl: totaltvlReducer,
  }),
)

let store

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(dataApi.middleware),
      save({ states: PERSISTED_KEYS }),
    ],
    devTools: process.env.NODE_ENV === 'development',
    preloadedState: load({ states: PERSISTED_KEYS }),
  })
}

export const initializeStore = () => {
  let _store = store ?? makeStore()

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (store) {
    _store = makeStore()
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) {
    store = _store
  }

  return _store
}

store = initializeStore()

export default store

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}

import { useWeb3React } from '@web3-react/core'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { addBookMarkPair, addBookMarkToken, removeBookmarkPair, removeBookmarkToken, updateBookmarkTokens } from './actions'

export function useBlockNumber() {
  const { chainId } = useWeb3React()

  return useSelector((state) => state.application.blockNumber[chainId ?? -1])
}

export function useBookmarkTokens() {
  const bookmarkedTokens = useSelector((state) => state.application.bookmarkedTokens)
  const dispatch = useDispatch()
  const _addBookmarkToken = useCallback(
    (token) => {
      dispatch(addBookMarkToken(token))
    },
    [dispatch],
  )
  const _removeBookmarkToken = useCallback(
    (token) => {
      dispatch(removeBookmarkToken(token))
    },
    [dispatch],
  )
  const _updateBookmarkTokens = useCallback(
    (tokens) => {
      dispatch(updateBookmarkTokens(tokens))
    },
    [dispatch],
  )
  return {
    bookmarkTokens: bookmarkedTokens,
    addBookmarkToken: _addBookmarkToken,
    removeBookmarkToken: _removeBookmarkToken,
    updateBookmarkTokens: _updateBookmarkTokens,
  }
}

export function useBookmarkPairs() {
  const bookmarkedPairs = useSelector((state) => state.application.bookmarkedPairs)
  const dispatch = useDispatch()
  const _addBookmarkPair = useCallback(
    (pair) => {
      dispatch(addBookMarkPair(pair))
    },
    [dispatch],
  )
  const _removeBookmarkPair = useCallback(
    (pair) => {
      dispatch(removeBookmarkPair(pair))
    },
    [dispatch],
  )
  const _updateBookmarkPairs = useCallback(
    (pairs) => {
      dispatch(updateBookmarkTokens(pairs))
    },
    [dispatch],
  )
  return {
    bookmarkPairs: bookmarkedPairs,
    addBookmarkPair: _addBookmarkPair,
    removeBookmarkPair: _removeBookmarkPair,
    updateBookmarkPairs: _updateBookmarkPairs,
  }
}

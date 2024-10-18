import { createAction } from '@reduxjs/toolkit'

export const updateBlockNumber = createAction('application/updateBlockNumber')

export const addBookMarkToken = createAction('application/addBookMarkedToken')

export const removeBookmarkToken = createAction('application/removeBookMarkedToken')

export const updateBookmarkTokens = createAction('application/updateBookMarkedTokens')

export const addBookMarkPair = createAction('application/addBookMarkPair')

export const removeBookmarkPair = createAction('application/removeBookmarkPair')

export const updateBookmarkPairs = createAction('application/updateBookmarkPairs')

export const addCompetitionData = createAction('application/addCompetitionData')

export const addEventsData = createAction('application/addEventsData')
export const addPostData = createAction('application/addPostData')

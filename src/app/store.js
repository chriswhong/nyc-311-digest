// redux-toolkit store
import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { toast } from 'react-toastify'

import { mainApi } from '../util/rtk-api.js'
import { serviceRequestsApi } from '../util/service-requests-api.js'

export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!')
    toast.error('Oops, something went wrong... Please try again later.', {
      position: 'bottom-left',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    })
  }

  return next(action)
}

export const store = configureStore({
  reducer: {
    [mainApi.reducerPath]: mainApi.reducer,
    [serviceRequestsApi.reducerPath]: serviceRequestsApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
      .concat(mainApi.middleware)
      .concat(serviceRequestsApi.middleware)
      .concat(rtkQueryErrorLogger)
})

setupListeners(store.dispatch)

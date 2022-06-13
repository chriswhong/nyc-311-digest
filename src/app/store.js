// redux-toolkit store
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { mainApi } from '../util/rtk-api.js'
import { staticApi } from '../util/static-api.js'
import { serviceRequestsApi } from '../util/service-requests-api.js'

export const store = configureStore({
  reducer: {
    [mainApi.reducerPath]: mainApi.reducer,
    [staticApi.reducerPath]: staticApi.reducer,
    [serviceRequestsApi.reducerPath]: serviceRequestsApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
      .concat(mainApi.middleware)
      .concat(staticApi.middleware)
      .concat(serviceRequestsApi.middleware)
})

setupListeners(store.dispatch)

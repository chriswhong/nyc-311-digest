import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { sec } from './security'

// Define a service using a base URL and expected endpoints
export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions`,
    prepareHeaders: async (headers, { endpoint }) => {
      const getAccessToken = sec.getAccessToken()

      // If we have a token set in state, let's assume that we should be passing it.
      if (['createAoi'].includes(endpoint)) {
        const token = await getAccessToken({
          audience: 'nyc-311-reports-functions'
        })
        console.log('token', token)

        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    }
  }),
  endpoints: (builder) => ({
    getAois: builder.query({
      query: () => 'get-aois'
    }),

    getAoi: builder.query({
      query: (aoiId) => `get-aoi?id=${aoiId}`
    }),

    getUsername: builder.query({
      query: (sub) => `get-username?sub=${sub}`
    }),

    createAoi: builder.mutation({
      query: (body) => ({
        url: 'post-aoi',
        method: 'POST',
        body
      })
    })
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAoisQuery, useGetAoiQuery, useGetUsernameQuery, useCreateAoiMutation } = mainApi

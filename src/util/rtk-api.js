// react toolkit query api for this app's netlify functions
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { sec } from './security'

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions`,
    prepareHeaders: async (headers, { endpoint }) => {
      const getAccessToken = sec.getAccessToken()
      if ([
        'createAoi',
        'deleteAoi',
        'createUsername',
        'checkUsername',
        'followAoi',
        'toggleFollowAoi'
      ].includes(endpoint)) {
        const token = await getAccessToken({
          audience: 'nyc-311-reports-functions'
        })

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
      query: (_id) => `get-aoi?id=${_id}`
    }),

    createAoi: builder.mutation({
      query: (body) => ({
        url: 'post-aoi',
        method: 'POST',
        body
      })
    }),

    deleteAoi: builder.mutation({
      query: (id) => ({
        url: 'delete-aoi',
        method: 'DELETE',
        body: {
          id
        }
      })
    }),

    getCommunityDistricts: builder.query({
      query: () => 'get-community-districts'
    }),

    getCommunityDistrict: builder.query({
      query: (id) => `get-community-district?id=${id}`
    }),

    getUsername: builder.query({
      query: (sub) => `get-username?sub=${sub}`
    }),

    checkUsername: builder.mutation({
      query: (username) => ({
        url: 'post-check-username',
        method: 'POST',
        body: {
          username
        }
      })
    }),

    createUsername: builder.mutation({
      query: (body) => ({
        url: 'post-create-username',
        method: 'POST',
        body
      })
    }),

    toggleFollowAoi: builder.mutation({
      query: (body) => ({
        url: 'post-toggle-follow',
        method: 'POST',
        body
      })
    })

  })
})

export const {
  useGetAoisQuery,
  useGetAoiQuery,
  useCreateAoiMutation,
  useDeleteAoiMutation,
  useGetCommunityDistrictsQuery,
  useGetCommunityDistrictQuery,
  useGetUsernameQuery,
  useCheckUsernameMutation,
  useCreateUsernameMutation,
  useToggleFollowAoiMutation
} = mainApi

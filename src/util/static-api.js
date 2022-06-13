// react toolkit query api for static json files located in `/public/data`
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const staticApi = createApi({
  reducerPath: 'staticApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/data'
  }),
  endpoints: (builder) => ({
    getCommunityDistricts: builder.query({
      query: () => 'community-districts.geojson'
    })
  })
})

export const {
  useGetCommunityDistrictsQuery
} = staticApi

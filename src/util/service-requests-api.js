// react toolkit query api for static json files located in `/public/data`
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const serviceRequestsApi = createApi({
  reducerPath: 'serviceRequestsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://data.cityofnewyork.us/resource/erm2-nwe9.json'
  }),
  endpoints: (builder) => ({
    getNewServiceRequests: builder.query({
      query: ({ bbox, dateSelection, page }) => {
        const dateFrom = dateSelection.dateRange[0].format('YYYY-MM-DD')
        const dateTo = dateSelection.dateRange[1].format('YYYY-MM-DD')
        const offset = (page - 1) * 1000

        return `?$where=latitude>${bbox[1]} AND latitude<${bbox[3]} AND longitude>${bbox[0]} AND longitude<${bbox[2]} AND created_date>'${dateFrom}' AND created_date<='${dateTo}'&$offset=${offset}&$order=created_date DESC`
      }
    }),
    getClosedServiceRequests: builder.query({
      query: ({ bbox, dateSelection, page }) => {
        const dateFrom = dateSelection.dateRange[0].format('YYYY-MM-DD')
        const dateTo = dateSelection.dateRange[1].format('YYYY-MM-DD')
        const offset = (page - 1) * 1000

        return `?$where=latitude>${bbox[1]} AND latitude<${bbox[3]} AND longitude>${bbox[0]} AND longitude<${bbox[2]} AND created_date>'${dateFrom}' AND created_date<='${dateTo}'&$offset=${offset}&$order=created_date DESC`
      }
    })
  })
})

export const {
  useGetNewServiceRequestsQuery,
  useGetClosedServiceRequestsQuery
} = serviceRequestsApi

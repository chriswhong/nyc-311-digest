// react toolkit query api for static json files located in `/public/data`
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const formatDateRange = (dateRange) => {
  const dateFrom = dateRange[0].format('YYYY-MM-DD')
  const dateTo = dateRange[1].format('YYYY-MM-DD')

  return {
    dateFrom,
    dateTo
  }
}

const offsetFromPage = (page) => {
  return (page - 1) * 1000
}
export const serviceRequestsApi = createApi({
  reducerPath: 'serviceRequestsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://data.cityofnewyork.us/resource/erm2-nwe9.json'
  }),
  endpoints: (builder) => ({
    // get all requests in bbox which were created during the daterange
    getNewServiceRequests: builder.query({
      query: ({ bbox, dateSelection, page }) => {
        const { dateFrom, dateTo } = formatDateRange(dateSelection.dateRange)
        const offset = offsetFromPage(page)

        return `?$where=latitude>${bbox[1]} AND latitude<${bbox[3]} AND longitude>${bbox[0]} AND longitude<${bbox[2]} AND created_date>'${dateFrom}' AND created_date<='${dateTo}'&$offset=${offset}&$order=created_date DESC`
      }
    }),
    // get all requests in bbox which were closed during the daterange
    getClosedServiceRequests: builder.query({
      query: ({ bbox, dateSelection, page }) => {
        const { dateFrom, dateTo } = formatDateRange(dateSelection.dateRange)
        const offset = offsetFromPage(page)

        return `?$where=latitude>${bbox[1]} AND latitude<${bbox[3]} AND longitude>${bbox[0]} AND longitude<${bbox[2]} AND closed_date>'${dateFrom}' AND closed_date<='${dateTo}'&$offset=${offset}&$order=closed_date DESC`
      }
    })
  })
})

export const {
  useGetNewServiceRequestsQuery,
  useGetClosedServiceRequestsQuery
} = serviceRequestsApi

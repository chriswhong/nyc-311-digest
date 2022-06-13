import { useEffect, useState } from 'react'
import useFetch from './useFetch'

// this is a custom implementation of useFetch() which can paginate NYC 311 requests
export const useGetServiceRequestsQuery = (areaOfInterest, dateSelection) => {
  const bounds = areaOfInterest.properties.bbox
  const dateFrom = dateSelection.dateRange[0].format('YYYY-MM-DD')
  const dateTo = dateSelection.dateRange[1].format('YYYY-MM-DD')

  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [triggered, setTriggered] = useState(false)

  const trigger = () => {
    setTriggered(true)
  }

  useEffect(() => {
    if (triggered) {
      setTriggered(false)

      let offset = 0

      const fetchProduct = async () => {
        try {
          setError()

          const url = `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$where=latitude>${bounds[1]} AND latitude<${bounds[3]} AND longitude>${bounds[0]} AND longitude<${bounds[2]} AND created_date>'${dateFrom}' AND created_date<='${dateTo}'&$offset=${offset}&$order=created_date DESC`

          let response = await fetch(url).then(d => d.json())

          if (response.length === 1000) {
            offset += 1000
            response = [
              ...response,
              ...await fetchProduct(offset)
            ]
          }
          return response
        } catch (err) {
          setError(err)
        }
      }

      setLoading(true)

      fetchProduct().then((data) => {
        setData(data)
        setLoading(false)
      })
    }
  }, [triggered])

  return { data, loading, error, trigger }
}

export const useGetCommunityDistrictsQuery = () => {
  return useFetch({
    url: '/data/community-districts.geojson'
  })
}

export const useCheckUsernameQuery = (username) => {
  return useFetch({
    url: `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/post-check-username`,
    method: 'POST',
    body: {
      username
    }
  })
}

export const useCreateUsernameQuery = (username, sub) => {
  return useFetch({
    url: `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/post-create-username`,
    method: 'POST',
    body: {
      username,
      sub
    },
    authorization: true
  })
}

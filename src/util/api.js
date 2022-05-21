import moment from 'moment'
import pointsWithinPolygon from '@turf/points-within-polygon'

import useFetch from './useFetch'
import getRollupCategory from './categoryColors'

export const useDeleteAOIQuery = (areaOfInterestId) => {
  return useFetch({
    url: `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/delete-geometry`,
    method: 'DELETE',
    body: {
      id: areaOfInterestId
    },
    authorization: true
  })
}

export const useGetServiceRequestsQuery = (areaOfInterest, dateSelection) => {
  if (!areaOfInterest || !dateSelection) {
    return useFetch({
      url: 'foo'
    })
  }
  const bounds = areaOfInterest.properties.bbox
  const dateFrom = dateSelection.dateRange[0].format('YYYY-MM-DD')
  const dateTo = dateSelection.dateRange[1].format('YYYY-MM-DD')

  const { data, loading, error, trigger } = useFetch({
    url: `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$where=latitude>${bounds[1]} AND latitude<${bounds[3]} AND longitude>${bounds[0]} AND longitude<${bounds[2]} AND created_date>'${dateFrom}' AND created_date<='${dateTo}'&$order=created_date DESC`
  })

  if (data) {
    const serviceRequestsGeojson = {
      type: 'FeatureCollection',
      features: data.map((d) => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(d.longitude), parseFloat(d.latitude)]
          },
          properties: { ...d }
        }
      })
    }

    const clippedServiceRequests = pointsWithinPolygon(serviceRequestsGeojson, areaOfInterest.geometry)
    // convert created_date to unix epoch
    clippedServiceRequests.features = clippedServiceRequests.features.map((d) => {
      return {
        ...d,
        properties: {
          ...d.properties,
          created_date: moment(d.properties.created_date).unix(),
          closed_date: moment(d.properties.closed_date).unix(),
          resolution_action_updated_date: moment(d.properties.resolution_action_updated_date).unix(),
          rollupCategory: getRollupCategory(d.properties.complaint_type)
        }
      }
    })
    return { data: clippedServiceRequests, loading, error, trigger }
  }

  return { data, loading, error, trigger }
}

export const useGetAOIsQuery = () => {
  return useFetch({
    url: `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/get-geometries`
  })
}

export const useGetUsernameQuery = (sub) => {
  return useFetch({
    url: `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/get-username?sub=${sub}`
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
export const useCreateAOIQuery = (body) => {
  return useFetch({
    url: `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/post-geometry`,
    method: 'POST',
    body,
    authorization: true
  })
}

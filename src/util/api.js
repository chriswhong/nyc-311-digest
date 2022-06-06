import useFetch from './useFetch'

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
  const bounds = areaOfInterest.properties.bbox
  const dateFrom = dateSelection.dateRange[0].format('YYYY-MM-DD')
  const dateTo = dateSelection.dateRange[1].format('YYYY-MM-DD')

  return useFetch({
    url: `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$where=latitude>${bounds[1]} AND latitude<${bounds[3]} AND longitude>${bounds[0]} AND longitude<${bounds[2]} AND created_date>'${dateFrom}' AND created_date<='${dateTo}'&$order=created_date DESC`
  })
}

export const useGetAOIsQuery = () => {
  return useFetch({
    url: `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/get-geometries`
  })
}

export const useGetCommunityDistrictsQuery = () => {
  return useFetch({
    url: '/data/community-districts.geojson'
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

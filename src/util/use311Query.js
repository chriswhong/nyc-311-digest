import { useState, useEffect } from 'react'
import moment from 'moment'
import pointsWithinPolygon from '@turf/points-within-polygon'

import getRollupCategory from './categoryColors'

// wraps rtk-queries for 311 requests, handling pagination and transformation of the results into geojson

const use311Query = (serviceRequestsQuery, { areaOfInterest, dateSelection }) => {
  const [skip, setSkip] = useState(true)
  // raw service requests, appended via pagination
  const [serviceRequests, setServiceRequests] = useState([])
  // FeatureCollection of combined service requests
  const [serviceRequestsFC, setServiceRequestsFC] = useState()
  const [page, setPage] = useState(1)

  const bbox = areaOfInterest.properties.bbox

  const { data } = serviceRequestsQuery({ bbox, dateSelection, page }, { skip })

  // kicks off the querying when the date range changes
  useEffect(() => {
    if (areaOfInterest) {
      setServiceRequests([])
      setSkip(false)
    }
  }, [bbox, dateSelection.dateRange])

  // check results length, keep fetching data until the number of results is less than 1000
  useEffect(() => {
    if (data?.length) {
      setServiceRequests([...serviceRequests, ...data])
      if (data.length < 1000) {
        setSkip(true)
      } else {
        setPage(page + 1)
      }
    }
  }, [data])

  // when all pages are downloaded, convert to geojson FeatureCollection for export
  useEffect(() => {
    if (serviceRequests.length && skip) {
      // convert to geojson
      const serviceRequestsGeojson = {
        type: 'FeatureCollection',
        features: serviceRequests.map((d) => {
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

      setServiceRequestsFC(clippedServiceRequests)
    }
  }, [serviceRequests])

  return {
    data: serviceRequestsFC
  }
}

export default use311Query

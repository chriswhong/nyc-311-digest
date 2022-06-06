import React, { useState, useEffect, createContext } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'
import pointsWithinPolygon from '@turf/points-within-polygon'

import { DEFAULT_DATE_RANGE_SELECTION, dateSelectionItems } from './DateRangeSelector'
import { useGetServiceRequestsQuery } from '../../util/api'
import getRollupCategory from '../../util/categoryColors'

function useQuery () {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

export const ThreeOneOneDataContext = createContext()

const ThreeOneOneDataHandler = ({
  areaOfInterest,
  children
}) => {
  const query = useQuery()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // array of two moments
  const dateRangeSelectorFromQueryParams = dateSelectionItems.find((d) => {
    return d.value === query.get('dateSelection')
  }) || DEFAULT_DATE_RANGE_SELECTION

  const [dateSelection, setDateSelection] = useState(dateRangeSelectorFromQueryParams)

  const { data, loading, error, trigger } = useGetServiceRequestsQuery(areaOfInterest, dateSelection)

  const [serviceRequests, setServiceRequests] = useState()
  const [popupData, setPopupData] = useState()

  // react to changes in query params
  useEffect(() => {
    setDateSelection(dateRangeSelectorFromQueryParams)
  }, [dateRangeSelectorFromQueryParams])

  useEffect(() => {
    if (areaOfInterest) {
      setServiceRequests()
      trigger()
    }
  }, [areaOfInterest, dateSelection.dateRange])

  const handleDateSelectionChange = (d) => {
    navigate({
      pathname,
      search: `?dateSelection=${d.value}`,
      hash: window.location.hash // get this value directly from window because mapboxgl is updating the hash
    })
  }

  useEffect(() => {
    if (data) {
      // convert to geojson
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

      setServiceRequests(clippedServiceRequests)
    }
  }, [data])

  return (
    <ThreeOneOneDataContext.Provider value={{
      serviceRequests,
      dateSelection,
      handleDateSelectionChange,
      popupData,
      setPopupData
    }}
    >
      {children}
    </ThreeOneOneDataContext.Provider>
  )
}

ThreeOneOneDataHandler.propTypes = {
  areaOfInterest: PropTypes.object,
  children: PropTypes.array
}

export default ThreeOneOneDataHandler

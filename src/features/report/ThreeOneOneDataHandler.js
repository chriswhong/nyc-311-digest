import React, { useState, createContext, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'

import { DEFAULT_DATE_RANGE_SELECTION, dateSelectionItems } from './DateRangeSelector'
import use311Query from '../../util/use311Query'
import { useGetNewServiceRequestsQuery, useGetClosedServiceRequestsQuery } from '../../util/service-requests-api'

export const ThreeOneOneDataContext = createContext()

// use query params
function useQuery () {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}
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

  const [popupData, setPopupData] = useState()
  const [dateSelection, setDateSelection] = useState(dateRangeSelectorFromQueryParams)
  // the active group of requests ('new', 'closed')
  const [activeGroup, setActiveGroup] = useState('new')

  // use use311Query multiple times for the various different cuts of data we need
  const {
    data: newServiceRequests,
    isLoading: newIsLoading
  } = use311Query(useGetNewServiceRequestsQuery, {
    areaOfInterest,
    dateSelection
  })

  const {
    data: closedServiceRequests,
    isLoading: closedIsLoading
  } = use311Query(useGetClosedServiceRequestsQuery, {
    areaOfInterest,
    dateSelection
  })

  // react to changes in query params
  useEffect(() => {
    setDateSelection(dateRangeSelectorFromQueryParams)
  }, [dateRangeSelectorFromQueryParams])

  // when data selection changes, update the query params
  const handleDateSelectionChange = (d) => {
    navigate({
      pathname,
      search: `?dateSelection=${d.value}`,
      hash: window.location.hash // get this value directly from window because mapboxgl is updating the hash
    })
  }

  const handleActiveGroupChange = (activeGroup) => {
    setActiveGroup(activeGroup)
  }

  const isLoading = newIsLoading || closedIsLoading

  // cacluate counts for simple display in the UI (for tabs)
  const groupCounts = {
    new: newServiceRequests?.features.length,
    closed: closedServiceRequests?.features.length
  }

  // export only one slice of the data at a time depending on activeGroup
  let serviceRequests = newServiceRequests
  if (activeGroup === 'closed') {
    serviceRequests = closedServiceRequests
  }

  return (
    <ThreeOneOneDataContext.Provider value={{
      serviceRequests,
      groupCounts,
      closedServiceRequests,
      dateSelection,
      handleDateSelectionChange,
      popupData,
      setPopupData,
      activeGroup,
      handleActiveGroupChange,
      isLoading
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

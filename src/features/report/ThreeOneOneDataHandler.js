import React, { useState, createContext, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'

import { DEFAULT_DATE_RANGE_SELECTION, dateSelectionItems } from './DateRangeSelector'
import use311Query from '../../util/use311Query'
import { useGetNewServiceRequestsQuery, useGetClosedServiceRequestsQuery } from '../../util/service-requests-api'

export const ThreeOneOneDataContext = createContext()

const DEFAULT_ACTIVE_GROUP = 'new'

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

  const [popupData, setPopupData] = useState()

  // pull the date range from query params, or use the default ('last7days')
  const dateRangeSelectorFromQueryParams = dateSelectionItems.find((d) => {
    return d.value === query.get('dateSelection')
  }) || DEFAULT_DATE_RANGE_SELECTION
  const [dateSelection, setDateSelection] = useState(dateRangeSelectorFromQueryParams)

  // pull the active group from query params, or use the default ('new')
  const activeGroupFromQueryParams = query.get('group') || DEFAULT_ACTIVE_GROUP
  const [activeGroup, setActiveGroup] = useState(activeGroupFromQueryParams)

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

  // react to changes in query params to update date range
  useEffect(() => {
    setDateSelection(dateRangeSelectorFromQueryParams)
  }, [dateRangeSelectorFromQueryParams])

  // when data selection changes, update the query params
  const handleDateSelectionChange = (d) => {
    query.set('dateSelection', d.value)
    navigate({
      pathname,
      search: query.toString(),
      hash: window.location.hash // get this value directly from window because mapboxgl is updating the hash
    })
  }

  const handleActiveGroupChange = (activeGroup) => {
    query.set('group', activeGroup)
    setActiveGroup(activeGroup)
    navigate({
      pathname,
      search: query.toString(),
      hash: window.location.hash // get this value directly from window because mapboxgl is updating the hash
    })
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

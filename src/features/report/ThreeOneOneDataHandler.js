import React, { useState, createContext, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'

import { DEFAULT_DATE_RANGE_SELECTION, dateSelectionItems } from './DateRangeSelector'

import use311Query from '../../util/use311Query'

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

  // array of two moments
  const dateRangeSelectorFromQueryParams = dateSelectionItems.find((d) => {
    return d.value === query.get('dateSelection')
  }) || DEFAULT_DATE_RANGE_SELECTION

  const [popupData, setPopupData] = useState()
  const [dateSelection, setDateSelection] = useState(dateRangeSelectorFromQueryParams)

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const bbox = areaOfInterest.properties.bbox

  const { data: serviceRequestsFC } = use311Query('new', {
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

  return (
    <ThreeOneOneDataContext.Provider value={{
      serviceRequestsFC,
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

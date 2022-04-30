import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import { DEFAULT_DATE_RANGE_SELECTION, dateSelectionItems } from './DateRangeSelector'
import AOISidebar from './AOISidebar'

function useQuery () {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const AOISidebarWrapper = ({
  map,
  allGeometries
}) => {
  const query = useQuery()
  const { pathname, state } = useLocation()
  const navigate = useNavigate()
  const { areaOfInterestId } = useParams()

  // array of two moments
  const dateRangeSelectorFromQueryParams = dateSelectionItems.find((d) => {
    return d.value === query.get('dateSelection')
  }) || DEFAULT_DATE_RANGE_SELECTION
  const [dateSelection, setDateSelection] = useState(dateRangeSelectorFromQueryParams)

  const [areaOfInterest, setAreaOfInterest] = useState()

  // react to changes in query params
  useEffect(() => {
    setDateSelection(dateRangeSelectorFromQueryParams)
  }, [dateRangeSelectorFromQueryParams])

  const handleDateRangeChange = (d) => {
    navigate({
      pathname,
      search: `?dateSelection=${d.value}`,
      hash: window.location.hash // get this value directly from window because mapboxgl is updating the hash
    })
  }

  useEffect(() => {
    if (allGeometries) {
      const areaOfInterest = allGeometries.features.find((d) => d.properties._id === areaOfInterestId)

      if (!areaOfInterest && !state?.refresh) {
        navigate('/404')
      } else {
        setAreaOfInterest(areaOfInterest)
      }
    }
  }, [allGeometries])

  return (
    <>
      {areaOfInterest && dateSelection && (
        <AOISidebar
          map={map}
          areaOfInterest={areaOfInterest}
          dateSelection={dateSelection}
          onDateRangeChange={handleDateRangeChange}
        />
      )}
    </>
  )
}

AOISidebarWrapper.propTypes = {
  map: PropTypes.object,
  allGeometries: PropTypes.object
}

export default AOISidebarWrapper

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import AOISidebar from '../report/AOISidebar'

import { DEFAULT_DATE_RANGE_SELECTION, dateSelectionItems } from '../report/DateRangeSelector'
import SidebarContainer from '../../layout/SidebarContainer'

const borocodeFromBoroughname = (boroughname) => {
  let boroCode
  switch (boroughname) {
    case 'manhattan' :
      boroCode = 1
      break
    case 'bronx' :
      boroCode = 2
      break
    case 'brooklyn' :
      boroCode = 3
      break
    case 'queens' :
      boroCode = 4
      break
    case 'staten-island' :
      boroCode = 5
      break
  }

  return boroCode
}

const getCommunityDistrictFeature = (communityDistricts, boroughname, cdnumber) => {
  // find the corresponding district
  const borocode = borocodeFromBoroughname(boroughname)
  const boroCD = parseInt(`${borocode}${cdnumber.padStart(2, '0')}`)
  const match = communityDistricts.features.find((d) => d.properties.BoroCD === boroCD)
  return match
}

function useQuery () {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const CommunityDistrictReportSidebar = ({ map, communityDistricts }) => {
  const query = useQuery()
  const { pathname, state } = useLocation()
  const navigate = useNavigate()

  // array of two moments
  const dateRangeSelectorFromQueryParams = dateSelectionItems.find((d) => {
    return d.value === query.get('dateSelection')
  }) || DEFAULT_DATE_RANGE_SELECTION
  const [dateSelection, setDateSelection] = useState(dateRangeSelectorFromQueryParams)

  const { boroughname, cdnumber } = useParams()

  const [cdFeature, setCdFeature] = useState()

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
    if (!communityDistricts) return

    const match = getCommunityDistrictFeature(communityDistricts, boroughname, cdnumber)

    setCdFeature(match)
  }, [communityDistricts])

  return (
    <SidebarContainer>
      {cdFeature && dateSelection && (
        <AOISidebar
          map={map}
          areaOfInterest={cdFeature}
          dateSelection={dateSelection}
          onDateRangeChange={handleDateRangeChange}
        />
      )}
    </SidebarContainer>

  )
}

CommunityDistrictReportSidebar.propTypes = {
  map: PropTypes.object,
  communityDistricts: PropTypes.object
}

export default CommunityDistrictReportSidebar

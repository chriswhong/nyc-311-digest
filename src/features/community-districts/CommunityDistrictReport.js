// this component should filter for the selected geometry, and pass it down to threeoneoneprovider

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

import ThreeOneOneDataHandler from '../report/ThreeOneOneDataHandler'
import ReportSidebar from '../report/ReportSidebar'
import ReportMapElements from '../report/ReportMapElements'

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

const capitalizeString = (str) => {
  return str[0].toUpperCase() + str.substring(1)
}

const getCdName = (boroughname, cdnumber) => {
  let prettifiedBoroughname = capitalizeString(boroughname)

  if ((boroughname) === 'staten-island') {
    prettifiedBoroughname = 'Staten Island'
  }

  return `${prettifiedBoroughname} Community District ${cdnumber}`
}

const getCommunityDistrictFeature = (communityDistricts, boroughname, cdnumber) => {
  // find the corresponding district
  const borocode = borocodeFromBoroughname(boroughname)
  const boroCD = parseInt(`${borocode}${cdnumber.padStart(2, '0')}`)
  const match = communityDistricts.features.find((d) => d.properties.BoroCD === boroCD)
  return match
}

const CommunityDistrictReport = ({ communityDistricts, map }) => {
  const { pathname } = useLocation()

  const { boroughname, cdnumber } = useParams()

  const [cdFeature, setCdFeature] = useState()

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GA4_TRACKING_ID)
    ReactGA.send({ hitType: 'pageview', page: pathname })
  }, [])

  useEffect(() => {
    if (!communityDistricts) return

    const match = getCommunityDistrictFeature(communityDistricts, boroughname, cdnumber)

    setCdFeature(match)
  }, [communityDistricts])

  const cdName = getCdName(boroughname, cdnumber)
  return (
    <>
      {cdFeature && (
        <>
          {/* <Head
            title={areaOfInterest.properties.name}
            description={`A report of 311 activity in the area ${areaOfInterest.properties.name}`}
          /> */}
          <ThreeOneOneDataHandler areaOfInterest={cdFeature}>
            <ReportSidebar
              areaOfInterest={cdFeature}
              backText='All Community Districts'
              backLink='/community-districts'
              areaTitle={cdName}

            />
            <ReportMapElements areaOfInterest={cdFeature} map={map} />
          </ThreeOneOneDataHandler>
        </>
      )}
    </>
  )
}

CommunityDistrictReport.propTypes = {
  map: PropTypes.object,
  communityDistricts: PropTypes.object
}

export default CommunityDistrictReport

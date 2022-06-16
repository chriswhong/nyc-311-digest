// this component should filter for the selected geometry, and pass it down to threeoneoneprovider

import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import ThreeOneOneDataHandler from '../report/ThreeOneOneDataHandler'
import ReportSidebar from '../report/ReportSidebar'
import ReportMapElements from '../report/ReportMapElements'
import Head from '../../layout/Head'
import { useGetCommunityDistrictQuery } from '../../util/rtk-api'

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

// const getCommunityDistrictFeature = (communityDistricts, boroughname, cdnumber) => {
//   // find the corresponding district
//   const borocode = borocodeFromBoroughname(boroughname)
//   const boroCD = parseInt(`${borocode}${cdnumber.padStart(2, '0')}`)
//   const match = communityDistricts.features.find((d) => d.properties.BoroCD === boroCD)
//   return match
// }

const CommunityDistrictReport = ({ communityDistricts }) => {
  const { boroughname, cdnumber } = useParams()

  const borocode = borocodeFromBoroughname(boroughname)
  const boroCD = parseInt(`${borocode}${cdnumber.padStart(2, '0')}`)

  const { data, error, isLoading, refetch } = useGetCommunityDistrictQuery(boroCD)

  const cdName = data.properties.name
  return (
    <>
      {data && (
        <>
          <Head
            title={cdName}
            description={`A report of 311 activity in the area ${cdName}`}
          />
          <ThreeOneOneDataHandler areaOfInterest={data}>
            <ReportSidebar
              areaOfInterest={data}
              backText='All Community Districts'
              backLink='/community-districts'
              areaTitle={cdName}
              onRefetch={refetch}
            />
            <ReportMapElements areaOfInterest={data} />
          </ThreeOneOneDataHandler>
        </>
      )}
    </>
  )
}

CommunityDistrictReport.propTypes = {
  communityDistricts: PropTypes.object
}

export default CommunityDistrictReport

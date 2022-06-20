// this component should filter for the selected geometry, and pass it down to threeoneoneprovider

import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import ThreeOneOneDataHandler from '../report/ThreeOneOneDataHandler'
import ReportSidebar from '../report/ReportSidebar'
import ReportMapElements from '../report/ReportMapElements'
import Head from '../../layout/Head'
import { useGetCommunityDistrictQuery } from '../../util/rtk-api'

const CommunityDistrictReport = ({ communityDistricts }) => {
  const { borocd } = useParams()

  const { data, refetch } = useGetCommunityDistrictQuery(borocd)

  const cdName = data?.properties.name
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

import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import Map from '../map/Map'
import ThreeOneOneDataHandler from '../report/ThreeOneOneDataHandler'
import ReportMapElements from '../report/ReportMapElements'
import ReportImageSidebar from '../report/ReportImageSidebar'
import { useGetAoiQuery, useGetCommunityDistrictQuery } from '../../util/rtk-api'

const AOIReportImage = ({
  onLoad
}) => {
  const { type, id } = useParams()
  console.log(type)

  let useGetAreaQuery = useGetAoiQuery

  if (type === 'cd') {
    useGetAreaQuery = useGetCommunityDistrictQuery
  }

  const { data } = useGetAreaQuery(id)

  console.log(data)

  return (
    <>
      {data && (
        <ThreeOneOneDataHandler areaOfInterest={data}>
          <ReportImageSidebar
            areaOfInterest={data}
          />
          <Map
            onLoad={(map) => {
              onLoad(map)
            }}
          />
          <ReportMapElements areaOfInterest={data} offsetCenter={false} isStatic />
        </ThreeOneOneDataHandler>
      )}
    </>
  )
}

AOIReportImage.propTypes = {
  onLoad: PropTypes.func
}

export default AOIReportImage

import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import Map from '../map/Map'
import ThreeOneOneDataHandler from '../report/ThreeOneOneDataHandler'
import ReportMapElements from '../report/ReportMapElements'
import ReportImageSidebar from '../report/ReportImageSidebar'
import { useGetAoiQuery } from '../../util/rtk-api'

const AOIReportImage = ({
  allGeometries,
  onLoad
}) => {
  const { areaOfInterestId } = useParams()

  const { data, error, isLoading } = useGetAoiQuery(areaOfInterestId)

  return (
    <>
      {areaOfInterest && (
        <ThreeOneOneDataHandler areaOfInterest={data}>
          <ReportImageSidebar
            areaOfInterest={data}
          />
          <Map
            onLoad={(map) => {
              onLoad(map)
            }}
          />
          <ReportMapElements areaOfInterest={data} offsetCenter={false} />
        </ThreeOneOneDataHandler>
      )}
    </>
  )
}

AOIReportImage.propTypes = {
  allGeometries: PropTypes.object,
  onLoad: PropTypes.func
}

export default AOIReportImage

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { DEFAULT_DATE_RANGE_SELECTION } from './DateRangeSelector'
import Map from '../map/Map'
import { useGetServiceRequestsQuery } from '../../util/api'
import AOIMapRenderer from './AOIMapRenderer'
import RollupChart from './RollupChart'

const AOIReportImage = ({
  allGeometries,
  onLoad
}) => {
  const { areaOfInterestId } = useParams()

  const [mapInstance, setMapInstance] = useState()

  const [areaOfInterest, setAreaOfInterest] = useState()
  const [popupData, setPopupData] = useState()

  const [dateSelection] = useState(DEFAULT_DATE_RANGE_SELECTION)

  const { data: serviceRequests, loading, error, trigger } = useGetServiceRequestsQuery(areaOfInterest, dateSelection)

  useEffect(() => {
    if (allGeometries) {
      const areaOfInterest = allGeometries.features.find((d) => d.properties._id === areaOfInterestId)
      setAreaOfInterest(areaOfInterest)
    }
  }, [allGeometries])

  useEffect(() => {
    if (mapInstance && areaOfInterest) {
      trigger()
    }
  }, [mapInstance, areaOfInterest, dateSelection.dateRange])

  const dateFrom = dateSelection.dateRange[0].format('ddd, DD MMM YYYY')
  const dateTo = dateSelection.dateRange[1].format('ddd, DD MMM YYYY')

  return (
    <>
      {areaOfInterest && serviceRequests && (
        <div className='flex flex-col p-5 h-3/6'>
          <div>Weekly Report of 311 Activity for</div>
          <div className='mb-1 text-3xl font-semibold'>{areaOfInterest.properties.name}</div>
          <div className='text-xs'>From {dateFrom} thru {dateTo}</div>
          <div className='flex items-center'>
            <div className='mr-2 text-2xl font-bold'>
              {serviceRequests.features.length}
            </div>
            <div className='text-lg'>
              New Service Requests
            </div>
          </div>
          <div className='flex-grow mb-3 '>
            <RollupChart data={serviceRequests.features} />
          </div>
        </div>
      )}
      <div className='h-3/6'>
        <Map
          onLoad={(map) => {
            setMapInstance(map)
            onLoad(map)
          }}
        />
      </div>

      <AOIMapRenderer
        map={mapInstance}
        dateSelection={dateSelection}
        areaOfInterest={areaOfInterest}
        serviceRequests={serviceRequests}
        popupData={popupData}
        setPopupData={setPopupData}
        offsetCenter={false}
      />
    </>
  )
}

AOIReportImage.propTypes = {
  allGeometries: PropTypes.object,
  onLoad: PropTypes.func
}

export default AOIReportImage

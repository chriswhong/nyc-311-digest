import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import RollupChart from './RollupChart'
import { ThreeOneOneDataContext } from './ThreeOneOneDataHandler'

const ReportImageSidebar = ({
  areaOfInterest
}) => {
  const {
    serviceRequestsFC,
    dateSelection
  } = useContext(ThreeOneOneDataContext)

  const dateFrom = dateSelection.dateRange[0].format('DD MMM YYYY')
  const dateTo = dateSelection.dateRange[1].format('DD MMM YYYY')

  return (
    <div className='flex flex-col p-5 h-3/6'>
      <div>Weekly Report of 311 Activity for</div>
      <div className='mb-1 text-3xl font-semibold'>{areaOfInterest.properties.name}</div>
      <div className='text-xs'>From {dateFrom} thru {dateTo}</div>
      {
        areaOfInterest && serviceRequestsFC && (
          <>
            <div className='flex items-center'>
              <div className='mr-2 text-2xl font-bold'>
                {serviceRequestsFC.features.length}
              </div>
              <div className='text-lg'>
                New Service Requests
              </div>
            </div>
            <div className='flex-grow mb-3 '>
              <RollupChart data={serviceRequestsFC.features} isAnimationActive={false} />
            </div>
          </>
        )
    }

    </div>
  )
}

ReportImageSidebar.propTypes = {
  areaOfInterest: PropTypes.object
}

export default ReportImageSidebar

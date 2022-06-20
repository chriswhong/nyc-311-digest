import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import RollupChart from './RollupChart'
import { ThreeOneOneDataContext } from './ThreeOneOneDataHandler'
import { groupByRollupCategory } from './RollupChartContainer'

const ReportImageSidebar = ({
  areaOfInterest
}) => {
  const {
    serviceRequests,
    dateSelection
  } = useContext(ThreeOneOneDataContext)

  const [chartData, setChartData] = useState()

  const dateFrom = dateSelection.dateRange[0].format('DD MMM YYYY')
  const dateTo = dateSelection.dateRange[1].format('DD MMM YYYY')

  useEffect(() => {
    if (!serviceRequests) return

    const grouped = groupByRollupCategory(serviceRequests.features)
    setChartData(grouped)
  }, [serviceRequests])
  return (
    <div className='flex flex-col p-5 h-3/6'>
      <div>Weekly Report of 311 Activity for</div>
      <div className='mb-1 text-3xl font-semibold'>{areaOfInterest.properties.name}</div>
      <div className='text-xs'>From {dateFrom} thru {dateTo}</div>
      {
        areaOfInterest && serviceRequests && (
          <>
            <div className='flex items-center'>
              <div className='mr-2 text-2xl font-bold'>
                {serviceRequests.features.length}
              </div>
              <div className='text-lg'>
                New Service Requests
              </div>
            </div>
            <div className='flex-grow mb-3 '>
              <RollupChart data={chartData} isAnimationActive={false} topLevel />
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

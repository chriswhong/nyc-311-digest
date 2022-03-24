import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  CalendarIcon,
  ChevronLeftIcon
} from '@heroicons/react/outline'

import RollupChart from './RollupChart'
import Link from './Link'

const Sidebar = ({
  startDateMoment,
  areaOfInterest,
  serviceRequests
}) => {
  const history = useNavigate()

  let newServiceRequests = []
  let oldServiceRequests = []

  // TODO: prep data elsewhere
  if (serviceRequests) {
    newServiceRequests = serviceRequests.features.filter((d) => {
      return d.properties.created_date >= startDateMoment.unix()
    })

    oldServiceRequests = serviceRequests.features.filter((d) => {
      return d.properties.created_date < startDateMoment.unix()
    })
  }

  const handleBackClick = () => {
    history('/')
  }

  return (
    <div>
      {areaOfInterest && (
        <>
          <div className='mb-1'>
            <Link onClick={handleBackClick}>
              <div className='flex items-center'><ChevronLeftIcon className='h-5 mr-0.5 -ml-1 inline' /><div className='inline text-sm'>City View</div></div>
            </Link>
          </div>
          <div className='font-semibold text-3xl mb-1'>{areaOfInterest.properties.name}</div>

          {serviceRequests && (
            <>
              <div className='flex items-center mb-2'>
                <CalendarIcon className='h-4 w-4 text-indigo-600 mr-2' />
                <div className='text-sm'>Last 7 days <span className='text-xs'>({startDateMoment.format('D MMM YYYY')} to yesterday)</span></div>
              </div>
              <div className='flex items-center'>
                <div className='font-bold text-2xl mr-2'>
                  {newServiceRequests.length}
                </div>
                <div className='flex-grow text-lg'>
                  New Service Requests
                </div>
              </div>
              <div className='h-64 mb-3'>
                <RollupChart data={newServiceRequests} />
              </div>
            </>
          )}

          {!serviceRequests && (
            <div className='flex flex-col justify-center items-center h-64'>
              <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
              <div className='mt-2 text-sm text-gray-500'>Loading 311 data...</div>
            </div>
          )}
        </>
      )}
      <div className='text-xs mb-3'>Hover over the markers for more info, <span className='italic'>click for full details</span>.</div>

      <hr />
      <div className='text-xs mt-3'>This area of interest also has <span className='font-bold'>{oldServiceRequests.length}</span> prior service requests that are still open.</div>
    </div>
  )
}

Sidebar.propTypes = {
  startDateMoment: PropTypes.object,
  areaOfInterest: PropTypes.shape({
    type: PropTypes.string,
    properties: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      bbox: PropTypes.arrayOf(PropTypes.number)
    }),
    geometry: PropTypes.object
  }),
  serviceRequests: PropTypes.shape({
    type: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.object)
  })
}

export default Sidebar

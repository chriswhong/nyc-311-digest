import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import RollupChart from './RollupChart'

import {
  CalendarIcon,
  ChevronLeftIcon
} from '@heroicons/react/outline'

const Sidebar = ({
  startDateMoment,
  areaOfInterest,
  serviceRequests
}) => {
  const history = useNavigate()

  let newServiceRequests = []
  let oldServiceRequests = []

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
    <div className='absolute top-5 left-5 z-10 bg-white p-4 rounded-lg w-96 shadow-md'>
      {areaOfInterest && serviceRequests && (
        <>
          <div onClick={handleBackClick} className='flex items-center underline hover:text-blue-800 visited:text-purple-600 cursor-pointer text-xs text-gray-500 mb-2'><ChevronLeftIcon className='h-3 w-3 mr-0.5' /><div>Back to City View</div></div>
          <div className='font-semibold text-xl mb-1'>{areaOfInterest.properties.name}</div>
          <div className='flex items-center mb-3'>
            <CalendarIcon className='h-4 w-4 text-indigo-600 mr-2' />
            <div className='text-sm'>Last 7 days ({startDateMoment.format('D MMM YYYY')})</div>
          </div>

          <div className='flex items-center'>
            <div className='font-bold text-3xl w-12'>
              {newServiceRequests.length}
            </div>
            <div className='flex-grow text-lg'>
              New service requests
            </div>
          </div>
          <div className='h-32'>
            <RollupChart data={newServiceRequests} />
          </div>
          <div className='flex items-center'>
            <div className='font-bold text-3xl w-12'>
              {oldServiceRequests.length}
            </div>
            <div className='flex-grow text-lg'>
              Prior service requests
            </div>
          </div>
          <div className='h-32 mb-3'>
            <RollupChart data={oldServiceRequests} />
          </div>
        </>
      )}
      <div className='text-xs'>Hover over the markers on the map to view details. Some markers may represent more than one 311 complaint.</div>
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

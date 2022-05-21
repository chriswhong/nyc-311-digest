import React from 'react'
import PropTypes from 'prop-types'
import { Outlet, useLocation } from 'react-router-dom'

import Map from './Map.js'
import CircleMarkerSvg from '../report/CircleMarkerSvg.js'

function MapWrapper ({ onLoad }) {
  const location = useLocation()
  const showLegend = location.pathname.includes('report')

  // don't render the map immediately when being redirected from auth0
  // this gives us time to update the hash so the map bounds can persist through login/logout
  if (location.search.includes('code')) {
    return null
  }

  return (
    <div className='h-3/6 md:h-full'>
      <Map
        onLoad={(d) => { onLoad(d) }}
      />
      <div className='top-0 left-0 z-10 flex flex-col w-full h-auto min-h-0 md:absolute md:w-96 md:max-h-full'>
        <div className='flex flex-col py-4 m-0 overflow-hidden bg-white md:m-5 md:rounded-lg md:shadow-md'>
          <div className='relative flex flex-col flex-grow h-full min-h-0'>
            <Outlet />
          </div>
        </div>
      </div>
      {/* Legend */}
      {
        showLegend && (
          <div className='absolute flex flex-col p-3 overflow-hidden bg-white md:rounded-lg md:shadow-md top-5 right-5'>
            <div className='flex items-center mb-1 text-xs text-gray-600'>
              <CircleMarkerSvg rollupCatgory='transparent' status='Open' noFill /> <div className='ml-2'>Open Complaint</div>
            </div>
            <div className='flex items-center text-xs text-gray-600'>
              <CircleMarkerSvg rollupCatgory='transparent' status='Closed' noFill /> <div className='ml-2'>Closed Complaint</div>
            </div>
          </div>
        )
      }

    </div>
  )
}

MapWrapper.propTypes = {
  onLoad: PropTypes.func
}

export default MapWrapper

import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

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
    <>
      <Map
        onLoad={(d) => { onLoad(d) }}
      />
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

    </>
  )
}

MapWrapper.propTypes = {
  onLoad: PropTypes.func
}

export default MapWrapper

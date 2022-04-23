import React from 'react'
import PropTypes from 'prop-types'
import { Outlet, useLocation } from 'react-router-dom'

import Map from './Map.js'
import CircleMarkerSvg from '../report/CircleMarkerSvg.js'

function MapWrapper ({ onLoad }) {
  const { pathname } = useLocation()
  const showLegend = pathname.includes('report')

  return (
    <div className='h-full'>
      <Map
        onLoad={(d) => { onLoad(d) }}
      />
      <div className='md:absolute top-0 left-0 z-10 w-full md:w-96 h-auto md:max-h-full flex flex-col min-h-0'>
        <div className='m-0 md:m-5 py-4 md:rounded-lg bg-white md:shadow-md overflow-hidden flex flex-col'>
          <div className='relative h-full flex-grow min-h-0 flex flex-col'>
            <Outlet />
          </div>
        </div>
      </div>
      {/* Legend */}
      {
        showLegend && (
          <div className='md:rounded-lg bg-white md:shadow-md overflow-hidden flex flex-col absolute top-5 right-5 p-3'>
            <div className='flex items-center text-xs text-gray-600 mb-1'>
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

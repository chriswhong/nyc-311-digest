import React from 'react'
import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'

import Map from './Map.js'

function MapWrapper ({ onLoad }) {
  return (
    <div className='h-full'>
      <Map
        onLoad={(d) => { onLoad(d) }}
      />
      <div className='md:absolute top-0 left-0 z-10 w-full md:w-96 h-2/3 md:h-full flex flex-col min-h-0'>
        <div className='m-0 md:m-5 py-4 md:rounded-lg bg-white md:shadow-md overflow-hidden'>
          <div className='relative h-full'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

MapWrapper.propTypes = {
  onLoad: PropTypes.func
}

export default MapWrapper

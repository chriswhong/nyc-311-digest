import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const DrawSidebar = ({
  name,
  isValid,
  mapInstance,
  onDraw,
  onNameChange,
  onSaveClick
}) => {
  const [drawInstance, setDrawInstance] = useState()

  useEffect(() => {
    if (!mapInstance) return
    // Create a Draw control
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true
      },
      keybindings: false,
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: 'draw_polygon'
    })

    // Add the Draw control to your map
    mapInstance.addControl(draw)

    mapInstance.on('draw.create', (d) => {
      onDraw(d.features[0])
    })

    setDrawInstance(draw)

    return () => {
      mapInstance.removeControl(draw)
    }
  }, [mapInstance])

  const handleClearDrawing = () => {
    drawInstance.deleteAll()
    drawInstance.changeMode('draw_polygon')
  }

  return (
    <div className='absolute top-5 left-5 z-10 bg-white p-4 rounded-lg w-96 shadow-md text-sm'>
      <div className='font-semibold text-xl mb-2'>Add an Area of Interest</div>
      <div className='font-medium text-lg mb-2'> 1. Name it!</div>
      <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4'
        type='text'
        value={name}
        placeholder='Enter a name'
        onChange={(d) => { onNameChange(d.target.value) }}
      />
      <div className='font-medium text-lg mb-2'>
        2. Draw it!
      </div>
      <div className=''>Click on the map to draw a polygon. Tip: Many 311 requests are geocoded to the center of a street.  Polygons that end mid-block are optimal for capturing all activity ona given street.</div>
      <div className='text-xs mb-4' onClick={handleClearDrawing}>Clear Drawing</div>

      <div className='flex justify-end'>
        <button
          className='ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50'
          disabled={!isValid}
          onClick={onSaveClick}
        >
          Save Area of Interest
        </button>
      </div>
    </div>
  )
}

DrawSidebar.propTypes = {
  name: PropTypes.string,
  isValid: PropTypes.bool,
  mapInstance: PropTypes.object,
  onDraw: PropTypes.func,
  onNameChange: PropTypes.func,
  onSaveClick: PropTypes.func
}

export default DrawSidebar

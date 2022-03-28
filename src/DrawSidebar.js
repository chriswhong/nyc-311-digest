import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import {
  XCircleIcon
} from '@heroicons/react/outline'

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const DrawSidebar = ({
  name,
  isValid,
  mapInstance,
  drawnFeature,
  onDraw,
  onNameChange,
  onClearDrawnFeature,
  onSaveClick
}) => {
  const [drawInstance, setDrawInstance] = useState()

  // creates a draw control and returns it, does not add it to the map
  const initializeDraw = () => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: 'draw_polygon'
    })

    mapInstance.on('draw.modechange', (d) => {
      if (draw.getMode() === 'simple_select') {
        draw.changeMode('draw_polygon')
      }
    })

    return draw
  }

  useEffect(() => {
    if (!mapInstance) return

    const draw = initializeDraw(mapInstance)

    mapInstance.addControl(draw)
    setDrawInstance(draw)

    // TODO: this handler doesn't work when moved to initializeDraw()
    // but it works fine here.  Not sure why.
    mapInstance.on('draw.create', (d) => {
      onDraw(d.features[0])
    })
  }, [mapInstance])

  // when the a drawn feature exists, remove the draw control
  useEffect(() => {
    if (drawnFeature) {
      // draw will attempt to change mode on draw.create
      // but we also want to remove the draw control on draw.create
      // this timeout gives it a chance to change modes first to avoid
      // an error
      setTimeout(() => {
        mapInstance.removeControl(drawInstance)
        setDrawInstance(null)
      }, 500)
    }
  }, [drawnFeature])

  const handleClearDrawing = () => {
    const draw = initializeDraw()
    mapInstance.addControl(draw)
    setDrawInstance(draw)
    onClearDrawnFeature()
  }

  return (
    <div className='px-4'>
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
      <div className='mb-4'>
        {
          !drawnFeature && <div className='mb-2 text-sm'>Click on the map to draw a polygon. Be sure to click the starting point to complete the drawing. </div>
        }
        {
          drawnFeature && (
            <div className='mb-2'>
              <button type='button' className='inline-block px-4 py-1.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out' onClick={handleClearDrawing}><XCircleIcon className='h-4 w-4 inline mr-1' />Clear</button>
            </div>
          )
        }
        <div className='text-xs text-gray-600'>Tip: Many 311 requests are geocoded to the center of a street.  Polygons that end mid-block are optimal for capturing all activity ona given street.</div>
      </div>

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
  drawnFeature: PropTypes.object,
  onDraw: PropTypes.func,
  onClearDrawnFeature: PropTypes.func,
  onNameChange: PropTypes.func,
  onSaveClick: PropTypes.func
}

export default DrawSidebar

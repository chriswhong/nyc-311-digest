import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import {
  XCircleIcon
} from '@heroicons/react/outline'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import gjv from 'geojson-validation'
import bbox from '@turf/bbox'
import { useNavigate } from 'react-router-dom'

import dummyGeojson from '../../util/dummyGeojson'
import Button from '../../ui/Button'
import Spinner from '../../ui/Spinner'
import { slugFromName } from '../../util/slugFromName'
import { useAuth } from '../../util/auth'

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const DrawSidebar = ({
  map,
  onAllGeometriesUpdate
}) => {
  const [drawInstance, setDrawInstance] = useState()
  const [drawnFeature, setDrawnFeature] = useState()
  const [drawnFeatureName, setDrawnFeatureName] = useState('')
  const [loading, setLoading] = useState(false)

  const history = useNavigate()

  const {
    getAccessTokenSilently,
    getAccessTokenWithPopup,
    user
  } = useAuth()

  // creates a draw control and returns it, does not add it to the map
  const initializeDraw = () => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: 'draw_polygon'
    })

    map.on('draw.modechange', (d) => {
      if (draw.getMode() === 'simple_select') {
        draw.changeMode('draw_polygon')
      }
    })

    return draw
  }

  useEffect(() => {
    if (!map) return

    const draw = initializeDraw(map)

    map.addControl(draw)
    setDrawInstance(draw)

    // TODO: this handler doesn't work when moved to initializeDraw()
    // but it works fine here.  Not sure why.
    map.on('draw.create', (d) => {
      setDrawnFeature(d.features[0])
    })

    // check for one source in the group
    if (!map.getSource('drawn-feature')) {
      map.addSource('drawn-feature', {
        type: 'geojson',
        data: dummyGeojson
      })

      map.addLayer({
        id: 'drawn-feature-fill',
        type: 'fill',
        source: 'drawn-feature',
        paint: {
          'fill-color': 'steelblue',
          'fill-opacity': 0.6
        }
      })
    }

    return () => {
      map.getSource('drawn-feature').setData(dummyGeojson)
    }
  }, [map])

  useEffect(() => {
    if (!map) return
    map.getSource('drawn-feature').setData(drawnFeature || dummyGeojson)
  }, [map, drawnFeature])

  // when the a drawn feature exists, remove the draw control
  useEffect(() => {
    if (drawnFeature) {
      // draw will attempt to change mode on draw.create
      // but we also want to remove the draw control on draw.create
      // this timeout gives it a chance to change modes first to avoid
      // an error
      setTimeout(() => {
        map.removeControl(drawInstance)
        setDrawInstance(null)
      }, 500)
    }
  }, [drawnFeature])

  const handleClearDrawing = () => {
    const draw = initializeDraw()
    map.addControl(draw)
    setDrawInstance(draw)
    setDrawnFeature(null)
  }

  const validate = (feature, name) => {
    const nameIsValid = name && name.length > 3
    const featureIsValid = feature && gjv.valid(feature)
    return !!nameIsValid && featureIsValid
  }

  const drawIsValid = validate(drawnFeature, drawnFeatureName)

  const handleSave = async () => {
    setLoading(true)
    const postGeometryURL = `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/post-geometry`

    let auth0AccessTokenFunction = getAccessTokenSilently

    // in development we can't get the access token silently
    if (process.env.NODE_ENV !== 'production') {
      auth0AccessTokenFunction = getAccessTokenWithPopup
    }

    const token = await auth0AccessTokenFunction({
      audience: 'nyc-311-reports-functions',
      scope: 'write:area-of-interest'
    })

    await fetch(postGeometryURL, {
      method: 'POST',
      body: JSON.stringify({
        name: drawnFeatureName,
        geometry: drawnFeature.geometry,
        bbox: bbox(drawnFeature.geometry),
        owner: user.sub
      }),
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(d => d.json())
      .then(async ({ id }) => {
        history(`/report/${id}/${slugFromName(drawnFeatureName)}`, {
          state: {
            refresh: true
          }
        })
        setDrawnFeature(null)
        setDrawnFeatureName('')
      })
  }

  return (
    <div className='px-4'>
      <div className='font-semibold text-xl mb-2'>Add an Area of Interest</div>
      <div className='font-medium text-lg mb-2'> 1. Name it!</div>
      <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4'
        type='text'
        value={drawnFeatureName}
        placeholder='Enter a name'
        onChange={(d) => { setDrawnFeatureName(d.target.value) }}
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
        <div className='text-xs text-gray-600 mb-2'>Tip: Many 311 requests are geocoded to the center of a street.  Polygons that end mid-block are optimal for capturing all activity ona given street.</div>
        <div className='flex items-center bg-blue-500 text-white px-4 py-3 text-xs' role='alert'>
          <svg className='fill-current w-4 h-4 mr-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z' /></svg>
          <p>This area of interest will appear publicly and will be associated with your username</p>
        </div>
      </div>

      <div className='flex justify-end'>
        <Button
          disabled={!drawIsValid || loading}
          onClick={handleSave}
        >
          {loading && (
            <div className='flex justify-center items-center'>
              <div className='spinner-border animate-spin inline-block w-5 h-5 border-4 rounded-full text-white mr-2' role='status'>
                <span className='visually-hidden'>Saving...</span>
              </div>
              Saving...
            </div>
          )}
          {!loading && (
            <>Save Area of Interest</>
          )}
        </Button>
      </div>
    </div>
  )
}

DrawSidebar.propTypes = {
  map: PropTypes.object,
  onAllGeometriesUpdate: PropTypes.func
}

export default withAuthenticationRequired(DrawSidebar, {
  onRedirecting: () => <Spinner>Loading...</Spinner>,
  returnTo: '/new'
})

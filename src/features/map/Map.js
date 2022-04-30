import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line
import mapboxgl from '!mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { useDeviceSelectors } from 'react-device-detect'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'

const Map = ({
  width = '100%',
  height = '100%',
  zoom = 0,
  center = [0, 0],
  style = 'light-v9',
  sources = {},
  layers = [],
  minZoom = 10,
  maxZoom = 18,
  bounds = [],
  padding = 0.1,
  areaOfInterest,
  drawnFeature,
  serviceRequests,
  startDateMoment,
  allGeometries,
  highlightedFeature,
  drawMode,
  onDraw,
  onLoad,
  onMapClick
}) => {
  // this ref holds the map DOM node so that we can pass it into Mapbox GL
  const mapNode = useRef(null)
  const geocoderRef = useRef()

  const [selectors] = useDeviceSelectors(window.navigator.userAgent)
  const { isMobile } = selectors

  const { pathname } = useLocation()

  // instantiate the map, add sources and layers, event listeners, tooltips
  useEffect(() => {
    const nycBounds = [[-74.333496, 40.469935], [-73.653717, 40.932190]]

    const map = new mapboxgl.Map({
      container: mapNode.current,
      style: `mapbox://styles/mapbox/${style}`,
      bounds: nycBounds,
      minZoom,
      maxZoom,
      hash: true
    })

    if (isMobile) {
      map.scrollZoom.disable()
    }

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })

    geocoderRef.current.appendChild(geocoder.onAdd(map))

    map.on('load', () => {
      onLoad(map)
      window.map = map // for easier debugging and querying via console
    })

    return () => {
      map.remove()
    }
  }, [])

  return (
    <div
      className='relative h-3/6 md:h-full w-full'
    >
      <div
        className={classNames(
          'geocoder absolute w-full md:w-auto -top-2 md:top-5 md:right-5',
          {
            hidden: pathname.includes('report')
          })}
        ref={geocoderRef}
      />
      <div className='w-full h-full' ref={mapNode} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

Map.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  style: PropTypes.string,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  padding: PropTypes.number,
  sources: PropTypes.object,
  layers: PropTypes.arrayOf(PropTypes.object),
  bounds: PropTypes.arrayOf(PropTypes.number),
  areaOfInterest: PropTypes.shape({
    type: PropTypes.string,
    properties: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      bbox: PropTypes.arrayOf(PropTypes.number)
    }),
    geometry: PropTypes.object
  }),
  drawnFeature: PropTypes.object,
  serviceRequests: PropTypes.shape({
    type: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.object)
  }),
  highlightedFeature: PropTypes.object,
  startDateMoment: PropTypes.object,
  allGeometries: PropTypes.shape({
    type: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.object)
  }),
  drawMode: PropTypes.bool,
  onDraw: PropTypes.func,
  onLoad: PropTypes.func,
  onMapClick: PropTypes.func
}

export default Map

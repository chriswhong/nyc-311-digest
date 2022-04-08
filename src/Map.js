import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line
import mapboxgl from '!mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'

export const agencyColors = [
  'match',
  ['get', 'rollupCategory'],
  'Noise & Nuisance', '#fbb4ae',
  'Streets & Sidewalks', '#b3cde3',
  'Sanitation & Environmental', '#ccebc5',
  'Business/Consumer', '#decbe4',
  'Housing & Buildings', '#fed9a6',
  'Homeless/Assistance', '#fddaec',
  'Vehicular/Parking', '#e5d8bd',
  /* other */ 'gray'
]

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
  location,
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

  // instantiate the map, add sources and layers, event listeners, tooltips
  useEffect(() => {
    const nycBounds = [[-74.333496, 40.469935], [-73.653717, 40.932190]]

    const map = new mapboxgl.Map({
      container: mapNode.current,
      style: `mapbox://styles/mapbox/${style}`,
      bounds: nycBounds,
      minZoom,
      maxZoom
    })

    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    )

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
      className='relative h-1/3 md:h-full w-full'
    >
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
  location: PropTypes.object,
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

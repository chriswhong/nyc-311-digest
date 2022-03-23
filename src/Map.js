import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { renderToString } from 'react-dom/server'
// eslint-disable-next-line
import mapboxgl from '!mapbox-gl'
import bbox from '@turf/bbox'
import { useNavigate } from 'react-router-dom'

import PopupInfo from './PopupInfo'

import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A'

export const agencyColors = [
  'match',
  ['get', 'rollupCategory'],
  'Noise & Nuisance', '#fbb4ae',
  'Streets & Sidewalks', '#b3cde3',
  'Sanitation & Cleanliness', '#ccebc5',
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
  serviceRequests,
  startDateMoment,
  allGeometries,
  drawMode,
  onDraw,
  onMapLoad
}) => {
  // this ref holds the map DOM node so that we can pass it into Mapbox GL
  const mapNode = useRef(null)

  // store the map instance
  const [map, setMap] = useState(false)

  const history = useNavigate()

  // dummy geojson for creating sources with no data
  const dummyGeojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [
        0,
        0
      ]
    }
  }

  // when data arrives call setData() to add it to the sources
  useEffect(() => {
    if (!map) {
      return
    }
    if (allGeometries) {
      map.getSource('all-geometries').setData(allGeometries)

      if (location.pathname === '/') {
        const allGeometriesBounds = bbox(allGeometries)
        map.fitBounds(allGeometriesBounds, {
          padding: 30
        })
      }
    }

    if (areaOfInterest) {
      map.getSource('area-of-interest').setData(areaOfInterest)
      map.fitBounds(areaOfInterest.properties.bbox, {
        padding: { top: 30, bottom: 30, left: 400, right: 30 }
      })
    }

    if (serviceRequests) {
      map.getSource('serviceRequests').setData(serviceRequests)
    }
  }, [map, allGeometries, areaOfInterest, serviceRequests, location])

  // react to location changes by showing/hiding layers
  useEffect(() => {
    if (!map) {
      return
    }

    let allGeometriesVisibility = 'visible'
    let areaOfInterestVisibility = 'none'

    map.getSource('serviceRequests').setData(dummyGeojson)
    map.getSource('area-of-interest').setData(dummyGeojson)

    if (location.pathname.includes('report')) {
      allGeometriesVisibility = 'none'
      areaOfInterestVisibility = 'visible'
    }

    map.setLayoutProperty('all-geometries-fill', 'visibility', allGeometriesVisibility)
    map.setLayoutProperty('all-geometries-symbol', 'visibility', allGeometriesVisibility)

    map.setLayoutProperty('area-of-interest-line', 'visibility', areaOfInterestVisibility)
    map.setLayoutProperty('serviceRequests-circle', 'visibility', areaOfInterestVisibility)
    // map.setLayoutProperty('serviceRequests-circle-old', 'visibility', areaOfInterestVisibility)
  }, [location])

  // this useEffect fires once and instantiates the map
  useEffect(() => {
    const nycBounds = [[-74.333496, 40.469935], [-73.653717, 40.932190]]

    const map = new mapboxgl.Map({
      container: mapNode.current,
      style: `mapbox://styles/mapbox/${style}`,
      bounds: nycBounds,
      minZoom,
      maxZoom
    })

    map.on('load', () => {
      map.addSource('serviceRequests', {
        type: 'geojson',
        data: dummyGeojson
      })

      // map.addLayer({
      //   id: 'serviceRequests-circle-old',
      //   type: 'circle',
      //   source: 'serviceRequests',
      //   paint: {
      //     'circle-color': agencyColors,
      //     'circle-radius': 3,
      //     'circle-stroke-color': 'black',
      //     'circle-stroke-width': 2,
      //     'circle-opacity': 0.3,
      //     'circle-stroke-opacity': 0.3
      //   },
      //   filter: ['<', ['get', 'created_date'], 1644721398]
      // })

      map.addLayer({
        id: 'serviceRequests-circle',
        type: 'circle',
        source: 'serviceRequests',
        paint: {
          'circle-color': agencyColors,
          'circle-radius': 3,
          'circle-stroke-color': 'black',
          'circle-stroke-width': 2
        },
        filter: ['>=', ['get', 'created_date'], startDateMoment.unix()]
      })

      map.addSource('area-of-interest', {
        type: 'geojson',
        data: dummyGeojson
      })

      map.addLayer({
        id: 'area-of-interest-line',
        type: 'line',
        source: 'area-of-interest',
        paint: {
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      })

      map.addSource('all-geometries', {
        type: 'geojson',
        data: dummyGeojson
      })

      map.addLayer({
        id: 'all-geometries-fill',
        type: 'fill',
        source: 'all-geometries',
        paint: {
          'fill-color': 'steelblue',
          'fill-opacity': 0.6
        },
        layout: {
          visibility: location.pathname === '/' ? 'visible' : 'none'
        }
      })

      // add a symbol layer to label each polygon
      map.addLayer({
        id: 'all-geometries-symbol',
        type: 'symbol',
        source: 'all-geometries',
        layout: {
          'text-field': ['get', 'name'],
          'text-variable-anchor': ['bottom'],
          'text-radial-offset': 0.5,
          'text-justify': 'auto',
          visibility: location.pathname === '/' ? 'visible' : 'none'
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 2,
          'text-halo-blur': 1
        }
      })

      // make geometries clickable
      map.on('click', 'all-geometries-fill', (e) => {
        const [feature] = map.queryRenderedFeatures(e.point)
        const geometryId = feature.properties._id
        history(`/report/${geometryId}`)
      })

      // make the cursor a pointer when hovering all-geomtries-fill layer
      map.on('mouseenter', 'all-geometries-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'all-geometries-fill', () => {
        map.getCanvas().style.cursor = ''
      })
      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })

      const showPopup = (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer'

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice()
        const popupHtml = (
          <>
            {e.features.map((d) => (
              <PopupInfo key={d.properties.unique_key} complaint={d} />
            ))}
          </>
        )

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(renderToString(popupHtml)).addTo(map)
      }

      const hidePopup = () => {
        map.getCanvas().style.cursor = ''
        popup.remove()
      }

      map.on('mouseenter', 'serviceRequests-circle', showPopup)
      // map.on('mouseenter', 'serviceRequests-circle-old', showPopup)

      map.on('mouseleave', 'serviceRequests-circle', hidePopup)
      // map.on('mouseleave', 'serviceRequests-circle-old', hidePopup)

      setMap(map)
      onMapLoad(map)
      window.map = map // for easier debugging and querying via console
    })

    return () => {
      map.remove()
    }
  }, [])

  return (
    <div
      className='relative' style={{
        height: height,
        width: width
      }}
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
  serviceRequests: PropTypes.shape({
    type: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.object)
  }),
  startDateMoment: PropTypes.object,
  allGeometries: PropTypes.shape({
    type: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.object)
  }),
  drawMode: PropTypes.bool,
  onDraw: PropTypes.func,
  onMapLoad: PropTypes.func
}

export default Map

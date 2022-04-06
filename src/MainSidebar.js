import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import bbox from '@turf/bbox'

import dummyGeojson from './util/dummyGeojson'
import Spinner from './Spinner'
import { slugFromName } from './util/slugFromName'

const MainSidebar = ({ map, allGeometries }) => {
  const history = useNavigate()

  // on mount, add this component's sources and layers to the map
  // only if they haven't been added before
  useEffect(() => {
    if (!map) return
    // use one source as a proxy for all sources related to this component
    if (!map.getSource('all-geometries')) {
      map.addSource('all-geometries', {
        type: 'geojson',
        data: dummyGeojson,
        generateId: true
      })

      map.addLayer({
        id: 'all-geometries-fill',
        type: 'fill',
        source: 'all-geometries',
        paint: {
          'fill-color': 'steelblue',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.6
          ]
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
          'text-justify': 'auto'
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
        const { name, _id: geometryId } = feature.properties
        history(`/report/${geometryId}/${slugFromName(name)}`)
      })
      // make the cursor a pointer when hovering all-geomtries-fill layer
      map.on('mouseenter', 'all-geometries-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'all-geometries-fill', () => {
        map.getCanvas().style.cursor = ''
      })

      let hoveredStateId = null
      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      map.on('mousemove', 'all-geometries-fill', (e) => {
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState(
              { source: 'all-geometries', id: hoveredStateId },
              { hover: false }
            )
          }
          hoveredStateId = e.features[0].id
          map.setFeatureState(
            { source: 'all-geometries', id: hoveredStateId },
            { hover: true }
          )
        }
      })

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('mouseleave', 'all-geometries-fill', () => {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: 'all-geometries', id: hoveredStateId },
            { hover: false }
          )
        }
        hoveredStateId = null
      })
    }

    return () => {
      map.getSource('all-geometries').setData(dummyGeojson)
    }
  }, [map])

  useEffect(() => {
    if (map && allGeometries) {
      map.getSource('all-geometries').setData(allGeometries)
      const allGeometriesBounds = bbox(allGeometries)
      map.fitBounds(allGeometriesBounds, {
        padding: 30
      })
    }
  }, [map, allGeometries])

  if (!map) {
    return <Spinner>Loading...</Spinner>
  }

  return (
    <div className='text-sm px-4 foobar'>
      <h3 className='font-semibold mb-3 text-lg'>Explore 311 Data for the Places You Care About</h3>
      <p className='mb-3'>This map shows custom <span className='italic'>areas of interest</span> created by users of this site to show localized 311 data.</p>
      <p className=''>Click any area of interest to see a report of recent 311 activity.  If your neighborhood isn't reflected here, <a onClick={() => { history('/new') }} className='text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4 cursor-pointer'>add it!</a></p>
    </div>
  )
}

MainSidebar.propTypes = {
  map: PropTypes.object,
  allGeometries: PropTypes.object
}

export default MainSidebar

import { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import dummyGeojson from '../../util/dummyGeojson'
import { slugFromName } from '../../util/slugFromName'
import { MapContext } from '../../App'

const AOIIndexMapElements = ({ allGeometries }) => {
  const navigate = useNavigate()
  const map = useContext(MapContext)

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
            0.9,
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
        navigate(`/report/${geometryId}/${slugFromName(name)}`)
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
      map.flyTo({
        zoom: 12.5
      })
      map.getSource('all-geometries').setData(allGeometries)
    }
  }, [map, allGeometries])

  return null
}

AOIIndexMapElements.propTypes = {
  allGeometries: PropTypes.object
}

export default AOIIndexMapElements

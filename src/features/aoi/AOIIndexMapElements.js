import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { UserIcon, CalendarIcon } from '@heroicons/react/outline'

import dummyGeojson from '../../util/dummyGeojson'
import { slugFromName } from '../../util/slugFromName'
import { MapContext } from '../../app/App'

const createdAtFromObjectId = (id) => {
  if (!/^[a-f\d]{24}$/i.test(id)) return null
  const timestamp = parseInt(id.substring(0, 8), 16) * 1000
  return new Date(timestamp).toLocaleDateString()
}

const AOIIndexMapElements = ({ allGeometries }) => {
  const navigate = useNavigate()
  const map = useContext(MapContext)
  const [tooltip, setTooltip] = useState(null) // { x, y, name, ownerUsername }

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
            0.4,
            0
          ]
        }
      })

      map.addLayer({
        id: 'all-geometries-line',
        type: 'line',
        source: 'all-geometries',
        paint: {
          'line-color': '#4f46e5',
          'line-width': 3,
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.2
          ]
        }
      })

      // make geometries clickable
      map.on('click', 'all-geometries-fill', (e) => {
        const [feature] = map.queryRenderedFeatures(e.point)
        const { name, _id: geometryId } = feature.properties
        navigate(`/report/aoi/${geometryId}/${slugFromName(name)}`)
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

          const { name, _id, owner } = e.features[0].properties
          const parsedOwner = typeof owner === 'string' ? JSON.parse(owner) : owner
          setTooltip({
            x: e.point.x,
            y: e.point.y,
            name,
            ownerUsername: parsedOwner?.username,
            createdAt: createdAtFromObjectId(_id)
          })
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
        setTooltip(null)
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

  if (!tooltip) return null

  return (
    <div
      className='absolute z-10 pointer-events-none bg-white border border-gray-200 rounded shadow-md px-3 py-2 text-xs text-gray-700 space-y-1'
      style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
    >
      <div className='font-semibold text-sm'>{tooltip.name}</div>
      <div className='flex items-center gap-1 text-gray-500'>
        <UserIcon className='w-3 h-3' />
        {tooltip.ownerUsername}
      </div>
      {tooltip.createdAt && (
        <div className='flex items-center gap-1 text-gray-500'>
          <CalendarIcon className='w-3 h-3' />
          {tooltip.createdAt}
        </div>
      )}
    </div>
  )
}

AOIIndexMapElements.propTypes = {
  allGeometries: PropTypes.object
}

export default AOIIndexMapElements

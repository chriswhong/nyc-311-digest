import { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { MapContext } from '../../App'

const parseBoroCD = (boroCD) => {
  const boroCode = Math.floor(boroCD / 100 % 10)
  let borough = ''
  switch (boroCode) {
    case 1:
      borough = 'manhattan'
      break
    case 2:
      borough = 'bronx'
      break
    case 3:
      borough = 'brooklyn'
      break
    case 4:
      borough = 'queens'
      break
    case 5:
      borough = 'staten-island'
      break
  }

  return {
    borough
  }
}

const CommunityDistrictsIndexMapElements = ({ communityDistricts }) => {
  const navigate = useNavigate()
  const map = useContext(MapContext)

  // on mount, add this component's sources and layers to the map
  // only if they haven't been added before
  useEffect(() => {
    if (!map && !communityDistricts) return
    // use one source as a proxy for all sources related to this component
    if (!map.getSource('community-districts')) {
      map.addSource('community-districts', {
        type: 'geojson',
        data: communityDistricts,
        generateId: true
      })

      map.addLayer({
        id: 'community-districts-fill',
        type: 'fill',
        source: 'community-districts',
        paint: {
          'fill-color': [
            'match',
            ['get', 'borocode'],
            1,
            '#b3e2cd',
            2,
            '#fdcdac',
            3,
            '#cbd5e8',
            4,
            '#f4cae4',
            5,
            '#e6f5c9',
            /* other */ 'steelblue'
          ],
          'fill-outline-color': '#333',
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
        id: 'community-districts-symbol',
        type: 'symbol',
        source: 'community-districts',
        layout: {
          'text-field': ['get', 'cdNumber'],
          'text-justify': 'auto'
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 2,
          'text-halo-blur': 1
        }
      })

      // make geometries clickable
      map.on('click', 'community-districts-fill', (e) => {
        const [feature] = map.queryRenderedFeatures(e.point)
        const { BoroCD, cdNumber } = feature.properties
        const { borough } = parseBoroCD(BoroCD)
        navigate(`/report/community-districts/${borough}/${cdNumber}`)
      })
      // make the cursor a pointer when hovering all-geomtries-fill layer
      map.on('mouseenter', 'community-districts-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'community-districts-fill', () => {
        map.getCanvas().style.cursor = ''
      })

      let hoveredStateId = null
      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      map.on('mousemove', 'community-districts-fill', (e) => {
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState(
              { source: 'community-districts', id: hoveredStateId },
              { hover: false }
            )
          }
          hoveredStateId = e.features[0].id
          map.setFeatureState(
            { source: 'community-districts', id: hoveredStateId },
            { hover: true }
          )
        }
      })

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('mouseleave', 'community-districts-fill', () => {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: 'community-districts', id: hoveredStateId },
            { hover: false }
          )
        }
        hoveredStateId = null
      })
    } else {
      map.setLayoutProperty('community-districts-fill', 'visibility', 'visible')
      map.setLayoutProperty('community-districts-symbol', 'visibility', 'visible')
    }

    return () => {
      map.setLayoutProperty('community-districts-fill', 'visibility', 'none')
      map.setLayoutProperty('community-districts-symbol', 'visibility', 'none')
    }
  }, [map])

  useEffect(() => {
    if (map) {
      map.flyTo({
        zoom: 10
      })
    }
  }, [map, communityDistricts])

  return null
}

CommunityDistrictsIndexMapElements.propTypes = {
  communityDistricts: PropTypes.object
}

export default CommunityDistrictsIndexMapElements

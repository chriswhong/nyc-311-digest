import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import ReactGA from 'react-ga4'

import dummyGeojson from '../../util/dummyGeojson'
import Spinner from '../../ui/Spinner'
import { slugFromName } from '../../util/slugFromName'
import Head from '../../layout/Head'
import SidebarContainer from '../../layout/SidebarContainer'
import GeometryTypeButtonTabs from '../../ui/GeometryTypeButtonTabs'

const parseBoroCD = (boroCD) => {
  const boroCode = Math.floor(boroCD / 100 % 10)
  const cdNumber = Math.floor(boroCD % 100)
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

  console.log(borough, cdNumber)

  return {
    borough,
    cdNumber
  }
}

const MainSidebar = ({ map, communityDistricts }) => {
  const navigate = useNavigate()

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GA4_TRACKING_ID)
    ReactGA.send({ hitType: 'pageview', page: '/' })
  }, [])

  // on mount, add this component's sources and layers to the map
  // only if they haven't been added before
  useEffect(() => {
    if (!map && !communityDistricts) return
    console.log(communityDistricts)
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
          'fill-color': 'steelblue',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.9,
            0.6
          ]
        }
      })

      //   // add a symbol layer to label each polygon
      //   map.addLayer({
      //     id: 'community-districts-symbol',
      //     type: 'symbol',
      //     source: 'community-districts',
      //     layout: {
      //       'text-field': ['get', 'name'],
      //       'text-variable-anchor': ['bottom'],
      //       'text-radial-offset': 0.5,
      //       'text-justify': 'auto'
      //     },
      //     paint: {
      //       'text-halo-color': 'white',
      //       'text-halo-width': 2,
      //       'text-halo-blur': 1
      //     }
      //   })

      // make geometries clickable
      map.on('click', 'community-districts-fill', (e) => {
        const [feature] = map.queryRenderedFeatures(e.point)
        const { BoroCD } = feature.properties
        const { borough, cdNumber } = parseBoroCD(BoroCD)
        console.log(`/report/community-districts/${borough}/${cdNumber}`)
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
    }

    return () => {
      map.setLayoutProperty('community-districts-fill', 'visibility', 'none')
    }
  }, [map])

  useEffect(() => {
    if (map) {
      map.flyTo({
        zoom: 12.5
      })
    }
  }, [map, communityDistricts])

  if (!map) {
    return <Spinner>Loading...</Spinner>
  }

  return (
    <SidebarContainer>
      <Head
        title='Citywide Map'
        description='Browse user-created areas of interest for local 311 activity in New York City'
      />
      <div className='px-4 text-sm'>
        <h3 className='mb-3 text-lg font-semibold'>Explore 311 Data for the Places You Care About</h3>
        <div className='mb-3'>
          <GeometryTypeButtonTabs active='cd' />
        </div>
        <p className='mb-3'>Click on a community district to see a report of recent 311 activity.</p>
      </div>
    </SidebarContainer>
  )
}

MainSidebar.propTypes = {
  map: PropTypes.object,
  communityDistricts: PropTypes.object
}

export default MainSidebar

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import ReactGA from 'react-ga4'

import dummyGeojson from '../../util/dummyGeojson'
import Spinner from '../../ui/Spinner'
import { slugFromName } from '../../util/slugFromName'
import Head from '../../layout/Head'
import SidebarContainer from '../../layout/SidebarContainer'

const StreetTreesSidebar = ({ map, allGeometries }) => {
  const navigate = useNavigate()

  // on mount, add this component's sources and layers to the map
  // only if they haven't been added before
  useEffect(() => {
    if (!map) return
    // use one source as a proxy for all sources related to this component
    if (!map.getSource('open-street-tree-requests')) {
      map.addSource('open-street-tree-requests', {
        type: 'geojson',
        data: '/data/open-street-tree-requests.geojson'
      })

      map.addLayer({
        id: 'open-street-tree-requests-circle',
        type: 'circle',
        source: 'open-street-tree-requests',
        paint: {
          'circle-color': 'green',
          'circle-radius': 1.5,
          'circle-opacity': 0.7
        }
      })
    }

    return () => {
      map.setLayoutProperty('open-street-tree-requests-circle', 'visibility', 'hidden')
    }
  }, [map])

  return (
    <SidebarContainer>
      <Head
        title='Citywide Map'
        description='Browse user-created areas of interest for local 311 activity in New York City'
      />
      Open Street Tree Requests
    </SidebarContainer>
  )
}

StreetTreesSidebar.propTypes = {
  map: PropTypes.object,
  allGeometries: PropTypes.object
}

export default StreetTreesSidebar

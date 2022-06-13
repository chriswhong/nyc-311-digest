import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { renderToString } from 'react-dom/server'
// eslint-disable-next-line
import mapboxgl from '!mapbox-gl'
import _ from 'underscore'
import { useDeviceSelectors } from 'react-device-detect'

import CircleMarkerSvg from './CircleMarkerSvg'
import getRollupCategory, {
  generateClusterProperties,
  generateCircleCategoryColorStyle,
  generateClusterCategoryColorStyle
} from '../../util/categoryColors'
import dummyGeojson from '../../util/dummyGeojson'
import { ThreeOneOneDataContext } from './ThreeOneOneDataHandler'
import { statusColorsClusterMapStyle, statusColorsMapStyle } from '../../util/statusColors'
import { MapContext } from '../../app/App'

// de-duplicate the features.  MapboxGl bug where solo points in clustered sources will show duplicates when queried during events
// https://github.com/visgl/react-map-gl/issues/1410
const dedupeServiceRequests = (serviceRequests) => {
  return _.uniq(serviceRequests, d => d.properties.unique_key)
}

const ReportMapElements = ({
  areaOfInterest
}) => {
  const map = useContext(MapContext)
  const {
    serviceRequestsFC,
    popupData,
    dateSelection,
    setPopupData
  } = useContext(ThreeOneOneDataContext)

  const [selectors] = useDeviceSelectors(window.navigator.userAgent)
  const { isMobile } = selectors

  let fitBoundsPadding = { top: 30, bottom: 30, left: 400, right: 30 }
  if (isMobile) {
    fitBoundsPadding = { top: 5, bottom: 5, left: 5, right: 5 }
  }

  const highlightedFeature = popupData && popupData[0]

  const handleComplaintClick = (e) => {
    const features = dedupeServiceRequests(e.features)
    setPopupData(features)
  }

  // initialize sources and layers
  useEffect(() => {
    if (!map) return

    // check for one source in the group
    if (!map.getSource('area-of-interest')) {
      map.addSource('area-of-interest', {
        type: 'geojson',
        data: dummyGeojson
      })

      map.addSource('serviceRequests', {
        type: 'geojson',
        data: dummyGeojson,
        cluster: true,
        clusterMaxZoom: 18, // Max zoom to cluster points on
        clusterRadius: 3,
        clusterProperties: generateClusterProperties(),
        generateId: true
      })

      map.addSource('highlighted-circle', {
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

      map.addLayer({
        id: 'serviceRequests-circle',
        type: 'circle',
        source: 'serviceRequests',
        paint: {
          'circle-color': generateCircleCategoryColorStyle(),
          'circle-radius': 3,
          'circle-stroke-color': statusColorsMapStyle,
          'circle-stroke-width': 1.5
        },
        filter: ['!', ['has', 'point_count']]
      })

      map.addLayer({
        id: 'serviceRequests-circle-cluster',
        type: 'circle',
        source: 'serviceRequests',
        paint: {
          'circle-color': generateClusterCategoryColorStyle(),
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            5,
            3,
            6,
            5,
            7,
            7,
            8,
            9,
            9
          ],
          'circle-stroke-color': statusColorsClusterMapStyle,
          'circle-stroke-width': 1.5
        },
        filter: ['has', 'point_count']
      })

      map.addLayer({
        id: 'serviceRequests-circle-cluster-count',
        type: 'symbol',
        source: 'serviceRequests',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 9
        },
        paint: {
          // 'text-translate': [6, 6]
        }
      })

      map.addLayer({
        id: 'highlighted-circle',
        type: 'circle',
        source: 'highlighted-circle',
        paint: {
          'circle-radius': 30,
          'circle-color': 'lightblue',
          'circle-opacity': 0.6
        },
        filter: ['>=', ['get', 'created_date'], dateSelection.dateRange[0].unix()]
      }, 'serviceRequests-circle')
    }

    return () => {
      map.getSource('area-of-interest').setData(dummyGeojson)
      map.getSource('serviceRequests').setData(dummyGeojson)
      map.getSource('highlighted-circle').setData(dummyGeojson)
    }
  }, [map])

  useEffect(() => {
    if (map && areaOfInterest) {
      map.getSource('area-of-interest').setData(areaOfInterest)

      map.fitBounds(areaOfInterest.properties.bbox, {
        padding: fitBoundsPadding
      })
    }
  }, [map, areaOfInterest])

  useEffect(() => {
    if (map && serviceRequestsFC) {
      map.getSource('serviceRequests').setData(serviceRequestsFC)

      const tooltip = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 5
      })

      const showTooltip = (e) => {
        if (isMobile) { return }
        const features = dedupeServiceRequests(e.features)

        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer'

        const coordinates = features[0].geometry.coordinates.slice()
        const tooltipHtml = (
          <div className='px-2 py-1'>
            {features.map((feature) => (
              <div key={feature.properties.unique_key} className='flex items-center'>
                <CircleMarkerSvg rollupCategory={getRollupCategory(feature.properties.complaint_type)} status={feature.properties.status} />
                <span className='ml-1 text-sm'>{feature.properties.complaint_type} - </span><span className='text-xs text-gray-600'>{moment.unix(feature.properties.created_date).fromNow()}</span>
              </div>
            ))}
          </div>
        )

        tooltip
          .setLngLat(coordinates)
          .setHTML(renderToString(tooltipHtml))
          .addTo(map)
      }

      const hideTooltip = () => {
        map.getCanvas().style.cursor = ''
        tooltip.remove()
      }
      map.on('mouseenter', 'serviceRequests-circle', showTooltip)
      map.on('click', 'serviceRequests-circle', handleComplaintClick)

      map.on('mouseenter', 'serviceRequests-circle-cluster', (e) => {
        const clusterId = e.features[0].properties.cluster_id
        map.getSource('serviceRequests').getClusterLeaves(
          clusterId,
          100, // limit
          0,
          (err, features) => {
            if (err) return

            showTooltip({
              features
            })
          }
        )
      })
      map.on('click', 'serviceRequests-circle-cluster', (e) => {
        const clusterId = e.features[0].properties.cluster_id
        map.getSource('serviceRequests').getClusterLeaves(
          clusterId,
          100, // limit
          0,
          (err, features) => {
            if (err) return
            setPopupData(features)
          }
        )
      })

      map.on('mouseleave', 'serviceRequests-circle', hideTooltip)
      map.on('mouseleave', 'serviceRequests-circle-cluster', hideTooltip)
    }
  }, [map, serviceRequestsFC])

  useEffect(() => {
    if (!map) return
    map.getSource('highlighted-circle').setData(highlightedFeature || dummyGeojson)
  }, [map, highlightedFeature])

  return null
}

ReportMapElements.propTypes = {
  areaOfInterest: PropTypes.object,
  dateSelection: PropTypes.object,
  onDateRangeChange: PropTypes.func
}

export default ReportMapElements

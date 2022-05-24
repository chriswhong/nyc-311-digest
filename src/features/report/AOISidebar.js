import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeftIcon,
  UserCircleIcon,
  ExternalLinkIcon
} from '@heroicons/react/outline'
import moment from 'moment'
import pointsWithinPolygon from '@turf/points-within-polygon'
import { renderToString } from 'react-dom/server'
// eslint-disable-next-line
import mapboxgl from '!mapbox-gl'
import _ from 'underscore'
import { useDeviceSelectors } from 'react-device-detect'
import ReactGA from 'react-ga4'

import RollupChart from './RollupChart'
import Link from '../../ui/Link'
import PopupSidebar from './PopupSidebar'
import Spinner from '../../ui/Spinner'
import CircleMarkerSvg from './CircleMarkerSvg'
import DateRangeSelector from './DateRangeSelector'

import getRollupCategory, {
  generateClusterProperties,
  generateCircleCategoryColorStyle,
  generateClusterCategoryColorStyle
} from '../../util/categoryColors'
import dummyGeojson from '../../util/dummyGeojson'
import AOIMenu from './AOIMenu'
import { useGetServiceRequestsQuery } from '../../util/api'
import { useAuth } from '../../util/auth'
import { statusColorsMapStyle, statusColorsClusterMapStyle } from '../../util/statusColors'
import Head from '../../layout/Head'
import { AuthContext } from '../../AppContainer'

// de-duplicate the features.  MapboxGl bug where solo points in clustered sources will show duplicates when queried during events
// https://github.com/visgl/react-map-gl/issues/1410
const dedupeServiceRequests = (serviceRequests) => {
  return _.uniq(serviceRequests, d => d.properties.unique_key)
}

const AOISidebar = ({
  map,
  areaOfInterest,
  dateSelection,
  onDateRangeChange
}) => {
  const navigate = useNavigate()
  const [serviceRequests, setServiceRequests] = useState()
  const [popupData, setPopupData] = useState()

  const [selectors] = useDeviceSelectors(window.navigator.userAgent)
  const { isMobile } = selectors

  const { user } = useContext(AuthContext)

  const { pathname } = useLocation()

  const { data, loading, error, trigger } = useGetServiceRequestsQuery(areaOfInterest, dateSelection)

  let fitBoundsPadding = { top: 30, bottom: 30, left: 400, right: 30 }
  if (isMobile) {
    fitBoundsPadding = { top: 5, bottom: 5, left: 5, right: 5 }
  }

  const highlightedFeature = popupData && popupData[0]

  const handleComplaintClick = (e) => {
    const features = dedupeServiceRequests(e.features)
    setPopupData(features)
  }

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GA4_TRACKING_ID)
    ReactGA.send({ hitType: 'pageview', page: pathname })
  }, [])

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
      trigger()
    }
  }, [map, areaOfInterest, dateSelection.dateRange])

  useEffect(() => {
    if (data) {
      // convert to geojson
      const serviceRequestsGeojson = {
        type: 'FeatureCollection',
        features: data.map((d) => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [parseFloat(d.longitude), parseFloat(d.latitude)]
            },
            properties: { ...d }
          }
        })
      }

      const clippedServiceRequests = pointsWithinPolygon(serviceRequestsGeojson, areaOfInterest.geometry)
      // convert created_date to unix epoch
      clippedServiceRequests.features = clippedServiceRequests.features.map((d) => {
        return {
          ...d,
          properties: {
            ...d.properties,
            created_date: moment(d.properties.created_date).unix(),
            closed_date: moment(d.properties.closed_date).unix(),
            resolution_action_updated_date: moment(d.properties.resolution_action_updated_date).unix(),
            rollupCategory: getRollupCategory(d.properties.complaint_type)
          }
        }
      })

      setServiceRequests(clippedServiceRequests)
    }
  }, [data])

  useEffect(() => {
    if (map && areaOfInterest) {
      map.getSource('area-of-interest').setData(areaOfInterest)

      map.fitBounds(areaOfInterest.properties.bbox, {
        padding: fitBoundsPadding
      })
    }
  }, [map, areaOfInterest])

  useEffect(() => {
    if (map && serviceRequests) {
      map.getSource('serviceRequests').setData(serviceRequests)

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
  }, [map, serviceRequests])

  useEffect(() => {
    if (!map) return
    map.getSource('highlighted-circle').setData(highlightedFeature || dummyGeojson)
  }, [map, highlightedFeature])

  const handleBackClick = () => {
    navigate('/')
  }

  if (popupData) {
    return (
      <PopupSidebar complaints={popupData} onClose={() => { setPopupData(null) }} />
    )
  }

  const dateFrom = dateSelection.dateRange[0].format('DD MMM YYYY')
  const dateTo = dateSelection.dateRange[1].format('DD MMM YYYY')

  const isOwner = user?.sub === areaOfInterest?.properties.owner.sub
  const isAdmin = user && user['http://demozero.net/roles'].includes('Admin')

  return (
    <>
      {areaOfInterest && (
        <>
          <Head
            title={areaOfInterest.properties.name}
            description={`A report of 311 activity in the area ${areaOfInterest.properties.name}`}
          />
          <div className='px-4 mb-3'>
            <div className='flex items-center mb-1'>
              <div className='flex-grow'>
                <Link onClick={handleBackClick}>
                  <div className='flex items-center'><ChevronLeftIcon className='h-5 mr-0.5 -ml-1 inline' /><div className='inline text-sm'>City View</div></div>
                </Link>
              </div>
              {(isOwner || isAdmin) && <AOIMenu ownerId={areaOfInterest.properties.owner.sub} />}
            </div>
            <div className='mb-1 text-3xl font-semibold'>{areaOfInterest.properties.name}</div>
            <div className='flex items-center justify-end text-gray-600'>
              <span className='text-xs font-light'>by</span> <UserCircleIcon className='h-4 w-4 ml-1 mr-0.5' />
              <div className='text-sm'>{areaOfInterest.properties.owner?.username || 'Anonymous'}</div>
            </div>
          </div>
          <div className='flex-grow px-4 overflow-y-scroll'>
            <div className='mb-2'>
              <DateRangeSelector selection={dateSelection} onChange={onDateRangeChange} />
              <div className='text-xs'>From {dateFrom} to {dateTo}</div>
            </div>
            {serviceRequests && (
              <>

                <div className='flex items-center'>
                  <div className='mr-2 text-2xl font-bold'>
                    {serviceRequests.features.length}
                  </div>
                  <div className='text-lg'>
                    New Service Requests
                  </div>
                </div>
                <Link to='https://github.com/chriswhong/nyc-311-digest/blob/master/src/util/getRollupCategory.js'>
                  <div className='flex items-center mb-2 text-xs'>
                    About these Categories
                    <ExternalLinkIcon className='w-3 h-3 ml-1.5' />
                  </div>
                </Link>
                <div className='h-64 mb-3'>
                  <RollupChart data={serviceRequests.features} />
                </div>
                <div className='mb-3 text-xs'>Hover over the markers for more info, <span className='italic'>click for full details</span>.</div>
              </>
            )}

            {!serviceRequests && (
              <Spinner>Loading 311 data...</Spinner>
            )}
          </div>
        </>
      )}
    </>
  )
}

AOISidebar.propTypes = {
  map: PropTypes.object,
  areaOfInterest: PropTypes.object,
  dateSelection: PropTypes.object,
  onDateRangeChange: PropTypes.func
}

export default AOISidebar

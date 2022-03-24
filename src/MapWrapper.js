import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import pointsWithinPolygon from '@turf/points-within-polygon'
import bbox from '@turf/bbox'
import gjv from 'geojson-validation'

import Map from './Map.js'
import AOISidebar from './AOISidebar.js'
import MainSidebar from './MainSidebar.js'
import DrawSidebar from './DrawSidebar.js'
import PopupSidebar from './PopupSidebar.js'

import getRollupCategory from './util/getRollupCategory'

const fetchGeometries = async () => {
  const getGeometriesUrl = `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/get-geometries`
  return await fetch(getGeometriesUrl).then((d) => {
    return d.json()
  })
}

function MapWrapper () {
  const { areaOfInterestId } = useParams()
  const location = useLocation()
  const history = useNavigate()

  const [areaOfInterest, setAreaOfInterest] = useState()
  const [serviceRequests, setServiceRequests] = useState()
  const [allGeometries, setAllGeometries] = useState()
  const [startDateMoment] = useState(moment().subtract(7, 'd').startOf('day'))
  const [mapInstance, setMapInstance] = useState()

  const [drawnFeature, setDrawnFeature] = useState()
  const [drawnFeatureName, setDrawnFeatureName] = useState()

  // object with address and complaints properties
  const [popupData, setPopupData] = useState()

  // data fetching based on the current route
  useEffect(() => {
    if (location.pathname.includes('report') && allGeometries) {
      const fetchData = async (bounds) => { // get datestamp for 7 days ago (go one day earlier so we can do a date > clause)
        const dateFrom = startDateMoment.format('YYYY-MM-DD')

        const serviceRequestsApiUrl = `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$where=latitude>${bounds[1]} AND latitude<${bounds[3]} AND longitude>${bounds[0]} AND longitude<${bounds[2]} AND (created_date>'${dateFrom}' OR status='Open')&$order=created_date DESC`
        return await fetch(serviceRequestsApiUrl).then(d => d.json())
      }

      const areaOfInterest = allGeometries.features.find((d) => d.properties._id === areaOfInterestId)
      // set areaOfInterest as soon as we have it so that the map can fitBounds
      // while waiting for the 311 data request
      setAreaOfInterest(areaOfInterest)

      const areaOfInterestGeometry = areaOfInterest.geometry

      fetchData(areaOfInterest.properties.bbox)
        .then((data) => {
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

          const clippedServiceRequests = pointsWithinPolygon(serviceRequestsGeojson, areaOfInterestGeometry)
          // convert create_date to unix epoch
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
        })
    } else {
      // clear data
      setServiceRequests()
      setAreaOfInterest()
    }
  }, [location, allGeometries])

  // get all area of interest geometries
  useEffect(() => {
    fetchGeometries()
      .then((allGeometries) => {
        setAllGeometries(allGeometries)
      })
  }, [])

  const isDrawMode = location.pathname === '/new'

  const validate = (feature, name) => {
    const nameIsValid = name && name.length > 3
    const featureIsValid = feature && gjv.valid(feature)
    return nameIsValid && featureIsValid
  }

  const drawIsValid = validate(drawnFeature, drawnFeatureName)

  const handleSave = async () => {
    const postGeometryURL = `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/post-geometry`
    await fetch(postGeometryURL, {
      method: 'POST',
      body: JSON.stringify({
        name: drawnFeatureName,
        geometry: drawnFeature.geometry,
        bbox: bbox(drawnFeature.geometry)
      })
    })
      .then(d => d.json())
      .then(async ({ id }) => {
        await fetchGeometries()
          .then((allGeometries) => {
            setAllGeometries(allGeometries)
          })
          .then(() => {
            history(`/report/${id}`)
          })
      })
  }

  return (
    <div className='h-full'>
      <Map
        allGeometries={allGeometries}
        areaOfInterest={areaOfInterest}
        serviceRequests={serviceRequests}
        startDateMoment={startDateMoment}
        location={location}
        drawMode={isDrawMode}
        highlightedFeature={popupData && popupData[0]}
        onMapLoad={(d) => { setMapInstance(d) }}
        onMapClick={(d) => { setPopupData(d) }}
      />
      <div className='md:absolute top-0 left-0 z-10 w-full md:w-96 h-2/3 md:h-full flex flex-col min-h-0'>
        <div className='m-0 md:m-5 py-4 md:rounded-lg bg-white md:shadow-md overflow-hidden'>
          <div className='relative h-full'>
            {isDrawMode && (
              <DrawSidebar
                name={drawnFeatureName}
                isValid={drawIsValid}
                mapInstance={mapInstance}
                onNameChange={(d) => { setDrawnFeatureName(d) }}
                onDraw={(d) => { setDrawnFeature(d) }}
                onSaveClick={handleSave}
              />
            )}
            {location.pathname.includes('report') && !popupData && (
              <AOISidebar
                startDateMoment={startDateMoment}
                areaOfInterest={areaOfInterest}
                serviceRequests={serviceRequests}
              />
            )}
            {location.pathname === '/' && (
              <MainSidebar />
            )}
            {
          popupData && (
            <PopupSidebar complaints={popupData} onClose={() => { setPopupData(null) }} />
          )
        }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapWrapper

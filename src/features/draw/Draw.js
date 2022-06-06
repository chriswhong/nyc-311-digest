import React, { useContext, useEffect, useState } from 'react'
import gjv from 'geojson-validation'
import bbox from '@turf/bbox'
import { useNavigate } from 'react-router-dom'
import ReactGA from 'react-ga4'

import { slugFromName } from '../../util/slugFromName'
import { useCreateAOIQuery } from '../../util/api'
import Head from '../../layout/Head'
import { AuthContext } from '../../AppContainer'
import DrawSidebar from './DrawSidebar'
import DrawMapElements from './DrawMapElements'

const Draw = () => {
  const [drawnFeature, setDrawnFeature] = useState()
  const [drawnFeatureName, setDrawnFeatureName] = useState('')
  const [cleared, setCleared] = useState(false)

  const navigate = useNavigate()

  const { user } = useContext(AuthContext)

  const requestBody = {
    name: drawnFeatureName,
    geometry: drawnFeature?.geometry,
    bbox: drawnFeature && bbox(drawnFeature?.geometry),
    owner: user?.sub
  }

  const { data, loading, error, trigger } = useCreateAOIQuery(requestBody)

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GA4_TRACKING_ID)
    ReactGA.send({ hitType: 'pageview', page: '/new' })
  }, [])

  const validate = (feature, name) => {
    const nameIsValid = name && name.length > 3
    const featureIsValid = feature && gjv.valid(feature)
    return !!nameIsValid && featureIsValid
  }

  const drawIsValid = validate(drawnFeature, drawnFeatureName)

  const handleSave = async () => {
    trigger()
  }

  // on successful submission
  useEffect(() => {
    if (!data) { return }
    setDrawnFeature(null)
    setDrawnFeatureName('')
    navigate(`/report/${data.id}/${slugFromName(drawnFeatureName)}`, {
      state: {
        refresh: true
      }
    })
  }, [data])

  return (
    <>
      <Head title='Add an Area of Interest' description='Draw a new Area of Interest on the map to create a localized 311 data report' />
      <DrawMapElements
        drawnFeature={drawnFeature}
        setDrawnFeature={setDrawnFeature}
        cleared={cleared}
        setCleared={setCleared}
      />
      <DrawSidebar
        drawnFeature={drawnFeature}
        drawIsValid={drawIsValid}
        loading={loading}
        drawnFeatureName={drawnFeatureName}
        setDrawnFeatureName={setDrawnFeatureName}
        onSave={handleSave}
        setCleared={setCleared}
      />
    </>
  )
}

export default Draw

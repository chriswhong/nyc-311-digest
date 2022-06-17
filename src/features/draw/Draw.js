import React, { useContext, useEffect, useState } from 'react'
import gjv from 'geojson-validation'
import bbox from '@turf/bbox'
import area from '@turf/area'
import { useNavigate } from 'react-router-dom'

import { slugFromName } from '../../util/slugFromName'
import { useCreateAoiMutation } from '../../util/rtk-api'
import Head from '../../layout/Head'
import { AuthContext } from '../../app/AppContainer'
import DrawSidebar from './DrawSidebar'
import DrawMapElements from './DrawMapElements'

const Draw = () => {
  const [drawnFeature, setDrawnFeature] = useState()
  const [drawnFeatureName, setDrawnFeatureName] = useState('')
  const [cleared, setCleared] = useState(false)

  const navigate = useNavigate()

  const { user } = useContext(AuthContext)

  const [createAoi, { data, error, isLoading }] = useCreateAoiMutation()

  const validate = (feature, name) => {
    const nameIsValid = name && name.length > 3
    const featureIsValid = feature && gjv.valid(feature)
    return !!nameIsValid && featureIsValid
  }

  const drawIsValid = validate(drawnFeature, drawnFeatureName)

  const handleSave = async () => {
    createAoi({
      name: drawnFeatureName,
      geometry: drawnFeature?.geometry,
      bbox: drawnFeature && bbox(drawnFeature?.geometry),
      area: area(drawnFeature?.geometry),
      owner: user?.sub
    })
  }

  // on successful submission
  useEffect(() => {
    if (!data) { return }
    setDrawnFeature(null)
    setDrawnFeatureName('')
    navigate(`/report/aoi/${data.id}/${slugFromName(drawnFeatureName)}`, {
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
        loading={isLoading}
        drawnFeatureName={drawnFeatureName}
        setDrawnFeatureName={setDrawnFeatureName}
        onSave={handleSave}
        setCleared={setCleared}
      />
    </>
  )
}

export default Draw

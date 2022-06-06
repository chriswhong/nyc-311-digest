import React, { useState, useEffect, createContext, useContext } from 'react'
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import MapWrapper from './features/map/MapWrapper'
import Header from './layout/Header'
import AOIIndex from './features/aoi/AOIIndex'
import Draw from './features/draw/Draw'
import AOIReport from './features/aoi/AOIReport'
import UsernameForm from './features/auth/UsernameForm'
import ModalWrapper from './ui/modal/ModalWrapper'
import useModal from './util/useModal'
import { useGetAOIsQuery, useGetCommunityDistrictsQuery } from './util/api'
import ProtectedRoute from './features/auth/ProtectedRoute'
import NotFound from './layout/NotFound'
import { AuthContext } from './AppContainer'
import CommunityDistrictsIndex from './features/community-districts/CommunityDistrictsIndex'
import CommunityDistrictReport from './features/community-districts/CommunityDistrictReport'
import usePageTracking from './util/usePageTracking'

export const ModalContext = createContext()
export const MapContext = createContext()

function App () {
  const [mapInstance, setMapInstance] = useState()
  const location = useLocation()

  const { state } = location

  const modalProps = useModal()
  const { showModal } = modalProps

  const { user, isLoading: userIsLoading } = useContext(AuthContext)

  usePageTracking()

  // don't let an authenticated user do anything else until they create a username
  useEffect(() => {
    if (userIsLoading) return

    if (user && !user.username) {
      showModal('CreateUsernameModal', {
        locked: true
      })
    }
  }, [user])

  const {
    data: allGeometries,
    loading: allGeometriesLoading,
    error: allGeometriesError,
    trigger: allGeometriesTrigger
  } = useGetAOIsQuery()

  const {
    data: communityDistricts,
    loading: communityDistrictsLoading,
    error: communityDistrictsError,
    trigger: communityDistrictsTrigger
  } = useGetCommunityDistrictsQuery()

  // get all area of interest geometries
  useEffect(() => {
    allGeometriesTrigger()
    communityDistrictsTrigger()
    // modal that effectively hides the app if there is a data issue
    // showModal('NoDataModal')
  }, [])

  useEffect(() => {
    if (state?.refresh) {
      allGeometriesTrigger()
    }
  }, [state])

  const handleMapLoad = (map) => {
    setMapInstance(map)

    // add source and layer for borough boundaries
    map.addSource('borough-boundaries', {
      type: 'geojson',
      data: '/data/borough-boundaries.geojson'
    })

    map.addLayer({
      id: 'borough-boundaries-line',
      source: 'borough-boundaries',
      type: 'line',
      paint: {
        'line-color': '#4f46e5',
        'line-dasharray': [5, 2],
        'line-opacity': 0.7
      }
    })
  }

  return (
    <div className='flex flex-col App'>
      <ModalContext.Provider value={modalProps}>
        <MapContext.Provider value={mapInstance}>
          <Header />
          <div className='relative flex-grow min-h-0'>
            <MapWrapper onLoad={handleMapLoad} />
            <Routes>
              <Route
                index
                element={
                  <AOIIndex
                    allGeometries={allGeometries}
                  />
                  }
              />
              <Route
                path='/new'
                element={
                  <ProtectedRoute user={user} userIsLoading={userIsLoading}>
                    <Draw />
                  </ProtectedRoute>
                  }
              />
              <Route
                path='/community-districts'
                element={
                  <CommunityDistrictsIndex
                    communityDistricts={communityDistricts}
                  />
                  }
              />
              <Route
                path='/report/community-districts/:boroughname/:cdnumber'
                element={
                  <CommunityDistrictReport
                    communityDistricts={communityDistricts}
                  />
                  }
              />
              <Route
                path='/report/:areaOfInterestId/:slug'
                element={
                  <AOIReport
                    allGeometries={allGeometries}
                  />
                  }
              />

              <Route
                path='/create-username'
                element={
                  <UsernameForm />
                }
              />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
          <ModalWrapper {...modalProps} />
        </MapContext.Provider>
      </ModalContext.Provider>
    </div>
  )
}

export default App

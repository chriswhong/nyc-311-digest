import React, { useState, useEffect, createContext, useContext } from 'react'
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import MapWrapper from './features/map/MapWrapper'
import Header from './layout/Header'
import MainSidebar from './features/main/MainSidebar'
import DrawSidebar from './features/draw/DrawSidebar'
import AOISidebarWrapper from './features/report/AOISidebarWrapper'
import UsernameForm from './features/auth/UsernameForm'
import ModalWrapper from './ui/modal/ModalWrapper'
import useModal from './util/useModal'
import { useGetAOIsQuery, useGetCommunityDistrictsQuery } from './util/api'
import ProtectedRoute from './features/auth/ProtectedRoute'
import NotFound from './layout/NotFound'
import { AuthContext } from './AppContainer'
import StreetTreesSidebar from './features/street-trees/StreetTreesSidebar'
import CommunityDistrictsSidebar from './features/community-districts/CommunityDistrictsSidebar'
import CommunityDistrictReportSidebarWrapper from './features/community-districts/CommunityDistrictReportSidebarWrapper'

export const ModalContext = createContext()

function App () {
  const [mapInstance, setMapInstance] = useState()
  const location = useLocation()

  const { pathname, state } = location

  const modalProps = useModal()
  const { showModal } = modalProps

  const { user, isLoading: userIsLoading } = useContext(AuthContext)

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
        <Header />
        <div className='relative flex-grow min-h-0'>
          <MapWrapper onLoad={handleMapLoad} />
          <Routes>

            <Route
              index
              element={
                <MainSidebar
                  map={mapInstance}
                  allGeometries={allGeometries}
                />
                  }
            />
            <Route
              path='/new'
              element={
                <ProtectedRoute user={user} userIsLoading={userIsLoading}>
                  <DrawSidebar
                    map={mapInstance}
                  />
                </ProtectedRoute>
                  }
            />
            <Route
              path='/community-districts'
              element={
                <CommunityDistrictsSidebar
                  map={mapInstance}
                  communityDistricts={communityDistricts}
                />
                  }
            />
            <Route
              path='/report/community-districts/:boroughname/:cdnumber'
              element={
                <CommunityDistrictReportSidebarWrapper
                  map={mapInstance}
                  communityDistricts={communityDistricts}

                />
                  }
            />
            <Route
              path='/report/:areaOfInterestId/:slug'
              element={
                <AOISidebarWrapper
                  map={mapInstance}
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
            <Route
              path='/street-trees'
              element={
                <StreetTreesSidebar map={mapInstance} />
                }
            />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
        <ModalWrapper {...modalProps} />
      </ModalContext.Provider>
    </div>
  )
}

export default App

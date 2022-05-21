import React, { useState, useEffect, createContext } from 'react'
import {
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom'

import MapWrapper from './features/map/MapWrapper'
import Header from './layout/Header'
import MainSidebar from './features/main/MainSidebar'
import DrawSidebar from './features/draw/DrawSidebar'
import AOISidebarWrapper from './features/report/AOISidebarWrapper'
import AOIReportImage from './features/report/AOIReportImage'
import UsernameForm from './features/auth/UsernameForm'
import ModalWrapper from './ui/modal/ModalWrapper'
import useModal from './util/useModal'
import { useGetAOIsQuery } from './util/api'
import { useAuth } from './util/auth'
import ProtectedRoute from './features/auth/ProtectedRoute'
import NotFound from './layout/NotFound'

export const ModalContext = createContext()

function App () {
  const [mapInstance, setMapInstance] = useState()
  const location = useLocation()

  const { pathname, state } = location
  const navigate = useNavigate()

  const modalProps = useModal()

  const { user, isLoading: userIsLoading } = useAuth()

  // don't let an authenticated user do anything else until they create a username
  const shouldRedirectToCreateUsername = (pathname !== '/create-username') && user?.username === null
  const shouldRedirectFromCreateUsername = (pathname === '/create-username') && user?.username
  useEffect(() => {
    if (shouldRedirectToCreateUsername) {
      navigate('/create-username', {
        state: {
          returnTo: pathname
        }
      })
    }

    if (shouldRedirectFromCreateUsername) {
      navigate('/')
    }
  })

  const {
    data: allGeometries,
    loading: allGeometriesLoading,
    error: allGeometriesError,
    trigger: allGeometriesTrigger
  } = useGetAOIsQuery()

  // get all area of interest geometries
  useEffect(() => {
    allGeometriesTrigger()
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

  // render map + chart layout for static image creation
  if (pathname.includes('report-image')) {
    return (
      <div className='flex flex-col App'>
        <Routes>
          <Route
            path='/report-image/:areaOfInterestId'
            element={
              <AOIReportImage
                map={mapInstance}
                allGeometries={allGeometries}
                onLoad={handleMapLoad}
              />
                }
          />
        </Routes>
      </div>
    )
  }

  return (
    <div className='flex flex-col App'>

      <ModalContext.Provider value={modalProps}>
        <Header />
        <div className='relative flex-grow min-h-0'>
          <Routes>
            <Route element={<MapWrapper onLoad={handleMapLoad} />}>
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
                path='/report/:areaOfInterestId/:slug'
                element={
                  <AOISidebarWrapper
                    map={mapInstance}
                    allGeometries={allGeometries}
                  />
                }
              />
            </Route>
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
      </ModalContext.Provider>
    </div>
  )
}

export default App

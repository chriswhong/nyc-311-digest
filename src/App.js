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
import UsernameForm from './features/auth/UsernameForm'
import ModalWrapper from './ui/modal/ModalWrapper'
import useModal from './util/useModal'
import { useGetAOIsQuery } from './util/api'
import { useAuth } from './util/auth'
import ProtectedRoute from './features/auth/ProtectedRoute'

export const ModalContext = createContext()

function App () {
  const [mapInstance, setMapInstance] = useState()

  const { pathname, state } = useLocation()
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
  }, [])

  useEffect(() => {
    if (state?.refresh) {
      allGeometriesTrigger()
    }
  }, [state])

  return (
    <div className='App flex flex-col'>

      <ModalContext.Provider value={modalProps}>
        <Header />
        <div className='flex-grow relative min-h-0'>
          <Routes>
            <Route element={<MapWrapper onLoad={(map) => { setMapInstance(map) }} />}>
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
          </Routes>
        </div>
        <ModalWrapper {...modalProps} />
      </ModalContext.Provider>
    </div>
  )
}

export default App

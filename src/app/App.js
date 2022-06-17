import React, { useState, useEffect, createContext, useContext } from 'react'
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import MapWrapper from '../features/map/MapWrapper'
import Header from '../layout/Header'
import AOIIndex from '../features/aoi/AOIIndex'
import Draw from '../features/draw/Draw'
import AOIReport from '../features/aoi/AOIReport'
import ModalWrapper from '../ui/modal/ModalWrapper'
import useModal from '../util/useModal'
import ProtectedRoute from '../features/auth/ProtectedRoute'
import NotFound from '../layout/NotFound'

import { AuthContext } from './AppContainer'
import CommunityDistrictsIndex from '../features/community-districts/CommunityDistrictsIndex'
import CommunityDistrictReport from '../features/community-districts/CommunityDistrictReport'
import usePageTracking from '../util/usePageTracking'
import ReportImage from '../features/aoi/ReportImage'

import 'react-toastify/dist/ReactToastify.css'

export const ModalContext = createContext()
export const MapContext = createContext()

function App () {
  const [mapInstance, setMapInstance] = useState()

  const location = useLocation()

  const { pathname } = location

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
      <MapContext.Provider value={mapInstance}>
        <div className='flex flex-col App'>
          <Routes>
            <Route
              path='/report-image/:type/:id'
              element={
                <ReportImage
                  onLoad={handleMapLoad}
                />
            }
            />
          </Routes>
        </div>
      </MapContext.Provider>
    )
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
                  <AOIIndex />
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
                  <CommunityDistrictsIndex />
                  }
              />
              <Route
                path='/report/community-district/:boroughname/:cdnumber'
                element={
                  <CommunityDistrictReport />
                  }
              />
              <Route
                path='/report/aoi/:areaOfInterestId/:slug'
                element={
                  <AOIReport />
                  }
              />

              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
          <ModalWrapper {...modalProps} />
        </MapContext.Provider>
      </ModalContext.Provider>
      <ToastContainer />
    </div>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  useNavigate
} from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

import MapWrapper from './MapWrapper.js'
import Header from './Header.js'
import MainSidebar from './MainSidebar.js'
import DrawSidebar from './DrawSidebar.js'
import AOISidebar from './AOISidebar.js'

export const fetchGeometries = async () => {
  const getGeometriesUrl = `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/get-geometries`
  return await fetch(getGeometriesUrl).then((d) => {
    return d.json()
  })
}

function App () {
  const [mapInstance, setMapInstance] = useState()
  const [allGeometries, setAllGeometries] = useState()

  const history = useNavigate()

  const onRedirectCallback = (appState) => {
    history(appState.returnTo || '/')
  }

  // get all area of interest geometries
  useEffect(() => {
    fetchGeometries()
      .then((allGeometries) => {
        setAllGeometries(allGeometries)
      })
  }, [])

  return (
    <div className='App flex flex-col'>
      <Auth0Provider
        domain='nyc-311-reports.us.auth0.com'
        clientId='9nFBTNCFCZR2Fht7WGDjlt5g5vtbnpDD'
        redirectUri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
      >
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
                  <DrawSidebar
                    map={mapInstance}
                    onAllGeometriesUpdate={(d) => { setAllGeometries(d) }}
                  />
                }
              />
              <Route
                path='/report/:areaOfInterestId'
                element={
                  <AOISidebar
                    map={mapInstance}
                    allGeometries={allGeometries}
                  />
                }
              />
            </Route>
          </Routes>
        </div>
      </Auth0Provider>

    </div>
  )
}

export default App

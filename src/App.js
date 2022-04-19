import React, { useState, useEffect, createContext } from 'react'
import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import MapWrapper from './features/map/MapWrapper'
import Header from './layout/Header'
import MainSidebar from './features/main/MainSidebar'
import DrawSidebar from './features/draw/DrawSidebar'
import AOISidebar from './features/report/AOISidebar'
import UsernameForm from './features/auth/UsernameForm'
import ModalWrapper from './ui/modal/ModalWrapper'
import useModal from './util/useModal'

export const fetchGeometries = async () => {
  const getGeometriesUrl = `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/get-geometries`
  return await fetch(getGeometriesUrl).then((d) => {
    return d.json()
  })
}

const getUsername = async (sub) => {
  const getUsernameUrl = `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/get-username?sub=${sub}`
  return await fetch(getUsernameUrl).then((d) => {
    return d.json()
  })
}

export const AuthContext = createContext()
export const ModalContext = createContext()

function App () {
  const [mapInstance, setMapInstance] = useState()
  const [allGeometries, setAllGeometries] = useState()
  const [username, setUsername] = useState()

  const authItems = useAuth0()
  const history = useNavigate()
  const { pathname } = useLocation()

  const modalProps = useModal()
  console.log(modalProps)

  // get all area of interest geometries
  useEffect(() => {
    fetchGeometries()
      .then((allGeometries) => {
        setAllGeometries(allGeometries)
      })
  }, [])

  useEffect(() => {
    if (authItems.user && !username) {
      getUsername(authItems.user.sub)
        .then((d) => {
          if (d) {
            setUsername(d.username)
          } else {
            history('/create-username', {
              state: {
                returnTo: pathname
              }
            })
          }
        })
    }
  }, [authItems.user])

  const authItemsWithUsername = {
    ...authItems,
    user: {
      ...authItems.user,
      username
    }
  }

  return (
    <div className='App flex flex-col'>
      <AuthContext.Provider value={authItemsWithUsername}>
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
                    <DrawSidebar
                      map={mapInstance}
                      onAllGeometriesUpdate={(d) => { setAllGeometries(d) }}
                    />
                }
                />
                <Route
                  path='/report/:areaOfInterestId/:slug'
                  element={
                    <AOISidebar
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
      </AuthContext.Provider>
    </div>
  )
}

export default App

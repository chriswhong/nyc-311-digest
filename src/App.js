import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import MapWrapper from './MapWrapper.js'
import Header from './Header.js'

function App () {
  return (
    <div className='App flex flex-col'>
      <BrowserRouter>

        <Header />
        <div className='flex-grow relative'>
          <Routes>
            <Route
              path='/'
              element={
                <MapWrapper />
              }
            />
            <Route
              path='/new'
              element={
                <MapWrapper />
              }
            />
            <Route
              path='/report/:areaOfInterestId'
              element={
                <MapWrapper />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App

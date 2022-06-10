import React, { createContext } from 'react'

import App from './App.js'
import { useAuth } from '../util/auth.js'

export const AuthContext = createContext()

function AppContainer () {
  const authItems = useAuth()

  return (

    <AuthContext.Provider value={authItems}>
      <App />
    </AuthContext.Provider>
  )
}

export default AppContainer

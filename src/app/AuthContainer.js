import React, { createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

import AppContainer from './AppContainer.js'

export const AuthContext = createContext()

function AuthContainer () {
  const navigate = useNavigate()

  const onRedirectCallback = (appState) => {
    navigate(appState.returnTo || '/')
  }
  return (
    <Auth0Provider
      domain='nyc-311-reports.us.auth0.com'
      clientId='9nFBTNCFCZR2Fht7WGDjlt5g5vtbnpDD'
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <AppContainer />
    </Auth0Provider>
  )
}

export default AuthContainer

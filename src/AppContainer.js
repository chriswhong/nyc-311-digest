import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

import App from './App.js'
import { AuthProvider } from './util/auth'

function AppContainer () {
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
      <AuthProvider>
        <App />
      </AuthProvider>
    </Auth0Provider>
  )
}

export default AppContainer

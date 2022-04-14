import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

import App from './App.js'

function AppContainer () {
  const history = useNavigate()

  const onRedirectCallback = (appState) => {
    history(appState.returnTo || '/')
  }
  return (
    <Auth0Provider
      domain='nyc-311-reports.us.auth0.com'
      clientId='9nFBTNCFCZR2Fht7WGDjlt5g5vtbnpDD'
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  )
}

export default AppContainer

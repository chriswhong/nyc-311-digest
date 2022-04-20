import React, { useContext, createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useGetUsernameQuery } from './api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState()

  const authItems = useAuth0()
  const { user, getAccessTokenSilently, getAccessTokenWithPopup } = authItems

  const { data: usernameData, loading, error: usernameError, trigger: usernameTrigger } = useGetUsernameQuery(user?.sub)

  useEffect(() => {
    if (user && !username) {
      usernameTrigger()
    }
  }, [user])

  useEffect(() => {
    if (!usernameData) return
    if (usernameData?.username) {
      setUsername(usernameData.username)
    } else {
      setUsername(null)
    }
  }, [usernameData])

  if (user) {
    user.username = username
  }

  // add getAccessToken for convenience, use the appropriate method for prod/dev environments
  authItems.getAccessToken = getAccessTokenSilently

  // in development we can't get the access token silently
  if (process.env.NODE_ENV !== 'production') {
    authItems.getAccessToken = getAccessTokenWithPopup
  }

  authItems.setUsername = setUsername

  return (
    <AuthContext.Provider value={authItems}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

AuthProvider.propTypes = {
  children: PropTypes.object
}

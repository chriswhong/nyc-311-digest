import { useState, useEffect, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import { useGetUsernameQuery } from './api'

export const useAuth = () => {
  const [username, setUsername] = useState()
  // this should be true until have either gotten a username or confirmed there is no username
  const [isLoading, setIsLoading] = useState(true)

  const authItems = useAuth0()
  const { user, getAccessTokenSilently, getAccessTokenWithPopup, isLoading: auth0IsLoading } = authItems
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
    setIsLoading(false)
  }, [usernameData])

  useEffect(() => {
    if (auth0IsLoading === false && !user) {
      setIsLoading(false)
    }
  }, [auth0IsLoading])

  // add getAccessToken for convenience, use the appropriate method for prod/dev environments
  let getAccessToken = getAccessTokenSilently

  // in development we can't get the access token silently
  if (process.env.NODE_ENV !== 'production') {
    getAccessToken = getAccessTokenWithPopup
  }

  const userWithUsername = {
    ...authItems.user,
    username
  }

  return {
    ...authItems,
    user: authItems.user ? userWithUsername : authItems.user,
    setUsername,
    getAccessToken,
    isLoading
  }
}

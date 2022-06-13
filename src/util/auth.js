import { useState, useEffect, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import { sec } from './security'

import { useGetUsernameQuery } from './rtk-api'

export const useAuth = () => {
  const [username, setUsername] = useState()
  // this should be true until have either gotten a username or confirmed there is no username
  const [isLoading, setIsLoading] = useState(true)
  const [skip, setSkip] = useState(true)

  const authItems = useAuth0()
  const { user, getAccessTokenSilently, getAccessTokenWithPopup, isLoading: auth0IsLoading } = authItems
  const { data, error, isLoading: usernameIsLoading } = useGetUsernameQuery(user?.sub, {
    skip
  })

  // once the user exists, get the username
  useEffect(() => {
    if (user && !username) {
      setSkip(false)
    }
  }, [user])

  // once we have a username, set it and set loading to false
  useEffect(() => {
    if (data?.username) {
      setUsername(data.username)
      setIsLoading(false)
    }
  }, [data])

  // if no username for this user, set loading to false
  useEffect(() => {
    if (error?.data.error === 'not found') {
      setIsLoading(false)
    }
  }, [error])

  // if auth0 is no longer loading and there is no user, set loading to false
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

  // necessary for accessing getAccessToken outside of a react component
  sec.setAccessToken(getAccessToken)

  return {
    ...authItems,
    user: authItems.user ? userWithUsername : authItems.user,
    setUsername,
    getAccessToken,
    isLoading
  }
}

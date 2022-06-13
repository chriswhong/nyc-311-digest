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

  console.log('foo', data, error, isLoading)

  useEffect(() => {
    console.log('skipeffect')
    if (user && !username) {
      setSkip(false)
    }
  }, [user])

  // once we have a username
  useEffect(() => {
    console.log('dataEffect')

    if (data?.username) {
      setUsername(data.username)
      console.log('dataeffectwillsettofalse')
      setIsLoading(false)
    }
  }, [data])

  useEffect(() => {
    if (error?.data.error === 'not found') {
      setIsLoading(false)
    }
  }, [error])

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

  sec.setAccessToken(getAccessToken)

  return {
    ...authItems,
    user: authItems.user ? userWithUsername : authItems.user,
    setUsername,
    getAccessToken,
    isLoading
  }
}

import React, { useState, useEffect, useContext } from 'react'
// import PropTypes from 'prop-types'
import slugify from 'slugify'
import { useLocation, useNavigate } from 'react-router-dom'

import { AuthContext } from '../../App'
import Button from '../../ui/Button'
import TextInput from '../../ui/TextInput'
import useDebounce from '../../util/useDebounce.js'

const UsernameForm = () => {
  const {
    user,
    getAccessTokenSilently,
    getAccessTokenWithPopup
  } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState()

  const debouncedUsername = useDebounce(username, 500)

  const location = useLocation()
  const history = useNavigate()

  const checkUsername = async (username) => {
    const checkUsernameUrl = `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/post-check-username`

    return await fetch(checkUsernameUrl, {
      method: 'POST',
      body: JSON.stringify({
        username
      })
    }).then((d) => {
      return d.json()
    })
  }

  const createUsername = async (username, sub) => {
    const createUsernameUrl = `${process.env.REACT_APP_API_BASE_URL}/.netlify/functions/post-create-username`
    let auth0AccessTokenFunction = getAccessTokenSilently

    // in development we can't get the access token silently
    if (process.env.NODE_ENV !== 'production') {
      auth0AccessTokenFunction = getAccessTokenWithPopup
    }

    const token = await auth0AccessTokenFunction({
      audience: 'nyc-311-reports-functions',
      scope: 'write:area-of-interest'
    })
    return await fetch(createUsernameUrl, {
      method: 'POST',
      body: JSON.stringify({
        username,
        sub
      }),
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((d) => {
      return d.json()
    })
  }

  useEffect(() => {
    if (user) {
      setUsername(slugify(user.nickname || '', {
        replacement: '',
        lower: true,
        strict: true
      }))
    }
  }, [user])

  useEffect(() => {
    if (username) {
      checkUsername(username)
        .then((d) => {
          setUsernameAvailable(d.usernameAvailable)
        })
      // call API to determine if username exists
    }
  }, [debouncedUsername])

  let message

  if (usernameAvailable !== null) {
    if (usernameAvailable) {
      message = `Yass, ${username} is available`
    } else {
      message = `Sorry, ${username} is not available`
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    createUsername(username, user.sub)
      .then((d) => {
        history(location.state.returnTo || '/')
      })
  }

  return (
    <div className='block p-6 rounded-lg shadow-lg bg-white max-w-sm mx-auto'>
      <div className='mb-4 font-semibold'>Create a Username</div>
      <form onSubmit={handleSubmit}>
        <TextInput
          id='username'
          value={username}
          placeholder='Enter username'
          message={message}
          onChange={(d) => setUsername(d)}
        />
        <Button
          submit
          disabled={!usernameAvailable}
        >Submit
        </Button>
      </form>
    </div>
  )
}

export default UsernameForm

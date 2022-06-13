import React, { useState, useEffect, useContext } from 'react'
// import PropTypes from 'prop-types'
import slugify from 'slugify'
import { useNavigate } from 'react-router-dom'

import useDebounce from '../../util/useDebounce'
import { useCheckUsernameMutation, useCreateUsernameMutation } from '../../util/rtk-api'
import Head from '../../layout/Head'
import { AuthContext } from '../../app/AppContainer'

const UsernameForm = () => {
  const { user, setUsername: setAuthProviderUsername } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState()

  const debouncedUsername = useDebounce(username, 500)

  const navigate = useNavigate()

  const [checkUsername, { data: checkUsernameData, error: checkUsernameError, isLoading: checkUsernameLoading }] = useCheckUsernameMutation()
  const [createUserame, { data: createUsernameData, error: createUsernameError, isLoading: createUsernameLoading }] = useCreateUsernameMutation()

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
    }
  }, [debouncedUsername])

  useEffect(() => {
    if (checkUsernameData) {
      const { usernameAvailable } = checkUsernameData
      setUsernameAvailable(usernameAvailable)
    }
  }, [checkUsernameData])

  let message

  if (usernameAvailable !== null) {
    if (usernameAvailable) {
      message = `Yass, ${username} is available`
    } else {
      message = `Sorry, ${username} is not available`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    createUserame(username, user?.sub)
  }

  useEffect(() => {
    if (createUsernameData) {
      // update the username in the auth provider
      setAuthProviderUsername(createUsernameData.username)
      navigate('/')
    }
  }, [createUsernameData])

  return (
    <>
      <Head title='Create a Username' />

    </>
  )
}

export default UsernameForm

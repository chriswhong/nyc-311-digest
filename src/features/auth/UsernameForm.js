import React, { useState, useEffect, useContext } from 'react'
// import PropTypes from 'prop-types'
import slugify from 'slugify'
import { useNavigate } from 'react-router-dom'

import useDebounce from '../../util/useDebounce'
import { useCheckUsernameQuery, useCreateUsernameQuery } from '../../util/api'
import Head from '../../layout/Head'
import { AuthContext } from '../../AppContainer'

const UsernameForm = () => {
  const { user, setUsername: setAuthProviderUsername } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState()

  const debouncedUsername = useDebounce(username, 500)

  const navigate = useNavigate()

  const {
    data: checkUsernameData,
    loading: checkUsernameLoading,
    error: checkUsernameError,
    trigger: checkUsernameTrigger
  } = useCheckUsernameQuery(username)

  const {
    data: createUsernameData,
    loading: createUsernameLoading,
    error: createUsernameError,
    trigger: createUsernameTrigger
  } = useCreateUsernameQuery(username, user?.sub)

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
      checkUsernameTrigger()
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
    createUsernameTrigger()
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

import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import slugify from 'slugify'
import { useNavigate } from 'react-router-dom'

import Button from '../../ui/Button'
import TextInput from '../../ui/TextInput'
import useDebounce from '../../util/useDebounce'
import { useCheckUsernameQuery, useCreateUsernameQuery } from '../../util/api'
import { useAuth } from '../../util/auth'

const UsernameForm = () => {
  const { user, setUsername: setAuthProviderUsername } = useAuth()
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
        <div className='flex items-center bg-blue-500 text-white text-sm px-4 py-3 mb-4' role='alert'>
          <svg className='fill-current w-4 h-4 mr-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z' /></svg>
          <p>Your username will appear publicly and will be associated with areas of interest that you add</p>
        </div>
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

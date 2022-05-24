import React, { useState, Fragment, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { Transition, Dialog } from '@headlessui/react'

// import PropTypes from 'prop-types'
import slugify from 'slugify'

import Button from '../../ui/Button'
import TextInput from '../../ui/TextInput'
import useDebounce from '../../util/useDebounce'
import { useCheckUsernameQuery, useCreateUsernameQuery } from '../../util/api'
import { AuthContext } from '../../AppContainer'

export default function CreateUsernameModal ({ hideModal }) {
  const { user, setUsername: setAuthProviderUsername } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState()

  const debouncedUsername = useDebounce(username, 500)

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
  }, [])

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
      hideModal()
    }
  }, [createUsernameData])

  return (
    <Transition.Child
      as={Fragment}
      enter='ease-out duration-300'
      enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
      enterTo='opacity-100 translate-y-0 sm:scale-100'
      leave='ease-in duration-200'
      leaveFrom='opacity-100 translate-y-0 sm:scale-100'
      leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
    >
      <div className='relative inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
        <form onSubmit={handleSubmit}>
          <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
            <Dialog.Title as='h3' className='mb-3 text-lg font-medium leading-6 text-gray-900'>
              Create a Username
            </Dialog.Title>
            <TextInput
              id='username'
              value={username}
              placeholder='Enter username'
              message={message}
              onChange={(d) => setUsername(d)}
            />
            <div className='flex items-center px-4 py-3 mb-4 text-sm text-white bg-blue-500' role='alert'>
              <svg className='w-4 h-4 mr-2 fill-current' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z' /></svg>
              <p>Your username will appear publicly and will be associated with areas of interest that you add</p>
            </div>
          </div>
          <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>

            <Button
              submit
              disabled={!usernameAvailable}
            >
              {createUsernameLoading && (
                <div className='flex items-center justify-center'>
                  <div className='inline-block w-5 h-5 mr-2 text-white border-4 rounded-full spinner-border animate-spin' role='status'>
                    <span className='visually-hidden'>Deleting...</span>
                  </div>
                  Saving...
                </div>
              )}
              {!createUsernameLoading && 'Submit'}
            </Button>
          </div>
        </form>

      </div>

    </Transition.Child>
  )
}

CreateUsernameModal.propTypes = {
  hideModal: PropTypes.func
}

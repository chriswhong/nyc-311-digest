import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'

import { useDeleteAoiMutation } from '../../util/rtk-api'

export default function DeleteModal ({ hideModal, modalProperties }) {
  const { id } = modalProperties
  const [deleteAoi, { data, error, isLoading }] = useDeleteAoiMutation()

  const navigate = useNavigate()

  // close the modal after the delete is successful
  useEffect(() => {
    if (data) {
      hideModal()
      navigate('/', { state: { refresh: true } })
    }
  }, [data])

  const handleDelete = async () => {
    deleteAoi(id)
  }

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
        <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
          <div className='sm:flex sm:items-start'>
            <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10'>
              <ExclamationIcon className='w-6 h-6 text-red-600' aria-hidden='true' />
            </div>
            <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
              <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                Delete Area of Interest
              </Dialog.Title>
              <div className='mt-2'>
                <p className='text-sm text-gray-500'>
                  Are you sure you want to delete this Area of Interest?
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse'>
          <button
            type='button'
            className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
            onClick={handleDelete}
          >
            {isLoading && (
              <div className='flex items-center justify-center'>
                <div className='inline-block w-5 h-5 mr-2 text-white border-4 rounded-full spinner-border animate-spin' role='status'>
                  <span className='visually-hidden'>Deleting...</span>
                </div>
                Deleting...
              </div>
            )}
            {!isLoading && 'Delete'}
          </button>
          <button
            type='button'
            className='inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            onClick={() => { hideModal() }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Transition.Child>
  )
}

DeleteModal.propTypes = {
  modalProperties: PropTypes.object,
  hideModal: PropTypes.func
}

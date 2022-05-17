import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'

import Link from '../Link'

export default function NoDataModal ({ hideModal, modalProperties }) {
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
              <div className=''>
                <p className='text-sm text-gray-500'>
                  The <Link to='https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9'>New York City 311 Dataset</Link> is experiencing issues loading new data after May 8, 2022. This app won't be much help to you until it is fixed.  Please check back again later.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Transition.Child>
  )
}

NoDataModal.propTypes = {
  modalProperties: PropTypes.object,
  hideModal: PropTypes.func
}

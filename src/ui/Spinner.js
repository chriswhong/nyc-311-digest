import React from 'react'
import PropTypes from 'prop-types'

const Spinner = ({ children }) => (
  <div className='flex flex-col justify-center items-center h-64'>
    <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600' role='status'>
      <span className='visually-hidden'>Loading...</span>
    </div>
    <div className='mt-2 text-sm text-gray-500'>{children}</div>
  </div>
)

Spinner.propTypes = {
  children: PropTypes.string
}

export default Spinner

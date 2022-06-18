import React from 'react'
import PropTypes from 'prop-types'

const Badge = ({ children }) => (
  <span style={{ fontSize: 11 }} className='inline-block px-1.5 py-0.5 font-semibold leading-none text-center text-gray-700 align-baseline bg-gray-200 rounded-full whitespace-nowrap'>{children}</span>
)

Badge.propTypes = {
  children: PropTypes.number
}

export default Badge

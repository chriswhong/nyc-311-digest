import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Link from './Link'

const buttonClassnames = 'px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-0 active:bg-indigo-800 transition duration-150 ease-in-out'

const GeometryTypeButtonTabs = ({ active }) => {
  return (
    <div className='flex items-center justify-center'>
      <div className='inline-flex shadow-md hover:shadow-lg focus:shadow-lg' role='group'>
        <Link
          to='/'
        >
          <button
            className={classNames(
              buttonClassnames,
              'rounded-l',
              {
                'bg-indigo-600': active !== 'aoi',
                'bg-indigo-800': active === 'aoi'
              }
            )}
          >
            User-defined Areas
          </button>
        </Link>
        <Link
          to='/community-districts'

        >
          <button
            className={classNames(
              buttonClassnames,
              'rounded-r',
              {
                'bg-indigo-600': active !== 'cd',
                'bg-indigo-800': active === 'cd'
              }
            )}
          >
            Community Districts
          </button>
        </Link>

      </div>
    </div>
  )
}

GeometryTypeButtonTabs.propTypes = {
  active: PropTypes.string
}

export default GeometryTypeButtonTabs

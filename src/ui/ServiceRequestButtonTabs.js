import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Badge from './Badge'

const ServiceRequestButtonTabs = ({ tabItems, onClick }) => {
  const tabs = tabItems.map(({ id, label, count, title, active }) => {
    return (
      <li key={id} className='flex-grow' onClick={() => { onClick(id) }} title={title}>
        <a
          href='#' className={classNames('inline-block w-full px-4 py-1 border-b-2 border-transparent rounded-t-lg  dark:hover:text-gray-300 flex items-center justify-center', {
            'text-blue-600 border-blue-600 active': active,
            'hover:text-gray-600 hover:border-gray-300': active
          })}
        ><span className='mr-1.5'>{label}</span> <Badge>{count}</Badge>
        </a>
      </li>
    )
  })

  return (
    <div className='mb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700'>
      <ul className='flex flex-wrap -mb-px'>
        {tabs}
      </ul>
    </div>
  )
}

ServiceRequestButtonTabs.propTypes = {
  tabItems: PropTypes.array,
  onClick: PropTypes.func
}

export default ServiceRequestButtonTabs

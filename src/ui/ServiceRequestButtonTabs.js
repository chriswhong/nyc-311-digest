import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ServiceRequestButtonTabs = ({ active }) => {
  const tabItems = [
    {
      id: 'new',
      label: 'New'
    },
    {
      id: 'closed',
      label: 'Closed'
    },
    {
      id: 'open',
      label: 'Open'
    }
  ]

  const tabs = tabItems.map(({ id, label }) => {
    return (
      <li key={id} className='flex-grow'>
        <a
          href='#' className={classNames('inline-block w-full px-4 py-1 border-b-2 border-transparent rounded-t-lg  dark:hover:text-gray-300', {
            'text-blue-600 border-blue-600 active': id === active,
            'hover:text-gray-600 hover:border-gray-300': id !== active
          })}
        >{label}
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
  active: PropTypes.string
}

export default ServiceRequestButtonTabs

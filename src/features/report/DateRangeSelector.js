import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import moment from 'moment'

import {
  CalendarIcon
} from '@heroicons/react/outline'

export const dateSelectionItems = [
  {
    value: 'yesterday',
    displayName: 'Yesterday',
    dateRange: [
      moment().subtract(1, 'd').startOf('day'),
      moment().startOf('day')
    ]
  },
  {
    value: 'last7days',
    displayName: 'Last 7 days',
    dateRange: [
      moment().subtract(7, 'd').startOf('day'),
      moment().startOf('day')
    ]
  },
  {
    value: 'last30days',
    displayName: 'Last 30 days',
    dateRange: [
      moment().subtract(30, 'd').startOf('day'),
      moment().startOf('day')
    ]
  }
]

export const DEFAULT_DATE_RANGE_SELECTION = dateSelectionItems[1]

const DateRangeSelector = ({
  selection,
  onChange
}) => {
  return (
    <Menu as='div' className='relative inline-block text-left mb-2 mt-1'>
      <div>
        <Menu.Button className='inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
          <CalendarIcon className='h-4 w-4 text-indigo-600 mr-2' /> {selection.displayName}
          <ChevronDownIcon className='-mr-1 ml-2 h-5 w-5' aria-hidden='true' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
          <div className='py-1'>
            {dateSelectionItems.map((item) => {
              return (
                <Menu.Item key={item.value}>
                  {({ active }) => {
                    const selected = selection.value === item.value
                    return (
                      <a
                        href='#'
                        className={classNames(
                          'block px-4 py-2 text-sm',
                          {
                            'bg-gray-100 text-gray-900': active && !selected,
                            'text-gray-700': !active && !selected,
                            'bg-indigo-600 text-white': selected
                          }
                        )}
                        onClick={() => { onChange(item) }}
                      >
                        {item.displayName}
                      </a>
                    )
                  }}
                </Menu.Item>
              )
            })}

          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

DateRangeSelector.propTypes = {
  selection: PropTypes.object,
  onChange: PropTypes.func
}

export default DateRangeSelector

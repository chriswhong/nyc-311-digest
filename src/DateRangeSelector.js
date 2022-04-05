import React, { useState, useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import moment from 'moment'

import {
  CalendarIcon
} from '@heroicons/react/outline'

const items = [
  {
    value: 'Yesterday',
    dateRange: [
      moment().subtract(1, 'd').startOf('day'),
      moment().startOf('day')
    ]
  },
  {
    value: 'Last 7 days',
    dateRange: [
      moment().subtract(7, 'd').startOf('day'),
      moment().startOf('day')
    ]
  },
  {
    value: 'Last 30 days',
    dateRange: [
      moment().subtract(30, 'd').startOf('day'),
      moment().startOf('day')
    ]
  }
]

export const DEFAULT_DATE_RANGE = items[1].dateRange

const DateRangeSelector = ({
  onChange
}) => {
  const [activeItem, setActiveItem] = useState(items[1])

  useEffect(() => {
    onChange(activeItem.dateRange)
  }, [activeItem])

  return (
    <Menu as='div' className='relative inline-block text-left mb-1 mt-1'>
      <div>
        <Menu.Button className='inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
          <CalendarIcon className='h-4 w-4 text-indigo-600 mr-2' /> {activeItem.value}
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
            {items.map((item) => {
              return (
                <Menu.Item key={item.value}>
                  {({ active }) => {
                    const selected = activeItem.value === item.value
                    return (
                      <a
                        href='#'
                        className={classNames(
                          active && !selected ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                          {
                            'bg-indigo-600 text-white': selected
                          }
                        )}
                        onClick={() => { setActiveItem(item) }}
                      >
                        {item.value}
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
  onChange: PropTypes.func
}

export default DateRangeSelector

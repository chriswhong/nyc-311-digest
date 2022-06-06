import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

export default function DropdownMenu ({
  menuItems,
  selectedValue,
  icon,
  alignRight,
  onChange,
  children
}) {
  let triggerItem = (
    <Menu.Button className='inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
      {children}
      <ChevronDownIcon className='w-5 h-5 ml-2 -mr-1' aria-hidden='true' />
    </Menu.Button>
  )

  if (icon) {
    triggerItem = (
      <Menu.Button className='inline-flex items-center justify-center w-full text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50'>
        {icon}
      </Menu.Button>
    )
  }

  return (
    <Menu as='div' className='relative inline-block text-left '>
      <div>
        {triggerItem}
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
        <Menu.Items className={classNames('absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10', {
          'origin-top-left  left-0 ': !alignRight,
          'origin-top-right  right-0 ': alignRight
        })}
        >
          <div className='py-1'>
            {menuItems.map((item) => {
              return (
                <Menu.Item key={item.value}>
                  {({ active }) => {
                    const selected = selectedValue === item.value
                    return (
                      <div
                        className={classNames(
                          'block px-4 py-2 text-sm hover:cursor-pointer',
                          {
                            'bg-gray-100 text-gray-900': active && !selected,
                            'text-gray-700': !active && !selected,
                            'bg-indigo-600 text-white': selected
                          }
                        )}
                        onClick={() => { onChange(item) }}
                      >
                        {item.displayName}
                      </div>
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

DropdownMenu.propTypes = {
  menuItems: PropTypes.array,
  selectedValue: PropTypes.string,
  icon: PropTypes.element,
  alignRight: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.array
}

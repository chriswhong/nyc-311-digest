import React, { Fragment, useContext } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useLocation } from 'react-router-dom'

import Button from './Button'
import { AuthContext } from './App'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const UserMenu = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useContext(AuthContext)
  const location = useLocation()

  if (isLoading) {
    // spinner from https://flowbite.com/docs/components/spinner/
    return (
      <div className='ml-4 spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full text-indigo-600' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    )
  }

  return (
    <>
      {
      !isAuthenticated && (
        <div className='hidden md:flex items-center justify-end md:flex-1 ml-8 cursor-pointer'>
          <a
            onClick={() => loginWithRedirect({
              appState: {
                returnTo: location.pathname
              }
            })} className='whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900'
          >
            Sign in
          </a>
          <Button
            className='ml-6'
            onClick={() => loginWithRedirect({
              appState: {
                returnTo: location.pathname
              },
              screen_hint: 'signup'
            })}
          >
            Sign up
          </Button>
        </div>
      )
    }
      {
    isAuthenticated && (
      <Menu as='div' className='relative inline-block text-left ml-4'>
        <div className='flex items-center'>
          <Menu.Button className='inline-flex justify-center h-10 w-10'>
            <img className='rounded-full border-transparent border-4 hover:border-gray-400 transition-all duration-100' src={user.picture} alt={user.name} referrerPolicy='no-referrer' />
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
          <Menu.Items className='origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10'>
            <div className='py-1'>
              <Menu.Item>
                <div className='flex items-center px-4 py-2 text-sm'>
                  <div className='h-8 w-8 flex-shrink-0 mr-2'>
                    <img className='rounded-full' src={user.picture} alt={user.name} referrerPolicy='no-referrer' />
                  </div>
                  <div className='flex-grow'>
                    <p className='font-medium'>{user.username}</p>
                    <p className='font-light text-gray-500 text-xs'>{user.email}</p>
                  </div>
                </div>
              </Menu.Item>
            </div>
            <div className='py-1'>
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm cursor-pointer'
                    )}
                    onClick={() => logout({ returnTo: window.location.origin })}
                  >
                    Log Out
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    )
    }
    </>
  )
}

export default UserMenu

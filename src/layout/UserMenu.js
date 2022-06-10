import React, { Fragment, useContext } from 'react'
import { Menu, Transition } from '@headlessui/react'

import Button from '../ui/Button'
import { AuthContext } from '../app/AppContainer'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const UserMenu = () => {
  const authItems = useContext(AuthContext)

  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = authItems

  if (isLoading) {
    // spinner from https://flowbite.com/docs/components/spinner/
    return (
      <div className='inline-block w-6 h-6 ml-4 text-indigo-600 border-4 rounded-full spinner-border animate-spin' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    )
  }

  const handleLogin = () => {
    const { pathname, search, hash } = window.location
    loginWithRedirect({
      appState: {
        returnTo: `${pathname}${search}${hash}`
      }
    })
  }

  const handleSignup = () => {
    const { pathname, search, hash } = window.location
    loginWithRedirect({
      appState: {
        returnTo: `${pathname}${search}${hash}`
      },
      screen_hint: 'signup'
    })
  }

  const handleLogout = () => {
    const { origin, pathname, search, hash } = window.location
    logout({
      returnTo: `${origin}${pathname}${search}${hash}`
    })
  }

  return (
    <>
      {
      !isAuthenticated && (
        <div className='items-center justify-end hidden ml-8 cursor-pointer md:flex md:flex-1'>
          <a
            onClick={handleLogin} className='text-base font-medium text-gray-500 whitespace-nowrap hover:text-gray-900'
          >
            Sign in
          </a>
          <Button
            className='ml-6'
            onClick={handleSignup}
          >
            Sign up
          </Button>
        </div>
      )
    }
      {
    isAuthenticated && (
      <Menu as='div' className='relative inline-block ml-4 text-left'>
        <div className='flex items-center'>
          <Menu.Button className='inline-flex justify-center w-10 h-10'>
            <img className='transition-all duration-100 border-4 border-transparent rounded-full hover:border-gray-400' src={user.picture} alt={user.name} referrerPolicy='no-referrer' />
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
          <Menu.Items className='absolute right-0 z-10 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='py-1'>
              <Menu.Item>
                <div className='flex items-center px-4 py-2 text-sm'>
                  <div className='flex-shrink-0 w-8 h-8 mr-2'>
                    <img className='rounded-full' src={user.picture} alt={user.name} referrerPolicy='no-referrer' />
                  </div>
                  <div className='flex-grow'>
                    <p className='font-medium'>{user.username}</p>
                    <p className='text-xs font-light text-gray-500'>{user.email}</p>
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
                    onClick={handleLogout}
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

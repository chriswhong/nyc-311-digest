// based on https://tailwindui.com/components/marketing/elements/headers
import React, { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  MenuIcon,
  XIcon,
  TicketIcon,
  PlusIcon
} from '@heroicons/react/outline'
import { useNavigate, useLocation } from 'react-router-dom'

import Link from '../ui/Link'
import GithubIcon from '../img/GithubIcon'
import UserMenu from './UserMenu'
import Button from '../ui/Button'

export default function Header () {
  const history = useNavigate()
  const location = useLocation()

  const handleAddClick = () => {
    history('/new')
  }
  return (
    <Popover className='relative bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='flex justify-between items-center border-b-2 border-gray-100 py-3 md:justify-start md:space-x-10'>
          <div className='flex justify-start lg:w-0 lg:flex-1'>
            <a className='flex items-center cursor-pointer' onClick={() => { history('/') }}>
              <TicketIcon className='h-8 w-8 text-indigo-600 inline' aria-hidden='true' />
              <div className='font-semibold ml-3' style={{ fontSize: 17 }}>NYC 311 Reports</div>
              <div className='text-xs font-semibold h-4 text-white bg-blue-400 px-1 rounded flex items-center ml-2'><div>BETA</div></div>
            </a>
          </div>
          <div className='-mr-2 -my-2 md:hidden'>
            <Popover.Button className='bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
              <span className='sr-only'>Open menu</span>
              <MenuIcon className='h-6 w-6' aria-hidden='true' />
            </Popover.Button>
          </div>
          <Popover.Group as='nav' className='hidden md:flex space-x-10' />
          <div className='hidden md:flex items-center justify-end md:flex-1 lg:w-0'>
            <Link className='text-base font-medium text-gray-500 hover:text-gray-900' to='https://github.com/chriswhong/nyc-311-digest/blob/master/README.md#why'>
              About
            </Link>
            <Link to='https://github.com/chriswhong/nyc-311-digest'>
              <GithubIcon />
            </Link>
            {location.pathname !== '/new' && (
              <Button
                className='ml-6'
                icon={PlusIcon}
                onClick={handleAddClick}
              >
                New Area of Interest
              </Button>
            )}
            <UserMenu />
          </div>

        </div>
      </div>

      <Transition
        as={Fragment}
        enter='duration-200 ease-out'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='duration-100 ease-in'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
      >
        <Popover.Panel focus className='absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden'>
          <div className='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50'>
            <div className='pt-5 pb-6 px-5'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <TicketIcon className='h-8 w-8 text-indigo-600' aria-hidden='true' />
                  <div className='font-semibold ml-3' style={{ fontSize: 17 }}>NYC 311 Reports</div>
                </div>
                <div className='-mr-2'>
                  <Popover.Button className='bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Close menu</span>
                    <XIcon className='h-6 w-6' aria-hidden='true' />
                  </Popover.Button>
                </div>
              </div>
              <div className='mt-6'>
                <nav className='grid gap-y-8'>
                  <Link to='https://github.com/chriswhong/nyc-311-digest/blob/master/README.md#why' className='flex text-base font-medium text-gray-500 hover:text-gray-900'>
                    About
                  </Link>
                  <Link to='https://github.com/chriswhong/nyc-311-digest' className='flex text-base font-medium text-gray-500 hover:text-gray-900'>
                    Github
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

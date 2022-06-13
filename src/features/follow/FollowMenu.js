import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  EyeIcon
} from '@heroicons/react/outline'

import DropdownMenu from '../../ui/DropdownMenu'
import { useGetAoiQuery, useToggleFollowAoiMutation } from '../../util/rtk-api'

export default function FollowMenu ({
  areaOfInterest,
  user
}) {
  const { _id } = areaOfInterest.properties
  const followers = areaOfInterest.properties.followers?.weekly

  let userIsFollower = false
  if (user) {
    userIsFollower = followers?.includes(user.sub)
  }

  const [toggleFollow, { data, error, isLoading }] = useToggleFollowAoiMutation()
  const { refetch } = useGetAoiQuery(_id)

  console.log('data', data)

  const handleToggleFollow = () => {
    toggleFollow({
      _id,
      sub: user?.sub
    })
  }

  // refetch the aoi when toggle-follow is successful
  useEffect(() => {
    if (data) {
      refetch()
    }
  }, [data])

  const menuItems = [
    {
      value: 'followingweekly',
      displayName: 'Following - Weekly',
      description: 'Receive a weekly email report about this area of interest',
      onClick: handleToggleFollow
    },
    {
      value: 'notfollowing',
      displayName: 'Not Following',
      description: 'Never receive notifications about this area of interest',
      onClick: handleToggleFollow
    }
  ]

  const Badge = ({ children }) => (
    <span style={{ fontSize: 11 }} className='inline-block px-1.5 py-0.5 font-semibold leading-none text-center text-gray-700 align-baseline bg-gray-200 rounded-full whitespace-nowrap'>{children}</span>
  )

  Badge.propTypes = {
    children: PropTypes.number
  }

  const selectedValue = userIsFollower ? 'followingweekly' : 'notfollowing'
  let displayValue = 'Follow'

  if (userIsFollower) {
    displayValue = 'Following'
  }
  return (
    <DropdownMenu
      menuItems={menuItems}
      selectedValue={selectedValue}
      alignRight
      buttonClassNames='inline-flex items-center justify-center w-full px-2 py-0.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none '
      onChange={(item) => {
        item.onClick()
      }}
    >
      <EyeIcon className='w-4 h-4 mr-1' aria-hidden='true' />
      <span className='mr-1.5 text-xs'>{displayValue}</span>
      <Badge>{followers?.length || 0}</Badge>
    </DropdownMenu>
  )
}

FollowMenu.propTypes = {
  areaOfInterest: PropTypes.object,
  user: PropTypes.object
}

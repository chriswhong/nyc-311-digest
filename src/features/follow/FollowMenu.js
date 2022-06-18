import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  EyeIcon
} from '@heroicons/react/outline'

import DropdownMenu from '../../ui/DropdownMenu'
import { useToggleFollowAoiMutation } from '../../util/rtk-api'
import Badge from '../../ui/Badge'

const Spinner = () => (
  <div className='flex flex-col items-center justify-center h-4'>
    <div className='inline-block w-4 h-4 text-gray-600 rounded-full border-0.5 spinner-border animate-spin' role='status'>
      <span className='visually-hidden'>Loading...</span>
    </div>
  </div>
)

export default function FollowMenu ({
  areaOfInterest,
  user,
  onRefetch
}) {
  const { _id, type } = areaOfInterest.properties
  const followers = areaOfInterest.properties.followers?.weekly

  let userIsFollower = false
  if (user) {
    userIsFollower = followers?.includes(user.sub)
  }

  const [toggleFollow, { data, isLoading }] = useToggleFollowAoiMutation()

  const handleToggleFollow = () => {
    toggleFollow({
      type,
      id: _id,
      sub: user?.sub
    })
  }

  // refetch the aoi when toggle-follow is successful
  useEffect(() => {
    if (data) {
      onRefetch()
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
      {isLoading && <Spinner />}
      {!isLoading && <Badge>{followers?.length || 0}</Badge>}
    </DropdownMenu>
  )
}

FollowMenu.propTypes = {
  areaOfInterest: PropTypes.object,
  user: PropTypes.object,
  onRefetch: PropTypes.func
}

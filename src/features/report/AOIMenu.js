import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import {
  DotsHorizontalIcon
} from '@heroicons/react/outline'

import DropdownMenu from '../../ui/DropdownMenu'
import { ModalContext } from '../../App'

export default function AOIMenu () {
  const modalProps = useContext(ModalContext)
  const { showModal } = modalProps
  const { areaOfInterestId } = useParams()

  const handleEdit = () => {

  }

  const handleDelete = () => {
    showModal('DeleteModal', {
      id: areaOfInterestId
    })
  }

  const menuItems = [
    {
      value: 'edit',
      displayName: 'Edit',
      onClick: handleEdit
    },
    {
      value: 'delete',
      displayName: 'Delete',
      onClick: handleDelete
    }
  ]

  return (
    <DropdownMenu
      icon={
        <DotsHorizontalIcon className='h-6 w-6' />
      }
      menuItems={menuItems}
      alignRight
      onChange={(item) => {
        item.onClick()
      }}
    />
  )
}

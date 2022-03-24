import React from 'react'
import PropTypes from 'prop-types'
import {
  ChevronLeftIcon
} from '@heroicons/react/outline'

import Link from './Link'
import PopupInfo from './PopupInfo'

const PopupSidebar = ({
  complaints,
  onClose
}) => {
  return (
    <div className='bg-white h-full w-full flex flex-col min-h-0'>

      <div className='mb-3'>
        <div className='mb-2'>
          <Link onClick={() => { onClose() }}>
            <div className='flex items-center'><ChevronLeftIcon className='h-5 mr-0.5 -ml-1 inline' /><div className='inline text-sm'>Back to Area Summary</div></div>
          </Link>
        </div>
        <div className='font-semibold text-lg'>Complaint Details</div>
      </div>
      <div className='overflow-y-scroll flex-grow'>
        {
          complaints.map((complaint) => {
            return <PopupInfo key={complaint.properties.unique_key} complaint={complaint} />
          })
        }
      </div>
    </div>
  )
}

PopupSidebar.propTypes = {
  complaints: PropTypes.array,
  onClose: PropTypes.func
}

export default PopupSidebar

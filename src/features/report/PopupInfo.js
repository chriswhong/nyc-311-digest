import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import CircleMarkerSvg from './CircleMarkerSvg'

const PopupInfo = ({ complaint }) => {
  const {
    complaint_type: complaintType,
    agency,
    created_date: createdDate,
    closed_date: closedDate,
    descriptor,
    incident_address: incidentAddress,
    resolution_action_updated_date: resolutionActionUpdatedDate,
    resolution_description: resolutionDescription,
    rollupCategory,
    status
  } = complaint.properties

  const timestampFormat = 'D MMM YYYY, h:mm a'

  const timeFromNow = moment.unix(createdDate).fromNow()
  const createdTimestampMoment = moment.unix(createdDate)
  const createdTimestamp = createdTimestampMoment.format(timestampFormat)
  const closedTimestampMoment = moment.unix(closedDate)
  const closedTimestamp = closedTimestampMoment.format(timestampFormat)
  const duration = moment.duration(createdTimestampMoment.diff(closedTimestampMoment), 'millisecond').humanize()
  const updatedTimestamp = moment.unix(resolutionActionUpdatedDate).format(timestampFormat)

  return (
    <div className='block px-3 py-1.5 rounded-lg max-w-sm mb-2 border'>
      <div className='flex flex-col'>
        <div className='flex items-center mb-0.5 border-b pb-1'>
          <div className='mr-2'>
            <CircleMarkerSvg rollupCategory={rollupCategory} status={status} />
          </div>
          <div className='flex flex-col'>
            <div className='text-gray-600 font-light' style={{ fontSize: 10 }}>{rollupCategory}</div>
            <div className='text-xs'>{incidentAddress || 'Address not specified'}</div>
          </div>
        </div>
        <div className='flex mt-1'>
          <div className='flex-grow text-left'>
            <div className='font-semibold text-sm'>{complaintType}</div>
            <div className='font-semibold' style={{ fontSize: 12, lineHeight: '14px' }}>{descriptor}</div>
          </div>
          <div className='flex-grow text-right pl-2'>
            <div className='font-light' style={{ fontSize: 10 }}>{status}</div>
            <div className='font-medium' style={{ fontSize: 10 }}>{agency}</div>
          </div>
        </div>
      </div>
      <div className='pt-2 text-left'>
        <div className='font-light' style={{ fontSize: 10, lineHeight: '14px' }}>Opened {timeFromNow} ({createdTimestamp})</div>
        {status === 'Closed' && <div className='font-light' style={{ fontSize: 10, lineHeight: '14px' }}>Closed {closedTimestamp} ({duration} later)</div>}
        <div className='font-normal mt-2' style={{ fontSize: 10, lineHeight: '12px' }}>{resolutionDescription} (updated {updatedTimestamp})</div>
      </div>
    </div>
  )
}

PopupInfo.propTypes = {
  complaint: PropTypes.object
}

export default PopupInfo

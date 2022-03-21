import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

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
    <div style={{ width: 240 }} className='py-2 px-3'>
      <div className='flex border-b pb-1'>
        <div className='flex-grow text-left'>
          <div className='font-semibold text-sm'>{complaintType}</div>
          <div className='font-light' style={{ fontSize: 10, lineHeight: '14px' }}>{descriptor}</div>
        </div>
        <div className='flex-grow text-right pl-2'>
          <div className='font-light' style={{ fontSize: 10 }}>{status}</div>
          <div className='font-medium' style={{ fontSize: 10 }}>{agency}</div>
        </div>
      </div>
      <div className='pt-2 text-left'>
        <div className='text-sm mb-0.5'>{incidentAddress}</div>
        <div className='font-light' style={{ fontSize: 10, lineHeight: '14px' }}>Opened {timeFromNow} ({createdTimestamp})</div>
        {status === 'Closed' && <div className='font-light' style={{ fontSize: 10, lineHeight: '14px' }}>Closed {closedTimestamp} ({duration})</div>}
        <div className='font-normal mt-2' style={{ fontSize: 10, lineHeight: '12px' }}>{resolutionDescription} (updated {updatedTimestamp})</div>
      </div>
    </div>
  )
}

PopupInfo.propTypes = {
  complaint: PropTypes.object
}

export default PopupInfo

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  CalendarIcon
} from '@heroicons/react/outline'

import DropdownMenu from '../../ui/DropdownMenu'

export const dateSelectionItems = [
  {
    value: 'yesterday',
    displayName: 'Yesterday',
    dateRange: [
      moment().subtract(1, 'd').startOf('day'),
      moment().startOf('day')
    ]
  },
  {
    value: 'last7days',
    displayName: 'Last 7 days',
    dateRange: [
      moment().subtract(7, 'd').startOf('day'),
      moment().startOf('day')
    ]
  },
  {
    value: 'last30days',
    displayName: 'Last 30 days',
    dateRange: [
      moment().subtract(30, 'd').startOf('day'),
      moment().startOf('day')
    ]
  }
]

export const DEFAULT_DATE_RANGE_SELECTION = dateSelectionItems[1]

const DateRangeSelector = ({
  selection,
  onChange
}) => {
  return (
    <DropdownMenu
      menuItems={dateSelectionItems}
      selectedValue={selection.value}
      onChange={onChange}
    >
      <CalendarIcon className='h-4 w-4 text-indigo-600 mr-2' />
      {selection.displayName}
    </DropdownMenu>
  )
}

DateRangeSelector.propTypes = {
  selection: PropTypes.object,
  onChange: PropTypes.func
}

export default DateRangeSelector

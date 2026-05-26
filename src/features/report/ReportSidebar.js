import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import {
  ExternalLinkIcon,
  ChevronLeftIcon,
  UserCircleIcon
} from '@heroicons/react/outline'

import RollupChartContainer from './RollupChartContainer'
import Link from '../../ui/Link'
import PopupSidebar from './PopupSidebar'
import Spinner from '../../ui/Spinner'
import DateRangeSelector from './DateRangeSelector'
import { ThreeOneOneDataContext } from './ThreeOneOneDataHandler'
import AOIMenu from '../aoi/AOIMenu'
import SidebarContainer from '../../layout/SidebarContainer'
import FollowMenu from '../follow/FollowMenu'
import { AuthContext } from '../../app/AppContainer'
import ServiceRequestButtonTabs from '../../ui/ServiceRequestButtonTabs'

const ReportSidebar = ({
  areaOfInterest,
  backText,
  backLink,
  isOwner,
  isAdmin,
  areaTitle,
  onRefetch
}) => {
  const {
    serviceRequests,
    groupCounts,
    dateSelection,
    handleDateSelectionChange,
    popupData,
    setPopupData,
    activeGroup,
    handleActiveGroupChange,
    isLoading
  } = useContext(ThreeOneOneDataContext)
  const navigate = useNavigate()

  const [showCustomInputs, setShowCustomInputs] = useState(dateSelection.value === 'custom')
  const [customFrom, setCustomFrom] = useState(
    dateSelection.dateRange?.[0].format('YYYY-MM-DD') ?? moment().subtract(7, 'd').format('YYYY-MM-DD')
  )
  const [customTo, setCustomTo] = useState(
    dateSelection.dateRange?.[1].format('YYYY-MM-DD') ?? moment().format('YYYY-MM-DD')
  )
  const [customRangeError, setCustomRangeError] = useState(null)

  const handleBackClick = () => {
    navigate(backLink)
  }

  const handleDropdownChange = (d) => {
    if (d.value === 'custom') {
      setShowCustomInputs(true)
    } else {
      setShowCustomInputs(false)
      setCustomRangeError(null)
      handleDateSelectionChange(d)
    }
  }

  const handleApplyCustomRange = () => {
    const from = moment(customFrom).startOf('day')
    const to = moment(customTo).endOf('day')
    if (to.diff(from, 'days') > 30) {
      setCustomRangeError('Date range cannot exceed 30 days.')
      return
    }
    if (to.isBefore(from)) {
      setCustomRangeError('End date must be after start date.')
      return
    }
    setCustomRangeError(null)
    handleDateSelectionChange({
      value: 'custom',
      displayName: 'Custom range',
      dateRange: [from, to]
    })
  }

  const dateFrom = dateSelection.dateRange?.[0].format('DD MMM YYYY')
  const dateTo = dateSelection.dateRange?.[1].format('DD MMM YYYY')

  const { user } = useContext(AuthContext)

  const serviceRequestTabItems = [
    {
      id: 'new',
      label: 'New',
      count: groupCounts.new,
      title: 'all requests created during this time period',
      active: activeGroup === 'new'
    },
    {
      id: 'closed',
      label: 'Closed',
      count: groupCounts.closed,
      title: 'new and existing requests which were closed during this time period',
      active: activeGroup === 'closed'
    }
  ]

  let content = (
    <>
      <div className='px-4'>
        <div className='flex items-center mb-1 mt-0.5'>
          <div className='flex-grow'>
            <Link onClick={handleBackClick}>
              <div className='flex items-center'>
                <ChevronLeftIcon className='h-5 mr-0.5 -ml-1 inline' />
                <div className='inline text-sm'>{backText}</div>
              </div>
            </Link>
          </div>
          <div className='mr-2'>
            <FollowMenu areaOfInterest={areaOfInterest} user={user} onRefetch={onRefetch} />
          </div>
          {(isOwner || isAdmin) && <AOIMenu ownerId={areaOfInterest.properties.owner?.sub} />}
        </div>
        <div className='mb-3'>
          <div className='text-2xl font-semibold '>{areaTitle}</div>
          {
          areaOfInterest.properties.owner && (
            <div className='flex items-center justify-start text-gray-600'>
              <span className='text-xs font-light'>by</span> <UserCircleIcon className='h-4 w-4 ml-1 mr-0.5' />
              <div className='text-xs'>{areaOfInterest.properties.owner?.username || 'Anonymous'}</div>
            </div>
          )
        }
        </div>
        <div className='flex items-center justify-between mb-2'>
          <DateRangeSelector selection={dateSelection} onChange={handleDropdownChange} />
          {!showCustomInputs && dateFrom && dateTo && (
            <div className='mt-1 text-xs font-medium'>{dateFrom} - {dateTo}</div>
          )}
        </div>
        {showCustomInputs && (
          <div className='mb-2 space-y-1'>
            <div className='flex items-center gap-2'>
              <input
                type='date'
                value={customFrom}
                max={customTo}
                onChange={(e) => { setCustomFrom(e.target.value); setCustomRangeError(null) }}
                className='flex-1 text-xs border border-gray-300 rounded px-2 py-1'
              />
              <span className='text-xs text-gray-400'>to</span>
              <input
                type='date'
                value={customTo}
                min={customFrom}
                onChange={(e) => { setCustomTo(e.target.value); setCustomRangeError(null) }}
                className='flex-1 text-xs border border-gray-300 rounded px-2 py-1'
              />
            </div>
            {customRangeError && (
              <div className='text-xs text-red-500'>{customRangeError}</div>
            )}
            <button
              onClick={handleApplyCustomRange}
              className='w-full px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700'
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <ServiceRequestButtonTabs tabItems={serviceRequestTabItems} onClick={handleActiveGroupChange} />
      <div className='flex-grow px-4 overflow-y-scroll'>

        {!isLoading && (
          <>
            <RollupChartContainer key={activeGroup} data={serviceRequests?.features} activeGroup={activeGroup} />
            <div className='mb-3 text-xs'>
              Hover over the markers for more info, <span className='italic'>click for full details</span>.
              <Link to='https://github.com/chriswhong/nyc-311-digest/blob/master/src/util/categoryColors.js'>

                <div className='flex items-center mb-2 text-xs'>
                  About these Categories
                  <ExternalLinkIcon className='w-3 h-3 ml-1.5' />
                </div>
              </Link>
            </div>
          </>
        )}

        {isLoading && (
          <Spinner>Loading 311 data...</Spinner>
        )}
      </div>
    </>
  )

  if (popupData) {
    content = (
      <PopupSidebar complaints={popupData} onClose={() => { setPopupData(null) }} />
    )
  }

  return (
    <>
      {areaOfInterest && (
        <SidebarContainer>
          {content}
        </SidebarContainer>
      )}
    </>
  )
}

ReportSidebar.propTypes = {
  areaOfInterest: PropTypes.object,
  backText: PropTypes.string,
  backLink: PropTypes.string,
  isOwner: PropTypes.bool,
  isAdmin: PropTypes.bool,
  areaTitle: PropTypes.string,
  onRefetch: PropTypes.func
}

export default ReportSidebar

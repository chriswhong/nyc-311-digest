import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
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

  const handleBackClick = () => {
    navigate(backLink)
  }
  const dateFrom = dateSelection.dateRange[0].format('DD MMM YYYY')
  const dateTo = dateSelection.dateRange[1].format('DD MMM YYYY')

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
          <DateRangeSelector selection={dateSelection} onChange={handleDateSelectionChange} />
          <div className='mt-1 text-xs font-medium'>{dateFrom} - {dateTo}</div>
        </div>
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

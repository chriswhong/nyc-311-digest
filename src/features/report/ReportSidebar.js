import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeftIcon,
  UserCircleIcon,
  ExternalLinkIcon
} from '@heroicons/react/outline'

import RollupChart from './RollupChart'
import Link from '../../ui/Link'
import PopupSidebar from './PopupSidebar'
import Spinner from '../../ui/Spinner'
import DateRangeSelector from './DateRangeSelector'
import { ThreeOneOneDataContext } from './ThreeOneOneDataHandler'
import AOIMenu from '../aoi/AOIMenu'
import SidebarContainer from '../../layout/SidebarContainer'

const ReportSidebar = ({ areaOfInterest, backText, backLink, isOwner, isAdmin, areaTitle }) => {
  const {
    serviceRequestsFC,
    dateSelection,
    handleDateSelectionChange,
    popupData,
    setPopupData
  } = useContext(ThreeOneOneDataContext)
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(backLink)
  }
  const dateFrom = dateSelection.dateRange[0].format('DD MMM YYYY')
  const dateTo = dateSelection.dateRange[1].format('DD MMM YYYY')

  let content = (
    <>
      <div className='px-4 mb-3'>
        <div className='flex items-center mb-1'>
          <div className='flex-grow'>
            <Link onClick={handleBackClick}>
              <div className='flex items-center'><ChevronLeftIcon className='h-5 mr-0.5 -ml-1 inline' /><div className='inline text-sm'>{backText}</div></div>
            </Link>
          </div>
          {(isOwner || isAdmin) && <AOIMenu ownerId={areaOfInterest.properties.owner?.sub} />}
        </div>
        <div className='mb-1 text-2xl font-semibold'>{areaTitle}</div>
        {
          areaOfInterest.properties.owner && (
            <div className='flex items-center justify-end text-gray-600'>
              <span className='text-xs font-light'>by</span> <UserCircleIcon className='h-4 w-4 ml-1 mr-0.5' />
              <div className='text-sm'>{areaOfInterest.properties.owner?.username || 'Anonymous'}</div>
            </div>
          )
        }
      </div>
      <div className='flex-grow px-4 overflow-y-scroll'>
        <div className='mb-2'>
          <DateRangeSelector selection={dateSelection} onChange={handleDateSelectionChange} />
          <div className='text-xs'>From {dateFrom} to {dateTo}</div>
        </div>
        {serviceRequestsFC?.features.length && (
          <>

            <div className='flex items-center'>
              <div className='mr-2 text-2xl font-bold'>
                {serviceRequestsFC.features.length}
              </div>
              <div className='text-lg'>
                New Service Requests
              </div>
            </div>
            <Link to='https://github.com/chriswhong/nyc-311-digest/blob/master/src/util/categoryColors.js'>
              <div className='flex items-center mb-2 text-xs'>
                About these Categories
                <ExternalLinkIcon className='w-3 h-3 ml-1.5' />
              </div>
            </Link>
            <div className='h-64 mb-3'>
              <RollupChart data={serviceRequestsFC.features} />
            </div>
            <div className='mb-3 text-xs'>Hover over the markers for more info, <span className='italic'>click for full details</span>.</div>
          </>
        )}

        {!serviceRequestsFC?.features.length && (
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
  areaTitle: PropTypes.string
}

export default ReportSidebar

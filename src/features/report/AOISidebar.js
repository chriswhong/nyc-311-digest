import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeftIcon,
  UserCircleIcon,
  ExternalLinkIcon
} from '@heroicons/react/outline'

// eslint-disable-next-line
import mapboxgl from '!mapbox-gl'

import ReactGA from 'react-ga4'

import RollupChart from './RollupChart'
import Link from '../../ui/Link'
import PopupSidebar from './PopupSidebar'
import Spinner from '../../ui/Spinner'
import DateRangeSelector from './DateRangeSelector'

import AOIMenu from './AOIMenu'
import { useAuth } from '../../util/auth'
import Head from '../../layout/Head'

const AOISidebar = ({
  map,
  areaOfInterest,
  dateSelection,
  onDateRangeChange,
  serviceRequests,
  popupData,
  setPopupData
}) => {
  const navigate = useNavigate()

  const { user } = useAuth()

  const { pathname } = useLocation()

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GA4_TRACKING_ID)
    ReactGA.send({ hitType: 'pageview', page: pathname })
  }, [])

  const handleBackClick = () => {
    navigate('/')
  }

  if (popupData) {
    return (
      <PopupSidebar complaints={popupData} onClose={() => { setPopupData(null) }} />
    )
  }

  const dateFrom = dateSelection.dateRange[0].format('DD MMM YYYY')
  const dateTo = dateSelection.dateRange[1].format('DD MMM YYYY')

  const isOwner = user?.sub === areaOfInterest?.properties.owner.sub
  const isAdmin = user && user['http://demozero.net/roles'].includes('Admin')

  return (
    <>
      {areaOfInterest && (
        <>
          <Head
            title={areaOfInterest.properties.name}
            description={`A report of 311 activity in the area ${areaOfInterest.properties.name}`}
          />
          <div className='px-4 mb-3'>
            <div className='flex items-center mb-1'>
              <div className='flex-grow'>
                <Link onClick={handleBackClick}>
                  <div className='flex items-center'><ChevronLeftIcon className='h-5 mr-0.5 -ml-1 inline' /><div className='inline text-sm'>City View</div></div>
                </Link>
              </div>
              {(isOwner || isAdmin) && <AOIMenu ownerId={areaOfInterest.properties.owner.sub} />}
            </div>
            <div className='mb-1 text-3xl font-semibold'>{areaOfInterest.properties.name}</div>
            <div className='flex items-center justify-end text-gray-600'>
              <span className='text-xs font-light'>by</span> <UserCircleIcon className='h-4 w-4 ml-1 mr-0.5' />
              <div className='text-sm'>{areaOfInterest.properties.owner?.username || 'Anonymous'}</div>
            </div>
          </div>
          <div className='flex-grow px-4 overflow-y-scroll'>
            <div className='mb-2'>
              <DateRangeSelector selection={dateSelection} onChange={onDateRangeChange} />
              <div className='text-xs'>From {dateFrom} thru {dateTo}</div>
            </div>
            {serviceRequests && (
              <>

                <div className='flex items-center'>
                  <div className='mr-2 text-2xl font-bold'>
                    {serviceRequests.features.length}
                  </div>
                  <div className='text-lg'>
                    New Service Requests
                  </div>
                </div>
                <Link to='https://github.com/chriswhong/nyc-311-digest/blob/master/src/util/getRollupCategory.js'>
                  <div className='flex items-center mb-2 text-xs'>
                    About these Categories
                    <ExternalLinkIcon className='w-3 h-3 ml-1.5' />
                  </div>
                </Link>
                <div className='h-64 mb-3'>
                  <RollupChart data={serviceRequests.features} />
                </div>
                <div className='mb-3 text-xs'>Hover over the markers for more info, <span className='italic'>click for full details</span>.</div>
              </>
            )}

            {!serviceRequests && (
              <Spinner>Loading 311 data...</Spinner>
            )}
          </div>
        </>
      )}
    </>
  )
}

AOISidebar.propTypes = {
  map: PropTypes.object,
  areaOfInterest: PropTypes.object,
  dateSelection: PropTypes.object,
  onDateRangeChange: PropTypes.func,
  serviceRequests: PropTypes.object,
  popupData: PropTypes.object,
  setPopupData: PropTypes.func
}

export default AOISidebar

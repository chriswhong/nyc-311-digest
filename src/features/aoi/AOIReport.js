// this component should filter for the selected geometry, and pass it down to threeoneoneprovider

import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import { AuthContext } from '../../app/AppContainer'
import ReportSidebar from '../report/ReportSidebar'
import ReportMapElements from '../report/ReportMapElements'
import Head from '../../layout/Head'

import { useGetAoiQuery } from '../../util/rtk-api'

import ThreeOneOneDataHandler from '../report/ThreeOneOneDataHandler'

const AOIReport = ({ allGeometries }) => {
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  const { areaOfInterestId } = useParams()
  const { user } = useContext(AuthContext)

  const { data, error, isLoading } = useGetAoiQuery(areaOfInterestId)

  // useEffect(() => {
  //   if (allGeometries) {
  //     const areaOfInterest = allGeometries.features.find((d) => d.properties._id === areaOfInterestId)

  //     if (!areaOfInterest && !state?.refresh) {
  //       navigate('/404')
  //     } else {
  //       setAreaOfInterest(areaOfInterest)
  //     }
  //   }
  // }, [allGeometries])

  const isOwner = user?.sub === data?.properties.owner?.sub
  const isAdmin = user && user['http://demozero.net/roles'].includes('Admin')

  return (
    <>
      {data && (
        <>
          <Head
            title={data.properties.name}
            description={`A report of 311 activity in the area ${data.properties.name}`}
          />
          <ThreeOneOneDataHandler areaOfInterest={data}>
            <ReportSidebar
              areaOfInterest={data}
              backText='Citywide View'
              backLink='/'
              isOwner={isOwner} isAdmin={isAdmin}
              areaTitle={data.properties.name}
            />
            <ReportMapElements areaOfInterest={data} />
          </ThreeOneOneDataHandler>
        </>
      )}
    </>
  )
}

AOIReport.propTypes = {
  allGeometries: PropTypes.object
}

export default AOIReport

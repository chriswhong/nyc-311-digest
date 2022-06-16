// this component should filter for the selected geometry, and pass it down to threeoneoneprovider

import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'

import { AuthContext } from '../../app/AppContainer'
import ReportSidebar from '../report/ReportSidebar'
import ReportMapElements from '../report/ReportMapElements'
import Head from '../../layout/Head'

import { useGetAoiQuery } from '../../util/rtk-api'

import ThreeOneOneDataHandler from '../report/ThreeOneOneDataHandler'

const AOIReport = () => {
  const navigate = useNavigate()
  const { areaOfInterestId } = useParams()
  const { user } = useContext(AuthContext)

  const { data, error, isLoading, refetch } = useGetAoiQuery(areaOfInterestId)

  useEffect(() => {
    if (error?.status === 404) {
      navigate('/404')
    }
  }, [error])

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
              onRefetch={refetch}
            />
            <ReportMapElements areaOfInterest={data} />
          </ThreeOneOneDataHandler>
        </>
      )}
    </>
  )
}

export default AOIReport

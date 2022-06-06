// this component should filter for the selected geometry, and pass it down to threeoneoneprovider

import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import { AuthContext } from '../../AppContainer'
import ReportSidebar from '../report/ReportSidebar'
import ReportMapElements from '../report/ReportMapElements'
import Head from '../../layout/Head'

import ThreeOneOneDataHandler from '../report/ThreeOneOneDataHandler'

const AOIReport = ({ allGeometries }) => {
  const [areaOfInterest, setAreaOfInterest] = useState()
  const { state, pathname } = useLocation()
  const navigate = useNavigate()
  const { areaOfInterestId } = useParams()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (allGeometries) {
      const areaOfInterest = allGeometries.features.find((d) => d.properties._id === areaOfInterestId)

      if (!areaOfInterest && !state?.refresh) {
        navigate('/404')
      } else {
        setAreaOfInterest(areaOfInterest)
      }
    }
  }, [allGeometries])

  const isOwner = user?.sub === areaOfInterest?.properties.owner?.sub
  const isAdmin = user && user['http://demozero.net/roles'].includes('Admin')

  return (
    <>
      {areaOfInterest && (
        <>
          <Head
            title={areaOfInterest.properties.name}
            description={`A report of 311 activity in the area ${areaOfInterest.properties.name}`}
          />
          <ThreeOneOneDataHandler areaOfInterest={areaOfInterest}>
            <ReportSidebar
              areaOfInterest={areaOfInterest}
              backText='Citywide View'
              backLink='/'
              isOwner={isOwner} isAdmin={isAdmin}
              areaTitle={areaOfInterest.properties.name}
            />
            <ReportMapElements areaOfInterest={areaOfInterest} />
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

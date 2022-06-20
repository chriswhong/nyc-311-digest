import React from 'react'
import PropTypes from 'prop-types'

import AOIIndexMapElements from './AOIIndexMapElements'
import AOIIndexSidebar from './AOIIndexSidebar'
import Head from '../../layout/Head'
import { useGetAoisQuery } from '../../util/rtk-api'

const AOIIndex = ({ allGeometries }) => {
  const { data } = useGetAoisQuery()

  return (
    <>
      <Head
        title='Citywide Map'
        description='Browse user-created areas of interest for local 311 activity in New York City'
      />
      <AOIIndexSidebar />
      <AOIIndexMapElements allGeometries={data} />
    </>
  )
}

AOIIndex.propTypes = {
  allGeometries: PropTypes.object
}

export default AOIIndex

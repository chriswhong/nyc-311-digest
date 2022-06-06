import React from 'react'
import PropTypes from 'prop-types'

import AOIIndexMapElements from './AOIIndexMapElements'
import AOIIndexSidebar from './AOIIndexSidebar'
import Head from '../../layout/Head'

const AOIIndex = ({ allGeometries }) => {
  return (
    <>
      <Head
        title='Citywide Map'
        description='Browse user-created areas of interest for local 311 activity in New York City'
      />
      <AOIIndexSidebar />
      <AOIIndexMapElements allGeometries={allGeometries} />
    </>
  )
}

AOIIndex.propTypes = {
  allGeometries: PropTypes.object
}

export default AOIIndex

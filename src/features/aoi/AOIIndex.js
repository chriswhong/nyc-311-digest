import React from 'react'
import PropTypes from 'prop-types'

import AOIIndexMapElements from './AOIIndexMapElements'
import AOIIndexSidebar from './AOIIndexSidebar'

const AOIIndex = ({ map, allGeometries }) => {
  return (
    <>
      <AOIIndexSidebar map={map} />
      <AOIIndexMapElements map={map} allGeometries={allGeometries} />
    </>
  )
}

AOIIndex.propTypes = {
  map: PropTypes.object,
  allGeometries: PropTypes.object
}

export default AOIIndex

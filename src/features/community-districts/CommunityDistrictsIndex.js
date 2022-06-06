import React from 'react'
import PropTypes from 'prop-types'

import CommunityDistrictsIndexSidebar from './CommunityDistrictsIndexSidebar'
import CommunityDistrictsIndexMapElements from './CommunityDistrictsIndexMapElements'

const CommunityDistrictsIndex = ({ map, communityDistricts }) => {
  return (
    <>
      <CommunityDistrictsIndexSidebar map={map} />
      <CommunityDistrictsIndexMapElements map={map} communityDistricts={communityDistricts} />
    </>
  )
}

CommunityDistrictsIndex.propTypes = {
  map: PropTypes.object,
  communityDistricts: PropTypes.object
}

export default CommunityDistrictsIndex

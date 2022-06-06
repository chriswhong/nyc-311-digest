import React from 'react'
import PropTypes from 'prop-types'

import CommunityDistrictsIndexSidebar from './CommunityDistrictsIndexSidebar'
import CommunityDistrictsIndexMapElements from './CommunityDistrictsIndexMapElements'

import Head from '../../layout/Head'

const CommunityDistrictsIndex = ({ map, communityDistricts }) => {
  return (
    <>
      <Head
        title='Community Districts'
        description='Browse local 311 activity by Community District in New York City'
      />
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

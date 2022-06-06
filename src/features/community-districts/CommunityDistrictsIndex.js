import React from 'react'
import PropTypes from 'prop-types'

import CommunityDistrictsIndexSidebar from './CommunityDistrictsIndexSidebar'
import CommunityDistrictsIndexMapElements from './CommunityDistrictsIndexMapElements'

import Head from '../../layout/Head'

const CommunityDistrictsIndex = ({ communityDistricts }) => {
  return (
    <>
      <Head
        title='Community Districts'
        description='Browse local 311 activity by Community District in New York City'
      />
      <CommunityDistrictsIndexSidebar />
      <CommunityDistrictsIndexMapElements communityDistricts={communityDistricts} />
    </>
  )
}

CommunityDistrictsIndex.propTypes = {
  communityDistricts: PropTypes.object
}

export default CommunityDistrictsIndex

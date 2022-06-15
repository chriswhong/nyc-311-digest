import React from 'react'

import CommunityDistrictsIndexSidebar from './CommunityDistrictsIndexSidebar'
import CommunityDistrictsIndexMapElements from './CommunityDistrictsIndexMapElements'
import { useGetCommunityDistrictsQuery } from '../../util/rtk-api'

import Head from '../../layout/Head'

const CommunityDistrictsIndex = () => {
  const {
    data: communityDistricts,
    isLoading: communityDistrictsLoading,
    error: communityDistrictsError
  } = useGetCommunityDistrictsQuery()

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

export default CommunityDistrictsIndex

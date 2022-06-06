import React from 'react'
import PropTypes from 'prop-types'

import Spinner from '../../ui/Spinner'
import Head from '../../layout/Head'
import SidebarContainer from '../../layout/SidebarContainer'
import GeometryTypeButtonTabs from '../../ui/GeometryTypeButtonTabs'

const CommunityDistrictsIndexSidebar = ({ map, communityDistricts }) => {
  if (!map) {
    return <Spinner>Loading...</Spinner>
  }

  return (
    <SidebarContainer>
      <Head
        title='Citywide Map'
        description='Browse user-created areas of interest for local 311 activity in New York City'
      />
      <div className='px-4 text-sm'>
        <h3 className='mb-3 text-lg font-semibold'>Explore 311 Data for the Places You Care About</h3>
        <div className='mb-3'>
          <GeometryTypeButtonTabs active='cd' />
        </div>
        <p className='mb-3'>Click on a community district to see a report of recent 311 activity.</p>
      </div>
    </SidebarContainer>
  )
}

CommunityDistrictsIndexSidebar.propTypes = {
  map: PropTypes.object,
  communityDistricts: PropTypes.object
}

export default CommunityDistrictsIndexSidebar

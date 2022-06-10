import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import Spinner from '../../ui/Spinner'
import SidebarContainer from '../../layout/SidebarContainer'
import GeometryTypeButtonTabs from '../../ui/GeometryTypeButtonTabs'
import { MapContext } from '../../app/App'

const CommunityDistrictsIndexSidebar = ({ communityDistricts }) => {
  const map = useContext(MapContext)
  if (!map) {
    return <Spinner>Loading...</Spinner>
  }

  return (
    <SidebarContainer>
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
  communityDistricts: PropTypes.object
}

export default CommunityDistrictsIndexSidebar

import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import Spinner from '../../ui/Spinner'
import SidebarContainer from '../../layout/SidebarContainer'
import GeometryTypeButtonTabs from '../../ui/GeometryTypeButtonTabs'

const AOIIndexSidebar = ({ map }) => {
  const navigate = useNavigate()

  if (!map) {
    return <Spinner>Loading...</Spinner>
  }

  return (
    <SidebarContainer>
      <div className='px-4 text-sm'>
        <h3 className='mb-3 text-lg font-semibold'>Explore 311 Data for the Places You Care About</h3>
        <div className='mb-3'>
          <GeometryTypeButtonTabs active='aoi' />
        </div>
        <p className='mb-3'>This map shows custom <span className='italic'>areas of interest</span> created by users of this site to show localized 311 data.</p>
        <p className=''>Click any area of interest to see a report of recent 311 activity.  If your neighborhood isn't reflected here, <a onClick={() => { navigate('/new') }} className='mb-4 text-indigo-600 transition duration-300 ease-in-out cursor-pointer hover:text-indigo-700'>add it!</a></p>
      </div>
    </SidebarContainer>
  )
}

AOIIndexSidebar.propTypes = {
  map: PropTypes.object
}

export default AOIIndexSidebar

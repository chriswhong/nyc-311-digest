import React from 'react'
// import PropTypes from 'prop-types'

const MainSidebar = () => {
  return (
    <div className='absolute top-5 left-5 z-10 bg-white p-4 rounded-lg w-96 shadow-md text-sm'>
      <p className='mb-3'>This map shows custom polygons of interest created by users of this site to show localized 311 data.</p>
      <p className=''>Click any polygon to explore recent 311 activity along with older complaints that are still pending resolution.</p>

    </div>
  )
}

MainSidebar.propTypes = {

}

export default MainSidebar

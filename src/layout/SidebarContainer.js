import React from 'react'
import PropTypes from 'prop-types'

const SidebarContainer = ({ children }) => (
  <div className='top-0 left-0 z-10 flex flex-col w-full h-auto min-h-0 md:absolute md:w-96 md:max-h-full'>
    <div className='flex flex-col py-4 m-0 overflow-hidden bg-white md:m-5 md:rounded-lg md:shadow-md'>
      <div className='relative flex flex-col flex-grow h-full min-h-0'>
        {children}
      </div>
    </div>
  </div>
)

SidebarContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
}

export default SidebarContainer

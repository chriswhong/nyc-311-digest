import React from 'react'
import PropTypes from 'prop-types'
import {
  XCircleIcon
} from '@heroicons/react/outline'

import Button from '../../ui/Button'
import Head from '../../layout/Head'
import SidebarContainer from '../../layout/SidebarContainer'

const DrawSidebar = ({
  drawnFeature,
  drawIsValid,
  loading,
  drawnFeatureName,
  setDrawnFeatureName,
  onSave,
  setCleared
}) => {
  return (
    <SidebarContainer>
      <Head title='Add an Area of Interest' description='Draw a new Area of Interest on the map to create a localized 311 data report' />
      <div className='px-4'>
        <div className='mb-2 text-xl font-semibold'>Add an Area of Interest</div>
        <div className='mb-2 text-lg font-medium'> 1. Name it!</div>
        <input
          className='w-full px-3 py-2 mb-4 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          type='text'
          value={drawnFeatureName}
          placeholder='Enter a name'
          onChange={(d) => { setDrawnFeatureName(d.target.value) }}
        />
        <div className='mb-2 text-lg font-medium'>
          2. Draw it!
        </div>
        <div className='mb-4'>
          {
          !drawnFeature && <div className='mb-2 text-sm'>Click on the map to draw a polygon. Be sure to click the starting point to complete the drawing. </div>
        }
          {
          drawnFeature && (
            <div className='mb-2'>
              <button
                type='button' className='inline-block px-4 py-1.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out'
                onClick={() => { setCleared(true) }}
              ><XCircleIcon className='inline w-4 h-4 mr-1' />Clear
              </button>
            </div>
          )
        }
          <div className='mb-2 text-xs text-gray-600'>Tip: Many 311 requests are geocoded to the center of a street.  Polygons that end mid-block are optimal for capturing all activity on a given street.</div>
          <div className='flex items-center px-4 py-3 text-xs text-white bg-blue-500' role='alert'>
            <svg className='w-4 h-4 mr-2 fill-current' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z' /></svg>
            <p>This area of interest will appear publicly and will be associated with your username</p>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            disabled={!drawIsValid || loading}
            onClick={onSave}
          >
            {loading && (
              <div className='flex items-center justify-center'>
                <div className='inline-block w-5 h-5 mr-2 text-white border-4 rounded-full spinner-border animate-spin' role='status'>
                  <span className='visually-hidden'>Saving...</span>
                </div>
                Saving...
              </div>
            )}
            {!loading && (
              <>Save Area of Interest</>
            )}
          </Button>
        </div>
      </div>
    </SidebarContainer>

  )
}

DrawSidebar.propTypes = {
  drawnFeature: PropTypes.object,
  drawIsValid: PropTypes.bool,
  loading: PropTypes.bool,
  drawnFeatureName: PropTypes.string,
  setDrawnFeatureName: PropTypes.func,
  onSave: PropTypes.func,
  setCleared: PropTypes.func
}

export default DrawSidebar

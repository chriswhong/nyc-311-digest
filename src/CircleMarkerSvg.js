import React from 'react'
import PropTypes from 'prop-types'

import getColorFromRollupCategory from './util/getColorFromRollupCategory'

// generate an SVG circle that resembles the circlemarkers used on the map
const CircleMarkerSvg = ({ rollupCategory }) => {
  return (
    <svg height='14' width='14'>
      <circle cx='7' cy='7' r='5' stroke='black' strokeWidth='2' fill={getColorFromRollupCategory(rollupCategory)} />
    </svg>
  )
}

CircleMarkerSvg.propTypes = {
  rollupCategory: PropTypes.string
}

export default CircleMarkerSvg

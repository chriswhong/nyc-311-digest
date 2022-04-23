import React from 'react'
import PropTypes from 'prop-types'

import { getColorFromRollupCategory } from '../../util/categoryColors'
import { getStatusColor } from '../../util/statusColors.js'

// generate an SVG circle that resembles the circlemarkers used on the map
const CircleMarkerSvg = ({ rollupCategory, status, noFill }) => {
  return (
    <svg height='14' width='14'>
      <circle cx='7' cy='7' r='5' stroke={getStatusColor(status)} strokeWidth='2' fill={getColorFromRollupCategory(rollupCategory)} fillOpacity={noFill ? 0 : 1} />
    </svg>
  )
}

CircleMarkerSvg.propTypes = {
  rollupCategory: PropTypes.string,
  status: PropTypes.string,
  noFill: PropTypes.bool
}

export default CircleMarkerSvg

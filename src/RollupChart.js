import React from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, LabelList, Cell } from 'recharts'

import getColorFromRollupCategory from './util/getColorFromRollupCategory'

const RollupChart = ({ data }) => {
  // group and count
  let grouped = _.countBy(data, d => d.properties.rollupCategory)

  grouped = Object.keys(grouped).map((key) => {
    return {
      name: key,
      count: grouped[key]
    }
  })

  grouped = _.sortBy(grouped, 'count').reverse()

  return (
    <ResponsiveContainer>
      <BarChart
        data={grouped}
        layout='vertical'
        margin={{ left: 0, right: 20 }}
      >
        <YAxis type='category' width={150} dataKey='name' fontSize={11} interval={0} axisLine={false} dx={-5} tickLine={false} />
        <XAxis type='number' hide />
        <Bar dataKey='count' fill='#285A64' label='count'>
          {grouped.map((entry, index) => (
            <Cell key={index} fill={getColorFromRollupCategory(entry.name)} />
          ))}
          <LabelList dataKey='count' position='right' />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

RollupChart.propTypes = {
  data: PropTypes.array
}

export default RollupChart

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, LabelList, Cell } from 'recharts'

const getColor = (agency) => {
  switch (agency) {
    case 'DPR':
      return '#208a3e'
    case 'TLC':
      return '#edf50f'
    case 'NYPD':
      return '#3054f2'
    case 'DSNY':
      return '#002e02'
    case 'DEP':
      return '#6bf8ff'
    case 'DOHMH':
      return '#af25c4'
    case 'HPD':
      return '#de8921'
    default:
      return 'gray'
  }
}

const RollupChart = ({ data }) => {
  // group and count
  let grouped = _.countBy(data, d => d.properties.agency)

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
        <YAxis type='category' width={60} dataKey='name' fontSize={11} interval={0} axisLine={false} dx={-5} tickLine={false} />
        <XAxis type='number' hide />
        <Bar dataKey='count' fill='#285A64' label='count'>
          {grouped.map((entry, index) => (
            <Cell key={index} fill={getColor(entry.name)} />
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

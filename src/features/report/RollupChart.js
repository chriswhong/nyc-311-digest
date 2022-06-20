import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, LabelList, Cell, Text } from 'recharts'

import { getColorFromRollupCategory } from '../../util/categoryColors'

// custom Tick so we can add onClick and cursor-pointer
const YAxisTick = (props) => {
  return (
    <Text
      {...props} onClick={() => {
        if (props.topLevel) {
          props.onClick({
            name: props.payload.value
          })
        }
      }} className={classNames('recharts-cartesian-axis-tick-value', {
        'cursor-pointer': props.topLevel
      })}
    >
      {props.payload.value}
    </Text>
  )
}

YAxisTick.propTypes = {
  topLevel: PropTypes.bool,
  onClick: PropTypes.func,
  payload: PropTypes.object
}

const RollupChart = ({
  data,
  onBarClick,
  isAnimationActive = true,
  fillColor,
  topLevel = false
}) => {
  if (!data) {
    return null
  }

  return (
    <div className='h-64 mb-3'>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout='vertical'
          margin={{ left: 0, right: 30 }}
        >
          <YAxis
            type='category'
            width={150}
            dataKey='name'
            fontSize={11}
            interval={0}
            axisLine={false}
            dx={-5}
            tickLine={false}
            tick={<YAxisTick onClick={onBarClick} topLevel={topLevel} />}
          />
          <XAxis type='number' hide />
          <Bar
            className={classNames({
              'cursor-pointer': topLevel
            })}
            dataKey='count'
            fill='#285A64'
            label='count'
            isAnimationActive={isAnimationActive}
            onClick={(e) => {
              if (topLevel) {
                onBarClick(e)
              }
            }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={fillColor || getColorFromRollupCategory(entry.name)} />
            ))}
            <LabelList dataKey='count' position='right' />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

RollupChart.propTypes = {
  data: PropTypes.array,
  onBarClick: PropTypes.func,
  isAnimationActive: PropTypes.bool,
  fillColor: PropTypes.string,
  topLevel: PropTypes.bool
}

export default RollupChart

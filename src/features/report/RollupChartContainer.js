import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Transition } from '@headlessui/react'
import {
  CursorClickIcon,
  ChevronLeftIcon
} from '@heroicons/react/outline'

import RollupChart from './RollupChart'
import _ from 'underscore'
import { getColorFromRollupCategory } from '../../util/categoryColors'
import Link from '../../ui/Link'
import { ThreeOneOneDataContext } from './ThreeOneOneDataHandler'

export const groupByRollupCategory = (data) => {
  let grouped = _.countBy(data, d => d.properties.rollupCategory)

  grouped = Object.keys(grouped).map((key) => {
    return {
      name: key,
      count: grouped[key]
    }
  })

  grouped = _.sortBy(grouped, 'count').reverse()
  return grouped
}

const RollupChartContainer = ({ data, activeGroup }) => {
  const [topLevelData, setTopLevelData] = useState()
  const [subLevelData, setSubLevelData] = useState()
  // used to infer visible level for transitions (if null, top-level is active)
  const { categoryFilter, setCategoryFilter } = useContext(ThreeOneOneDataContext)

  // group the top-level data by rollupCategory
  useEffect(() => {
    if (!data) return
    // group and count
    const grouped = groupByRollupCategory(data)
    setTopLevelData(grouped)
  }, [data])

  // group the sub-level data by complaint_type
  useEffect(() => {
    if (categoryFilter) {
      let grouped = _.countBy(data, d => d.properties.complaint_type)

      grouped = Object.keys(grouped).map((key) => {
        return {
          name: key,
          count: grouped[key]
        }
      })

      grouped = _.sortBy(grouped, 'count').reverse()
      setSubLevelData(grouped)
    } else {
      setSubLevelData()
    }
  }, [categoryFilter])

  // on click, set the rollupCategory filter
  const handleBarClick = (e) => {
    const category = e.name
    setCategoryFilter(category)
  }

  // calculate the total number of requests for use in the header
  const subLevelDataLength = subLevelData?.reduce((acc, curr) => {
    return acc + curr.count
  }, 0)

  return (
    <div className='relative w-full' style={{ height: 310 }}>
      {/* top-level header and chart */}

      <Transition
        className='absolute w-full h-full '
        show={!categoryFilter}
        enter='transform duration-300 transition-all ease-in-out'
        enterFrom='-left-full'
        enterTo='left-0'
        leave='transform duration-300 transition-all ease-in-out'
        leaveFrom='left-0'
        leaveTo='-left-full'
      >
        <div className='flex items-center'>
          <div className='mr-1 text-lg font-bold'>
            {data?.length}
          </div>
          <div className='text-base'>
            {activeGroup === 'new' ? 'new' : 'closed'} Service Requests
          </div>
        </div>
        <div className='flex items-center mb-2 text-xs text-gray-600'>
          <CursorClickIcon className='h-4 mr-1' /> Click a category to filter the requests
        </div>

        <RollupChart data={topLevelData} onBarClick={handleBarClick} topLevel />
      </Transition>
      {/* end top-level header and chart */}

      {/* sub-level header and chart */}
      <Transition
        className='absolute w-full h-full'
        show={!!categoryFilter}
        enter='transform duration-300 transition-all ease-in-out'
        enterFrom='-right-full'
        enterTo='right-0'
        leave='transform duration-300 transition-all ease-in-out'
        leaveFrom='right-0'
        leaveTo='-right-full'
      >

        <Link onClick={() => {
          setCategoryFilter()
        }}
        >
          <div className='flex items-center text-xs'>
            <ChevronLeftIcon className='w-3 h-3 mr-1' />
            All Categories
          </div>
        </Link>
        <div className='flex items-center'>
          <div className='mr-1 text-lg font-bold'>
            {subLevelDataLength}
          </div>
          <div className='text-base'>
            in {categoryFilter}
          </div>
        </div>

        <RollupChart data={subLevelData} fillColor={getColorFromRollupCategory(categoryFilter)} />
      </Transition>
      {/* end sub-level header and chart */}

    </div>

  )
}

RollupChartContainer.propTypes = {
  data: PropTypes.array,
  activeGroup: PropTypes.string
}

export default RollupChartContainer

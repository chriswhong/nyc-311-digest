import React from 'react'
import { Link } from 'react-router-dom'

import SidebarContainer from '../../layout/SidebarContainer'
import Head from '../../layout/Head'
import Spinner from '../../ui/Spinner'
import { useGetAoisQuery } from '../../util/rtk-api'
import { slugFromName } from '../../util/slugFromName'

const AOIListPage = () => {
  const { data, isLoading } = useGetAoisQuery()

  const aois = data?.features ?? []

  return (
    <SidebarContainer>
      <Head
        title='All Areas of Interest'
        description='Browse all user-created areas of interest for localized 311 data reports in New York City.'
      />
      <div className='px-4 py-2'>
        <h1 className='text-xl font-semibold mb-1'>All Areas of Interest</h1>
        <p className='text-sm text-gray-500 mb-4'>
          {aois.length > 0 ? `${aois.length} user-created areas` : ''}
        </p>
        {isLoading && <Spinner>Loading...</Spinner>}
        {!isLoading && (
          <ul className='space-y-1'>
            {aois.map(({ properties }) => {
              const { _id, name, owner } = properties
              const slug = slugFromName(name)
              return (
                <li key={_id} className='border-b border-gray-100 pb-1'>
                  <Link
                    to={`/report/aoi/${_id}/${slug}`}
                    className='text-indigo-600 hover:text-indigo-800 text-sm font-medium'
                  >
                    {name}
                  </Link>
                  {owner?.username && (
                    <span className='ml-2 text-xs text-gray-400'>by {owner.username}</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </SidebarContainer>
  )
}

export default AOIListPage

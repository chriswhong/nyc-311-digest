import React from 'react'
import { useNavigate } from 'react-router-dom'

const MainSidebar = () => {
  const history = useNavigate()

  return (
    <div className='text-sm'>
      <p className='mb-3'>This map shows custom <span className='italic'>areas of interest</span> created by users of this site to show localized 311 data.</p>
      <p className=''>Click any area of interest to see a report of recent 311 activity.  If your neighborhood isn't reflected here, <a onClick={() => { history('/new') }} className='text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out mb-4 cursor-pointer'>add it!</a></p>
    </div>
  )
}

export default MainSidebar

import React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../ui/Button'

export default function NotFound () {
  const navigate = useNavigate()
  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center bg-white'>
      <div className='flex items-start'>
        <h1 className='pr-6 text-5xl font-bold text-indigo-600'>404</h1>
        <div className=''>
          <div className='pl-6 mb-8 border-l'>
            <h3 className='mb-2 text-5xl font-bold'>Page Not Found</h3>
            <p className='text-gray-500'>Sorry, you tried to load a page that doesn't exist</p>
          </div>
          <div className='pl-6'>
            <Button onClick={() => { navigate('/') }}>Go Home</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

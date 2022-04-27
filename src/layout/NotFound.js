import React from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../ui/Button'

export default function NotFound () {
  const navigate = useNavigate()
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='flex items-start'>
        <h1 className='text-5xl font-bold text-indigo-600 pr-6'>404</h1>
        <div className=''>
          <div className='border-l pl-6 mb-8'>
            <h3 className='text-5xl font-bold mb-2'>Page Not Found</h3>
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

import React from 'react'
import PropTypes from 'prop-types'

const TextInput = ({
  id,
  value,
  label,
  message,
  placeholder,
  onChange
}) => {
  return (
    <div className='form-group mb-6'>
      {label && <label htmlFor='exampleInputEmail1' className='form-label inline-block mb-2 text-gray-700'>{label}</label>}
      <input
        type='text'
        className='form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
        id={id}
        value={value}
        aria-describedby=''
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value) }}
      />
      <small id='emailHelp' className='block mt-1 text-xs text-gray-600'>{message}
      </small>
    </div>
  )
}

export default TextInput

TextInput.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  message: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
}

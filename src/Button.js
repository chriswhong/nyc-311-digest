import React from 'react'
import PropTypes from 'prop-types'

const Button = ({
  icon,
  children,
  href,
  disabled,
  onClick
}) => {
  const Icon = icon
  const className = 'ml-6 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-50'

  const buttonContent = (
    <>
      {icon && <Icon className='h-5 w-5 mr-2' />}
      {children}
    </>
  )

  if (onClick) {
    return (
      <button
        href='#'
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        {buttonContent}
      </button>
    )
  }
  return (
    <a
      className={className}
      href={href}
      disabled={disabled}
    >
      {buttonContent}
    </a>
  )
}

Button.propTypes = {
  children: PropTypes.string,
  onClick: PropTypes.func,
  href: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.object
}

export default Button

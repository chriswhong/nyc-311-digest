import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Button = ({
  icon,
  className,
  children,
  href,
  disabled,
  submit,
  onClick
}) => {
  const Icon = icon
  const combinedClassName = classNames(
    'whitespace-nowrap w-auto inline-flex items-center justify-center ml-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    className
  )

  const buttonContent = (
    <>
      {icon && <Icon className='w-5 h-5 mr-2' />}
      {children}
    </>
  )

  if (onClick) {
    return (
      <button
        href='#'
        className={combinedClassName}
        onClick={onClick}
        disabled={disabled}
        submit={submit ? 'true' : ''}
      >
        {buttonContent}
      </button>
    )
  }
  return (
    <button
      className={combinedClassName}
      href={href}
      disabled={disabled}
      submit={submit ? 'true' : ''}
    >
      {buttonContent}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.object,
  disabled: PropTypes.bool,
  submit: PropTypes.bool,
  onClick: PropTypes.func
}

export default Button

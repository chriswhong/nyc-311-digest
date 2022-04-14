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
    'whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-50',
    className
  )

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
  children: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.object,
  disabled: PropTypes.bool,
  submit: PropTypes.bool,
  onClick: PropTypes.func
}

export default Button

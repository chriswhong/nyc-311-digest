import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link as RouterLink } from 'react-router-dom'

const Link = ({
  to,
  className,
  colorClassName = 'hover:text-blue-800',
  onClick,
  children,
  id
}) => {
  const combinedClassNames = classNames('cursor-pointer transition-all duration-100', colorClassName)

  // use a <div> by default
  let theLink = (
    <span id={id} onClick={onClick} className={combinedClassNames}>
      {children}
    </span>
  )

  // if to exists, make it a react-router-dom <Link>
  if (to) {
    theLink = (
      <RouterLink to={to} className={combinedClassNames} onClick={onClick}>
        {children}
      </RouterLink>
    )
  }

  // if to contains http:// or https:// make it an <a>
  if (to?.match(/^https?:\/\//)) {
    theLink = (
      <a
        href={to}
        target='_blank'
        rel='noopener noreferrer'
        className={combinedClassNames}
      >
        {children}
      </a>
    )
  }

  return (
    <span className={className} onClick={onClick}>
      {theLink}
    </span>
  )
}

Link.propTypes = {
  to: PropTypes.string,
  className: PropTypes.string,
  colorClassName: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  id: PropTypes.string
}

export default Link

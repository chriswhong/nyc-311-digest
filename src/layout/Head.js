import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

export default function Head ({
  title,
  description
}) {
  const displayTitle = `NYC 311 Reports${title && ` | ${title}`}`
  const defaultDescription = 'Localized 311 maps and reports for New York City'

  return (
    <Helmet>
      <title>{displayTitle}</title>

      <meta property='og:type' content='website' />
      <meta property='og:url' content={window.location.href} />
      <meta property='og:title' content={displayTitle} />
      <meta property='og:description' content={description || defaultDescription} />
    </Helmet>
  )
}

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
}

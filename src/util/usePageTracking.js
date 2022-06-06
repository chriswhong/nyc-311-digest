import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GA4_TRACKING_ID)
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
  }, [location])
}

export default usePageTracking

import { useAuth0 } from '@auth0/auth0-react'
import { useLocation } from 'react-router-dom'

export default function ProtectedRoute ({ user, userIsLoading, children }) {
  const { loginWithRedirect } = useAuth0()
  const location = useLocation()

  if (!userIsLoading) {
    if (!user) {
      loginWithRedirect({
        appState: {
          returnTo: `${location.pathname}${location.hash}`
        },
        screen_hint: 'signup'
      })
    }
  }

  return children
}

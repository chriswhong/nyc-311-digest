import { useEffect, useContext } from 'react'
import { AuthContext } from './AppContainer'

const Login = () => {
  const authItems = useContext(AuthContext)

  const { loginWithRedirect } = authItems

  useEffect(() => {
    loginWithRedirect({
      appState: {
        returnTo: '/'
      }
    })
  })
  return null
}

export default Login

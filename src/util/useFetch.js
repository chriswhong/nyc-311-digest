import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../AppContainer'

const useFetch = ({
  url,
  method = 'GET',
  body,
  authorization
}) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [triggered, setTriggered] = useState(false)
  const authItems = useContext(AuthContext)
  const { getAccessToken } = { ...authItems }

  const trigger = () => {
    setTriggered(true)
  }

  useEffect(() => {
    if (triggered) {
      setTriggered(false)

      const fetchProduct = async () => {
        setLoading(true)

        try {
          setError()
          let fetchOptions = {
            method,
            body: JSON.stringify(body)
          }

          if (authorization) {
            const token = await getAccessToken({
              audience: 'nyc-311-reports-functions'
            })
            fetchOptions = {
              ...fetchOptions,
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          }

          const response = await fetch(url, fetchOptions).then(d => d.json())
          setData(response)
        } catch (err) {
          setError(err)
        }
        setLoading(false)
      }
      fetchProduct()
    }
  }, [triggered])

  return { data, loading, error, trigger }
}

export default useFetch

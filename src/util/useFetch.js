import { useState, useEffect } from 'react'

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
  const [accessToken, setAccessToken] = useState()

  const trigger = (triggerOptions) => {
    if (triggerOptions?.token) { setAccessToken(triggerOptions.token) }
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
            fetchOptions = {
              ...fetchOptions,
              headers: {
                Authorization: `Bearer ${accessToken}`
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

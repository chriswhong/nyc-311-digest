import { useState } from 'react'

const useModal = () => {
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState()
  const [properties, setProperties] = useState()

  function hideModal () {
    setVisible(false)
  }

  function showModal (type, properties) {
    setType(type)
    setProperties(properties)
    setVisible(true)
  }
  return { hideModal, visible, showModal, type, properties }
}

export default useModal

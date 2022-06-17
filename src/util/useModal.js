import { useState } from 'react'

const useModal = () => {
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState()
  const [properties, setProperties] = useState()
  const [locked, setLocked] = useState()

  function hideModal () {
    setVisible(false)
  }

  function showModal (type, modalProperties, locked) {
    setType(type)
    setProperties(modalProperties)
    setVisible(true)
    setLocked(true)
  }
  return { hideModal, visible, showModal, type, modalProperties: properties, locked }
}

export default useModal

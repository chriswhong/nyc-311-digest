import { useState } from 'react'

const useModal = () => {
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState()
  const [properties, setProperties] = useState()

  function hideModal () {
    setVisible(false)
  }

  function showModal (type, modalProperties) {
    setType(type)
    setProperties(modalProperties)
    setVisible(true)
  }
  return { hideModal, visible, showModal, type, modalProperties: properties }
}

export default useModal

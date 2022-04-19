import { useState } from 'react'

const useModal = () => {
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState()
  const [action, setAction] = useState()

  function hideModal () {
    setVisible(false)
  }

  function showModal (type, theAction) {
    setType(type)
    setAction(theAction)
    setVisible(true)
  }
  return { hideModal, visible, showModal, type, action }
}

export default useModal

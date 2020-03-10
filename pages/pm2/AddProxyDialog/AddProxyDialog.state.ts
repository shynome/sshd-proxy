import { useState } from 'react'
import { createContainer } from 'unstated-next'

export const useAddProxyDialogState = () => {
  return useState({
    open: false,
    pending: false,
    nextLocalPort: 0,
  })
}

export const AddProxyDialogState = createContainer(useAddProxyDialogState)

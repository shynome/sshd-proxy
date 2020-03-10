import { useState } from 'react'
import { createContainer } from 'unstated-next'

export const useDelProxyDialogState = () => {
  return useState({
    open: false,
    pending: false,
    rule: '',
  })
}

export const DelProxyDialogState = createContainer(useDelProxyDialogState)

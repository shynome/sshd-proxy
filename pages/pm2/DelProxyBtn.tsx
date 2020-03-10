import { IconButton, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDelProxyDialog } from './DelProxyDialog'
import { StatelessComponent } from 'react'

export const DelProxyBtn: StatelessComponent<{ name: string }> = props => {
  const dialog = useDelProxyDialog()
  return (
    <Tooltip title={`点击删除转发: ${props.name}`}>
      <IconButton onClick={() => dialog.open(props.name)}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  )
}

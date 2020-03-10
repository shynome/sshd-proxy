import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
} from '@material-ui/core'
import { useDelProxyDialog } from './DelProxyDialog.hook'
import { StatelessComponent } from 'react'

export const DelProxyDialog: StatelessComponent<{
  onFinish: () => any
}> = props => {
  const { state, close, delProxy } = useDelProxyDialog()

  return (
    <Dialog open={state.open} onClose={state.pending ? () => 0 : close}>
      <form
        onSubmit={e => {
          e.preventDefault()
          delProxy().then(() => props.onFinish())
        }}
      >
        <DialogTitle>删除确认</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确认是否删除 {state.rule} ?
            <br />
            请注意一旦删除就无法找回
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size="large" disabled={state.pending} onClick={close}>
            取消
          </Button>
          <Button size="large" disabled={state.pending} type="submit">
            确认
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

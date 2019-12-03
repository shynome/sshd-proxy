import { useState } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText,
  Button,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

interface Props {
  onSubmit: (rule: string) => any
  rule: string
  open: boolean
  onClose?: () => any
}

export const DelProxyDialog: React.StatelessComponent<Props> = ({
  onSubmit,
  onClose = () => 0,
  rule,
  open,
}) => {
  const [pending, setPending] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  return (
    <Dialog open={open}>
      <form onSubmit={(e) => {
        e.preventDefault()
        if (pending) {
          return
        }
        setPending(true)
        Promise
          .resolve(onSubmit(rule))
          .then(() => {
            enqueueSnackbar(`删除 ${rule} 成功`, {
              autoHideDuration: 2e3
            })
          })
          .finally(() => {
            setPending(false)
          })
      }}>
        <DialogTitle>确认是否删除 {rule}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            请注意一旦删除就无法找回
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size='large' onClick={() => onClose()}>取消</Button>
          <Button size='large' type='submit'>确认</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

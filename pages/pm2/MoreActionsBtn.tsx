import { Fragment, useState, StatelessComponent, useRef } from 'react'
import {
  IconButton,
  Menu,
  Button,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
  useTheme,
  makeStyles,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ReloadIcon from '@material-ui/icons/Replay'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDelProxyDialog } from './DelProxyDialog'

const useStyles = makeStyles(theme => ({
  icon: {
    minWidth: 0,
    paddingRight: theme.spacing(2),
  },
}))

export const MoreActionsBtn: StatelessComponent<{ rule: string }> = props => {
  const classes = useStyles()
  const delDialog = useDelProxyDialog()
  const [open, setOpen] = useState(false)
  const ref = useRef()
  return (
    <Fragment>
      <Button
        startIcon={<MoreVertIcon />}
        ref={ref}
        onClick={() => setOpen(true)}
      >
        更多
      </Button>
      <Menu open={open} anchorEl={ref.current} onClose={() => setOpen(false)}>
        {/* <MenuItem disabled>
          <ListItemIcon className={classes.icon}>
            <ReloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="重启" />
        </MenuItem> */}
        <MenuItem onClick={() => delDialog.open(props.rule)}>
          <ListItemIcon className={classes.icon}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="删除" />
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

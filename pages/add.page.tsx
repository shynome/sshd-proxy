import React, { useState, useMemo } from "react";
import {
  useTheme,
  TextField, Paper,
  Select, MenuItem, CircularProgress,
  Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, DialogContentText,
} from "@material-ui/core";
import { useStyles } from "./add.style";
import { PM2ClientContaienr } from "./pm2.client";
import { Readable } from "react-read";
import { Autocomplete } from "@material-ui/lab";
import { useFormFields } from "~modules/browser-utils";

export enum SSHType {
  Proxy = 'proxy',
  LocalPortForwarding = 'local port forwarding',
}

export const Hosts: React.StatelessComponent<{ onChange: (value: { target: { value: string } }) => void }> = (props) => {
  const client = PM2ClientContaienr.useContainer()
  const [hosts, setHosts] = useState<string[]>([])
  useMemo(() => {
    client.GetHosts().then(hosts => {
      setHosts(hosts)
    })
  }, [])
  return (
    <Autocomplete
      options={hosts}
      freeSolo
      loading={hosts.length === 0}
      onInputChange={(e, value) => props.onChange({ target: { value } })}
      renderInput={params => (
        <TextField {...params} label="Host" variant="outlined" name='host' required fullWidth />
      )}
    />
  )
}

const createItem = (value: SSHType, displayName: string) => ({
  displayName,
  value,
})
const sshTypes = [
  createItem(SSHType.Proxy, '代理'),
  createItem(SSHType.LocalPortForwarding, '端口转发'),
]

export interface FormData {
  localPort: string,
  remoteAddr: string,
  remotePort: string,
  host: string,
}

export interface Props {
  onSubmit: (rule: string, fields: FormData) => any
  open?: boolean
}

export const AddProxy: React.StatelessComponent<Props> = ({
  open = true,
  onSubmit,
}) => {
  const styles = useStyles(useTheme())
  const [sshType, setSSHType] = useState(SSHType.LocalPortForwarding)
  const [pending, setPending] = useState(false)
  const [fields, saveField] = useFormFields({
    localPort: '',
    remoteAddr: '',
    remotePort: '',
    host: '',
  })
  return (
    <Dialog open={open} maxWidth='md'>
      <form onSubmit={(e) => {
        e.preventDefault()
        if (pending) {
          return
        }
        setPending(true)
        let rule = [
          fields.localPort,
          fields.remoteAddr,
          fields.remotePort,
          fields.host,
        ].filter(v => v).join(':')
        Promise
          .all([onSubmit(rule, fields)])
          .finally(() => {
            setPending(false)
          })
      }}>
        <DialogTitle>添加新的 SSH 中转</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Select
                variant='outlined'
                value={sshType}
                onChange={(e) => setSSHType(e.target.value as any)}
                fullWidth
              >
                {sshTypes.map(item => (
                  <MenuItem value={item.value} key={item.value}>{item.displayName}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                variant='outlined'
                type='number'
                required
                label='本机端口'
                onChange={saveField('localPort')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant='outlined'
                disabled={sshType === SSHType.Proxy}
                required={sshType === SSHType.LocalPortForwarding}
                label='远端地址'
                onChange={saveField('remoteAddr')}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                variant='outlined'
                disabled={sshType === SSHType.Proxy}
                required={sshType === SSHType.LocalPortForwarding}
                type='number'
                label='远端端口'
                onChange={saveField('remotePort')}
              />
            </Grid>
            <Grid item xs={12}><Hosts onChange={saveField('host')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button size='large' disabled={pending} >取消</Button>
          <Button
            size='large' disabled={pending} type='submit' color='primary'
            startIcon={pending ? <CircularProgress size={20} /> : null}
          >
            添加
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default () => {
  const client = PM2ClientContaienr.useContainer()
  return (
    <AddProxy onSubmit={async (rule) => {
      await client.AddProxy(rule)
    }} />
  )
}
import React, { useState, useMemo, useEffect } from "react";
import {
  useTheme,
  TextField,
  Select, MenuItem, CircularProgress,
  Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, DialogContentText,
} from "@material-ui/core";
import { useStyles } from "./add.style";
import { PM2ClientContaienr } from "./pm2.client";
import { useSnackbar } from "notistack";
import { Autocomplete } from "@material-ui/lab";
import { useFormFields } from "~modules/browser-utils";
import { PM2Svc } from "~libs/thrift/codegen";
import { parse } from "~libs/proxy_rule";

export enum SSHType {
  Proxy = 'proxy',
  LocalPortForwarding = 'local port forwarding',
}

let _hosts: Promise<string[]>
const getHosts = (client: PM2Svc.Client) => {
  return _hosts || (_hosts = client.GetHosts())
}

export const Hosts: React.StatelessComponent<{ onChange: (value: { target: { value: string } }) => void }> = (props) => {
  const client = PM2ClientContaienr.useContainer()
  const [hosts, setHosts] = useState<string[]>([])
  useEffect(() => {
    getHosts(client).then(hosts => {
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
        <TextField
          {...params}
          label="Host"
          variant="outlined"
          required
          fullWidth
          helperText='要使用的远程主机'
        />
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
  localPort: number,
  remoteAddr: string,
  remotePort: number,
  host: string,
}

export interface Props {
  open?: boolean
  onSubmit: (rule: string, fields: FormData) => any
  onClose?: () => any
  nextLocalPort?: number
}

export const AddProxyDialog: React.StatelessComponent<Props> = ({
  open = true,
  onSubmit,
  onClose = () => 0,
  nextLocalPort = 0,
}) => {
  const styles = useStyles(useTheme())
  const [sshType, setSSHType] = useState(SSHType.LocalPortForwarding)
  const [pending, setPending] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [fields, saveField, setFields] = useFormFields<FormData>({
    localPort: nextLocalPort,
    remoteAddr: '127.0.0.1',
    remotePort: 6379,
    host: '',
  })
  useEffect(() => {
    setFields({
      ...fields,
      localPort: nextLocalPort,
    })
  }, [nextLocalPort])

  const [rule, setRule] = useState('')
  useEffect(() => {
    let rule: string
    switch (sshType) {
      case SSHType.LocalPortForwarding:
        rule = [
          fields.localPort,
          fields.host,
          fields.remoteAddr,
          fields.remotePort,
        ].filter(v => v).join(':');
        break;
      case SSHType.Proxy:
        rule = [
          fields.localPort,
          fields.host,
        ].join(':');
        break;
    }
    setRule(rule)
  }, [
    sshType,
    fields.localPort,
    fields.remoteAddr,
    fields.remotePort,
    fields.host,
  ])

  const [cmd, setCmd] = useState('')
  useEffect(() => {
    if (!fields.host || !fields.localPort) {
      setCmd('')
      return
    }
    try {
      let p = parse(rule)
      let cmd = `${p.script} ${(p.args as string[]).join(' ')}`
      setCmd(cmd)
    } catch (e) {
      console.error(e)
      // do nothing
    }
  }, [
    rule,
    fields.host,
    fields.localPort,
  ])

  const handleSubmit = () => {
    if (pending) {
      return
    }
    setPending(true)
    Promise
      .resolve(onSubmit(rule, fields))
      .then(() => {
        enqueueSnackbar('添加成功', {
          autoHideDuration: 2e3
        })
      })
      .finally(() => {
        setPending(false)
      })
  }

  return (
    <Dialog open={open} maxWidth='md'>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
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
                autoFocus
                label='本机端口'
                helperText='占用的本机端口'
                value={fields.localPort}
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
                helperText='反向代理的主机地址'
                value={fields.remoteAddr}
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
                helperText='反向代理的主机端口'
                value={fields.remotePort}
                onChange={saveField('remotePort')}
              />
            </Grid>
            <Grid item xs={12}><Hosts onChange={saveField('host')} /></Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant='outlined'
                label='ssh cmd'
                value={cmd}
                helperText={'linux ssh command'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button size='large' disabled={pending} onClick={onClose}>取消</Button>
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
    <AddProxyDialog onSubmit={(rule) => client.AddProxy(rule)} />
  )
}
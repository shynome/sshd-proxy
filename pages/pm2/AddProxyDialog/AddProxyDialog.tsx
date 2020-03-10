import React, { useState, useMemo, useEffect } from 'react'
import {
  useTheme,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { parse } from '~modules/utils/common/proxy_rule'
import { useForm, Controller } from 'react-hook-form'
import { FormData, getRule } from './AddProxyDialog.hook'
import { useQuery, gql } from '@apollo/client'
import { useAddProxyDialog, SSHType } from './AddProxyDialog.hook'

const getHostsQuery = gql`
  query getHosts {
    hosts: SSHHosts
  }
`

const createItem = (value: SSHType, displayName: string) => ({
  displayName,
  value,
})
const sshTypes = [
  createItem(SSHType.Proxy, '代理'),
  createItem(SSHType.LocalPortForwarding, '端口转发'),
]

export const AddProxyDialog: React.StatelessComponent<{
  onFinish: () => any
}> = props => {
  const { state, addProxy, close } = useAddProxyDialog()
  const FormDefaultValue = useMemo(() => {
    return {
      localPort: state.nextLocalPort,
      remoteAddr: '127.0.0.1',
      remotePort: 6379,
      sshType: SSHType.LocalPortForwarding,
      host: '',
    }
  }, [state.nextLocalPort])
  const { register, handleSubmit, reset, control, watch, setValue } = useForm<
    FormData
  >({
    defaultValues: FormDefaultValue,
  })
  register('host')
  const sshType = watch('sshType')

  useEffect(() => {
    reset(FormDefaultValue)
  }, [state.nextLocalPort])

  const { data: { hosts = [] } = {} } = useQuery<{ hosts: string[] }>(
    getHostsQuery,
    {
      fetchPolicy: 'cache-first',
    },
  )

  const [cmd, setCmd] = useState('')
  const fields = watch()
  useEffect(() => {
    if (!fields.host || !fields.localPort) {
      setCmd('')
      return
    }
    try {
      const rule = getRule(fields)
      let p = parse(rule)
      let cmd = `${p.script} ${(p.args as string[]).join(' ')}`
      setCmd(cmd)
    } catch (e) {
      console.error(e)
      // do nothing
    }
  }, [JSON.stringify(fields)])

  const addProxyWrapper = (data: any) => {
    addProxy(data).then(() => props.onFinish())
  }

  return (
    <Dialog
      open={state.open}
      maxWidth="md"
      onClose={state.pending ? () => 0 : close}
    >
      <form onSubmit={handleSubmit(addProxyWrapper)}>
        <DialogTitle>添加新的 SSH 中转</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                as={
                  <Select
                    variant="outlined"
                    value={sshType}
                    fullWidth
                    disabled={state.pending}
                  >
                    {sshTypes.map(item => (
                      <MenuItem value={item.value} key={item.value}>
                        {item.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                }
                name="sshType"
                control={control}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                required
                autoFocus
                label="本机端口"
                helperText="占用的本机端口"
                name="localPort"
                disabled={state.pending}
                inputRef={register}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                disabled={state.pending || sshType === SSHType.Proxy}
                required={sshType === SSHType.LocalPortForwarding}
                label="远端地址"
                helperText="反向代理的主机地址"
                name="remoteAddr"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                variant="outlined"
                disabled={state.pending || sshType === SSHType.Proxy}
                required={sshType === SSHType.LocalPortForwarding}
                type="number"
                label="远端端口"
                helperText="反向代理的主机端口"
                name="remotePort"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={hosts}
                freeSolo
                loading={hosts.length === 0}
                disableClearable
                onInputChange={(e, v) => setValue('host', v)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Host"
                    name="host"
                    variant="outlined"
                    required
                    fullWidth
                    disabled={state.pending}
                    helperText="要使用的远程主机"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="ssh cmd"
                value={cmd}
                disabled={state.pending}
                helperText={'linux ssh command'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button size="large" disabled={state.pending} onClick={close}>
            取消
          </Button>
          <Button
            size="large"
            disabled={state.pending}
            type="submit"
            color="primary"
            startIcon={
              state.pending ? (
                <CircularProgress color="inherit" size="1em" />
              ) : null
            }
          >
            添加
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

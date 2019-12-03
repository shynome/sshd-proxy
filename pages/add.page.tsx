import React, { useState, Fragment, Suspense } from "react";
import {
  useTheme,
  TextField, Paper,
  Select, MenuItem,
} from "@material-ui/core";
import { useStyles } from "./add.style";
import { PM2ClientContaienr } from "./pm2.client";
import { Readable } from "react-read";
import { Autocomplete } from "@material-ui/lab";

export enum SSHType {
  Proxy = 'proxy',
  LocalPortForwarding = 'local port forwarding',
}

export const Hosts: React.StatelessComponent<{ data: Readable<string[]> }> = ({ data }) => {
  let hosts = data.read()
  return (
    <Autocomplete
      options={hosts}
      renderInput={params => (
        <TextField {...params} label="Host" variant="outlined" fullWidth />
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

export const AddProxy: React.StatelessComponent = () => {
  const styles = useStyles(useTheme())
  const [sshType, setSSHType] = useState(SSHType.LocalPortForwarding)
  const [host, setHost] = useState('loading')
  const client = PM2ClientContaienr.useContainer()
  const hosts = Readable.create(client.GetHosts())
  return (
    <Paper className={styles.main}>
      <Select value={sshType} onChange={(e) => setSSHType(e.target.value as any)}>
        {sshTypes.map(item => (
          <MenuItem value={item.value} key={item.value}>{item.displayName}</MenuItem>
        ))}
      </Select>
      <form>
        <Suspense fallback={<div>host</div>}>
          <Hosts data={hosts} />
        </Suspense>
      </form>
    </Paper>
  )
}

export default AddProxy

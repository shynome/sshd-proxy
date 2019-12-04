import React, { Suspense, useState, useEffect, useMemo } from "react";
import { PM2ClientContaienr } from "./pm2.client";
import {
  useTheme,
  Grid, Paper,
  LinearProgress, CircularProgress,
  IconButton,
  Table, TableBody, TableCell, TableHead, TableRow,
} from "@material-ui/core";
import IconDelete from "@material-ui/icons/Delete";
import { ListParams, ProcessDescription } from "~libs/thrift/codegen";
import { timeSince } from "~libs/utils";
import { useStyles } from "./list.styles";

export type displayProc = ProcessDescription & {
  metadata: {
    localPort: string,
    host: string,
    remoteAddr: string,
  }
}

export const Proc2DisplayProc = (item: ProcessDescription) => {
  let xrule = item.name.split(':')
  let [localPort, host, remoteHost, remotePort] = xrule
  let remoteAddr = ''
  if (xrule.length === 2) {
    remoteAddr = 'socks5 proxy'
  } else if (xrule.length === 3) {
    remotePort = remoteHost
    remoteAddr = `127.0.0.1:${remotePort}`
  } else if (xrule.length === 4) {
    remoteAddr = `${remoteHost}:${remotePort}`
  }
  return ({
    ...item,
    metadata: { localPort, host, remoteAddr, }
  } as displayProc)
}

const createColumn = (displayName: string, opath: (item: displayProc) => any, align: 'left' | 'center' = 'center') => ({
  displayName,
  opath,
  align,
})

const columns = [
  // createColumn('id', item => item.pm_id),
  // createColumn('name', item => item.name),
  createColumn('host', item => item.metadata.host, 'left'),
  createColumn('port', item => item.metadata.localPort, 'left'),
  createColumn('remote addr', item => item.metadata.remoteAddr, 'left'),
  createColumn('uptime', item => timeSince(item.pm2_env.pm_uptime)),
  createColumn('restart', item => item.pm2_env.restart_time),
  createColumn('status', item => item.pm2_env.status),
]

export interface Props {
  data: ProcessDescription[],
  handleDelete: (name: string) => any,
  loading?: boolean
}

export const ProcList: React.StatelessComponent<Props> = ({ data: items, handleDelete, loading = false }) => {
  const styles = useStyles(useTheme())
  return (
    <div className={styles.tableWrapper}>
      <Table stickyHeader className={styles.table}>
        <TableHead className={styles.thead}>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell className={styles['thead-cell']} align={col.align} key={col.displayName}>{col.displayName}</TableCell>
            ))}
            <TableCell className={styles['thead-cell']}>actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            loading && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} padding='none'>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            )
          }
          {items.map(Proc2DisplayProc)
            .map((item) => (
              <TableRow hover key={item.name}>
                {columns.map((col, index) => (
                  <TableCell className={styles['tbody-cell']} align={col.align} key={col.displayName}>{col.opath(item)}</TableCell>
                ))}
                <TableCell className={styles['tbody-cell']}>
                  <IconButton onClick={() => handleDelete(item.name)}>
                    <IconDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

import { useSnackbar } from "notistack";
export const PM2List: React.StatelessComponent = () => {
  const styles = useStyles(useTheme())
  const client = PM2ClientContaienr.useContainer()
  const { enqueueSnackbar } = useSnackbar()
  const [items, setItems] = useState<ProcessDescription[]>([])
  const updateItems = useMemo(() => () => {
    client.List(new ListParams()).then(items => setItems(items))
  }, [setItems])
  useEffect(() => {
    updateItems()
  }, [])
  const handleDelete = async (name: string) => {
    await client.DelProxy(name)
    enqueueSnackbar('删除成功', { autoHideDuration: 2e3 })
    updateItems()
  }
  return (
    <Grid container justify='center'>
      <Grid item xs={8}>
        <Paper className={styles.main}>
          <Suspense fallback={<LinearProgress />}>
            <ProcList data={items} handleDelete={handleDelete} />
          </Suspense>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default PM2List

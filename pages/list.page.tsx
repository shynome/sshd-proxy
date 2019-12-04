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

const createColumn = (displayName: string, opath: (item: ProcessDescription) => any) => ({
  displayName,
  opath
})

const columns = [
  createColumn('id', item => item.pm_id),
  createColumn('name', item => item.name),
  createColumn('uptime', item => timeSince(item.pm2_env.pm_uptime)),
  createColumn('restart', item => item.pm2_env.restart_time),
  createColumn('status', item => item.pm2_env.status),
]
export const ProcList: React.StatelessComponent<{
  data: ProcessDescription[],
  handleDelete: (name: string) => any,
  loading?: boolean
}> = ({ data: items, handleDelete, loading = false }) => {
  const styles = useStyles(useTheme())
  return (
    <Table stickyHeader size='small' className={styles.table}>
      <TableHead className={styles.thead}>
        <TableRow>
          {columns.map((col) => (
            <TableCell className={styles['thead-cell']} key={col.displayName}>{col.displayName}</TableCell>
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
        {items.map((item) => (
          <TableRow key={item.name}>
            {columns.map((col) => (
              <TableCell className={styles['tbody-cell']} key={col.displayName}>{col.opath(item)}</TableCell>
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

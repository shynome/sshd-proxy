import React, { Suspense } from "react";
import { PM2ClientContaienr } from "./pm2.client";
import {
  useTheme,
  Grid, Paper,
  LinearProgress,
  IconButton,
  Table, TableBody, TableCell, TableHead, TableRow,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { ListParams, ProcessDescription } from "~libs/thrift/codegen";
import { Readable } from "react-read";
import { timeSince } from "~libs/utils";

import { useStyles } from "./list.styles";

const createColumn = (displayName: string, opath: (item: ProcessDescription) => any) => ({
  displayName,
  opath
})

const columns = [
  createColumn('id', item => item.pm_id),
  createColumn('名字', item => item.name),
  createColumn('运行时间', item => timeSince(item.pm2_env.pm_uptime)),
  createColumn('重启次数', item => item.pm2_env.restart_time),
  createColumn('状态', item => item.pm2_env.status),
]
export const ProcList: React.StatelessComponent<{ data: Readable<ProcessDescription[]> }> = ({ data }) => {
  const items = data.read()
  const styles = useStyles(useTheme())
  const client = PM2ClientContaienr.useContainer()
  return (
    <Table stickyHeader size='small' className={styles.table}>
      <TableHead className={styles.thead}>
        <TableRow>
          {columns.map((col) => (
            <TableCell className={styles['thead-cell']} key={col.displayName}>{col.displayName}</TableCell>
          ))}
          <TableCell className={styles['thead-cell']}>动作</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => {
          return (
            <TableRow key={item.name}>
              {columns.map((col) => (
                <TableCell className={styles['tbody-cell']}>{col.opath(item)}</TableCell>
              ))}
              <TableCell className={styles['tbody-cell']}>
                <IconButton onClick={() => client.DelProxy(item.name)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export const PM2List: React.StatelessComponent = () => {
  const styles = useStyles(useTheme())
  const client = PM2ClientContaienr.useContainer()
  const items = Readable.create(client.List(new ListParams()))
  return (
    <Grid container justify='center'>
      <Grid item xs={8}>
        <Paper className={styles.main}>
          <Suspense fallback={<LinearProgress />}>
            <ProcList data={items} />
          </Suspense>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default PM2List

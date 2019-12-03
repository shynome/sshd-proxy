import { Suspense, useState, Fragment, useMemo, useEffect } from "react";
import { ProcList } from "./list.page";
import {
  useTheme,
  Grid, Paper,
  LinearProgress,
  Button,
} from "@material-ui/core";
import IconAdd from "@material-ui/icons/Add";
import { useStyles } from "./index.styles";
import { PM2ClientContaienr } from "./pm2.client";
import { ProcessDescription, ListParams } from "~libs/thrift/codegen";

import { AddProxyDialog } from "./add.page";
import { DelProxyDialog } from "./del.part";

export interface State {
  items: ProcessDescription[]
  openAdd: boolean
  openDelete: string
}

const Main: React.StatelessComponent = (props) => {
  const styles = useStyles(useTheme())
  return (
    <Grid container justify='center'>
      <Grid item xs={8}>
        <Paper className={styles.main}>
          {props.children}
        </Paper>
      </Grid>
    </Grid>
  )
}

export const Index = () => {
  const styles = useStyles(useTheme())
  const client = PM2ClientContaienr.useContainer()
  const [state, setState] = useState<State>({
    items: [],
    openAdd: false,
    openDelete: ''
  })
  const {
    updateItems,
    setOpenAdd,
    handleSubmit,
    handleDelete,
    setOpenDelete,
  } = {
    updateItems: () => {
      return client.List(new ListParams()).then(
        items => setState({ ...state, items, })
      )
    },
    setOpenAdd: (open: boolean) => setState({ ...state, openAdd: open, }),
    handleSubmit: async (rule: string) => {
      await client.AddProxy(rule)
      updateItems()
      setOpenAdd(false)
    },
    setOpenDelete: (name: string) => setState({ ...state, openDelete: name, }),
    handleDelete: async (rule: string) => {
      await client.DelProxy(rule)
      updateItems()
      setOpenDelete('')
    }
  }

  useEffect(() => {
    updateItems()
  }, [])

  const header = (
    <Grid container spacing={2} justify='space-between'>
      <Grid item>
        nothing
      </Grid>
      <Grid item>
        <Button
          color='primary' variant='contained' size='large'
          startIcon={<IconAdd></IconAdd>}
          onClick={() => setOpenAdd(true)}
        >
          新建
        </Button>
      </Grid>
    </Grid>

  )
  const body = <ProcList data={state.items} handleDelete={name => setOpenDelete(name)} />

  return (
    <Fragment>
      <Main>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {header}
          </Grid>
          <Grid item xs={12}>
            {body}
          </Grid>
        </Grid>
      </Main>
      <AddProxyDialog open={state.openAdd} onSubmit={handleSubmit} onClose={() => setOpenAdd(false)} />
      <DelProxyDialog open={state.openDelete !== ''} rule={state.openDelete} onSubmit={handleDelete} onClose={() => setOpenDelete('')}></DelProxyDialog>
    </Fragment>
  )
}


export default Index

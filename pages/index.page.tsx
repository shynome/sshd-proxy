import { Suspense, useState, Fragment, useMemo, useEffect, useLayoutEffect } from "react";
import { ProcList } from "./list.page";
import {
  useTheme,
  Grid, Paper,
  Button,
  TextField,
} from "@material-ui/core";
import IconAdd from "@material-ui/icons/Add";
import { useStyles } from "./index.styles";
import { PM2ClientContaienr } from "./pm2.client";
import { ProcessDescription, ListParams } from "~libs/thrift/codegen";
import { Autocomplete } from "@material-ui/lab";

import { AddProxyDialog, FormData as AddProxyFormData } from "./add.page";
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
  const [items, setItems] = useState<ProcessDescription[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const updateItems = useMemo(() => () => {
    setItemsLoading(true)
    client.List(new ListParams())
      .then(items => {
        setItems(items)
      })
      .finally(() => {
        setItemsLoading(false)
      })
  }, [setItems, setItemsLoading])

  const [openAdd, setOpenAdd] = useState(false)
  const [nextLocalPort, setNextLocalPort] = useState(0)
  useEffect(() => {
    let usedPorts = items.map(item => {
      let port = Number(item.name.split(':')[0])
      return isNaN(port) ? 0 : port
    })
    usedPorts = usedPorts.sort()
    let localPort = usedPorts[0] || 0
    localPort = Math.max(4040, localPort + 1)
    setNextLocalPort(localPort)
  }, [items])

  const [openDelete, setOpenDelete] = useState('')

  const handleSubmit = async (rule: string) => {
    await client.AddProxy(rule)
    updateItems()
    setOpenAdd(false)
  }
  const handleDelete = async (rule: string) => {
    await client.DelProxy(rule)
    updateItems()
    setOpenDelete('')
  }

  useEffect(() => {
    updateItems()
  }, [])

  const header = (
    <Grid container spacing={2} justify='space-between'>
      <Grid item xs={4}>
        <Autocomplete
          options={items}
          getOptionLabel={(item: ProcessDescription) => item.name}
          freeSolo
          onInputChange={(e, v) => console.log(v)}
          renderInput={params => (
            <TextField {...params} label="filter" variant="outlined" required fullWidth />
          )}
        />
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
  const body = <ProcList loading={itemsLoading} data={items} handleDelete={name => setOpenDelete(name)} />

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
      <AddProxyDialog open={openAdd} nextLocalPort={nextLocalPort} onSubmit={handleSubmit} onClose={() => setOpenAdd(false)} />
      <DelProxyDialog open={openDelete !== ''} rule={openDelete} onSubmit={handleDelete} onClose={() => setOpenDelete('')}></DelProxyDialog>
    </Fragment>
  )
}


export default Index

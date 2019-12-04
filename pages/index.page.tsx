import { Suspense, useState, Fragment, useMemo, useEffect, useLayoutEffect } from "react";
import {
  useTheme,
  Grid, Paper,
  Button,
  TextField,
  IconButton,
} from "@material-ui/core";
import IconAdd from "@material-ui/icons/Add";
import IconRelod from '@material-ui/icons/Replay'
import { useStyles } from "./index.styles";
import { PM2ClientContaienr } from "./pm2.client";
import { ProcessDescription, ListParams } from "~libs/thrift/codegen";
import { Autocomplete } from "@material-ui/lab";

import { AddProxyDialog } from "./add.page";
import { DelProxyDialog } from "./del.part";
import { ProcList, displayProc } from "./list.page";

export interface State {
  items: ProcessDescription[]
  openAdd: boolean
  openDelete: string
}

const optionsFilter = (keyword: string) => (proc: ProcessDescription) => {
  return proc.name.indexOf(keyword) !== -1
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

  const [keyword, setKeyword] = useState('')
  console.log(keyword)
  let diplayItems = items.filter(optionsFilter(keyword))
  const [openAdd, setOpenAdd] = useState(false)
  const [nextLocalPort, setNextLocalPort] = useState(0)
  useEffect(() => {
    let usedPorts = items.map(item => {
      let port = Number(item.name.split(':')[0])
      return isNaN(port) ? 0 : port
    })
    usedPorts = usedPorts.sort((a, b) => a > b ? -1 : 1)
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
          filterOptions={(options, input) => options.filter(optionsFilter(input.inputValue))}
          onInputChange={(e, v) => setKeyword(v)}
          renderInput={params => (
            <TextField {...params} label="filter" variant="outlined" required fullWidth />
          )}
        />
      </Grid>
      <Grid item>
        <IconButton onClick={updateItems}><IconRelod /></IconButton>
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
  const body = <ProcList loading={itemsLoading} data={diplayItems} handleDelete={name => setOpenDelete(name)} />

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

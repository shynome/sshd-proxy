import { Fragment, StatelessComponent, useCallback } from 'react'
import {
  useTheme,
  Grid,
  Paper,
  Button,
  TextField,
  IconButton,
  LinearProgress,
  Tooltip,
  Container,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ReloadIcon from '@material-ui/icons/Replay'
import MUIDatatables, { MUIDataTableColumnOptions } from 'mui-datatables'
import { useQuery, gql } from '@apollo/client'
import { ProcessDescription } from '~modules/graphql/codegen'
import { DelProxyBtn } from './DelProxyBtn'
import { TimeSince } from './TimeSince'
import { MoreActionsBtn } from './MoreActionsBtn'

const getPM2ListQuery = gql`
  query pm2_list {
    pm2_list: PM2List {
      name
      pm2_env {
        status
        pm_uptime
        restart_time
      }
    }
  }
`

const Main: StatelessComponent = props => {
  return (
    <Grid container justify="center">
      <Grid item xs={10}>
        <Paper>{props.children}</Paper>
      </Grid>
    </Grid>
  )
}

type DisplayProc = ProcessDescription & {
  metadata: {
    localPort: string
    host: string
    remoteAddr: string
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
  return {
    ...item,
    metadata: { localPort, host, remoteAddr },
  } as DisplayProc
}

const Col = (
  name: string,
  opath: (p: DisplayProc) => any,
  options: MUIDataTableColumnOptions = {},
) => ({ name, opath, options })

import { useAddProxyDialog } from './AddProxyDialog'

function getNextLocalPort(items: DisplayProc[]) {
  let usedPorts = items.map(item => {
    let port = Number(item.name.split(':')[0])
    return isNaN(port) ? 0 : port
  })
  usedPorts = usedPorts.sort((a, b) => (a > b ? -1 : 1))
  let localPort = usedPorts[0] || 0
  localPort = Math.max(4040, localPort + 1)
  return localPort
}

const CustomToolBar: StatelessComponent<{
  list: DisplayProc[]
  refresh: () => any
}> = props => {
  const dialog = useAddProxyDialog()

  const open = () => {
    dialog.open({ nextLocalPort: getNextLocalPort(props.list) })
  }

  return (
    <Fragment>
      <Tooltip title="添加">
        <IconButton onClick={open}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="刷新">
        <IconButton onClick={() => props.refresh()}>
          <ReloadIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  )
}

const cols = [
  Col('host', p => p.metadata.host, { sort: false }),
  Col('port', p => p.metadata.localPort, { filter: false }),
  Col('remote addr', p => p.metadata.remoteAddr, {
    sort: false,
    filter: false,
  }),
  Col('uptme', p => p.pm2_env.pm_uptime, {
    filter: false,
    searchable: false,
    customBodyRender: time => {
      return <TimeSince t={time} />
    },
  }),
  Col('restart', p => p.pm2_env.restart_time, {
    filter: false,
    searchable: false,
  }),
  Col('status', p => p.pm2_env.status, { searchable: false }),
  Col('action', p => p.name, {
    filter: false,
    sort: false,
    searchable: false,
    customBodyRender: name => {
      return <MoreActionsBtn rule={name} />
    },
  }),
]

export const PM2Page = () => {
  const { data: { pm2_list = [] } = {}, loading, refetch } = useQuery<{
    pm2_list: ProcessDescription[]
  }>(getPM2ListQuery)
  const theme = useTheme()

  const displayProcs = pm2_list.map(Proc2DisplayProc)
  const displayData = displayProcs.map(u => cols.map(c => c.opath(u)))

  return (
    <Container
      style={{ paddingTop: theme.spacing(3), paddingBottom: theme.spacing(3) }}
    >
      <AddProxyDialog onFinish={() => refetch()} />
      <DelProxyDialog onFinish={() => refetch()} />
      <Main>
        {loading && <LinearProgress />}
        <MUIDatatables
          title={'转发列表'}
          data={displayData}
          columns={cols}
          options={{
            download: false,
            print: false,
            selectableRows: 'none',
            customToolbar: () => (
              <CustomToolBar list={displayProcs} refresh={refetch} />
            ),
          }}
        />
      </Main>
    </Container>
  )
}

import { AddProxyDialog, AddProxyDialogState } from './AddProxyDialog'
import { DelProxyDialog, DelProxyDialogState } from './DelProxyDialog'

export default () => (
  <Fragment>
    <AddProxyDialogState.Provider>
      <DelProxyDialogState.Provider>
        <PM2Page />
      </DelProxyDialogState.Provider>
    </AddProxyDialogState.Provider>
  </Fragment>
)

import { Suspense, useState } from "react";
import { ProcList } from "./list.page";
import {
  useTheme,
  Grid, Paper,
  LinearProgress,
} from "@material-ui/core";
import { useStyles } from "./index.styles";
import { Readable } from "react-read";
import { PM2ClientContaienr } from "./pm2.client";
import { ProcessDescription, ListParams } from "~libs/thrift/codegen";

interface State {
  items: Readable<ProcessDescription[]>
}

export const Index = () => {
  const styles = useStyles(useTheme())
  const client = PM2ClientContaienr.useContainer()
  const [state, setState] = useState<State>({
    items: Readable.create(client.List(new ListParams()))
  })
  return (
    <Grid container justify='center'>
      <Grid item xs={8}>
        <Paper className={styles.main}>
          <Suspense fallback={<LinearProgress />}>
            <ProcList data={state.items} />
          </Suspense>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Index

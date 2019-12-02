import React, { Suspense, useMemo, useState, Fragment } from "react";
import { PM2ClientContaienr } from "./pm2.client";
import { Grid, Paper, List, ListItem, LinearProgress, makeStyles, useTheme } from "@material-ui/core";
import { unstable_createResource as createResource } from "react-cache";
import { PM2Svc, ListParams, ProcessDescription } from "~libs/thrift/codegen";
import { Readable } from "react-read";

const useStyles = makeStyles(theme => ({
  main: {
    padding: 20,
  }
}))


export const ProcList: React.StatelessComponent<{ data: Readable<ProcessDescription[]> }> = ({ data }) => {
  const items = data.read()
  return (
    <List>
      {items.map((item) => {
        <ListItem>
          
        </ListItem>
      })}
    </List>
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

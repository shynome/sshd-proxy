import React, { Fragment } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import { theme as _theme } from './_theme'
import { CssBaseline, createMuiTheme } from '@material-ui/core'
import { client } from './apollo-client'
import { ApolloProvider } from '@apollo/client'

const theme = createMuiTheme(_theme)

export const Provider: React.StatelessComponent = props => {
  return (
    <Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <ApolloProvider client={client}>{props.children}</ApolloProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Fragment>
  )
}

export default Provider

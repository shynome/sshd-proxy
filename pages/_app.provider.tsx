import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from "notistack";
import { theme } from './theme';

import { PM2ClientContaienr } from "./pm2.client";

export const Provider: React.StatelessComponent = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <PM2ClientContaienr.Provider>
          {props.children}
        </PM2ClientContaienr.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default Provider

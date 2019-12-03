import {
  makeStyles, useTheme,
} from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  main: {
    padding: 20,
    marginTop: 40,
  },
  table: {
    textAlign: 'center',
  },
  thead: {
    textAlign: 'center',
  },
  'thead-cell': {
    textAlign: 'center',
  },
  'tbody-cell': {
    textAlign: 'center',
  },
}))


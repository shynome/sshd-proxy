import {
  makeStyles, useTheme,
} from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  main: {
    padding: '20px 20px 50px 20px',
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

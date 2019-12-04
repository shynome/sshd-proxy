import {
  makeStyles, useTheme,
} from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  main: {
    padding: 20,
    marginTop: 40,
  },
  tableWrapper: {
    maxHeight: '70vh',
    overflow: 'auto',
  },
  table: {
  },
  thead: {
    textTransform: 'uppercase',
  },
  'thead-cell': {
  },
  'tbody-cell': {
  },
}))


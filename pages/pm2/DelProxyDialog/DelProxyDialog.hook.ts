import { DelProxyDialogState } from './DelProxyDialog.state'
import { useSnackbar } from 'notistack'
import { useApolloClient, gql } from '@apollo/client'

export const useDelProxyDialog = () => {
  const [state, setState] = DelProxyDialogState.useContainer()
  const { enqueueSnackbar } = useSnackbar()
  const client = useApolloClient()

  const delProxy = async () => {
    if (state.pending) {
      throw new Error('already pending')
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        await client.mutate({
          mutation: gql`
            mutation delProxy($rule: String!) {
              PM2DelProxy(rule: $rule) {
                name
              }
            }
          `,
          variables: {
            rule: state.rule,
          },
        })
      })
      .then(
        () => {
          enqueueSnackbar('删除成功', {
            autoHideDuration: 2e3,
          })
          close()
        },
        e => {
          enqueueSnackbar(`删除失败. 错误: ${e?.message}`, {
            autoHideDuration: 2e3,
          })
        },
      )
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  const open = (rule: string) => {
    setState(s => ({ ...s, open: true, rule: rule }))
  }

  const close = () => {
    setState(s => ({ ...s, open: false }))
  }

  return {
    state,
    setState,
    delProxy,
    close,
    open,
  }
}

import { AddProxyDialogState } from './AddProxyDialog.state'
import { useApolloClient, gql } from '@apollo/client'

import { useSnackbar } from 'notistack'
export interface FormData {
  localPort: number
  remoteAddr: string
  remotePort: number
  host: string
  sshType: string
}

export enum SSHType {
  Proxy = 'proxy',
  LocalPortForwarding = 'local port forwarding',
}

export function getRule(fields: FormData) {
  let rule: string
  switch (fields.sshType) {
    case SSHType.LocalPortForwarding:
      rule = [
        fields.localPort,
        fields.host,
        fields.remoteAddr,
        fields.remotePort,
      ]
        .filter(v => v)
        .join(':')
      break
    case SSHType.Proxy:
      rule = [fields.localPort, fields.host].join(':')
      break
  }
  return rule
}

export const useAddProxyDialog = () => {
  const [state, setState] = AddProxyDialogState.useContainer()
  const { enqueueSnackbar } = useSnackbar()
  const client = useApolloClient()

  const addProxy = async (fields: FormData) => {
    if (state.pending) {
      throw new Error('alreay pending')
    }
    return Promise.resolve(setState(s => ({ ...s, pending: true })))
      .then(async () => {
        const rule = getRule(fields)
        await client.mutate<{ p: { name: string } }>({
          mutation: gql`
            mutation addProxy($rule: String!) {
              p: PM2AddProxy(rule: $rule) {
                name
              }
            }
          `,
          variables: {
            rule: rule,
          },
        })
      })
      .then(
        () => {
          enqueueSnackbar('添加成功', {
            autoHideDuration: 2e3,
          })
          close()
        },
        e => {
          enqueueSnackbar(`添加失败. 错误: ${e?.message}`, {
            autoHideDuration: 2e3,
          })
        },
      )
      .finally(() => {
        setState(s => ({ ...s, pending: false }))
      })
  }

  const open = ({ nextLocalPort }: { nextLocalPort: number }) => {
    setState(s => ({ ...s, open: true, nextLocalPort: nextLocalPort }))
  }

  const close = () => {
    setState(s => ({ ...s, open: false }))
  }

  return {
    state,
    setState,
    addProxy,
    close,
    open,
  }
}

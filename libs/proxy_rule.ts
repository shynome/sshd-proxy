
import pm2 from 'pm2'
import { getEnv } from "~libs/utils";

export const parse = (rule: string): pm2.StartOptions => {
  let xrule = rule.split(':')
  let [published_port, ssh_host, target_host, target_port] = xrule
  const ssh_exec_path = getEnv('SSH_EXEC_PATH') || 'ssh'
  if (xrule.length === 2) {
    return {
      name: rule,
      script: ssh_exec_path,
      args: `-NT -D 0.0.0.0:${published_port} ${ssh_host}`.split(' '),
    }
  }
  if (typeof target_port === 'undefined') {
    target_port = target_host
    target_host = "127.0.0.1"
  }
  if (isNaN(Number(published_port)) || isNaN(Number(target_port))) {
    throw new TypeError(`内容格式不正确, ${rule}`)
  }
  return {
    name: rule,
    script: ssh_exec_path,
    args: `-NT -L 0.0.0.0:${published_port}:${target_host}:${target_port} ${ssh_host}`.split(' '),
  }
}

if(process.browser){
  // @ts-ignore
  window.parse = parse
}

export const formatStr = (str: string) => {
  return str.replace(/\s/g, '').replace(/\n/g, ',').split(',').filter(v => v)
}


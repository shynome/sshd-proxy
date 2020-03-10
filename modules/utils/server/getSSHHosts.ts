import SSHConfig from 'ssh-config'
import glob from 'glob'
import fse from 'fs-extra'
import path from 'path'

export const getSSHHosts = async (
  sshdir = path.join(process.env.HOME, '.ssh'),
) => {
  let files: string[] = await new Promise((rl, rj) => {
    glob(
      `**/*.conf`,
      {
        cwd: sshdir,
        nodir: true,
        absolute: true,
      },
      (err, res) => {
        err ? rj(err) : rl(res)
      },
    )
  })
  files = [`${sshdir}/config`, ...files]
  let content = ''
  await Promise.all(
    files.map(async f => {
      let isExist = await fse.pathExists(f)
      if (!isExist) {
        return
      }
      let buf = await fse.readFile(f, 'utf8')
      content = content + '\n' + buf
    }),
  )
  let config: { value: string }[] = SSHConfig.parse(content)
  let hosts = config.map(h => h.value)
  hosts = hosts.filter(h => !/\*/.test(h))
  hosts = Array.from(new Set(hosts))
  return hosts
}

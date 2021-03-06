const fse = require('fs-extra')
const path = require('path')
const apps_filepath = path.join(process.cwd(), "data/app.json")

if (fse.existsSync(apps_filepath)) {
  process.exit(0)
}

/**@type {any[]} */
let apps = [
  {
    name: "sshd-proxy",
    cwd: ".",
    script: "./node_modules/.bin/next-server",
    args: []
      .concat(process.env.PORT ? ["--port", process.env.PORT] : [])
      .concat(process.env.NEXT_HOSTNAME ? ["--hostname", process.env.NEXT_HOSTNAME] : [])
  }
]

fse.mkdirpSync(path.dirname(apps_filepath))
fse.writeFileSync(apps_filepath, JSON.stringify({ apps }, null, 2))

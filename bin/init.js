const fs = require('fs')
const path = require('path')
const { apps_filepath } = path.join(process.cwd(), "data/app.json")

if (fs.existsSync(apps_filepath)) {
  process.exit(0)
}

/**@type {any[]} */
let apps = [
  {
    name: "sshd-proxy",
    cwd: ".",
    script: "./node_modules/.bin/next"
  }
]

fs.writeFileSync(apps_filepath, JSON.stringify({ apps }, null, 2))

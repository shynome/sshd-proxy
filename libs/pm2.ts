import pm2 from 'pm2'
import *as proxy_rule from './proxy_rule'
import fs from 'fs'
import { apps_filepath } from "./config"
import { Pm2Env, ProcessDescription } from "~libs/thrift/codegen";

export class PM2 {
  link_status: 0 | 1 = 0
  apps: any[] = require(apps_filepath).apps
  pm2_connect: Promise<void>
  constructor() {
    this.pm2_connect = new Promise((rl, rj) => {
      pm2.connect(err => {
        if (err) return rj(err);
        this.link_status = 1
        rl()
      })
    })
  }
  apps_save() {
    fs.writeFileSync(apps_filepath, JSON.stringify({ apps: this.apps }, null, 2))
  }
  async init() {
    if (this.link_status === 0) {
      await this.pm2_connect
    }
  }
  async list(pm_id?: number): Promise<ProcessDescription[]> {
    await this.init()
    let list: pm2.ProcessDescription[] = await new Promise((rl, rj) => {
      pm2.list((err, list) => {
        if (err) return rj(err);
        rl(list.filter(proc => proc.name !== 'sshd-proxy'))
      })
    })
    if (typeof pm_id === 'number') {
      list = list.filter(pm2_proc => pm2_proc.pm_id === pm_id)
    }
    return list as any
  }
  async add_proxy(rule: string): Promise<Pm2Env> {
    await this.init()
    let startOptions = proxy_rule.parse(rule)
    let result = new Promise((rl, rj) => {
      pm2.start(startOptions, (err, proc) => {
        if (err) return rj(err);
        // @ts-ignore
        rl(proc[0])
      })
    })
    let index = this.apps.map(({ name }) => name).indexOf(rule)
    if (index === -1) {
      this.apps.push(startOptions)
    } else {
      this.apps[index] = startOptions
    }
    this.apps_save()
    return result as any
  }
  async del_proxy(rule: string): Promise<Pm2Env> {
    await this.init()
    let result = new Promise((rl, rj) => {
      pm2.delete(rule, (err, proc) => {
        if (err) rj(err)
        rl(proc)
      })
    })
    this.apps = this.apps.filter(({ name }) => name !== rule)
    this.apps_save()
    return result as any
  }
}


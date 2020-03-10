import { Injectable, ProviderScope, Inject } from '@graphql-modules/di'
import { ModuleConfig } from '@graphql-modules/core'
import * as proxy_rule from '~modules/utils/common/proxy_rule'
import fs from 'fs'
import pm2 from 'pm2'

export interface PM2Config {
  /**保存 pm2 应用的文件地址 */
  apps_filepath: string
}

@Injectable({
  scope: ProviderScope.Application,
})
export class PM2Provider {
  link_status: 0 | 1 = 0
  pm2_connect: Promise<void>
  apps: any[]
  constructor(@Inject(ModuleConfig) private config: PM2Config) {
    this.pm2_connect = new Promise((rl, rj) => {
      this.apps = JSON.parse(
        fs.readFileSync(this.config.apps_filepath, 'utf8'),
      ).apps
      pm2.connect(err => {
        if (err) return rj(err)
        this.link_status = 1
        rl()
      })
    })
  }
  apps_save() {
    fs.writeFileSync(
      this.config.apps_filepath,
      JSON.stringify({ apps: this.apps }, null, 2),
    )
  }
  async init() {
    if (this.link_status === 0) {
      await this.pm2_connect
    }
  }
  async list(pm_id?: number): Promise<pm2.ProcessDescription[]> {
    await this.init()
    let list: pm2.ProcessDescription[] = await new Promise((rl, rj) => {
      pm2.list((err, list) => {
        if (err) return rj(err)
        rl(list.filter(proc => proc.name !== 'sshd-proxy'))
      })
    })
    if (typeof pm_id === 'number') {
      list = list.filter(pm2_proc => pm2_proc.pm_id === pm_id)
    }
    return list as any
  }
  async add_proxy(rule: string): Promise<pm2.Proc> {
    await this.init()
    let startOptions = proxy_rule.parse(rule)
    let result = new Promise((rl, rj) => {
      pm2.start(startOptions, (err, proc) => {
        if (err) return rj(err)
        // @ts-ignore
        rl(proc ? proc[0] : {})
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
  async del_proxy(rule: string): Promise<pm2.Proc> {
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

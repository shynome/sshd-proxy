import { ThriftServer, createThriftServer, handleThriftServer, thriftApiPageConfig } from "@shynome/next-thrift-utils";
export { thriftApiPageConfig as config }
import { PM2Svc, Pm2Env, ProcessDescription, Monit, Proc, Command } from "~libs/thrift/codegen";
import { NextApiRequest } from "next";
import { pm2 } from "./pm2";
import { getSSHHosts } from "~libs/getSSHHosts";

interface Context extends NextApiRequest {
}

export class PM2Service implements ThriftServer {

  server = createThriftServer<PM2Svc.Processor, PM2Svc.IHandler<Context>>(PM2Svc.Processor, {
    AddProxy: async (ctx, rule) => {
      let proc = await pm2.add_proxy(rule)
      let resp = new Proc({
        ...proc,
        command: new Command({ ...proc.command, })
      })
      return resp
    },
    DelProxy: async (ctx, rule) => {
      let proc = await pm2.del_proxy(rule)
      let resp = new Proc({
        ...proc,
        command: new Command({ ...proc.command, })
      })
      return resp
    },
    List: async (ctx, params) => {
      let res = await pm2.list(params.pm_id)
      let resp = res.map((proc) => {
        return new ProcessDescription({
          ...proc,
          monit: new Monit({ ...proc.monit }),
          pm2_env: new Pm2Env({ ...proc.pm2_env }),
        })
      })
      return resp
    },
    GetHosts: async () => {
      let hosts = await getSSHHosts()
      return hosts
    },
  })

  httpHandle = handleThriftServer(this.server)

}

const svc = new PM2Service()

export default svc.httpHandle

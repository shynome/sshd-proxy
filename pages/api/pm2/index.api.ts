import { ThriftServer, createThriftServer, handleThriftServer, thriftApiPageConfig } from "@shynome/next-thrift-utils";
import { PM2Svc, Pm2Env } from "~libs/thrift/codegen";
import { NextApiRequest } from "next";
import { pm2 } from "./pm2";

interface Context extends NextApiRequest {
}

export class PM2Service implements ThriftServer {

  server = createThriftServer<PM2Svc.Processor, PM2Svc.IHandler<Context>>(PM2Svc.Processor, {
    AddProxy: async (ctx, rule) => {
      let res = await pm2.add_proxy(rule)
      let pm2Env = new Pm2Env(res)
      return pm2Env
    },
    DelProxy: async (ctx, rule) => {
      let res = await pm2.del_proxy(rule)
      let pm2Env = new Pm2Env(res)
      return pm2Env
    },
  })

  httpHandle = handleThriftServer(this.server)

}


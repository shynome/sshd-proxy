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
      return res
    },
    DelProxy: async (ctx, rule) => {
      let res = await pm2.del_proxy(rule)
      return res
    },
    List: async (ctx, params) => {
      let res = await pm2.list(params.pm_id)
      return res
    }
  })

  httpHandle = handleThriftServer(this.server)

}



import thrift from "thrift";
import { PM2Svc } from "~libs/thrift/codegen";
import { useState } from "react";
import { createContainer } from "unstated-next";

export const usePM2Client = () => {
  let _client: PM2Svc.Client = null
  if (process.browser) {
    let connection = thrift.createXHRConnection(
      location.hostname,
      Number(location.port),
      {
        path: '/api/pm2',
        https: location.protocol.slice(0, 5) === 'https',
      }
    )
    _client = thrift.createXHRClient(PM2Svc, connection)
  }
  const [client] = useState(_client)
  return client
}

export const PM2ClientContaienr = createContainer(usePM2Client)

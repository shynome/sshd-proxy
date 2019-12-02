import React, { Suspense } from "react";
import { PM2ClientContaienr } from "./pm2.client";

export const PM2List: React.StatelessComponent = () => {
  const client = PM2ClientContaienr.useContainer()
  return (
    <Suspense fallback={<div>loading</div>}>
      <div>555555555</div>
    </Suspense>
  )
}

export default () => (
  <PM2ClientContaienr.Provider>
    <PM2List />
  </PM2ClientContaienr.Provider>
)

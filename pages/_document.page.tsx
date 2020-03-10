import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { theme } from './_theme'
import { SimplePaletteColorOptions } from '@material-ui/core'

class MyDocument extends Document {
  render() {
    return (
      <html lang="zh-hans">
        <Head>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={(theme.palette.primary as SimplePaletteColorOptions).main}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default MyDocument

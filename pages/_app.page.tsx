import App from 'next/app'
import dynamic from 'next/dynamic'

const Provider = dynamic(() => import('./_provider'), {
  ssr: false,
})

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <Component {...pageProps} />
      </Provider>
    )
  }
}

export default MyApp

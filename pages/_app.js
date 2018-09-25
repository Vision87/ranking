import App, {Container} from 'next/app'
import React from 'react'

export default class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    //console.log(Component, router, ctx)

    return {pageProps}
  }

  render () {
    const {Component, router, pageProps} = this.props
    return <Container>
      <Component url={router} {...pageProps} />
    </Container>
  }
}

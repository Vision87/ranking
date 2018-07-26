import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import getContext from '../lib/context'
import Header from './Header'
import Footer from './Footer'

class Layout extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.pageContext = this.props.pageContext || getContext()
  }

  pageContext = null

  render() {
    return (
      <MuiThemeProvider
        theme={this.pageContext.theme}
      >
        <CssBaseline />
        <div>
          <Header />
          <div  style={{ padding: '10px 5%', fontSize: '15px', minHeight: 'calc(100vh - 128px)' }}>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Layout

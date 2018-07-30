import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core/styles'
import indigo from '@material-ui/core/colors/indigo'
import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'

import { styleToolbar } from '../lib/SharedStyles'
import getContext from '../lib/context'
import getRootUrl from '../lib/api/getRootUrl'
import Header from './Header'
import Footer from './Footer'
import MiniDrawer from './MiniDrawer'

const styles = {
  logo: {
    marginRight: 15,
    textDecoration: 'none',
    '&:hover': {
      opacity: 1
    }
  },
  link: {
    color: indigo[700],
    marginRight: 15,
    textDecoration: 'none',
    '&:visited': {
      color: indigo[900]
    },
    '&:hover': {
      color: indigo[500]
    }
  }
}

class Layout extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.pageContext = this.props.pageContext || getContext()
    this.state = {
      isOffCanvasOpen: false
    }
    this.offCanvasHandler = this.offCanvasHandler.bind(this)
  }

  pageContext = null

  offCanvasHandler () {
    this.setState({isOffCanvasOpen: !this.state.isOffCanvasOpen})
  }


  render() {
    const { classes } = this.props

    return (
      <MuiThemeProvider
        theme={this.pageContext.theme}
      >
        <CssBaseline/>
        <div>
          <Head>
            <link rel="shortcut icon" href={`${getRootUrl()}/scoreza.png`} type="image/png"/>
          </Head>
          <Header handler={this.offCanvasHandler}/>
          <MiniDrawer
            toggleDrawer={this.offCanvasHandler}
            open={this.state.drawerOpen}
          />
          <Toolbar style={styleToolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Link href="/">
              <a className={classes.logo}>
                <img src={`${getRootUrl()}/img/logo.png`} alt="logo" />
              </a>
            </Link>
          </Toolbar>
          <div style={{ fontSize: '15px', minHeight: 'calc(100vh - 128px)' }}>
            {this.props.children}
          </div>
          <Footer/>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(Layout)

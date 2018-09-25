import Link from 'next/link'
import Toolbar from '@material-ui/core/Toolbar'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import getRootUrl from '../lib/api/getRootUrl'
import { styleToolbar } from '../lib/SharedStyles'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import indigo from '@material-ui/core/colors/indigo'

const styles = {
  root: {
    flexGrow: 1
  },
  logo: {
    background: `url(${getRootUrl()}/img/logo.png) no-repeat center center`,
    backgroundSize: 'cover',
    display: 'inline-block',
    height: '65px',
    textDecoration: 'none',
    flexBasis: 200,
    marginTop: '12px',
  },
  menuButton: {
    color: indigo[700],
    display: 'inline-block',
    textDecoration: 'none',
    '&:visited': {
      color: indigo[700]
    },
    '&:hover': {
      color: indigo[700]
    },
  },
  innerHeader: {
    margin: '0 auto',
    maxWidth: '920px',
    width: '100%',
  }
}

const Header = ({classes, handler}) => (
  <AppBar position="fixed" style={{backgroundColor: '#fff'}}>
    <Toolbar style={styleToolbar} className={classes.innerHeader}>
      <Link href="/">
        <a title='Kalpunde is watching you' className={classes.logo} />
      </Link>
      <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={handler}>
        <MenuIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
)

export default withStyles(styles)(Header)

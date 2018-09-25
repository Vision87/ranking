import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Avatar from '@material-ui/core/Avatar'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Popper from '@material-ui/core/Popper'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import { SoccerIcon } from '../../components/IconComponents'
import ListIcon from '@material-ui/icons/List'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import CountUp from 'react-countup'

import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import Layout from '../../components/Layout.js'
import { getUsersBySlug, updateUser } from '../../lib/api/users'
import { styleForm, styleTextField, styleRaisedButton } from '../../lib/SharedStyles'
import { formArea, formButton, formButtonWrapper, formText, formTextSmall, paperWrapper, popperWrapper, userAvatar, userFeature, userFeatureBar, userFeatureBarWrapper, userFeatureLabel, userFeatureTitle, userFeatureValue, userFirstChar } from '../../lib/userPage'
import { Typography } from '@material-ui/core';

const styles = theme => ({
  cardTitle: {
    fontSize: '189x',
    fontWeight: '400',
    lineHeight: '30px',
    margin: '0px',
  },
  cardSubheader: {
    color: 'rgb(25, 118, 210)',
    fontSize: '15px',
    fontWeight: '700',
  },
  expand: {
    borderRadius: '0px',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.longest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
    width: '100%',
  },
  expandOpen: {
    transform: 'rotateX(180deg)',
  },
  avatar: {
    backgroundColor: 'red',
  },
  radioLegend: {
    color: '#000',
    fontSize: '15px',
    marginBottom: '10px',
    marginTop: '30px',
    [theme.breakpoints.up('sm')]: {
      float: 'left',
      marginTop: '18px',
      width: 'calc(100% - 280px)',
    }
  },
  radioGroup: {
    [theme.breakpoints.up('sm')]: {
      display: 'inline',
    }
  },
  radioLabel: {
    maxHeight: '36px',
    [theme.breakpoints.up('sm')]: {
      float: 'left',
      maxWidth: '33%',
    },
  },
  smallTextField: {
    [theme.breakpoints.up('sm')]: {
      float: 'left',
      marginRight: '50px',
      maxWidth: '230px',
    }
  },
  test: {
    '& > div > div': {
      maxHeight: '100px',
      overflow: 'auto',
    }
  }
})

class UpdateUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.user.name,
      avatarUrl: props.user.avatarUrl,
      description: props.user.description,
      slackID: props.user.slackID,
      role: props.user.role,
      expandend: false,
      anchorEl: null,
      open: false,
      placement: null
    }
  }

  static async getInitialProps({query}) {
    if (query) {
      const data = await getUsersBySlug(query.slug)
      return { user: data }
    }
    return {
      user: {}
    }
  }

  componentDidUpdate() {
    let el = document.querySelectorAll('[data-bar]')
    let barValue

    setTimeout(function(){
      for(let i = 0; i < el.length; i++) {
        barValue = el[i].getAttribute('data-bar-value')
        el[i].style.maxWidth = `${barValue}%`
        el[i].style.opacity = '0.8'
      }
    }, 300)
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const users = await updateUser({
      slug: this.props.user.slug,
      name: this.state.name,
      avatarUrl: this.state.avatarUrl,
      description: this.state.description,
      slackID: this.state.slackID,
      role: this.state.role,
    })

    Router.push('/users')
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleEdit = placement => event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: state.placement !== placement || !state.open,
      placement,
    }));
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  }

  render() {
    const { name, avatarUrl, description, slackID, role, anchorEl, open, placement, expanded } = this.state
    const { points, stats } = this.props.user
    const { classes } = this.props
    return (
      <Layout>
          <Grid container justify="center" alignItems="center" spacing={24} style={{marginBottom: '20px'}}>
            <Grid item xs={24} sm={6}>
              <Link href="/users">
                <Button
                  variant="extendedFab"
                  aria-label="Ranking"
                  style={{
                    width: 200
                  }}
                >
                  <ListIcon/>
                  Ranking
                </Button>
              </Link>
            </Grid>
            <Grid item xs={24} sm={0}>
              <Link href="/matches/fast">
                <Button
                  variant="extendedFab"
                  aria-label="Ranking"
                  style={{
                    width: 200
                  }}
                >
                  <SoccerIcon/>
                  New Match (beta)
                </Button>
              </Link>
            </Grid>
          </Grid>
        <Divider />
        <GridList cols={3}>
          <GridListTile style={userAvatar}>
              <Card className={classes.card}>
                <CardHeader
                  avatar={
                    <Avatar aria-label="Recipe" style={userFirstChar}>
                      {`${name[0]}`}
                    </Avatar>
                  }
                  action={
                    <IconButton style={{position: 'relative'}}>
                      <MoreVertIcon onClick={this.handleEdit('bottom-end')} />
                      <Popper open={open} anchorEl={anchorEl} placement={placement} style={popperWrapper} transition>
                        {({ TransitionProps }) => (
                          <Fade {...TransitionProps} timeout={350}>
                            <Paper style={paperWrapper}>
                              <form
                                autoComplete="off"
                                style={styleForm}
                                onSubmit={this.onSubmit}
                              >
                                <div style={formArea}>
                                  <TextField
                                    style={formText}
                                    id="name"
                                    label="Name"
                                    value={name}
                                    onChange={this.handleChange('name')}
                                    margin="normal"
                                    required
                                  />
                                  <TextField
                                    style={formText}
                                    id="avatarUrl"
                                    label="Avatar URL"
                                    value={avatarUrl}
                                    onChange={this.handleChange('avatarUrl')}
                                    margin="normal"
                                    required
                                  />
                                  <TextField
                                    className={this.props.classes.smallTextField}
                                    style={formText}
                                    id="slackID"
                                    label="Account Slack (e.g. <@slackID>)"
                                    value={slackID}
                                    onChange={this.handleChange('slackID')}
                                    margin="normal"
                                  />
                                  <FormLabel className={this.props.classes.radioLegend} component="legend">Main role</FormLabel>
                                  <RadioGroup
                                    aria-label="role"
                                    className={this.props.classes.radioGroup}
                                    name="role2"
                                    value={this.state.role || 'jolly'}
                                    onChange={this.handleChange('role')}
                                  >
                                    <FormControlLabel
                                      className={this.props.classes.radioLabel}
                                      value='defender'
                                      control={<Radio color="primary" />}
                                      label="Defender"
                                    />
                                    <FormControlLabel
                                      className={this.props.classes.radioLabel}
                                      value='striker'
                                      control={<Radio color="primary" />}
                                      label="Striker"
                                    />
                                    <FormControlLabel
                                      className={this.props.classes.radioLabel}
                                      value='jolly'
                                      control={<Radio color="primary" />}
                                      label="Jolly"
                                    />
                                  </RadioGroup>
                                  <TextField
                                    style={formText}
                                    className={this.props.classes.test}
                                    id="description"
                                    label="Description"
                                    value={description}
                                    multiline
                                    onChange={this.handleChange('description')}
                                    margin="normal"
                                  />
                                </div>
                                <div style={formButtonWrapper}>
                                  <Button
                                    style={formButton}
                                    variant="contained"
                                    type="submit"
                                  >
                                    EDIT
                                  </Button>
                                </div>
                              </form>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                    </IconButton>
                  }
                  title={<h3 className={classes.cardTitle}>{name}</h3>}
                  subheader={<span className={classes.cardSubheader}><CountUp start={1200} end={points} duration={2.1}/></span>}
                />
                <CardMedia
                  style = {{height: '350px'}}
                  image={avatarUrl}
                  title="Contemplative Reptile"
                />
                <div style={{backgroundColor: 'rgba(103,103,103,0.85)', borderRadius: '0% 50% 50% 50%', height: '100px', left: '0', position: 'absolute', top: '86px', width: '100px'}}>
                  <img src={`/img/attacco-difesa/${role}.svg`} style={{height: '100%'}} />
                </div>
                <CardContent>
                  <Typography component="p">
                  {description}
                  </Typography>
                </CardContent>
                <CardActions disableActionSpacing>
                  <IconButton
                    className={classnames(classes.expand, {
                      [classes.expandOpen]: this.state.expanded,
                    })}
                    onClick={this.handleExpandClick}
                    aria-expanded={this.state.expanded}
                    aria-label="Show more"
                    style={{paddingTop: '0px'}}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <GridListTile style={{display: 'block', height: 'initial', width: '100%'}}>
                      <List>
                        <ListItem style={userFeatureTitle}>
                          <h5 style={{margin: '20px 20px 20px 0'}}>SCORE</h5>
                          <div style={userFeatureBarWrapper}>
                            <div data-bar data-bar-value={`${stats.points_max * 50 / 1200}`} style={userFeatureBar()}></div>
                            <div data-bar data-bar-value={`${stats.points_min * 50 / 1200}`} style={userFeatureBar('rgb(29, 199, 115)')}></div>
                          </div>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Points</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={points} duration={1.6}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Highest points</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.points_max} duration={1.7}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Lowest points</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.points_min} duration={2.5}/></span>
                        </ListItem>
                        <ListItem style={userFeatureTitle}>
                          <h5 style={{margin: '20px 20px 20px 0'}}>TRENDS</h5>
                          <div style={userFeatureBarWrapper}>
                            <div data-bar data-bar-value={`${stats.max_win_streak}`} style={userFeatureBar()}></div>
                            <div data-bar data-bar-value={`${stats.points_trend}`} style={userFeatureBar('rgb(29, 199, 115)')}></div>
                          </div>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Win streak</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.win_streak} duration={1.9}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Longest streak </span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.max_win_streak} duration={1.6}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Trend</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.points_trend} duration={2.2}/></span>
                        </ListItem>
                        <ListItem style={userFeatureTitle}>
                          <h5 style={{margin: '20px 20px 20px 0'}}>MATCHES</h5>
                          <div style={userFeatureBarWrapper}>
                            <div data-bar data-bar-value={`${stats.match_win / stats.match_played * 100}`} style={userFeatureBar()}></div>
                            <div data-bar data-bar-value={`${(stats.match_played - stats.match_win) / stats.match_played * 100}`} style={userFeatureBar('rgb(29, 199, 115)')}></div>
                          </div>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Played</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.match_played} duration={2}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Winned</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.match_win} duration={1.9}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Crawl</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.match_crawl} duration={1.7}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Crawled</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.match_crawled} duration={2.1}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>As defender</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.match_as_defender} duration={1.3}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>As striker</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.match_as_striker} duration={1.4}/></span>
                        </ListItem>
                        <ListItem style={userFeatureTitle}>
                          <h5 style={{margin: '20px 20px 20px 0'}}>GOALS</h5>
                          <div style={userFeatureBarWrapper}>
                            <div data-bar data-bar-value={`${stats.match_goals_made_as_defender / stats.match_goals_made_as_striker * 100}`} style={userFeatureBar()}></div>
                          </div>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>As defender</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.match_goals_made_as_defender} duration={2.1}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>As striker</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.match_goals_made_as_striker} duration={1.6}/></span>
                        </ListItem>
                        <ListItem style={userFeature}>
                          <span style={userFeatureLabel}>Conceded as defender</span>
                          <span style={userFeatureValue}><CountUp start={1200} end={stats.match_goals_conceded_as_defender} duration={1.45}/></span>
                        </ListItem>
                      </List>
                    </GridListTile>
                  </CardContent>
                </Collapse>
              </Card>


          </GridListTile>

        </GridList>
      </Layout>
    )
  }
}

const StatsListItem = ({text}) => {
  return (
    <ListItemText
      primaryTypographyProps={{
        style: {
          fontSize: 12
        }
      }}
      primary={text}
    />
  )
}

export default withStyles(styles)(UpdateUser)

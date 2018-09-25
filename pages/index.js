import withTitle from '../components/hoc/WithTitle'

import Link from 'next/link'
import Layout from '../components/Layout.js'
import { getMatchesList } from '../lib/api/match'
import {
  styleLoadMoreButton,
  styleMatchScore,
  styleMatchDifference,
  styleMatchTile,
  stylePlayerScore,
  styleTeamTile,
  styleTeamPlayer
} from '../lib/ListOfMatches.js'
import { SoccerIcon } from '../components/IconComponents'

import { withStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import ListIcon from '@material-ui/icons/List'
import { Divider, Typography } from '@material-ui/core'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'

const elementPerPage = 6

const styles = theme => ({
  chipsLabel: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  winBadge: {
    backgroundColor: green[500],
    fontSize: '13px',
    fontWeight: '700',
  },
  loseBadge: {
    backgroundColor: red[500],
    colorPrimary: red[500],
    fontSize: '13px',
    fontWeight: '700',
    left: '30px',
  },
  styleTeamTile: {
    width:'calc(100% - 60px) !important' ,
    [theme.breakpoints.up('sm')]: {
      width:'calc(50% - 60px) !important',
    }
  },
  styleTeamTileLast: {
    width:'calc(100% - 60px) !important' ,
    [theme.breakpoints.up('sm')]: {
      width:'calc(50% - 60px) !important',
      order: '2',
    }
  }
})

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadMoreActive: true,
      matchesObj: {},
      matchesFetchedCount: 0,
      numMatches: 0
    }
    this.loadMore = this.loadMore.bind(this);
  }

  async componentDidMount () {
    try {
      const data = await getMatchesList(0, elementPerPage, true)

      const matchesObj = this.prepareMatchData(data.matches)
      const matchesFetchedCount = data.matches.length
      const numMatches = data.count

      this.setState({ matchesObj, matchesFetchedCount, numMatches })
    } catch (err) {
      console.log(err)
    }
  }

  loadMore () {
    if(this.state.loadMoreActive === true) {
      this.setState({ loadMoreActive: false })
      try {
        getMatchesList(this.state.matchesFetchedCount, elementPerPage).then((newMatches) => {
          const matchesObj = this.prepareMatchData(newMatches.matches)
          const matchesFetchedCount = newMatches.matches.length + this.state.matchesFetchedCount
          this.setState({ matchesObj, matchesFetchedCount, loadMoreActive: this.state.numMatches > matchesFetchedCount})
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  /**
   * Group match data by createdAt date
   * @param {array} data - matches array
   * @returns {object} grouped matches
   */
  prepareMatchData (data) {
    const matches = this.state.matchesObj
    data.forEach(item => {
      const currDate = this.convertDate(item.createdAt)
      if (currDate in matches) {
        matches[currDate].matches.push(item)
      } else {
        matches[currDate] = {
          matches: [item]
        }
      }
    })

    return matches
  }

  convertDate (inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
  }

  differenceTile = (hasWin, classes, difference, styleMatchDifference) => (
    <Badge
      color={hasWin ? 'primary' : 'secondary'}
      classes={{
        colorPrimary: classes.winBadge,
        colorSecondary: classes.loseBadge
      }}
      badgeContent={<small>{hasWin ? difference : - difference}</small>}
      style={styleMatchDifference}
    />
  )

  matchTile = (label, matches) => (
    <GridListTile style={styleMatchTile} key={label}>
      <Typography>
        {label}
      </Typography>
      <Divider />
      <GridList style={{margin: '0 auto', maxWidth: '100%'}}>
        {matches.map(match => (
          <GridListTile style={styleMatchTile} key={match.slug}>
            <GridList style={{lineHeight: '13px'}}>
              <GridListTile style={styleTeamTile('left')} className={this.props.classes.styleTeamTile}>
                <Chip
                  avatar={<Avatar src={match.teamHome.defender.avatarUrl} />}
                  label={match.teamHome.defender.name}
                  style={styleTeamPlayer('left')}
                />
                <Chip
                  avatar={<Avatar src={match.teamHome.striker.avatarUrl} />}
                  label={match.teamHome.striker.name}
                  style={styleTeamPlayer('left')}
                />
                {
                  this.differenceTile(
                    (match.teamHome.score > match.teamAway.score),
                    this.props.classes,
                    match.difference,
                    styleMatchDifference
                  )
                }
              </GridListTile>
              <GridListTile style={styleMatchScore}>
                <Link as={`/match/${match._id}`} href={`/matches/detail/?slug=${match._id}`}>
                  <Button variant="fab" mini color="primary">
                    {match.teamHome.score}
                  </Button>
                </Link>
                <Badge color="secondary" badgeContent={<small>{match.teamHome.defScore}</small>} style={stylePlayerScore('defender','home')}> </Badge>
                <Badge color="secondary" badgeContent={<small>{match.teamHome.strScore}</small>} style={stylePlayerScore('striker','home')}> </Badge>
              </GridListTile>
              <GridListTile style={styleTeamTile('right')} className={this.props.classes.styleTeamTileLast}>
                <Chip
                  avatar={<Avatar src={match.teamAway.defender.avatarUrl} />}
                  classes={{label: this.props.classes.chipsLabel}}
                  label={match.teamAway.defender.name}
                  style={styleTeamPlayer('right')}
                />
                <Chip
                  avatar={<Avatar src={match.teamAway.striker.avatarUrl} />}
                  label={match.teamAway.striker.name}
                  style={styleTeamPlayer('right')}
                />
                {
                  this.differenceTile(
                    (match.teamAway.score > match.teamHome.score),
                    this.props.classes,
                    match.difference,
                    styleMatchDifference
                  )
                }
              </GridListTile>
              <GridListTile style={styleMatchScore}>
                <Link as={`/match/${match._id}`} href={`/matches/detail/?slug=${match._id}`}>
                  <Button variant="fab" mini color="primary">
                    {match.teamAway.score}
                  </Button>
                </Link>
                <Badge color="secondary" badgeContent={<small>{match.teamAway.defScore}</small>} style={stylePlayerScore('defender','away')}> </Badge>
                <Badge color="secondary" badgeContent={<small>{match.teamAway.strScore}</small>} style={stylePlayerScore('striker','away')}> </Badge>
              </GridListTile>
            </GridList>
          </GridListTile>
        ))}
      </GridList>
    </GridListTile>
  )

  render () {
    const { matchesObj } = this.state
    return (
      <Layout>
        <Grid container spacing={16}>
          <Grid container justify="center" alignItems="center" spacing={24}>
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
        </Grid>
        {/* New grouped matches list */}
        <GridList style={{margin: '0 auto', maxWidth: '768px'}}>
          {Object.keys(matchesObj).map(matchKey => (
            this.matchTile(matchKey,  matchesObj[matchKey].matches)
          ))}
        </GridList>
        <Button
          color="primary"
          disabled={!this.state.loadMoreActive}
          onClick={this.loadMore}
          style={styleLoadMoreButton(this.state.loadMoreActive)}
          type="button"
          variant="contained"
        >
          Load more
        </Button>
      </Layout>
    )
  }
}

export default withTitle('Home | Scoreza')(withStyles(styles)(Index))

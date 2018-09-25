import Button from '@material-ui/core/Button'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import React from 'react'
import Router from 'next/router'
import getRootUrl from '../../lib/api/getRootUrl'
import Layout from '../../components/Layout.js'
import { addNewMatch } from '../../lib/api/match'
import { getUsersList } from '../../lib/api/users'
import ReactAudioPlayer from 'react-audio-player'
import { withStyles } from '@material-ui/core/styles'

import {
  styleMatchScore,
  styleMatchTile,
  stylePlayerScore,
  styleTeamTile,
  styleTeamPlayer
} from '../../lib/ListOfMatches.js'


import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import { Typography, Divider, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanelActions, Badge } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'


const styles = theme => ({
  styleTeamTile: {
    width: 'calc(100% - 60px) !important',
    [theme.breakpoints.up('sm')]: {
      width: 'calc(50% - 60px) !important',
    }
  },

  styleButtonGo: {
    margin: '40px 0 -40px',
    [theme.breakpoints.up('sm')]: {
      margin: '0',
    }
  },

  styleAwayTeam: {
    [theme.breakpoints.up('sm')]: {
      order: '2',
    }
  }
})

const defaultPlayer = {
  _id: 'default',
  avatarUrl: `${getRootUrl()}/img/user_placeholder.jpg`,
  name: '',
  selected: false,
  showNames: false
}

const matchViewState = {
  PLAYER_SELECTION: 'PLAYER_SELECTION',
  TEAMS_COMPLETE: 'TEAMS_COMPLETE',
  SCORE_SELECTION: 'SCORE_SELECTION'
}

class AddMatch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      homeDefender: defaultPlayer,
      homeStriker: defaultPlayer,

      awayDefender: defaultPlayer,
      awayStriker: defaultPlayer,

      selectedPlayers: 0,

      arrSelectedPlayerIndex: [],

      matchView: matchViewState.PLAYER_SELECTION,

      matchScore: '0 - 0',

      homeScore: 0,
      awayScore: 0,

      homeScoreDefender: 0,
      homeScoreStriker: 0,
      awayScoreDefender: 0,
      awayScoreStriker: 0,

      canSave: false,
      canSaveDetail: false,

      expanded: 'panelMatchGoals',



      activeSelection: null,
      awayDefenderSelected: false,
      awayGoals: NaN,
      awayGoalsDefender: NaN,
      awayGoalsStriker: NaN,
      awayStrikerSelected: false,
      badges: [],
      enableScore: false,
      homeDefenderSelected: false,
      homeGoals: NaN,
      homeGoalsDefender: NaN,
      homeGoalsStriker: NaN,
      homeStrikerSelected: false,
      matchAdded: false,
      backgroundSoundTracks: [
        'theKingOfFighters.aac',
        'ESAKA.aac',
        'BurningD.N.A.aac'
      ],
      currentSoundTrack: -1,
      showScores: false
    }
  }

  async componentDidMount () {
    try {
      await this.loadAudio(document.getElementById('background_audio'), { src: this.getBackgroundAudio(), volume: 1.0 }).then(() => {
        this.startAudio(document.getElementById('background_audio'), { volume: 1.0 })
      })
    } catch (err) {
      console.log(err)
    }
  }

  static async getInitialProps() {
    const players = await getUsersList()
    return {
      players
    }
  }

  handleExpandChange = panel => (event, expanded) => {
    if(expanded) {
      this.setState({
        expanded: panel,
        homeScore: 0,
        awayScore: 0,
        homeScoreDefender: 0,
        homeScoreStriker: 0,
        awayScoreDefender: 0,
        awayScoreStriker: 0,
        canSave: false,
      })
    }
  }

  onMatchStart = () => {
    if (this.state.selectedPlayers === 4) {
      this.setState({ matchView: matchViewState.TEAMS_COMPLETE }, () => { this.createAndStartAudio(getRootUrl() + '/sound/go.aac') })
    }
  }

  onPlayerSelect = (player, index) => {
    this.createAndStartAudio(getRootUrl() + '/sound/player_selection.aac')
    let selectedIndexes = this.state.arrSelectedPlayerIndex
    if (!selectedIndexes.includes(index)) {
      const playersCount = this.state.selectedPlayers + 1
      selectedIndexes.push(index)
      if (this.state.homeDefender === defaultPlayer) {
        this.setState({ homeDefender: player, selectedPlayers: playersCount, arrSelectedPlayerIndex: selectedIndexes }, () => { this.isReady() })
      } else if (this.state.homeStriker === defaultPlayer) {
        this.setState({ homeStriker: player, selectedPlayers: playersCount, arrSelectedPlayerIndex: selectedIndexes }, () => { this.isReady() })
      } else if (this.state.awayDefender === defaultPlayer) {
        this.setState({ awayDefender: player, selectedPlayers: playersCount, arrSelectedPlayerIndex: selectedIndexes }, () => { this.isReady() })
      } else if (this.state.awayStriker === defaultPlayer) {
        this.setState({ awayStriker: player, selectedPlayers: playersCount, arrSelectedPlayerIndex: selectedIndexes }, () => { this.isReady() })
      }
    } else {
      const playersCount = this.state.selectedPlayers - 1
      selectedIndexes.splice(selectedIndexes.indexOf(index), 1)
      if (this.state.homeDefender === player) {
        this.setState({ homeDefender: defaultPlayer, selectedPlayers: playersCount, arrSelectedPlayerIndex: selectedIndexes }, () => { this.isReady() })
      } else if (this.state.homeStriker === player) {
        this.setState({ homeStriker: defaultPlayer, selectedPlayers: playersCount, arrSelectedPlayerIndex: selectedIndexes }, () => { this.isReady() })
      } else if (this.state.awayDefender === player) {
        this.setState({ awayDefender: defaultPlayer, selectedPlayers: playersCount, arrSelectedPlayerIndex: selectedIndexes }, () => { this.isReady() })
      } else if (this.state.awayStriker === player) {
        this.setState({ awayStriker: defaultPlayer, selectedPlayers: playersCount, arrSelectedPlayerIndex: selectedIndexes }, () => { this.isReady() })
      }
    }
  }

  onScoreSelection = (score, team) => {
    this.setState({ [`${team}Score`]: score }, () =>{
      const canSave = (this.state.homeScore > 5 && (this.state.homeScore - this.state.awayScore) > 1) ||
                    (this.state.awayScore > 5 && (this.state.awayScore - this.state.homeScore) > 1)
      this.setState({ canSave: canSave })
    })
  }

  onScoreSelectionAddOne = (score, team) => {
    this.setState({ [`${team}Score`]: score+1 }, () =>{
      const canSave = (this.state.homeScore > 5 && (this.state.homeScore - this.state.awayScore) > 1) ||
                    (this.state.awayScore > 5 && (this.state.awayScore - this.state.homeScore) > 1)
      this.setState({ canSave: canSave })
    })
  }

  onScorePlayerSelection = (score, team, role) => {
    this.setState({ [`${team}Score${role}`]: score }, () =>{
      const homeScore = this.state.homeScoreDefender + this.state.homeScoreStriker
      const awayScore = this.state.awayScoreDefender + this.state.awayScoreStriker
      const canSave = (homeScore > 5 && (homeScore - awayScore) > 1) ||
                    (awayScore > 5 && (awayScore - homeScore) > 1)
      this.setState({ canSaveDetail: canSave, homeScore: homeScore, awayScore: awayScore })
    })
  }

  onScorePlayerSelectionAddOne = (score, team, role) => {
    this.setState({ [`${team}Score${role}`]: score+1 }, () =>{
      const homeScore = this.state.homeScoreDefender + this.state.homeScoreStriker
      const awayScore = this.state.awayScoreDefender + this.state.awayScoreStriker
      const canSave = (homeScore > 5 && (homeScore - awayScore) > 1) ||
                    (awayScore > 5 && (awayScore - homeScore) > 1)
      this.setState({ canSaveDetail: canSave, homeScore: homeScore, awayScore: awayScore })
    })
  }

  calculateScoreAndBadges = () => {
    const scoreAndBadges = {
      badges: []
    }
    if (this.state.homeScore === 0 || this.state.awayScore === 0) {
      scoreAndBadges.badges.push('cappotto')
      this.createAndStartAudio(getRootUrl() + '/sound/perfect.aac')
    }

    if (this.state.homeScoreDefender + this.state.homeScoreStriker !== this.state.homeScore) {
      scoreAndBadges.homeScoreDefender = Math.floor(this.state.homeScore / 2)
      scoreAndBadges.homeScoreStriker = Math.ceil(this.state.homeScore / 2)
    } else {
      scoreAndBadges.homeScoreDefender = this.state.homeScoreDefender
      scoreAndBadges.homeScoreStriker = this.state.homeScoreStriker
    }

    if (this.state.awayScoreDefender + this.state.awayScoreStriker !== this.state.awayScore) {
      scoreAndBadges.awayScoreDefender = Math.floor(this.state.awayScore / 2)
      scoreAndBadges.awayScoreStriker = Math.ceil(this.state.awayScore / 2)
    } else {
      scoreAndBadges.awayScoreDefender = this.state.awayScoreDefender
      scoreAndBadges.awayScoreStriker = this.state.awayScoreStriker
    }

    return scoreAndBadges
  }

  saveMatch = async () => {
    const scoreAndBadges = this.calculateScoreAndBadges()
    const match = {
      teamHome: {
        defender: {
          _id: this.state.homeDefender._id,
          points: this.state.homeDefender.points,
          stats: this.state.homeDefender.stats
        },
        striker: {
          _id: this.state.homeStriker._id,
          points: this.state.homeStriker.points,
          stats: this.state.homeStriker.stats
        },
        score: this.state.homeScore,
        defScore: scoreAndBadges.homeScoreDefender,
        strScore: scoreAndBadges.homeScoreStriker,
        defBadges: [],
        strBadges: []
      },
      teamAway: {
        defender: {
          _id: this.state.awayDefender._id,
          points: this.state.awayDefender.points,
          stats: this.state.awayDefender.stats
        },
        striker: {
          _id: this.state.awayStriker._id,
          points: this.state.awayStriker.points,
          stats: this.state.awayStriker.stats
        },
        score: this.state.awayScore,
        defScore: scoreAndBadges.awayScoreDefender,
        strScore: scoreAndBadges.awayScoreStriker,
        defBadges: [],
        strBadges: []
      },
      badges: scoreAndBadges.badges
    }
    await addNewMatch(match)
  }

  onContinue = async () => {
    await this.saveMatch()
    this.setState({
      matchView: matchViewState.PLAYER_SELECTION,
      homeScore: 0,
      awayScore: 0,
      canSave: false,
      expanded: 'panelMatchGoals',
    })
  }

  getBackgroundAudio = () => {
    this.state.currentSoundTrack++
    if(this.state.backgroundSoundTracks.length <= this.state.currentSoundTrack) {
      this.state.currentSoundTrack = 0
    }
    return getRootUrl() + '/sound/' + this.state.backgroundSoundTracks[this.state.currentSoundTrack]
  }

  loadAudio = async (elem, params) => {
    let backgroundAudio = elem
    backgroundAudio.volume = params.volume;
    if (typeof(params.src) !== 'undefined') {
      backgroundAudio.src = params.src
      backgroundAudio.load()
    } else {
      backgroundAudio.play()
    }
  }

  startAudio = (elem, params) => {
    let backgroundAudio = elem
    backgroundAudio.volume = params.volume;
    backgroundAudio.play()
  }

  createAndStartAudio = (audioFile) => {
    var self = this;
    const flush = new Audio(audioFile)
    flush.volume= 1.0
    flush.play()
    flush.onended = () => {
      flush.remove()
    }
  }

  isReady = () => {
    if ( this.state.selectedPlayers === 4 ) {
      setTimeout( () => {
        this.createAndStartAudio(getRootUrl() + '/sound/ready.aac')
        }, 500 )
    }
  }

  onSave = async () => {
    await this.saveMatch()
    Router.push('/')
  }

  onNew = async () => {
    await this.saveMatch()
    this.setState({
      matchView: matchViewState.PLAYER_SELECTION,
      selectedPlayers: 0,
      arrSelectedPlayerIndex: [],
      homeDefender: defaultPlayer,
      homeStriker: defaultPlayer,
      awayDefender: defaultPlayer,
      awayStriker: defaultPlayer,
      homeScore: 0,
      awayScore: 0,
      canSave: false,
      expanded: 'panelMatchGoals',
    })
  }

  render () {
    return (
      <Layout>
        <ReactAudioPlayer
          id="background_audio"
          onEnded={( async (e) => {
                      this.loadAudio(
                        e.target,
                        {
                          src: this.getBackgroundAudio(),
                          volume: 0.3
                        }
                      ).then(() => {
                        this.startAudio(e.target, { volume: 0.3 })
                      })
                    })
                  }
        />
        <GridList style={{margin: '0 auto', maxWidth: '500px'}}>
          <GridListTile style={styleMatchTile}>
            <GridList style={{lineHeight: '15px'}}>
              <GridListTile style={styleTeamTile('left')} className={this.props.classes.styleTeamTile}>
                <Chip
                  avatar={<Avatar src={this.state.homeDefender.avatarUrl} />}
                  label={this.state.homeDefender.name}
                  style={styleTeamPlayer('left')}
                />
                <Chip
                  avatar={<Avatar src={this.state.homeStriker.avatarUrl} />}
                  label={this.state.homeStriker.name}
                  style={styleTeamPlayer('left')}
                />

              </GridListTile>


                {this.state.matchView === matchViewState.PLAYER_SELECTION &&
                  <GridListTile
                    className={this.props.classes.styleButtonGo}
                    style={{
                      height: 75,
                      paddingTop: 10,
                      width: 60,
                    }}
                  >
                    <Avatar
                      style={{
                        height: 55,
                        width: 55,
                        padding: 0,
                        backgroundColor: this.state.selectedPlayers === 4 ? 'green' : '#bdbdbd'
                      }}
                      onClick={this.onMatchStart}
                    >GO</Avatar>
                  </GridListTile>
                }
                {this.state.matchView === matchViewState.TEAMS_COMPLETE &&
                  <GridListTile
                    style={{
                      height: 'auto',
                      overflow: 'visible',
                      padding: '10px 0px',
                      width: 60,
                    }}
                  >
                    <Avatar
                      style={{
                        backgroundColor: '#01ad01',
                        fontSize: '1em',
                        height: 45,
                        margin: '4px 10px',
                        overflow: 'visible',
                        padding: '10px 0',
                        width: 45,
                      }}
                    >{`${this.state.homeScore}`}</Avatar>
                    <Badge color="secondary" badgeContent={<small>{this.state.homeScoreDefender}</small>}
                      style={{
                        left: 11,
                        position: 'absolute',
                        top: 11,
                        zIndex: 1,
                    }}/>
                    <Badge color="secondary" badgeContent={<small>{this.state.homeScoreStriker}</small>}
                      style={{
                        left: 11,
                        position: 'absolute',
                        top: 42,
                        zIndex: 1,
                    }}/>
                  </GridListTile>
                }

              <GridListTile style={styleTeamTile('right')} className={this.props.classes.styleTeamTile + ' ' + this.props.classes.styleAwayTeam }>
                <Chip
                  avatar={<Avatar src={this.state.awayDefender.avatarUrl} />}
                  label={this.state.awayDefender.name}
                  style={styleTeamPlayer('right')}
                />
                <Chip
                  avatar={<Avatar src={this.state.awayStriker.avatarUrl} />}
                  label={this.state.awayStriker.name}
                  style={styleTeamPlayer('right')}
                />
              </GridListTile>

              {this.state.matchView === matchViewState.TEAMS_COMPLETE &&
                  <GridListTile
                    style={{
                      height: 'auto',
                      overflow: 'visible',
                      paddingTop: 10,
                      width: 60,
                    }}
                  >
                    <Avatar
                      style={{
                        backgroundColor: '#01ad01',
                        fontSize: '1em',
                        height: 45,
                        margin: '4px 0px',
                        overflow: 'visible',
                        padding: '10px 0',
                        width: 45,
                      }}
                    >{`${this.state.awayScore}`}</Avatar>
                    <Badge color="secondary" badgeContent={<small>{this.state.awayScoreDefender}</small>}
                      style={{
                        right: 11,
                        position: 'absolute',
                        top: 11,
                        zIndex: 1,
                    }}/>
                    <Badge color="secondary" badgeContent={<small>{this.state.awayScoreStriker}</small>}
                      style={{
                        right: 11,
                        position: 'absolute',
                        top: 42,
                        zIndex: 1,
                    }}/>
                  </GridListTile>
                }
            </GridList>
          </GridListTile>
        </GridList>

        {this.state.matchView === matchViewState.PLAYER_SELECTION &&
          <Grid
            style={{margin: '0 auto', maxWidth: '100%'}}
          >
            {this.props.players.map((player, index) => (
              <PlayerChip
                index={index} 
                player={player}
                onSelection={this.onPlayerSelect}
                canSelect={this.state.selectedPlayers < 4}
                selected={this.state.arrSelectedPlayerIndex.includes(index)}
              />
            ))}
          </Grid>
        }

        {this.state.matchView === matchViewState.TEAMS_COMPLETE &&
          <div>
            <ExpansionPanel
              expanded={this.state.expanded === 'panelMatchGoals'}
              onChange={this.handleExpandChange('panelMatchGoals')}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>Game Goals</ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container justify="space-between">
                  <Grid item xs={6} sm={6}>Home</Grid>
                  <Grid item xs={6} sm={6}>Away</Grid>
                  <Grid item xs={6} sm={6}>
                    {[0, 1,2,3,4,5,6,7,8].map(item =>
                      <Button
                        key={`homeScore${item}`}
                        variant="contained"
                        style={{width: 'calc(33% - 6px)', margin: '3px', minWidth: 'initial'}}
                        onClick={this.onScoreSelection.bind(this, item, 'home')}
                      >{item}</Button>
                    )}
                    <Button
                      style={{width: 'calc(100% - 9px)', margin: '3px'}}
                      variant="contained"
                      onClick={this.onScoreSelectionAddOne.bind(this, this.state.homeScore, 'home')}
                    >+1</Button>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    {[0, 1,2,3,4,5,6,7,8].map(item =>
                      <Button
                        style={{width: 'calc(33% - 6px)', margin: '3px', minWidth: 'initial'}}
                        key={`homeScore${item}`}
                        variant="contained"
                        onClick={this.onScoreSelection.bind(this, item, 'away')}
                      >{item}</Button>
                    )}
                    <Button
                      style={{width: 'calc(100% - 9px)', margin: '3px'}}
                      variant="contained"
                      onClick={this.onScoreSelectionAddOne.bind(this, this.state.awayScore, 'away')}
                    >+1</Button>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
              <ExpansionPanelMatchActions
                canSave={this.state.canSave}
                onContinue={this.onContinue}
                onSave={this.onSave}
                onNew={this.onNew}
              />
            </ExpansionPanel>

            <ExpansionPanel
              expanded={this.state.expanded === 'panelRoleGoals'}
              onChange={this.handleExpandChange('panelRoleGoals')}
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>Goals by role</ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container justify="space-between">
                  <Grid item xs={6} sm={6}>Home Defender</Grid>
                  <Grid item xs={6} sm={6}>Home Striker</Grid>
                  <Grid item xs={6} sm={6}>
                    {[0, 1,2,3,4,5,6,7,8].map(item =>
                      <Button
                        key={`homeScoreDef${item}`}
                        variant="contained"
                        style={{width: 'calc(33% - 6px)', margin: '3px', minWidth: 'initial'}}
                        onClick={this.onScorePlayerSelection.bind(this, item, 'home', 'Defender')}
                      >{item}</Button>
                    )}
                    <Button
                      style={{width: 'calc(100% - 9px)', margin: '3px'}}
                      variant="contained"
                      onClick={this.onScorePlayerSelectionAddOne.bind(this, this.state.homeScoreDefender, 'home', 'Defender')}
                    >+1</Button>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    {[0, 1,2,3,4,5,6,7,8].map(item =>
                      <Button
                        key={`homeScoreStr${item}`}
                        variant="contained"
                        style={{width: 'calc(33% - 6px)', margin: '3px', minWidth: 'initial'}}
                        onClick={this.onScorePlayerSelection.bind(this, item, 'home', 'Striker')}
                      >{item}</Button>
                    )}
                    <Button
                      style={{width: 'calc(100% - 9px)', margin: '3px'}}
                      variant="contained"
                      onClick={this.onScorePlayerSelectionAddOne.bind(this, this.state.homeScoreStriker, 'home', 'Striker')}
                    >+1</Button>
                  </Grid>
                  <Grid item xs={6} sm={6} style={{marginTop: '20px'}}>Away Defender</Grid>
                  <Grid item xs={6} sm={6} style={{marginTop: '20px'}}>Away Striker</Grid>
                  <Grid item xs={6} sm={6}>
                    {[0, 1,2,3,4,5,6,7,8].map(item =>
                      <Button
                        key={`awayScoreDef${item}`}
                        variant="contained"
                        style={{width: 'calc(33% - 6px)', margin: '3px', minWidth: 'initial'}}
                        onClick={this.onScorePlayerSelection.bind(this, item, 'away', 'Defender')}
                      >{item}</Button>
                    )}
                    <Button
                      style={{width: 'calc(100% - 9px)', margin: '3px'}}
                      variant="contained"
                      onClick={this.onScorePlayerSelectionAddOne.bind(this, this.state.awayScoreDefender, 'away', 'Defender')}
                    >+1</Button>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    {[0, 1,2,3,4,5,6,7,8].map(item =>
                      <Button
                        key={`awayScoreStr${item}`}
                        variant="contained"
                        style={{width: 'calc(33% - 6px)', margin: '3px', minWidth: 'initial'}}
                        onClick={this.onScorePlayerSelection.bind(this, item, 'away', 'Striker')}
                      >{item}</Button>
                    )}
                    <Button
                      style={{width: 'calc(100% - 9px)', margin: '3px'}}
                      variant="contained"
                      onClick={this.onScorePlayerSelectionAddOne.bind(this, this.state.awayScoreStriker, 'away', 'Striker')}
                    >+1</Button>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
              <ExpansionPanelMatchActions
                canSave={this.state.canSaveDetail}
                onContinue={this.onContinue}
                onSave={this.onSave}
                onNew={this.onNew}
              />
            </ExpansionPanel>
          </div>
        }
      </Layout>
    )
  }
}

const ExpansionPanelMatchActions = ({
  canSave,
  onContinue,
  onSave,
  onNew
}) => (
  <ExpansionPanelActions>
    <Button
      size="small"
      color="primary"
      variant="contained"
      disabled={!canSave}
      onClick={onContinue}
    >
      Continue
    </Button>
    <Button
      size="small"
      color="primary"
      variant="contained"
      disabled={!canSave}
      onClick={onSave}
    >
      Save
    </Button>
    <Button
      size="small"
      color="primary"
      variant="contained"
      disabled={!canSave}
      onClick={onNew}
    >
      New
    </Button>
  </ExpansionPanelActions>
)

class PlayerChip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: false
    }
  }

  onSelection = () => {
    if (this.props.canSelect || this.props.selected) {
      this.props.onSelection(this.props.player, this.props.index)
    }
  }

  render() {
    const { player } = this.props
    const key = player.name.replace(/\s/g, '')
    return (
      <Button
        color={this.props.selected ? 'primary' : 'default'}
        key={key}
        variant="extendedFab"
        style={{
          height: 25,
          justifyContent: 'flex-start',
          margin: '15px 5px 0',
          minHeight: 25,
          overflow: 'hidden',
          padding: '0px 10px 0px 0px',
          width: 'calc(33% - 10px)',
        }}
        onClick={this.onSelection}
      >
        <Avatar
          src={player.avatarUrl}
          style={{
            height: 25,
            width: 25,
            marginRight: 5,
          }}
        />
        <Typography style={{whiteSpace: 'nowrap', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'calc(33vw - 52px)', textAlign: 'left'}}>
          {player.name}
        </Typography>
      </Button>
    )
  }
}

export default withStyles(styles)(AddMatch)

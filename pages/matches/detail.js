import Button from '@material-ui/core/Button'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import React from 'react'
import Router from 'next/router'
import getRootUrl from '../../lib/api/getRootUrl'
import Layout from '../../components/Layout.js'
import MatchPlayerHeader from '../../components/MatchPlayerHeader'
import MatchPlayerSelection from '../../components/MatchPlayerSelection'
import PinnedSubheaderList from '../../components/PinnedSubheaderList'
import { addNewMatch } from '../../lib/api/match'
import { getUsersList } from '../../lib/api/users'

import { getMatchBySlug } from '../../lib/api/match'

import { styleForm } from '../../lib/SharedStyles'

const defaultPlayer = {
  _id: 'default',
  avatarUrl: `${getRootUrl()}/img/user_placeholder.jpg`,
  name: '',
  selected: false,
  showNames: false
}

class DetailMatch extends React.Component {
  constructor (props) {
    console.log(props)
    super(props)
    this.state = {
    //   activeSelection: null,
      awayDefender: defaultPlayer,
    //   awayDefenderSelected: false,
      awayGoals: NaN,
      awayGoalsDefender: NaN,
      awayGoalsStriker: NaN,
      awayStriker: defaultPlayer,
    //   awayStrikerSelected: false,
    //   badges: [],
    //   enableScore: false,
      homeDefender: defaultPlayer,
    //   homeDefenderSelected: false,
      homeGoals: NaN,
      homeGoalsDefender: NaN,
      homeGoalsStriker: NaN,
      homeStriker: defaultPlayer,
    //   homeStrikerSelected: false,
    //   matchAdded: false,
    //   search: '',
    //   showSelectionList: false
      slug: props.url.query.slug
    }

    this.onSelectPlayer = this.onSelectPlayer.bind(this)
  }

  async componentDidMount () {
    try {
      const data = await getMatchBySlug(this.state.slug).then( (data) => {
        this.setState({
          homeDefender: data.teamHome.defender,
          homeStriker: data.teamHome.striker,
          awayDefender: data.teamAway.defender,
          awayStriker: data.teamAway.striker,
          homeGoals: data.teamHome.score,
          homeGoalsDefender: data.teamHome.defScore,
          homeGoalsStriker: data.teamHome.strScore,
          awayGoals: data.teamAway.score,
          awayGoalsDefender: data.teamAway.defScore,
          awayGoalsStriker: data.teamAway.strScore
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  handleScoreChange = name => event => {
    const teamObj = Object.assign({}, this.state[name], {score: event.target.value})
    this.setState({
      [name]: teamObj
    })
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const match = await addNewMatch({
      teamHome: this.state.teamHome,
      teamAway: this.state.teamAway,
      badges: []
    })

    this.setState({matchAdded: true})
    Router.push('/matches')
  }

  onSelectPlayer = player => {
    this.setState(
      {
        [`${this.state.activeSelection}`]: player,
        activeSelection: null,
        showSelectionList: false
      })
  }

  showPlayersSelect = pointer => () => {
    this.setState({
      activeSelection: pointer,
      showSelectionList: true
    })
  }

  onScoreChange = params => {
    const {value, selector} = params
    this.setState({[selector]: value})
  }

  calculateScoreAndBadges = () => {
    const scoreAndBadges = {
      badges: []
    }
    if (this.state.homeGoals === 0 || this.state.awayGoals === 0) {
      scoreAndBadges.badges.push('cappotto')
    }

    if (this.state.homeGoalsDefender + this.state.homeGoalsStriker !== this.state.homeGoals) {
      scoreAndBadges.homeGoalsDefender = Math.floor(this.state.homeGoals / 2)
      scoreAndBadges.homeGoalsStriker = Math.ceil(this.state.homeGoals / 2)
    } else {
      scoreAndBadges.homeGoalsDefender = this.state.homeGoalsDefender
      scoreAndBadges.homeGoalsStriker = this.state.homeGoalsStriker
    }

    if (this.state.awayGoalsDefender + this.state.awayGoalsStriker !== this.state.awayGoals) {
      scoreAndBadges.awayGoalsDefender = Math.floor(this.state.awayGoals / 2)
      scoreAndBadges.awayGoalsStriker = Math.ceil(this.state.awayGoals / 2)
    } else {
      scoreAndBadges.awayGoalsDefender = this.state.awayGoalsDefender
      scoreAndBadges.awayGoalsStriker = this.state.awayGoalsStriker
    }

    return scoreAndBadges
  }

  onSave = async () => {
    const scoreAndBadges = this.calculateScoreAndBadges()
    const match = {
      teamHome: {
        defender: {
          _id: this.state.homeDefender._id,
          points: this.state.homeDefender.points
        },
        striker: {
          _id: this.state.homeStriker._id,
          points: this.state.homeStriker.points
        },
        score: this.state.homeGoals,
        defScore: scoreAndBadges.homeGoalsDefender,
        strScore: scoreAndBadges.homeGoalsStriker,
        defBadges: [],
        strBadges: []
      },
      teamAway: {
        defender: {
          _id: this.state.awayDefender._id,
          points: this.state.awayDefender.points
        },
        striker: {
          _id: this.state.awayStriker._id,
          points: this.state.awayStriker.points
        },
        score: this.state.awayGoals,
        defScore: scoreAndBadges.awayGoalsDefender,
        strScore: scoreAndBadges.awayGoalsStriker,
        defBadges: [],
        strBadges: []
      },
      badges: scoreAndBadges.badges
    }
    await addNewMatch(match)

    Router.push('/matches')
  }

  render () {

    return (
      <Layout>
        <GridList
          cols={2}
        >
          <MatchPlayerHeader
            enableScore
            onScoreChange={this.onScoreChange}
            selector={'homeGoals'}
            teamLabel={'Team Home'}
            disableScore={ true }
            scores={ { "score": this.state.homeGoals, "defScore": this.state.homeGoalsDefender, "strScore": this.state.homeGoalsStriker } }
          />
          <MatchPlayerSelection
            disableSelection
            player={this.state.homeDefender}
            selectionHandler={this.showPlayersSelect('homeDefender')}
          />
          <MatchPlayerSelection
            disableSelection
            player={this.state.homeStriker}
            selectionHandler={this.showPlayersSelect('homeStriker')}
          />
          <MatchPlayerHeader
            enableScore
            onScoreChange={this.onScoreChange}
            selector={'awayGoals'}
            teamLabel={'Team Away'}
            disableScore={ true }
            scores = { this.state.teamAway }
            scores={ { "score": this.state.awayGoals, "defScore": this.state.awayGoalsDefender, "strScore": this.state.awayGoalsStriker } }
          />
          <MatchPlayerSelection
            disableSelection
            player={this.state.awayDefender}
            selectionHandler={this.showPlayersSelect('awayDefender')}
          />
          <MatchPlayerSelection
            disableSelection
            player={this.state.awayStriker}
            selectionHandler={this.showPlayersSelect('awayStriker')}
          />

        </GridList>
      </Layout>
    )
  }
}

export default DetailMatch

const express = require('express')

const router = express.Router()

const { createEventAdapter } = require('@slack/events-api')
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET)

const Match = require('../../models/Match')
const User = require('../../models/User')
const slack = require('../../lib/slack')

const rankify = require('../../lib/rankify')

router.post('/', async (req, res) => {
  slackEvents.expressMiddleware()
  var value = req.body.event.text
  // var value = '<@UCPLWJ6E5> <@UCS26NM6C> - <@UCQHH9YRK> <@UCSDP1Z4H> : 6-0'
  const newMatchPattern = /^(<@[A-Z0-9]{9,}>) (<@[A-Z0-9]{9,}>) - (<@[A-Z0-9]{9,}>) (<@[A-Z0-9]{9,}>) : (0?[1-9][0-9]|[0-9])-(0?[1-9][0-9]|[0-9])/gm
  const command = value.replace(process.env.SLACK_BOT_ID + ' ', '')
  const condition = command.match(newMatchPattern)
  console.log('COMMAND => ', command)
  if ( condition !== null) {
    const [ teams, scores ] = command.split(' : ')
    const [ homeTeam, awayTeam ] = teams.split(' - ')
    const [ homeDef, homeStr ] = homeTeam.split(' ')
    const [ awayDef, awayStr ] = awayTeam.split(' ')
    const [ homeScore, awayScore ] = scores.split('-')
    Promise.all([
      await findPlayerPromise(homeDef, "Home Defender"),
      await findPlayerPromise(homeStr, "Home Striker"),
      await findPlayerPromise(awayDef, "Away Defender"),
      await findPlayerPromise(awayStr, "Away Striker")
    ]).then((rs) => {
      const scoreAndBadges = calculateScoreAndBadges(homeScore, awayScore)
      const createdAt = new Date().toISOString()
      const slug = Match.generateSlug()
      const rank = rankify.calculate({
        teamHome: {
          defender: rs[0][0],
          striker: rs[1][0],
          score: homeScore,
        },
        teamAway: {
          defender: rs[2][0],
          striker: rs[3][0],
          score: awayScore,
        }
      })
      const matchData = {
        teamHome: {
          defBadges: [],
          strBadges: [],
          defender: rs[0][0],
          striker: rs[1][0],
          score: homeScore,
          defScore: scoreAndBadges.homeScoreDefender,
          strScore: scoreAndBadges.homeScoreStriker
        },
        teamAway: {
          defBadges: [],
          strBadges: [],
          defender: rs[2][0],
          striker: rs[3][0],
          score: awayScore,
          defScore: scoreAndBadges.awayScoreDefender,
          strScore: scoreAndBadges.awayScoreStriker
        },
        badges: scoreAndBadges.badges,
        slug: slug,
        createdAt: createdAt,
        difference: rank.difference
      }
      const newMatch = new Match(matchData)
      newMatch.save(function (err) {
        if (err) return res.json({ error: err.message || err.toString() })

        const scoreHD = {
          id: matchData.teamHome.defender._id,
          score: rank.homeDefense,
          stats: calculateStats(matchData.teamHome.defender, true, rank.hasHomeWin, matchData.teamHome, matchData.teamAway, rank.difference, rank.homeDefense),
          res
        }
        updateUser(scoreHD)

        const scoreHS = {
          id: matchData.teamHome.striker._id,
          score: rank.homeStriker,
          stats: calculateStats(matchData.teamHome.striker, false, rank.hasHomeWin, matchData.teamHome, matchData.teamAway, rank.difference, rank.homeStriker),
          res
        }
        updateUser(scoreHS)

        const scoreAD = {
          id: matchData.teamAway.defender._id,
          score: rank.awayDefense,
          stats: calculateStats(matchData.teamAway.defender, true, !rank.hasHomeWin, matchData.teamAway, matchData.teamHome, rank.difference, rank.awayDefense),
          res
        }
        updateUser(scoreAD)

        const scoreAS = {
          id: matchData.teamAway.striker._id,
          score: rank.awayStriker,
          stats: calculateStats(matchData.teamAway.striker, false, !rank.hasHomeWin, matchData.teamAway, matchData.teamHome, rank.difference, rank.awayStriker),
          res
        }
        updateUser(scoreAS)
        slack.sendMessage(
          `
          --- Match Successfully Inserted ---
          ${matchData.teamHome.defender.name} + ${matchData.teamHome.striker.name} : ${matchData.teamHome.score}
          vs
          ${matchData.teamAway.defender.name} + ${matchData.teamAway.striker.name} : ${matchData.teamAway.score}
          `, 
          process.env.SLACK_TOKEN,
          process.env.SLACK_CHANNEL_ID
        )
      })    
    }).catch((e) => {
      console.log(e)
    })
    


    // tasks.reduce(function(cur, next) {
    //     return cur.then(next);
    // }, RSVP.resolve()).then(function(rs) {
    //   console.log(rs)
    //   slack.sendMessage(
    //     `
    //     --- Match data ---
    //     ${homeTeam} : ${homeScore}
    //     vs
    //     ${awayTeam} : ${awayScore}
    //     `, 
    //     process.env.SLACK_TOKEN,
    //     process.env.SLACK_CHANNEL_ID
    //   )
    // });
  }

  if ( command === 'man') {
    slack.sendMessage(
      `Welcome to scoreza slack manual syntax:

      --- Add new match: 
      @homeDef @homeStr - @awayDef @awayStr : homeScore-awayScore

      --- Add new user: (-WORK IN PROGRESS-)
      @playerSlack Name http://imageUrl
      `, 
      process.env.SLACK_TOKEN,
      process.env.SLACK_CHANNEL_ID
    )
  }
  res.json({ "challenge": req.body.challenge })
})

// slackEvents.on('message', (event) => {
//   console.log('Events: ')
//   console.log(event)
//   slack.sendMessage(
//     '1Command Key Found!!!', 
//     process.env.SLACK_TOKEN,
//     process.env.SLACK_CHANNEL_ID
//   )
  
  
//   // const { teamAway, teamHome, badges } = req.body

//   // const slug = Match.generateSlug()
//   // const createdAt = new Date().toISOString()

//   // const rank = rankify.calculate({
//   //   teamHome,
//   //   teamAway
//   // })
//   // const matchData = {
//   //   teamHome,
//   //   teamAway,
//   //   badges,
//   //   slug,
//   //   createdAt,
//   //   difference: rank.difference
//   // }

//   // const newMatch = new Match(matchData)
//   // newMatch.save(function (err) {
//   //   if (err) return res.json({ error: err.message || err.toString() })

//   //   const scoreHD = {
//   //     id: teamHome.defender._id,
//   //     score: rank.homeDefense,
//   //     stats: calculateStats(teamHome.defender, true, rank.hasHomeWin, teamHome, teamAway, rank.difference, rank.homeDefense),
//   //     res
//   //   }
//   //   updateUser(scoreHD)

//   //   const scoreHS = {
//   //     id: teamHome.striker._id,
//   //     score: rank.homeStriker,
//   //     stats: calculateStats(teamHome.striker, false, rank.hasHomeWin, teamHome, teamAway, rank.difference, rank.homeStriker),
//   //     res
//   //   }
//   //   updateUser(scoreHS)

//   //   const scoreAD = {
//   //     id: teamAway.defender._id,
//   //     score: rank.awayDefense,
//   //     stats: calculateStats(teamAway.defender, true, !rank.hasHomeWin, teamAway, teamHome, rank.difference, rank.awayDefense),
//   //     res
//   //   }
//   //   updateUser(scoreAD)

//   //   const scoreAS = {
//   //     id: teamAway.striker._id,
//   //     score: rank.awayStriker,
//   //     stats: calculateStats(teamAway.striker, false, !rank.hasHomeWin, teamAway, teamHome, rank.difference, rank.awayStriker),
//   //     res
//   //   }
//   //   updateUser(scoreAS)

//   //   res.json(newMatch)
//   // })
// })

const calculateScoreAndBadges = (homeScore, awayScore) => {
  const scoreAndBadges = {
    badges: []
  }
  if (homeScore === 0 || awayScore === 0) {
    scoreAndBadges.badges.push('cappotto')
  }
  scoreAndBadges.homeScoreDefender = Math.floor(homeScore / 2)
  scoreAndBadges.homeScoreStriker = Math.ceil(homeScore / 2)
  // if (this.state.homeScoreDefender + this.state.homeScoreStriker !== this.state.homeScore) {
  //   scoreAndBadges.homeScoreDefender = Math.floor(this.state.homeScore / 2)
  //   scoreAndBadges.homeScoreStriker = Math.ceil(this.state.homeScore / 2)
  // }
  // else {
  //   scoreAndBadges.homeScoreDefender = this.state.homeScoreDefender
  //   scoreAndBadges.homeScoreStriker = this.state.homeScoreStriker
  // }
  scoreAndBadges.awayScoreDefender = Math.floor(awayScore / 2)
  scoreAndBadges.awayScoreStriker = Math.ceil(awayScore / 2)
  // if (this.state.awayScoreDefender + this.state.awayScoreStriker !== this.state.awayScore) {
  //   scoreAndBadges.awayScoreDefender = Math.floor(this.state.awayScore / 2)
  //   scoreAndBadges.awayScoreStriker = Math.ceil(this.state.awayScore / 2)
  // }
  // else {
  //   scoreAndBadges.awayScoreDefender = this.state.awayScoreDefender
  //   scoreAndBadges.awayScoreStriker = this.state.awayScoreStriker
  // }

  return scoreAndBadges
}

const calculateStats = (user, isDefender, winner, team, oppositeTeam, rankDifference, newPoints) => {
  const currentStats = user.stats
  const winAgain = winner && currentStats.last_winned
  const looseAgain = !winner && !currentStats.last_winned

  return {
    win_streak: winner ? currentStats.win_streak + 1 : 0,
    max_win_streak: winAgain ? currentStats.max_win_streak + 1 : currentStats.max_win_streak,
    points_trend:
      winAgain ? currentStats.points_trend + Math.abs(rankDifference) :
        winner ? Math.abs(rankDifference) :
          looseAgain ? currentStats.points_trend - Math.abs(rankDifference) : - Math.abs(rankDifference),
    points_max: newPoints > currentStats.points_max ? newPoints : currentStats.points_max,
    points_min: newPoints < currentStats.points_min ? newPoints : currentStats.points_min,
    match_played: currentStats.match_played + 1,
    match_win: currentStats.match_win + (winner ? 1 : 0),
    match_as_defender: currentStats.match_as_defender + (isDefender ? 1 : 0),
    match_as_striker: currentStats.match_as_striker + (!isDefender ? 1 : 0),
    win_as_defender: currentStats.win_as_defender + (winner && isDefender ? 1 : 0),
    win_as_striker: currentStats.win_as_striker + (winner && !isDefender ? 1 : 0),
    match_goals_made: currentStats.match_goals_made + team.score,
    match_goals_conceded: currentStats.match_goals_conceded + oppositeTeam.score,
    match_goals_made_as_defender: currentStats.match_goals_made_as_defender + (isDefender ? team.defScore : 0),
    match_goals_made_as_striker: currentStats.match_goals_made_as_striker + (!isDefender ? team.strScore : 0),
    match_goals_conceded_as_defender: currentStats.match_goals_conceded_as_defender + (isDefender ? oppositeTeam.score : 0),
    match_crawl: currentStats.match_crawl + (winner && oppositeTeam.score === 0 ? 1 : 0),
    match_crawled: currentStats.match_crawled + (!winner && team.score === 0 ? 1 : 0),
    last_winned: winner
  }
}

const findPlayerPromise = async (homeDef, position) => {
  const rs = await User.find({ slackID: homeDef })
  if (!rs || rs.length <= 0) return res.json({ error: `Unable to find ${position} player.` })
  return rs
}

const updateUser = ({id, score, stats, res}) => {
  const query = { _id: id }
  User.findOneAndUpdate(query, { points: score, stats: stats }, {}, function (err, rs) {
    if (err) return res.json({ error: err.message || err.toString() })
  })
}

module.exports = router

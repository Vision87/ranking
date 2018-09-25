const express = require('express')

const router = express.Router()

const Match = require('../../models/Match')
const User = require('../../models/User')

const rankify = require('../../lib/rankify')

router.post('/', (req, res) => {
  const { teamAway, teamHome, badges } = req.body

  const slug = Match.generateSlug()
  const createdAt = new Date().toISOString()

  const rank = rankify.calculate({
    teamHome,
    teamAway
  })
  const matchData = {
    teamHome,
    teamAway,
    badges,
    slug,
    createdAt,
    difference: rank.difference,
    difference2: rank.difference2
  }

  const newMatch = new Match(matchData)
  newMatch.save(function (err) {
    if (err) return res.json({ error: err.message || err.toString() })

    const scoreHD = {
      id: teamHome.defender._id,
      score: rank.homeDefense,
      score2: rank.homeDefense2,
      stats: calculateStats(teamHome.defender, true, rank.hasHomeWin, teamHome, teamAway, rank.difference, rank.homeDefense),
      res
    }
    updateUser(scoreHD)

    const scoreHS = {
      id: teamHome.striker._id,
      score: rank.homeStriker,
      score2: rank.homeStriker2,
      stats: calculateStats(teamHome.striker, false, rank.hasHomeWin, teamHome, teamAway, rank.difference, rank.homeStriker),
      res
    }
    updateUser(scoreHS)

    const scoreAD = {
      id: teamAway.defender._id,
      score: rank.awayDefense,
      score2: rank.awayDefense2,
      stats: calculateStats(teamAway.defender, true, !rank.hasHomeWin, teamAway, teamHome, rank.difference, rank.awayDefense),
      res
    }
    updateUser(scoreAD)

    const scoreAS = {
      id: teamAway.striker._id,
      score: rank.awayStriker,
      score2: rank.awayStriker2,
      stats: calculateStats(teamAway.striker, false, !rank.hasHomeWin, teamAway, teamHome, rank.difference, rank.awayStriker),
      res
    }
    updateUser(scoreAS)

    res.json(newMatch)
  })
})

const defaultStats = {
  win_streak: 0, // current matches winned in row
  max_win_streak: 0, // max matches winned in row
  points_trend: 0, // trend positive or negative
  points_max: 1200, // max points reached
  points_min: 1200, // min points reached
  match_played: 0, // number of matches played
  match_win: 0, // matches win
  match_crawl: 0, // matches win with 6 - 0
  match_crawled: 0, // matches loose with 6 - 0
  match_as_defender: 0, // matches played as defender
  match_as_striker: 0, // matches played as striker
  win_as_defender: 0, // matches win as defender
  win_as_striker: 0, // matches win as striker
  match_goals_made: 0,
  match_goals_conceded: 0,
  match_goals_made_as_defender: 0,
  match_goals_made_as_striker: 0,
  match_goals_conceded_as_defender: 0,
  last_winned: false,
  last_matches: []
}

const calculateStats = (user, isDefender, winner, team, oppositeTeam, rankDifference, newPoints) => {
  const currentStats = Object.keys(user.stats).length > 2 ? user.stats : defaultStats

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

const updateUser = ({id, score, score2, stats, res}) => {
  const query = { _id: id }
  User.findOneAndUpdate(query, { points: score, points2: score2, stats: stats }, {}, function (err, rs) {
    if (err) {
      console.error(err)
      return res.json({ error: err.message || err.toString() })
    }
  })
}

module.exports = router

const express = require('express')
const router = express.Router()
const Match = require('../../models/Match')
const User = require('../../models/User')
const { GetMatchesStartingFromDateAndUsersFromMatchId } = require('./helper')

router.route('/').post(async (req, res) => {
  const { matchId } = req.body

  const result = await GetMatchesStartingFromDateAndUsersFromMatchId(matchId)

  result.matches.forEach(async match => {
    const query = { _id: match._id }
    const update = { difference: match.difference, difference2: match.difference2 }
    await Match.findOneAndUpdate(query, update, (err, doc) => {})
  })

  Object.keys(result.users).forEach(async key => {
    const query = { _id: result.users[key].id }
    const update = { points: result.users[key].points, points2: result.users[key].points2 }

    await User.findOneAndUpdate(query, update, (err, doc) => {})
  })

  res.json({
    success: true,
    updates: result
  })
})

module.exports = router

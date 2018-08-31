
const express = require('express')

const router = express.Router()

const Match = require('../models/Match')
const User = require('../models/User')

const rankify = require('../lib/rankify')

router.get('/get/:offset/:limit/:withCount', async (req, res) => {
  const { offset = 0, limit = 2, withCount = false } = req.params

  try {
    if (process.env.offline !== 'false') {
      res.json(
        [{
          id: 1,
          date: '2018/07/25',
          homeTeam: {
            defender: {
              user: '213jhb23gjh324',
              badges: [],
              score: 2
            },
            striker: {
              user: '213jhb23gjh324',
              badges: [],
              score: 4
            },
            score: 6,
            badges: []
          },
          awayTeam: {
            defender: {
              user: '213jhb23gjh324',
              badges: [],
              score: 2
            },
            striker: {
              user: '213jhb23gjh324',
              badges: [],
              score: 2
            },
            score: 4            
          }
        }]
      )
    }

    Match.find()
      .populate([
        {path: 'teamHome.defender.user', model: 'User'}, 
        {path: 'teamHome.striker.user', model: 'User'}, 
        {path: 'teamAway.defender.user', model: 'User'}, 
        {path: 'teamAway.striker.user', model: 'User'}
      ])
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .exec((err, rs) => {
        if (withCount) {
          Match.countDocuments({}, (err, count) => {
            res.json(
              Object.assign({}, { matches: rs }, { count: count })
            )
          })
        } else {
          res.json({ matches: rs })
        }
      })
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
})

router.get('/get/:slug', async (req, res) => {
  const _id = req.params.slug
  try {
    const match = await Match.findOne({ _id })
      .populate('teamHome.defender.user')
      .populate('teamHome.striker.user')
      .populate('teamAway.defender.user')
      .populate('teamAway.striker.user')
    res.json(match);
  } catch (err) {
    console.log(err)
    res.json({ error: err.message || err.toString() });
  }
})

router.post('/add', (req, res) => {
  const { teamAway, teamHome } = req.body
  const slug = Match.generateSlug()
  const createdAt = new Date().toISOString()
  const badges = []

  const rank = rankify.calculate({
    teamHome,
    teamAway
  })
  const matchData = {
    teamHome,
    teamAway,
    slug,
    createdAt,
    difference: rank.difference
  }
  const newMatch = new Match(matchData)
  newMatch.save(function (err) {
    if (err) return res.json({ error: err.message || err.toString() })
    // res.json(newMatch)
    const scoreHD = {
      id: teamHome.defender.user,
      score: rank.homeDefense,
      res
    }
    updateUser(scoreHD)

    const scoreHS = {
      id: teamHome.striker.user,
      score: rank.homeStriker,
      res
    }
    updateUser(scoreHS)

    const scoreAD = {
      id: teamAway.defender.user,
      score: rank.awayDefense,
      res
    }
    updateUser(scoreAD)

    const scoreAS = {
      id: teamAway.striker.user,
      score: rank.awayStriker,
      res
    }
    updateUser(scoreAS)

    res.json(newMatch)
  })
})

const updateUser = ({id, score, res}) => {
  const query = { _id: id }
  User.findOneAndUpdate(query, { points: score }, {}, function (err, rs) {
    if (err) return res.json({ error: err.message || err.toString() })
  })
}

module.exports = router

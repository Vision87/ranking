
const mongoose = require('mongoose')
const pick = require('lodash/pick')
var uuid = require('uuid');
const User = require('./User')

const { Schema } = mongoose

const mongoSchema = new Schema({
  teamHome: {
    defender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    striker: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: Number,
    defScore: Number,
    strScore: Number,
    defBadges: [],
    strBadges: []
  },
  teamAway: {
    defender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    striker: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: Number,
    defScore: Number,
    strScore: Number,
    defBadges: [],
    strBadges: []
  },
  difference: Number,
  difference2: Number,
  badges: [],
  slug: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    required: true,
  }
})

class MatchClass {
  static async list({ offset = 0, limit = 10 } = {}) {
    const matches = await this.find({})
      .populate('teamHome.defender')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec()
    return { matches }
  }

  static async addMatch({
    teamHome, teamAway, badges = []
  }) {
    if (!teamHome) {
      throw new Error('Data for the Home Team is required')
    }
    if (!teamHome.defender) {
      throw new Error('Player 1 for Home Team is required')
    }
    if (!teamHome.striker) {
      throw new Error('Player 2 for Home Team is required')
    }
    if (!teamAway) {
      throw new Error('Data for the Away Team is required')
    }
    if (!teamAway.defender) {
      throw new Error('Player 1 for Away Team is required')
    }
    if (!teamAway.striker) {
      throw new Error('Player 2 for Away Team is required')
    }
    if (!teamHome.score || !teamAway.score) {
      throw new Error('Add the score for the match')
    }
    if (!(teamHome.score + teamAway.score) > 5 || Math.abs(teamHome.score - teamAway.score) < 2) {
      throw new Error('Add valid score for the match')
    }

    const slug = await generateSlug(this, name)

    const newMatch = await this.create({
      teamHome,
      teamAway,
      badges,
      slug
    })
  }

  static generateSlug() {
    return uuid.v1()
  }

}

mongoSchema.loadClass(MatchClass)

const Match = mongoose.model('Match', mongoSchema)

module.exports = Match

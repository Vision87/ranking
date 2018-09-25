const mongoose = require('mongoose')
const pick = require('lodash/pick')
var uuid = require('uuid');
const { Schema } = mongoose

const mongoSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  points: Number,
  points2: Number,
  avatarUrl: String,
  description: String,
  slackID: String,
  role: String,
  active: Boolean,
  stats: {
    win_streak: Number, // current matches winned in row
    max_win_streak: Number, // max matches winned in row
    points_trend: Number, // trend positive or negative
    points_max: Number, // max points reached
    points_min: Number, // min points reached
    match_played: Number, // number of matches played
    match_win: Number, // matches win
    match_crawl: Number, // matches win with 6 - 0
    match_crawled: Number, // matches loose with 6 - 0
    match_as_defender: Number, // matches played as defender
    match_as_striker: Number, // matches played as striker
    win_as_defender: Number, // matches win as defender
    win_as_striker: Number, // matches win as striker
    match_goals_made: Number,
    match_goals_conceded: Number,
    match_goals_made_as_defender: Number,
    match_goals_made_as_striker: Number,
    match_goals_conceded_as_defender: Number,
    last_winned: Boolean,
    last_matches: [{
      type: Schema.Types.ObjectId,
      ref: 'Match',
      required: true
    }]
  }
})

class UserClass {
  static publicFields() {
    return [
      'userId',
      'name',
      'points',
      'avatarUrl',
      'description',
      'role',
      'slackID',
      'slug',
      'active'
    ]
  }

  static async list({ offset = 0, limit = 100 } = {}) {
    const users = await this.find({})
      .sort({ points: 1 })
      .skip(offset)
      .limit(limit)
    return { users }
  }

  static search(query) {
    return this.find(
      {
        $or: [
          { name: { $regex: query, $options: 'i' } }
        ],
      },
      UserClass.publicFields().join(' ')
    )
  }

  static generateSlug() {
    return uuid.v1()
  }

  static async addModifyUser({ userId, name, avatarUrl, description, role }) {
    const user = await this.findOne({ userId }).select(UserClass.publicFields().join(' '))

    // if user exists then modify
    if (user) {
      await this.updateOne({ userId }, { name, avatarUrl, description, role });

      return user
    }

    const slug = uuid.v1()

    const newUser = await this.create({
      name,
      avatarUrl,
      description,
      role,
      slug,
      active
    })

    return pick(newUser, UserClass.publicFields())
  }

}

mongoSchema.loadClass(UserClass)

const User = mongoose.model('User', mongoSchema)

module.exports = User

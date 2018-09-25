const Elo = require('arpad')

const elo = new Elo()

// extra percentage rank points based on the goal difference
const extraGoals = {
  1: 0,
  2: 0,
  3: 10,
  4: 20,
  5: 30,
  6: 50
}

const calculate = ({ teamHome, teamAway }) => {
  const homeRankPoints = Math.round((teamHome.defender.points + teamHome.striker.points) / 2)
  const awayRankPoints = Math.round((teamAway.defender.points + teamAway.striker.points) / 2)

  const hasHomeWin = teamHome.score > teamAway.score
  const hasCappotto = teamHome.score === 0 || teamAway.score === 0

  let difference = hasHomeWin ?
    elo.newRatingIfWon(homeRankPoints, awayRankPoints) - homeRankPoints :
    elo.newRatingIfWon(awayRankPoints, homeRankPoints) - awayRankPoints

  const winnerGoalDifference = Math.abs(teamHome.score - teamAway.score)
  const percGoalDiffence = extraGoals[winnerGoalDifference]
  const diffWithPerc = difference + Math.ceil((difference * percGoalDiffence / 100))

  if (hasCappotto) {
    difference++
  }

  const newPoints = {
    homeDefense2: hasHomeWin ? teamHome.defender.points + difference : teamHome.defender.points - difference,
    homeStriker2: hasHomeWin ? teamHome.striker.points + difference : teamHome.striker.points - difference,
    awayDefense2: hasHomeWin ? teamAway.defender.points - difference : teamAway.defender.points + difference,
    awayStriker2: hasHomeWin ? teamAway.striker.points - difference : teamAway.striker.points + difference,

    homeDefense: hasHomeWin ? teamHome.defender.points + diffWithPerc : teamHome.defender.points - diffWithPerc,
    homeStriker: hasHomeWin ? teamHome.striker.points + diffWithPerc : teamHome.striker.points - diffWithPerc,
    awayDefense: hasHomeWin ? teamAway.defender.points - diffWithPerc : teamAway.defender.points + diffWithPerc,
    awayStriker: hasHomeWin ? teamAway.striker.points - diffWithPerc : teamAway.striker.points + diffWithPerc,

    difference: diffWithPerc,
    difference2: difference,
    hasHomeWin,
    hasCappotto
  }

  return newPoints
}

module.exports = {
  calculate,
  elo
}

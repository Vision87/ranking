const styleLoadMoreButton = active => ({
    display: active ? 'block' : 'none',
    margin: '0 auto',
})

const styleMatchInfo = {
    height: '24px',
    lineHeight: '24px'
}

const styleMatchScore = {
  height: '78px',
  lineHeight: '70px',
  position: 'relative',
  textAlign: 'center',
  width: '60px'
}

const styleMatchTile = {
    margin: '20px auto',
    height: 'auto',
    width: '100%',
}

const styleMatchDifference = {
  left: '35%',
  position: 'absolute',
  top: '35px',
  zIndex: 1,
}

const stylePlayerScore = (role, team) => ({
    backgorundColor: 'blue',
    left: team=='home' ? '20%' : 'inherit',
    position: 'absolute',
    right: team=='away' ? '20%' : 'inherit',
    top: role=='defender' ? '14px' : '60px',
    zIndex: 1,
})

const styleTeamPlayer = position => ({
    flexDirection: position=='right'? 'row-reverse' : 'initial',
    justifyContent: 'flex-start',
    padding: '0 5px',
    width:'100%'
})

const styleTeamTile = position => ({
  height: '78px',
  textAlign: position? position : 'left',
})

module.exports = {
    styleLoadMoreButton,
    styleMatchInfo,
    styleMatchDifference,
    styleMatchScore,
    styleMatchTile,
    stylePlayerScore,
    styleTeamPlayer,
    styleTeamTile
}



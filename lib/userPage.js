const buttonSize = '46px'

const formArea = {
    float: 'left',
    maxWidth: 'calc(100% - 90px)',
}

const formButton = {
    backgroundColor: 'green',
    color: '#fff',
    fontSize: '12.5px',
    height: '100%',
    marginLeft: '-8px',
    padding: '0',
    width: '100%',
}

const formButtonWrapper = {
    borderRadius: '50%',
    float: 'left',
    height: buttonSize,
    marginLeft: '20px',
    marginTop: '40px',
    maxWidth: buttonSize,
    overflow: 'hidden',
    width: buttonSize,
}

const formText = {
    width: '100%',
}

const formTextSmall = {
    marginLeft: '-15%',
    transform: 'scale(0.8)',
    width: '165%',
}

const paperWrapper = {
}

const popperWrapper = {
    backgroundColor: '#fff',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    maxWidth: '90vw',
    padding: '20px',
}

const userAvatar = {
    height: 'initial',
    width: '100%',
}

const userFeature = {
    display: 'block',
    float: 'left',
    marginBottom: '-8px',
    padding: '5px',
    width: '33%',
}

const userFeatureBar = color => ({
    backgroundColor: color ? color : 'rgb(25, 118, 210)',
    height: '8px',
    maxWidth: '0px',
    opacity: '0',
    marginBottom: '2px',
    transition: 'all 0.85s ease-in-out',
    width: '100%',
})

const userFeatureBarWrapper = {
    marginTop: '20px',
    position: 'relative',
    top: '-10px',
    width: '100%',
}

const userFeatureLabel = {
    display: 'flex',
    alignItems: 'flex-end',
    fontSize: '12px',
    fontWeight: '700',
    height: '26px',
    lineHeight: '13px',
}

const userFeatureTitle = {
    marginBottom: '-24px',
    marginRight: '20px',
    fontSize: '18px',
    padding: '0px',
    width: '100%',
}

const userFeatureValue = {
    color: '#1976d2',
    fontSize: '16px',
    marginBottom: '10px',
}

const userFirstChar = {
    backgroundColor: 'rgb(25, 118, 210)',
    height: '46px',
    textTransform: 'uppercase',
    width: '46px',
}

module.exports = {
    formArea,
    formButton,
    formButtonWrapper,
    formText,
    formTextSmall,
    paperWrapper,
    popperWrapper,
    userAvatar,
    userFeature,
    userFeatureBar,
    userFeatureBarWrapper,
    userFeatureLabel,
    userFeatureTitle,
    userFeatureValue,
    userFirstChar,
}



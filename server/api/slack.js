
const express = require('express')
const slack = require('../lib/slack')
const router = express.Router()

router.get('/test', async (req, res) => {
    slack.sendMessage(
        'Mucci caccia il grano!',
        process.env.SLACK_TOKEN,
        process.env.SLACK_CHANNEL_ID
    )
})

router.post('/challenge', async (req, res) => {

    res.json({ "challenge": req.body.challenge })

})

module.exports = router
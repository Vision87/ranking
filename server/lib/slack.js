const { WebClient } = require('@slack/client')

const sendMessage = (messageText, token, conversationId) => {
    
    const web = new WebClient(token)
    web.chat.postMessage({ channel: conversationId, text: messageText}).then(
        (res) => {
            console.log('Message sent: ', res.ts)
        }
    ).catch(console.error)
}

module.exports = {
    sendMessage
}


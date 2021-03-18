
/* https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module */

const Audic = require('audic')
const path = require('path')
const {printLog, msToTime} = require('./tools.js')
const commands = require('./commands.js')

const notificationSound = new Audic(path.join(process.cwd(), 'assets', 'Notif.wav'))

// Send sound if message since N time
const NotifyInactivity = (inactivy, NotifyMinDelay) => {
    const now = Date.now()
    if(now - inactivy > NotifyMinDelay * 60000) {
        console.log(`New message after more than ${NotifyMinDelay}`)
        notificationSound.play()
    }
    return now
}

const sendChannelMessage = (say, channel, msg) => {
    say(channel,msg).then()
    .catch(e => console.error(e))
}

const handleCommand = msg => {
    // Remove ! and message spaces
    if(msg[0] === '!') {
        return commands(msg.substring(1).trim().toLowerCase())
    }
}

const viewerList = {
    nbViewers : 0,
    viewers: []
}

module.exports = (client, ACCESSTOKEN) => {
    const module = {}
    const AFKMinDelay = 10  // delay between 2 messages before sending a notification (in min)
    let lastMessageTimer = Date.now()

    module.message = (channel, userstate, msg, self) => {
        if (self) return // Ignore messages from the bot
        
        // Reset timer when new message
        lastMessageTimer = NotifyInactivity(lastMessageTimer, AFKMinDelay)
        
        // Execute command ("!command")
        const result = handleCommand(msg)
        if(result)
            sendChannelMessage(client.say, channel, result)
        else if (result === null)
            sendChannelMessage(client.say, channel, `Commande invalide : ${msg}`)
    }

    //module.onConnected = (addr, port) => console.log(`* Connected to ${addr}:${port}`)

    module.raided = (channel, username, viewers) => {
        client.say(channel, `Bienvenue @${username} et les ${viewers} viewers !`)
    }

    module.join = (channel, username, self) => {
        if(self) return
        
        if(!viewerList.viewers[username])
            viewerList.nbViewers++
        printLog(`JOIN: ${username} has joined the channel [Unique viewers: ${viewerList.nbViewers}]`)

        viewerList.viewers[username] = Date.now()
    }

    module.part = (channel, username, self) => {
        if(self) return
        printLog(`LEFT: ${username} has left the channel after ${msToTime(Date.now() - viewerList.viewers[username])}`)
    }

    return module
}
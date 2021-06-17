
/* https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module */

const Audic = require('audic')
const path = require('path')
const commands = require('./commands.js')

const notificationSound = new Audic(path.join(process.cwd(), 'assets', 'Notif.mp3'))
notificationSound.volume = 1.5

// Send sound if message since N time
const NotifyInactivity = (inactivy, NotifyMinDelay) => {
    const now = Date.now()
    if(now - inactivy > NotifyMinDelay * 30000) {
        console.log(`New message after more than ${NotifyMinDelay}`)
        notificationSound.play()
    }
    return now
}

module.exports = (client, ACCESSTOKEN) => {
    const module = {}
    const AFKMinDelay = 10  // delay between 2 messages before sending a notification (in min)
    let lastMessageTimer = Date.now()

    module.message = async (channel, userstate, msg, self) => {
        if (self) return // Ignore messages from the bot
        
        // Reset timer when new message
        lastMessageTimer = NotifyInactivity(lastMessageTimer, AFKMinDelay)
        
        // Execute command ("!command")
        if(msg[0] === '!') {
            // Remove ! and message spaces
            const result = await commands(msg.substring(1).trim().toLowerCase(), userstate, ACCESSTOKEN)
            if(result){
                client.say(channel, result)
            }
        }
    }

    module.raided = (channel, username, viewers) => {
        client.say(channel, `Bienvenue @${username} et les ${viewers} viewers !`)
    }

    return module
}
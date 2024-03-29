
/* https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module */

const Audic = require('audic')
const path = require('path')
const commands = require('./commands.js')

const notificationSound = new Audic(path.join(process.cwd(), 'assets', 'Notif.mp3'))
notificationSound.volume = 1.5

// Send sound if message since N time
const NotifyInactivity = (inactivy, NotifyMinDelay) => {
    const now = Date.now()
    if(now - inactivy > NotifyMinDelay * 60000) {
        console.log(`New message after more than ${NotifyMinDelay}`)
        notificationSound.play()
    }
    return now
}

module.exports = client => {
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
            commands(client, channel, msg.substring(1).trim().toLowerCase(), userstate).catch(console.error)
        }
    }

    module.raided = (channel, username, viewers) => {
        client.say(channel, `Bienvenue @${username} et les ${viewers} viewers !`)
    }

    return module
}

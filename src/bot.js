/* 
    https://dev.twitch.tv/docs/irc
    https://github.com/tmijs/tmi.js
*/

const tmi = require('tmi.js')
const http = require('http')
require('dotenv').config()

/*
 *
 *
 MAIN : Start the bot 
*
*
*/

const startBot = () => {
    // Conf for Twitch Bot
    const client = tmi.Client({
        options: { debug: true },
        connection: {
            secure: true,
            reconnect: true
        },
        identity: {
            username: process.env.USERNAME,
            password: process.env.TOKEN
        },
        channels: process.env.CHANNELS.split(',')
    })

    client.connect()
    .then(() => {
        const handler = require('./handlers/handler.js')(client)
 
        client.on('message', handler.message)
        client.on('raided', handler.raided)
    })
}

startBot()

const serverHTTP = http.createServer((req, res) => {
    res.end('Coucou')
})
.listen(8080)
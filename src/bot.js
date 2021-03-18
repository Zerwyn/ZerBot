/* 
    https://dev.twitch.tv/docs/irc
    https://github.com/tmijs/tmi.js
*/

const fs = require('fs')
const tmi = require('tmi.js')
require('dotenv').config()

const connect_API = './handlers/connect_API'

const startBot = access_token => {
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
        const handler = require('./handlers/handler.js')(client, access_token)
 
        client.on('message', handler.message)
        client.on('join', handler.join)
        client.on('part', handler.part)
        client.on('raided', handler.raided)
    })
}

const reniewAPIToken = () => new Promise((s,f) => {
    // Get Twitch API Token to make requests
    console.log('Get Bearer token ...')
    require(connect_API).then(json => {
        const {access_token, expires_in, token_type} = json
        
        // Store Token and expire timestamp to file
        const newToken = `${access_token}:${Date.now() + expires_in * 1000}`
        fs.writeFile(__dirname + '/bearer', newToken, e => {
            e ? f(e) : s(access_token)
        })
    })
    .catch(f)
})

const getStoredToken = data => {
    if(data) {
        const [token, expires] = data.split(':')
        const expireDays = expires / 3600000 / 24 // timestamp to days

        // if token expires in more than 2 days, we reuse it
        return expireDays > 2 ? token : undefined
    }
    return undefined
}

if(!process.env.API){
    startBot()
} else {
    console.log('Use Twitch API')
    // Read Bearer expire time
    fs.readFile(__dirname + '/bearer', 'utf8', (e,data) => {
        if(e && e.code !== 'ENOENT') return console.error(e)

        const token = getStoredToken(data)
        if(token){
            startBot(token)
        } else {
            reniewAPIToken().then(newToken => startBot(newToken))
            .catch(console.error)
        }
    })
}








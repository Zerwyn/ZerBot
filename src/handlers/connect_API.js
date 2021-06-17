const https = require('https')
require('dotenv').config()

const {CLIENTID, CLIENTSECRET} = process.env

const data = JSON.stringify({
    'client_id' : CLIENTID,
    'client_secret': CLIENTSECRET,
    'grant_type': 'client_credentials'
})

const options = {
    hostname: 'id.twitch.tv',
    port: 443,
    path: '/oauth2/token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}

module.exports = new Promise((s,f) => {
    const req = https.request(options, res => {
        res.on('data', d => {
            // {access_token, expires_in, token_type='Bearer'}
            s(JSON.parse(d))
        })
    })

    req.on('error', f)
    req.write(data)
    req.end()
})

module.exports.requestAPI = (apiToken, request) => new Promise((s,f) => {

    if(!request){
        console.error('Request path is empty')
        return
    }

    const user_options = {
        headers: {
            'client-id': CLIENTID,
            'Authorization': 'Bearer '+ apiToken
        }
    }
    
    https.get(`https://api.twitch.tv/helix/${request}`, user_options, res => {
        res.on('data', d => {
            const json = JSON.parse(d)
            s(json)
        })
    }).on('error', e => f(e))
})
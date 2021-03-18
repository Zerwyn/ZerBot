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

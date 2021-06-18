const fs = require('fs')
const requestAPI = require('./connect_API').requestAPI
const connect_API = './connect_API'

let APIToken = undefined
let APITokenTimeout = 0

let inutile = 0

const reniewAPIToken = () => new Promise((s,f) => {
    // Get Twitch API Token to make requests
    console.log('Get new Bearer token ...')
    require(connect_API).then(json => {
        const {access_token, expires_in, token_type} = json

        const expireDate = Date.now() + expires_in * 1000
        const newToken = `${access_token}:${expireDate}`

        APIToken = access_token
        APITokenTimeout = expireDate

        // Store Token and expire timestamp to file
        fs.writeFile(__dirname + '/bearer', newToken, e => {
            e ? f(e) : s(access_token, expireDate)
        })
    })
    .catch(f)
})

const setAPIToken = async () => {
    if(APIToken){
        if( APITokenTimeout - Date.now() > 60 ) {
            return true
        } else {
            await reniewAPIToken().catch(console.error)
            if(APIToken) return true
        }
    } else{
        // If APIToken not initialized: get from file
        fs.readFile(__dirname + '/bearer', 'utf8', async (e,data) => {
            if(e && e.code !== 'ENOENT') return console.error(e)
            
            if(data){
                const [token, expires] = data.split(':')
                // if token exists and expires in more than 1 min
                if(token && (expires - Date.now()) > 60){
                    console.log('Reuse token')
                    APIToken = token
                    APITokenTimeout = expires
                    return true
                }
            }

            console.log('Renew token')
            try{
                await reniewAPIToken()
                if(APIToken) return true
            } catch (e){
                console.error(e)
            }
        })
    }
}

const sentMessage = (client, channel) => (msg, username) => {
    client.say(channel, (username ? `@${username}` : '') + ' <BOT> ' + msg )
}

// Set Token for API at launch
setAPIToken()


module.exports = async (client, channel, msg, userstate) => {
    const send = sentMessage(client, channel)
    const [cmd, ...args] = msg.split(' ') // split spaces

    switch(cmd) {
        case 'des':
            if(args.length > 0 && !isNaN(args[0])){
                send(`Tu as obtenu un ${Math.floor(Math.random() * args[0]) + 1}`, userstate.username)
            }
        break
        case 'inutile':
            inutile++
            send(`La commande inutile a été lancée ${inutile} fois.`)
        break
        case 'top1':
            try{
                if(await setAPIToken()){
                    const promise = await requestAPI(APIToken,'streams?first=1&language=fr')
                    const res = promise.data[0]
                    send(`Premier stream FR : [${res.user_name}] sur [${res.game_name}] avec ${res.viewer_count} viewers`)
                }
            }catch(e){
                console.error(e)
            }
        break
        case 'streamer':
            try{
                if(await setAPIToken()){
                    const streamerName = args.length > 0 ? args[0] : 'zerwyn'
                    const promise = await requestAPI(APIToken,'users?login='+streamerName)
                    const res = promise.data[0]
                    send(`${streamerName.charAt(0).toUpperCase()}${streamerName.slice(1)} ${streamerName === 'zerwyn' ? 'est un BG, avec' : 'comptabilise'} ${res.view_count} vues et est inscrit sur Twitch depuis le ${res.created_at.substring(0,10)}.`)
                }
            }catch(e){
                console.error(e)
            }
        break
        case 'fc':
            try{
                if(await setAPIToken()){
                    const promise = await requestAPI(APIToken,`users/follows?from_id=${userstate['user-id']}&to_id=70206324`)
                    const res = promise.data[0]
                    if(res) { // undefined if not followed
                        send(`Tu follows la chaine depuis le ${res.followed_at.substring(0,10)}`,userstate.username)
                    } else {
                        send('Un bug est survenu et me dit que tu ne follows pas la chaine !', userstate.username)
                    }
                }
            }catch(e){
                console.error(e)
            }
            
        break
    }
}
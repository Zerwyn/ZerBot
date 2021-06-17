let inutile = 0
const requestAPI = require('./connect_API').requestAPI

module.exports = async (msg, userstate, ACCESSTOKEN) => {
    const [cmd, ...args] = msg.split(' ') // split spaces
    let answer = undefined

    switch(cmd) {
        case 'des':
            if(args.length > 0){
                answer = `@${userstate.username}: Tu as obtenu un ${Math.floor(Math.random() * args[0]) + 1}`
            }
        break
        case 'inutile':
            inutile++
            answer = `La commande inutile a été lancée ${inutile} fois.`
        break
        case 'top1':
            try{
                const promise = await requestAPI(ACCESSTOKEN,'streams?first=1&language=fr')
                const res = promise.data[0]
                answer = `Premier stream FR : [${res.user_name}] sur [${res.game_name}] avec ${res.viewer_count} viewers`
            }catch(e){
                console.error(e)
            }
        break
    }

    if(answer)
        return answer
}
module.exports = {
    printLog : string => {
        const time = new Date()
        console.log(`[${time.getHours()}:${time.getMinutes()}] ${string}`)
    },
    msToTime : timestamp => {
        let min = Math.floor(timestamp / 60000)
        const hours = Math.floor(min / 60)
        return `${hours}h${min}min`
    }

}
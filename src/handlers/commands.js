module.exports = msg => {
    const [cmd, ...args] = msg.split() // split spaces
    let answer = null
    switch(cmd) {
        case 'rolldice':
            if(args.length > 0)
                answer = Math.floor(Math.random() * args[0]) + 1
        break
    }

    return answer
}
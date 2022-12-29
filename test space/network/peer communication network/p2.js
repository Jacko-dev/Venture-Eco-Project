const name = 'bob'

const EventEmitter = require('events')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const emitter = new EventEmitter()

function allowInput() {
    rl.question('> ', (res) => {
        switch(res) {
            case 'add_peer':
                rl.question('What is the name of new peer: ', (res) => emitter.emit('connect_peer', res))
                break
            case 'msg':
                rl.question('What do you want to broadcast to peers: ', (res) => emitter.emit('broadcast_message', res))
                break
            default:
                console.log('unexpected input')
                
                allowInput()
                break
        }
    })
}

function displayPromptOptions() {
    console.log(`
    Options:
        Type \'help\' to display options
        Type \'add_peer\' to connect to a new peer
        Type \'msg\' to broadcast a message to peers
    `)
}

emitter.on('connect_peer', (data) => {
    console.log(`connecting to peer: ${data}`)
})

emitter.on('broadcast_message', (data) => {
    console.log(`broadcasting message: ${data}`)
})
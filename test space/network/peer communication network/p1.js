const name = 'jack'

const ws = require('ws')
const toPort = require('hash-to-port')
const readline = require('readline')
const EventEmitter = require('events')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const emitter = new EventEmitter()
const port = toPort(name)
const server = new ws.Server({ port: port })
const connections = new Map()

server.on('connection', (socket, request) => {
    console.log('new connection')

    socket.on('message', (data) => {
        const _data = data.toString('utf-8')

        console.log(_data)
    })

    socket.on('error', (err) => {
        console.error(err)
    })
})

server.on('close', () => {
    console.log('server was closed')
})

server.on('listening', () => {
    console.log('server is listening')

    displayPromptOptions()
    allowInput()
})

server.on('error', (err) => {
    console.error(err)
})

process.on('uncaughtException', (err) => {
    console.error(err)
})

function allowInput() {
    rl.question('> ', (res) => {
        switch(res) {
            case 'add_peer':
                rl.question('What is the name of new peer: ', (res) => emitter.emit('connect_peer', res))
                break
            case 'show_peers':
                if(connections.size === 0) {
                    console.log('no currently connected peers')
                } else {
                    console.log('All currently connected peers')
                    for(let peer of connections.keys()) {
                        console.log(peer)
                    }
                }
                allowInput()
                break
            case 'msg':
                displayMessageOptions()
                rl.question('>', (res) => {
                    switch(res) {
                        case 's':
                            rl.question('recipient: ', (peer) => {
                                rl.question('message: ', (data) => {
                                    message(data).single(peer, (err) => {
                                        if(err) {
                                            console.log(`error messaging peer ${peer}`)
                                        } else {
                                            console.log(`successfully messaged ${peer}`)
                                            allowInput()
                                        }
                                    })
                                })
                            })
                            break
                            case 'm':
                            console.log('reciptents: ')
                            let reciptents = []
                            const getReciptents = () => {
                                rl.question('>', (res) => {
                                    if(res !== 'end') {
                                        reciptents.push(res)
                                        getReciptents()
                                    } else {
                                        return
                                    }
                                })
                            }
                            console.log(reciptents)
                        break
                        case 'a':

                            break
                    }
                })
                break
            case 'help':
                displayPromptOptions()
                allowInput()
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
        Type \'show_peers\' to dislpay all connected peers
    `)
}

function displayMessageOptions() {
    console.log(`
    message types:
        singular (specify peer): type \'s\'
        multiple (select multiple recipients): type \'m\'
        all (broadcast to all peers): type \'a\'
    `)
}

function message(data) {
    return {
        broadcast: {
            all: (cb) => {
                connections.forEach(socket => socket.send(data, (err) => {
                    if(err) {
                        cb(err)
                    }
                }))
            },
            select: (peers, cb) => {
                peers.forEach(peer => {
                    connections.get(peer).send(data, (err) => {
                        if(err) {
                            cb(err)
                        } else {
                            cb(null)
                        }
                    })
                })
            }
        },
        single: (peer, cb) => {
            connections.get(peer).send(data, (err) => {
                if(err) {
                    cb(err)
                } else {
                    cb(null)
                }
            })
        }
    }
}

function connect(peerName, cb) {
    const port = toPort(peerName)
    const socket = new ws(`ws://localhost:${port}`)
    
    socket.on('open', () => {
        console.log('socket opened')

        console.log('adding socket to connections map')
        connections.set(peerName, socket)

        cb(null)
    })

    socket.on('error', (err) => {
        cb(err)
    })
}

emitter.on('connect_peer', (data) => {
    console.log(`connecting to peer: ${data}`)
    connect(data, (err) => {
        if(err) {
            console.log(`error connecting peer: ${data}`)
            allowInput()
        } else {
            allowInput()
        }
    })
})

emitter.on('broadcast_message', (data) => {
    console.log(`broadcasting message: ${data}`)
})

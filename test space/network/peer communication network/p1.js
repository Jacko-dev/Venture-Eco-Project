const name = 'jack'

const ws = require('ws')
const toPort = require('hash-to-port')
const readline = require('readline')

const connections = new Map()

connect('amy')

setTimeout(() => {
    message({
        peerName: 'amy',
        data: 'hello, how are you'
    }).individual() 
}, 1000)

function message({ peerName, data }) {
    return {
        broadcastAll: () => {
            connections.forEach(socket => socket.send(data))
        },
        individual: () => {
            connections.get(peerName).send(data)
        }
    }
}

function connect(peerName) {
    const port = toPort(peerName)
    const socket = new ws(`ws://localhost:${port}`)

    socket.on('open', () => {
        console.log('socket opened')

        console.log('adding socket to connections map')
        connections.set(peerName, socket)
    })

    socket.on('error', (err) => {
        console.log('error on socket connection')
    })
}
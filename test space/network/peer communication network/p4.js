const name = 'jeff'

const ws = require('ws')
const toPort = require('hash-to-port')

const port = toPort(name)
const server = new ws.Server({ port: port })

const _name = 'amy'
const _port = toPort(_name)
const socket = new ws(`ws://localhost:${_port}`)

setTimeout(() => {

    console.log(socketStatus)
}, 500)

server.on('connection', (socket, request) => {
    console.log('new connection')
    
    socket.on('message', (data) => {
        const _data = data.toString('utf-8')

        console.log(_data)
    })

    socket.on('close', (code, reason) => {
        const _reason = reason.toString('utf-8')

        console.log(code)
        console.log('socket was closed')
        console.log(_reason)
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
})

server.on('error', (err) => {
    console.error(err)
})

process.on('uncaughtException', (err) => {
    console.error(err)
})
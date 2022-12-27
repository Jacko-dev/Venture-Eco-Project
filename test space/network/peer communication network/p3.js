const name = 'amy'

const ws = require('ws')
const toPort = require('hash-to-port')

const port = toPort(name)
const server = new ws.Server({ port: port })

server.on('connection', async (socket, request) => {
    console.log('new connection')
    
    socket.on('message', (data) => {
        const _data = data.toString('utf-8')

        console.log(_data)
    })

})

server.on('listening', () => console.log('server is listening'))

server.on('error', (err) => console.error(err))

process.on('uncaughtException', (err) => console.error(err))
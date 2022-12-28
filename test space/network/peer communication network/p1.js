const name = 'jack'

const ws = require('ws')
const toPort = require('hash-to-port')
const readline = require('readline')
const EventEmitter = require('events')
const utils = require('./utils')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const emitter = new EventEmitter()
const port = toPort(name)
const server = new ws.Server({ port: port })
const connections = new Map()

// server.on('connection', (socket, request) => {
//     console.log('new connection')

//     socket.on('message', (data) => {
//         const _data = data.toString('utf-8')

//         console.log(_data)
//     })

//     socket.on('error', (err) => {
//         console.error(err)
//     })
// })

// server.on('close', () => {
//     console.log('server was closed')
// })

// server.on('listening', () => {
//     console.log('server is listening')
// })

// server.on('error', (err) => {
//     console.error(err)
// })

// process.on('uncaughtException', (err) => {
//     console.error(err)
// })


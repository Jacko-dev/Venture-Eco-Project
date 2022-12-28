const ws = require('ws')
const toPort = require('hash-to-port')
const EventEmitter = require('events')
const readline = require('readline')

class Peer {
    constructor(name) {
        this.name = name

        this.emitter = new EventEmitter()
        this.rl = readline.createInterface({input: process.stdin, output: process.stdout})
        this.port = toPort(name)
        this.server = new ws.Server({ port: this.port })
        this.peers = new Map()

        this.addServerListeners()
        this.addSocketListeners()
        this.addEventEmitters()
        this.addProcessEventListeners()

        this.prompt()
    }
    prompt() {
        this.rl.question('> ', (res) => {
            const inputWordsArr = this.filterWords(res)
            let commandInput = inputWordsArr[0] + ' ' + inputWordsArr[1]
            const args = inputWordsArr.splice(2)
    
            if(inputWordsArr[1] === undefined) {
                commandInput = inputWordsArr[0]
            }
            
            switch(commandInput) {
                case 'options': this.emitter.emit('prompt_options')
                    break
                case 'message options': this.emitter.emit('prompt_message_options')
                    break
                case 'add peer': this.emitter.emit('add_peer', args)
                    break
                case 'remove peer':
                    break
                case 'message peer':
                    break
                case 'lookup peer': this.emitter.emit('lookup_peer', args)
                    break
                case 'lookup peers':
                    break
                default:
                    console.log('Invalid input')
                    this.prompt()
                    break
            }
        })
    }
    addServerListeners() {
        this.server.on('connection', (socket, request) => {

        })
        this.server.on('close', () => {

        })
        this.server.on('listening', () => {

        })
        this.server.on('error', (err) => {

        })
    }
    addSocketListeners(socket) {
        this.peers.forEach(socket => {

            socket.on('message', (data) => {
                const _data = data.toString('utf-8')
            })

            socket.on('close', (code, reason) => {

            })

            socket.on('error', (err) => {

            })
        })
    }
    addEventEmitters() {
        
        this.emitter.on('prompt_options', () => {
            this.logInputOptions()
            this.prompt()
        })

        this.emitter.on('prompt_message_options', () => {
            this.logMessageOptions()
            this.prompt()
        })

        this.emitter.on('add_peer', (peerNames) => {
            let doesPeerNameExist = false
            for(let i = 0; i < peerNames.length; i++) {
                if(peerNames[i] == this.name) {
                    console.log('Error: Cannot connect to yourself')
                    doesPeerNameExist = true
                    this.prompt()
                    break
                }
            }
            if(doesPeerNameExist === false) {
                for(let i = 0; i < peerNames.length; i++) {
                    if(peerNames[i] == this.name) {
                        console.log('Error: Cannot connect to yourself')
                        this.prompt()
                        break
                    }
                    this.connect(peerNames[i], (err) => {
                        if(err) {
                            console.log(`Error: Couldn\'t connect to \'${peerNames[i]}\'`)
                        } else {
                            console.log(`Success: Connected to \'${peerNames[i]}\'`)
                        }
                        this.prompt()
                    })
                }    
            }
        })

        this.emitter.on('remove_peer', (peerName) => {

        })

        this.emitter.on('message_peer', (peerName) => {

        })

        this.emitter.on('lookup_peer', (peerName) => {
            if(peerName.length > 1) {
                console.log(`Error: Receved \'${peerName.length}\' arguments, only 1 acceptable`)
                this.prompt()
            }
            const _peerName = peerName[0]
            const socket = this.peers.get(_peerName)
            if(socket === undefined) {
                console.log(`Error: \'${_peerName}\' dosen\'t exits`)
                prompt()
            } else {
                // code connect functions
            }
        })

        this.emitter.on('lookup_peers', () => {

        })
    }
    message(messageString) {

        const messageAllFunc = (cb) => this.peers.forEach(socket => socket.send(messageString, (err) => err ? cb(err) : cb(null)))

        const messageSingleFunc = (peerName, cb) => this.peers.get(peerName).send(messageString, (err) => err ? cb(err) : cb(null))

        const messageSelectFunc = (peerList, cb) => {
            peerList.forEach(peer => {
                this.peers.get(peer).send(messageString, (err) => err ? cb(err) : cb(null))
            })
        }

        return { all: messageAllFunc, select: messageSelectFunc, single: messageSingleFunc }
    }
    connect(peerName, cb) {
        const port = toPort(peerName)
        const socket = new ws(`ws://localhost:${port}`)

        socket.on('open', () => {
            this.peers.set(peerName, socket)
            cb(null)
        })

        socket.on('error', (err) => cb(err))
    }
    logInputOptions() {
        console.log(`
        Options:
            Type \'help\' to display options
            Type \'add_peer\' to connect to a new peer
            Type \'msg\' to broadcast a message to peers
            Type \'show_peers\' to dislpay all connected peers
        `)
    }
    logMessageOptions() {
        console.log(`
        message types:
            singular (specify peer): type \'s\'
            multiple (select multiple recipients): type \'m\'
            all (broadcast to all peers): type \'a\'
        `)
    }
    checkPeerConnection(peerName) {
        const socket = this.peers.get(peerName)
    }
    filterWords(data) {
        return data.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ')
    }
    addProcessEventListeners() {

        process.on('uncaughtException', (err) => {

        })

        process.on('disconnect', () => {

        })

        process.on('warning', (warning) => {

        })
    }
}

const _peer = new Peer('jack')
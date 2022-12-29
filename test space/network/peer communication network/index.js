const ws = require('ws')
const cp = require('child_process')
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
        this.connect('amy')
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
                case 'add peers': this.emitter.emit('add_peers', args)
                    break
                case 'remove peers': this.emitter.emit('remove_peers', args)
                    break
                case 'message peers':
                    this.rl.question('(msg)> ', (res) => {
                        if(args[0] === 'broadcast') {
                            
                        }
                        args.push(res)
                        this.emitter.emit('message_peers', args)
                    })
                    break
                case 'lookup peers': this.emitter.emit('lookup_peers', args)
                    break
                default:
                    cp.exec(res, (err, stdout, stderr) => {
                        if(err) {
                            console.log('Invalid Input')
                            this.prompt()
                        }
                        if(stdout) {
                            console.log(`CMD command found: ${res}`)
                            console.log(stdout)
                            this.prompt()
                            return
                        }
                    })
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

        this.emitter.on('add_peers', (peerNames) => {
            if(peerNames.length < 1) {
                console.log(`Error: No arguments present`)
                this.prompt()
                return
            }
            
            let doesPeerNameExist = false
            for(let i = 0; i < peerNames.length; i++) {
                if(peerNames[i] == this.name) {
                    console.log('Error: Cannot connect to yourself')
                    doesPeerNameExist = true
                    this.prompt()
                    break
                }
            }
            if(doesPeerNameExist === true) {
                return
            }
            for(let i = 0; i < peerNames.length; i++) {
                this.connect(peerNames[i], (err) => {
                    if(err) {
                        console.log(`Error: Couldn\'t connect to \'${peerNames[i]}\'`)
                    } else {
                        console.log(`Success: Connected to \'${peerNames[i]}\'`)
                    }
                    this.prompt()
                })
            }
        })

        this.emitter.on('remove_peers', (peerNames) => {
            for(let i = 0; i < peerNames.length; i++) {
                this.peers.get(peerNames[i]).close(4040, 'socket was disconnected')
            }
        })

        this.emitter.on('message_peers', (args) => {
            const peerNames = args.slice(0, args.length - 1)
            const messageStr = args[args.length]
            let isValid = true
            for(let i = 0; i < peerNames.length; i++) {
                if(this.isPeerConnected(peerNames[i]) === false) {
                    isValid = false
                    break
                }
            }
            if(isValid === false) {
                console.log(`Error: \'${peerNames[i]}\' isn\'t a connected peer`)
                return
            }
            for(let i = 0; i < peerNames.length; i++) {
                this.message(messageStr)
            }
        })

        this.emitter.on('lookup_peers', (peerNames) => {
            for(let i = 0; i < peerNames.length; i++) {
                if(this.isPeerConnected(peerNames[i]) === false) {
                    console.log(`Error: \'${peerNames[i]}\' isn\'t connected`)
                    this.prompt()
                    break
                }
                const peerData = this.lookupPeerStatus(peerNames[i])
                console.log(peerData)
            }
            this.prompt()
            return
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
        if(this.isPeerConnected(peerName) === true) {
            cb(new Error())
            return
        }
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
    isPeerConnected(peerName) {
        if(this.peers.get(peerName) === undefined) {
            return false
        }
        return true
    }
    lookupPeerStatus(peerName) {
        const s = this.peers.get(peerName)
        return {
            is_socket_closed: s.CLOSED,
            is_socket_connecting: s.CLOSING,
            is_socket_connecting: s.CONNECTING,
            is_socket_open: s.OPEN,
            socket_binary_tpe: s.binaryType,
            socket_buffer_amount: s.bufferedAmount,
            socket_event_names: s.eventNames(),
            socket_extension: s.extensions,
            socket_max_listeners: s.getMaxListeners(),
            socket_is_paused: s.isPaused,
            socket_listener_count: {
                onOpen: s.listenerCount('open'),
                onMessage: s.listenerCount('message'),
                onClose: s.listenerCount('close'),
                onError: s.listenerCount('error')
            },
            socket_listeners: {
                opOper: s.listeners('open'),
            },
            socket_protocol: s.protocol,
            socket_ready_state: s.readyState,
            socket_url: s.url
        }
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

const peer = new Peer('jack')
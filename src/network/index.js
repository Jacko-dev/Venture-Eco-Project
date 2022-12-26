const ws = require('ws')
const toPort = require('hash-to-port')

const name = 'jack' 

const port = toPort(name)
const server = new ws.Server({ port: port })

server.on('connection', async (socket, request) => {

    socket.on('message', (data) => {
        const _data = JSON.parse(data)

        switch(_data) {
            case 'TYPE_ADDRESS_LIST_EXCHANGE':
                const nodes = _data.data

                nodes.forEach(address => connect(address))
                break
        }
    })
})

async function connect(address) {
    const socket = new ws(address)

    socket.on('open', () => {

    })

    socket.on('error', (err) => {
        
    })
}
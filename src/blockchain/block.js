const crypto = require('crypto')
const SHA256 = (data) => crypto.createHash('sha256').update(data).digest('hex')

class Block {
    constructor(data = [], additionalData = {}) {
        this.data = data
        this.additionalData = additionalData

        this.index = 0
        this.timestamp = Date.now().toString()
        this.nonce = 0
        this.prevHash = ''
        this.hash = this.calcHash()
    }
    calcHash = () => {
        return SHA256(
            JSON.stringify(this.data) +
            JSON.stringify(this.additionalData) +
            this.index +
            this.timestamp +
            this.nonce +
            this.prevHash
        )
    }
    mineBlock = (difficulty) => {
        while(!this.hash.startsWith(Array(1 + difficulty).join('0'))) {
            this.nonce++
            this.hash = this.calcHash()
        }
    }
}

module.exports = {
    Block
}
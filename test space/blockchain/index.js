const crypto = require('crypto')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const keypair = ec.genKeyPair()
const SHA256 = (data) => crypto.createHash('sha256').update(data).digest('hex')

class Transaction {
    constructor(from, to, amount) {
        this.from = from
        this.to = to
        this.amount = amount
        this.signature = ''
    }
    calcHash = () => {
        return SHA256(this.from + this.to + this.amount)
    }
    sign = (keypair) => {
        this.signature = keypair.sign(this.calcHash(), 'base64').toDER('hex')
    }
}

const keys = {
    pub: keypair.getPublic('hex'),
    priv: keypair.getPrivate('hex')
}

const returnBrackets = (data) => {
    return (data)
}
const res = returnBrackets('hello')
console.log(res)
const crypto = require('crypto')
const SHA256 = (data) => crypto.createHash('sha256').update(data).digest('hex')

class Transaction {
    constructor(fromAddress, toAddress, amount, gas = 0) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.gas = gas

        this.signature = ''
    }
    calcTransactionHash() {
        return SHA256(
            this.toAddress + 
            this.fromAddress + 
            this.amount + 
            this.gas + 
            this.signature
        )
    }
    signTransaction(keypair) {
        this.signature = keypair.sign(this.calcTransactionHash(), 'base64').toDER('hex')
    }
}

module.exports = {
    Transaction
}
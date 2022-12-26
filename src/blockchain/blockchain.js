const { Block } = require("./block.js")
const { Transaction } = require('./transaction.js')

class Blockchain {
    constructor(MINTER_KEYPAIR) {
        this.MINTER_KETPAIR = MINTER_KEYPAIR

        this.chain = [new Block([], this.formatAdditionalData('genesis_block', null))]
        this.transactions = []
        this.difficulty = 4
        this.reward = 123
    }
    formatAdditionalData(blockType, blockData) {
        return {
            blockType: blockType,
            blockData: blockData
        }
    }
    getPrevBlock() {
        return this.chain[this.chain.length - 1]
    }
    addBlock(block) {
        block.index = this.getPrevBlock().index + 1
        block.prevHash = this.getPrevBlock().hash
        block.hash = block.calcHash()
        block.mineBlock(this.difficulty)

        this.chain.push(Object.freeze(block))
    }
    addTransaction(transaction) {
        this.transactions.push(Object.freeze(transaction))
    }
    mineTransactions() {
        this.addBlock(new Block(this.transactions, null))

        this.transactions = []
    }
}

module.exports = {
    Blockchain
}
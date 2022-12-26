const { Block } = require("./block.js")

class Blockchain {
    constructor() {
        this.chain = [new Block(null, this.formatAdditionalData('genesis_block', null))]
        this.transactions = []
        this.difficulty = 4
    }
    formatAdditionalData = (blockType, blockData) =>  {
        return {
            blockType: blockType,
            blockData: blockData
        }
    }
    getPrevBlock = () => {
        return this.chain[this.chain.length - 1]
    }
    addBlock = (block) => {
        block.index = this.getPrevBlock().index + 1
        block.prevHash = this.getPrevBlock().hash
        block.hash = block.calcHash()
        block.mineBlock(this.difficulty)

        this.chain.push(Object.freeze(block))
    }
    addTransaction = (transaction) => {
        this.transactions.push(Object.freeze(transaction))
    }
    mineTransactions = () => {
        this.addBlock(new Block(this.transactions, null))

        this.transactions = []
    }
}

module.exports = {
    Blockchain
}
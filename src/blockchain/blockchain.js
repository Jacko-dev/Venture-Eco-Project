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
}

module.exports = {
    Blockchain
}
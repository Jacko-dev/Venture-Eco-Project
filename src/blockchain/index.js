const EC = require('elliptic').ec, ec = new EC('secp256k1')
const { Blockchain } = require('./blockchain.js')
const { Transaction } = require('./transaction.js')

const MINTER_KEYPAIR = ec.genKeyPair()
const MINTER_PUBLIC_ADDRESS = MINTER_KEYPAIR.getPublic('hex')
const keypair = ec.genKeyPair()

const blockchain = new Blockchain(MINTER_KEYPAIR)

const tx = new Transaction('jack', 'bob', 100)
tx.signTransaction(keypair)
blockchain.addTransaction(tx)

blockchain.mineTransactions()

blockchain.chain.forEach(block => console.log(block, '\n'))
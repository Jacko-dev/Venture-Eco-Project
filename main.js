const crypto = require('crypto'), SHA256 = (data) => crypto.createHash('sha256').update(data).digest('hex')

const calcDiff = (a, b) => {
    let res = a - b
    if(res < 0) {
        res = b - a
    }
    return res / 1000 + 's'
}

const initT = Date.now()

let msg = 'hello', diff = 5, nonce = 0
const calcHash = () => {
    return SHA256(msg + nonce)
}
let hash = calcHash()
while(!hash.startsWith(Array(1 + diff).join('0'))) {
    nonce++
    hash = calcHash()
}

const finalT = Date.now()

const dur = calcDiff(initT, finalT)
console.log(dur)
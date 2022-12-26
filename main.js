

function log(data, cb) {
    try {
        console.log(data)
    } catch(err) {
        cb(err)
    }
    return
}

log('Venture Eco Project', (err) => {
    console.error(err)
})


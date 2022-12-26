const express = require('express')
const router = express.Router()

router.route('/')
    .get((req, res) => {
        res.sendFile(__dirname, 'main_p/index.html')
    })

router.route('/downloads')
    .get((req, res) => {
        res.sendStatus(200)
    })

router.route('/downloads/demo')
    .get((req, res) => {
        res.download('./demo.txt')
    })

function getOpts() {
    return {
        root: __dirname
    }
}

module.exports = {
    router
}
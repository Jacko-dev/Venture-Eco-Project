require('dotenv').config()

const http = require('http')
const express = require('express')
const path = require('path')

const PORT = process.env.PORT
const app = express()
const server = http.createServer(app)

const { router } = require('./website_utils/router.js')

app.use(express.static(path.join(__dirname, 'public')))
app.use(router)

server.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`))
require('dotenv').config()

const http = require('http')
const express = require('express')
const path = require('path')

const PORT = process.env.PORT
const app = express()
const server = http.createServer(app)

server.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`))
const express = require('express')
const next = require('next')
const mongoose = require('mongoose')
const api = require('./api')

require('dotenv').config()

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 8000
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://builderbook.org'

const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL
// const MONGO_URL = 'mongodb://ranking:ranking1@ds247191.mlab.com:47191/belliga'
console.log(MONGO_URL)

mongoose.connect(MONGO_URL, {}, err => {
  console.error(err)
  throw err
})

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(express.json())
  
  api(server)
  
  // give all Nextjs's request to Nextjs server
  server.get('*', (req, res) => {
    handle(req, res)
  })


  server.listen(port, (err) => {
    if (err) throw err
    console.info(`> Ready on ${ROOT_URL}`)
  })
})
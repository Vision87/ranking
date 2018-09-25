const express = require('express')
const next = require('next')
const mongoose = require('mongoose')
const api = require('./api')

const auth = require('basic-auth')

require('dotenv').config()

const dev = process.env.v !== 'production'
const port = process.env.PORT || 8000
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://www.scoreza.it/'

const MONGO_URL = process.env.MONGO_URL

process.env.offline = false

mongoose.connect(MONGO_URL, {}, err => {
  if(err) {
    console.error(err)
    process.env.offline = true
  }
})

const app = next({ dev })
const handle = app.getRequestHandler()

function isAuthenticated(req, res, next) {
  const credentials = auth(req)
  if (credentials && credentials.name === 'john' && credentials.pass === 'secret') {
    return next()
  }
  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.statusCode = 401
  res.setHeader('WWW-Authenticate', 'Basic realm="Scoreza Access"')
  res.end('Access denied')
}


app.prepare().then(() => {
  const server = express()

  // if (!dev) {
  //   server.use (function (req, res, next) {
  //     if (req.headers['x-forwarded-proto'] == 'https') {
  //       // request was via https, so do no special handling
  //       next();
  //     } else {
  //       // request was via http, so redirect to https
  //       res.redirect('https://' + req.headers.host + req.url);
  //     }
  //   })
  // }

  server.use(express.static('public'))

  server.use(express.json())

  api(server)

  server.get('/users/:slug', (req, res) => {
    return app.render(req, res, `/users/update`, { slug: req.params.slug })
  })

  server.get('/match/:slug', (req, res) => {
    return app.render(req, res, `/matches/detail`, { slug: req.params.slug })
  })

  server.get('/admin*', isAuthenticated, (req, res) => {
    return handle(req, res)
  })

  // give all Nextjs's request to Nextjs server
  server.get('*', (req, res) => {
    handle(req, res)
  })


  server.listen(port, (err) => {
    if (err) throw err
    console.info(`> Ready on ${ROOT_URL}`)
  })
})

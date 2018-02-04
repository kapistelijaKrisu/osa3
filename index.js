const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.static('build'))
const bodyParser = require('body-parser')
app.use(bodyParser.json())

morgan.token('type', function (req, res)
 { return JSON.stringify(req.body) })
var logger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.type(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})
app.use(logger)

let ppl = []

app.get('/api/info', (req, res) => {
  res.send('<p>puhelinluettelossa ' + ppl.length + ' ihmisen tiedot</p>' +
    '<p>' + Date() + '<p>')
})

app.get('/api/persons', (request, response) => {
  response.json(ppl)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = ppl.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  ppl = ppl.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (person.number) {
    //const reg = new RegExp('^[0-9]+$')
    //if (!reg.test(person.number)) {
    //return response.status(400).json({ error: 'number incorrect format' })
    //  }
  } else {
    return response.status(400).json({ error: 'number missing' })
  }

  if (person.name) {
    //if (person.name.length > 100) {
    //return response.status(400).json({ error: 'Name too long! max length:100' })
    // }

    const found = ppl.filter(dude => dude.name === person.name)
    if (found.length !== 0) {
      return response.status(400).json({ error: 'Person with same name already exists!' })

    }
  } else {
    return response.status(400).json({ error: 'name missing' })
  }
  const id = uniqRandomId(ppl)
  person.id = id

  ppl = ppl.concat(person)

  response.json(person)
})

function uniqRandomId(content) {
  const id = Math.floor(Math.random() * Math.floor(2000000));
  const found = ppl.filter(person => person.id === id)
  if (found.length == 0) {
    return id
  }
  return uniqRandomId(content)
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
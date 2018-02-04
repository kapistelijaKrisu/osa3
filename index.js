const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
const bodyParser = require('body-parser')
app.use(bodyParser.json())

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
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


app.get('/api/info', (req, res) => {
  Person
    .find({})
    .then(person => {
      res.send('<p>puhelinluettelossa ' + person.length + ' ihmisen tiedot</p>' +
        '<p>' + Date() + '<p>')
    })
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(person => {
      response.json(person.map(formatPerson))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {

      if (person) {
        response.json(formatPerson(person))
      } else {
        response.status(404).end()
      }
    }).catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {

  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  body = request.body
  if (body === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (body.number) {
  } else {
    return response.status(400).json({ error: 'number missing' })
  }
  if (body.name) {
    Person
      .find({})
      .then(person => {
        all = (person.map(formatPerson))
        const found = all.filter(aPerson => aPerson.name === body.name)
        if (found.length !== 0) {
          response.status(400).send({ error: 'dude exists' })
        } else {
          const person = new Person({
            name: body.name,
            number: body.number,
          })
          person
            .save()
            .then(savedPerson => {
              response.json(formatPerson(savedPerson))
            })
        }
      })

  } else {
    return response.status(400).json({ error: 'name missing' })
  }
})

app.put('/api/persons/:id', (request, response) => {
  body = request.body
  if (body === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (body.number) {
  } else {
    return response.status(400).json({ error: 'number missing' })
  }
  if (body.name) {

    const dude = {
      name: body.name,
      number: body.number
    }
    Person
      .findByIdAndUpdate(request.params.id, dude, { new: true })
      .then(updatedPerson => {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        response.json(formatPerson(updatedPerson))
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
  } else {
    return response.status(400).json({ error: 'name missing' })
  }
})

const formatPerson = (person) => {
  const formattedPerson = { ...person._doc, id: person._id }
  delete formattedPerson._id
  delete formattedPerson.__v

  return formattedPerson
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/phonebook')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// 自定义 token 函数，用于记录请求体
morgan.token('req-body', (req) => JSON.stringify(req.body))

// 使用 morgan 中间件，并添加自定义 token 函数
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :req-body'))

/*
let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]
*/

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
            console.log(persons)
        })
        .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
        /*
        .catch(error => {
            console.error('Error fetching person:', error)
            response.status(404).json({ error: 'person not found' })
        })
        */
})


app.get('/info',(request, response, next) => {
    const returnedPerson = Person.find({})
    // console.log('typeof Person',typeof Person)
    // console.log('typeof returnedPerson', typeof returnedPerson)
    // console.log('returnedPerson ', returnedPerson)
    // returnedPerson.then(person => console.log('then, returnedPerson', person))
    const time = new Date().toString()
    //console.log(time)
    returnedPerson
        .then(person => {
            response.send(`Phonebook has info for ${person.length} people<br><br>${time}`)
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})



app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body) {
        return response.status(400).json({ error: 'content missing' })
    }
    else if (!body.name){
        return response.status(400).json({  error: 'name missing' })
    }
    else if (!body.number){
        return response.status(400).json({ error: 'number missing' })
    }
    
    Person.find({}).then(persons => {
        if (persons.find(item => item.name === body.name)) {
            return response.status(400).json({ 
                error: `name must be unique, the number of ${body.name} will be updated` 
            })
        }
        // 如果名字是唯一的，继续处理 POST 请求...
        const newPerson = new Person({
            name: body.name,
            number: body.number,
        })
    
        newPerson
            .save()
            .then(savedPerson => {
                response.json(savedPerson)
            })
            .catch(error => next(error))
    })
        .catch(error => next(error))
})


// Update phonebook entry by ID
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
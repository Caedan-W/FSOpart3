const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// 自定义 token 函数，用于记录请求体
morgan.token('req-body', (req, res) => JSON.stringify(req.body));

// 使用 morgan 中间件，并添加自定义 token 函数
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :req-body'));


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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info',(request, response) => {
    const number = persons.length
    const time = new Date().toString();
    console.log(time)
    response.send(
            `Phonebook has info for ${number} people<br><br>${time}`
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

const generateRandomId = () => {
    return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    //console.log('body', body)

    if (!body) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }
    else if (!body.name){
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }
    else if (!body.number){
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }
    else if (persons.find(item => item.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
        id: generateRandomId(),
        ...body
    }
    persons = persons.concat(person)

    response.json(person)
})



//const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
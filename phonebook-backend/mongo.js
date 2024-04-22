const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const person = {name: process.argv[3], number: process.argv[4]}

//const url =
    //`mongodb+srv://caedan:${password}@cluster0.jwuchqd.mongodb.net/?retryWrites=true&w=majority`

const url =
    `mongodb+srv://caedan:${password}@cluster0.jwuchqd.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('person', phonebookSchema)

const newPerson = new Phonebook({
    name: person.name,
    number: person.number,
})

newPerson.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
})


Phonebook.find({}).then(persons => {
    persons.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})